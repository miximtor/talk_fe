import Vue from 'vue'
import Vuex from 'vuex'

import {account} from '@/api/account';
import {storage} from "@/api/storage";
import {message} from "@/api/message";
import {system_session} from "@/api/account";

import {v4 as UUIDv4} from 'uuid';

import * as Mutation from "@/store/types";
import {PeerStates} from "@/util/connection";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
    login_id: '',
    token: '',
    socket: null,
    socket_state: 'normal',
    personal_info: null,
    contacts: [],
    sessions: [],
    current_session: '',
    current_contact: null,
    messages: [],
    new_message: {},
    media_state: 'uninitialized'
};

const mutations = {

    [Mutation.SET_CONTACTS](state, contacts) {
        state.contacts = contacts;
    },

    [Mutation.SET_PERSONAL_INFO](state, personal_info) {
        state.personal_info = personal_info;
    },

    [Mutation.SET_TOKEN](state, token) {
        state.token = token;
    },

    [Mutation.SET_LOGIN_ID](state, login_id) {
        state.login_id = login_id;
    },

    [Mutation.SET_SESSIONS](state, sessions) {
        state.sessions = sessions.filter(session => session !== 'sys');
    },

    [Mutation.UPSERT_SESSIONS](state, slave_login_id) {
        if (!state.sessions.find(session => session === slave_login_id)) {
            state.sessions.push(slave_login_id);
        }
    },

    [Mutation.UPSERT_MESSAGES](state, msg) {
        if (!state.messages.find(message => message.message_id === msg.message_id)) {
            state.messages.push(msg);
        }
    },

    [Mutation.DELETE_MESSAGE](state, message_id) {
        const index = state.messages.findIndex(message => message.message_id === message_id);
        if (index === -1) {
            return;
        }
        state.messages.splice(index, 1);
    },

    [Mutation.SET_CURRENT_CONTACT](state, contact) {
        state.current_contact = contact;
    },

    [Mutation.SET_CURRENT_SESSION](state, session) {
        state.current_session = session;
    },

    [Mutation.SET_SOCKET_STATE](state, socket_state) {
        state.socket_state = socket_state;
    },

    [Mutation.SET_MESSAGES](state, messages) {
        state.messages = messages;
    },

    [Mutation.SET_NEW_MESSAGE](state, {session, new_message}) {
        Vue.set(state.new_message, session, !!new_message);
    },

    [Mutation.CLEAR_STATE](state) {
        state.login_id = '';
        state.token = '';
        state.socket = null;
        state.socket_state = 'normal';
        state.personal_info = null;
        state.contacts = [];
        state.sessions = [];
        state.current_session = '';
        state.current_contact = null;
        state.messages = [];
        state.new_message = {};
    },

    [Mutation.SET_MEDIA_STATE](state, media_state) {
        state.media_state = media_state;
    }
};

const getters = {

    token: (state) => state.token,

    login_id: (state) => state.login_id,

    contacts: (state) => state.contacts,

    personal_info: (state) => state.personal_info,

    sessions: (state) => state.sessions.map(session => state.contacts.find(contact => contact.login_id === session)),

    current_session: (state) => state.current_session === 'sys' ? system_session : state.contacts.find(contact => contact.login_id === state.current_session),

    current_contact: (state) => state.current_contact,

    session_history: (state) => state.session_history,

    socket_state: (state) => state.socket_state,

    messages: (state) => state.messages,

    new_message: (state) => state.new_message,

    media_state: (state) => state.media_state
};

