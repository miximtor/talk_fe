import Vue from 'vue'
import Vuex from 'vuex'

import {account} from '@/api/account';
import {storage} from "@/api/storage";
import {message} from "@/api/message";

import {v4 as UUIDv4} from 'uuid';

import * as Mutation from "@/store/types";

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
    messages: []
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
        state.sessions = sessions;
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
    }
};

const getters = {

    token: (state) => state.token,

    login_id: (state) => state.login_id,

    contacts: (state) => state.contacts,

    personal_info: (state) => state.personal_info,

    sessions: (state) => state.sessions.map(session => state.contacts.find(contact => contact.login_id === session)),

    current_session: (state) => state.contacts.find(contact => contact.login_id === state.current_session),

    current_contact: (state) => state.current_contact,

    session_history: (state) => state.session_history,

    socket_state: (state) => state.socket_state,

    messages: (state) => state.messages

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

        await storage.initialize(authentication.login_id);

        await dispatch('update_contacts');
        await dispatch('update_personal_info');
        await dispatch('update_sessions');

        message.socket.addEventListener('close', (ev) => {
            if (ev.code === 4001) {
                return;
            }
            commit(Mutation.SET_SOCKET_STATE, 'error');
        });

        message.socket.addEventListener('message', async (ev) => {
            await dispatch('receive_message', JSON.parse(ev.data));
        });

        message.socket.addEventListener('error', () => {
            commit(Mutation.SET_SOCKET_STATE, 'error');
        });

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

    async logout() {
        message.socket.close(4001, 'client logout');
    },

    async upsert_session({commit}, slave_login_id) {
        await storage.upsert_session(slave_login_id);
        commit(Mutation.UPSERT_SESSIONS, slave_login_id);
    },

    async send_message({state, commit}, {type, content, to}) {
        const message_id = UUIDv4();
        const timestamp = Date.now();
        let msg = {
            message_id: message_id,
            from: state.login_id,
            sender: state.login_id,
            to: to,
            type: type,
            timestamp: timestamp,
            content: content
        };
        await storage.upsert_message(to, msg);
        await message.send(state.token, msg);
        commit(Mutation.UPSERT_MESSAGES, msg);
    },

    async receive_message({state, commit}, msg) {
        message.socket.send(JSON.stringify({
            token: state.token,
            message_id: msg.message_id,
            type: 'message-accept',
            timestamp: Date.now()
        }));
        await storage.upsert_message(msg.from, msg);
        if (msg.from === state.current_session) {
            commit(Mutation.UPSERT_MESSAGES, msg);
        }
    },

    async update_messages({commit}, slave_login_id) {
        const messages = await storage.get_messages(slave_login_id);
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
