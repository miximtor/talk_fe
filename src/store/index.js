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
    contacts: [],
    personal_info: null,
    socket: null,
    sessions: null,
    session_history: []
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

    [Mutation.PUSH_SESSIONS](state, slave_login_id) {
        state.sessions.push(slave_login_id);
    }

};

const getters = {
    token: (state) => state.token,

    login_id: (state) => state.login_id,

    contacts: (state) => state.contacts,

    personal_info: (state) => state.personal_info,

    sessions: (state) => state.sessions.map(session => state.contacts.find(contact => contact.login_id === session)),

    session_history: (state) => state.session_history
};

const actions = {

    async update_contacts({commit}, token) {
        const contacts = await account.get_contacts(token);
        commit(Mutation.SET_CONTACTS, contacts);
    },

    async update_personal_info({commit}, token) {
        const personal_info = await account.get_personal_info(token);
        commit(Mutation.SET_PERSONAL_INFO, personal_info);
    },

    async login({commit, dispatch}, authentication) {
        const [token, socket] = await account.login(authentication);
        message.socket = socket;
        commit(Mutation.SET_TOKEN, token);
        commit(Mutation.SET_LOGIN_ID, authentication.login_id);
        await dispatch('update_contacts', token);
        await dispatch('update_personal_info', token);
        await storage.initialize(authentication.login_id);
        commit(Mutation.SET_SESSIONS, await storage.get_sessions());
    },

    async logout({state}) {
        await account.logout(state.token);
    },

    async new_session({commit}, slave_login_id) {
        if (!(await storage.has_session(slave_login_id))) {
            await storage.put_session(slave_login_id);
            commit(Mutation.PUSH_SESSIONS, slave_login_id);
        }
    },

    async send_message({state}, {type, content, to}) {
        const message_id = UUIDv4();
        const timestamp = Date.now();
        let msg = {
            message_id: message_id,
            from: state.login_id,
            to: to,
            type: type,
            timestamp: timestamp,
            content: content
        };
        await storage.append_history(to, msg);
        await message.send(state.token, msg);
    }

};


export default new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    strict: debug
});