const actions = {

    async update_contacts({commit, state}) {
        const contacts = await account.get_contacts(state.token);
        commit(Mutation.SET_CONTACTS, contacts);
    },

    async update_personal_info({commit, state}) {
        const personal_info = await account.get_personal_info(state.token);
        commit(Mutation.SET_PERSONAL_INFO, personal_info);
    },

    async update_sessions({commit}) {
        const sessions = await storage.get_sessions();
        commit(Mutation.SET_SESSIONS, sessions);
    },

    async login({commit, dispatch}, authentication) {

        const [token, socket] = await account.login(authentication);

        message.socket = socket;
        commit(Mutation.SET_SOCKET_STATE, 'normal');
        commit(Mutation.SET_TOKEN, token);
        commit(Mutation.SET_LOGIN_ID, authentication.login_id);

        message.socket.onclose = (ev) => {
            if (ev.code === 4001) {
                return;
            }
            commit(Mutation.SET_SOCKET_STATE, 'error');
        };

        message.socket.onmessage = async (ev) => {
            await dispatch('receive_message', JSON.parse(ev.data));
        };

        message.socket.onerror = () => {
            commit(Mutation.SET_SOCKET_STATE, 'error');
        };


        await storage.initialize(authentication.login_id);
        await dispatch('update_contacts');
        await dispatch('update_personal_info');
        await dispatch('update_sessions');

        const keepalive = () => {
            if (message.socket.readyState !== WebSocket.OPEN) {
                return;
            }
            message.socket.send(JSON.stringify({
                token: state.token,
                message_id: UUIDv4(),
                type: 'keepalive',
                timestamp: Date.now()
            }));

            setTimeout(keepalive, 60000);
        };
        keepalive();
    },

    async logout({commit}) {
        message.socket.close(4001, 'client logout');
        PeerStates.peer.destroy();
        commit(Mutation.CLEAR_STATE);
    },

    async upsert_session({dispatch}, session) {
        await storage.upsert_session(session);
        await dispatch('update_sessions');
    },

    async send_message({state, dispatch}, msg) {
        await storage.upsert_message_version(msg.to, msg);
        await message.send(state.token, msg);
        await dispatch('update_messages', msg.to);

        const scroll = document.getElementById('message-viewer-scroll');
        if (!scroll) {
            return;
        }
        scroll.scrollTop = scroll.scrollHeight;
    },

    async delete_message({dispatch}, {session, msg}) {
        await storage.delete_message(msg.message_id);
        await dispatch('update_messages', session);
    },

    async delete_all_message({dispatch}, session) {
        await storage.delete_all_message(session);
        await dispatch('update_messages', session);
    },

    async delete_friend({state, dispatch, commit}) {
        await account.delete_friend(state.token, state.current_session);
        await storage.delete_session(state.current_session);
        commit(Mutation.SET_CURRENT_SESSION, '');
        await dispatch('update_contacts');
        await dispatch('update_sessions');
    },

    async add_friend_reply({state, dispatch}, {msg, reply}) {
        await account.add_friend_reply(state.token, msg, reply);
        if (reply === 'ok') {
            await dispatch('update_contacts');
        }
    },

    async revoke_message({dispatch}, msg) {
        const msg1 = JSON.parse(JSON.stringify(msg));
        msg1.version++;
        msg1.content = {};
        msg1.type = 'message-revoke';
        await dispatch('send_message', msg1);
    },

    async receive_message({state, dispatch, commit}, msg) {
        message.socket.send(JSON.stringify({
            token: state.token,
            message_id: msg.message_id,
            type: 'message-accept',
            timestamp: Date.now(),
            version: msg.version
        }));

        if (msg.type !== 'message-revoke') {
            commit(Mutation.SET_NEW_MESSAGE, {session: msg.from, new_message: true});
            const audio = document.getElementById('app-audio');
            audio.play();
        }

        if (msg.type === 'message-welcome') {
            await dispatch('update_contacts');
            msg.type = 'message-text';
        }

        await dispatch('upsert_session', msg.from);
        await storage.upsert_message_version(msg.from, msg);

        if (msg.from === state.current_session) {
            await dispatch('update_messages', msg.from);
        }
    },

    async update_messages({commit}, session) {
        const messages = await storage.get_messages(session);
        commit(Mutation.SET_MESSAGES, messages);
    }

};

export default new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    strict: debug
});
