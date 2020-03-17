import {account} from '@/api/account';
import {SessionStore} from "@/api/storage";

const state = {
    contacts: [],
    personal_info: null,
    token: '',
    socket: null,
    sessions: null,
    storage: null,
    session_history: []
};

const SET_CONTACT_INFO = 'set_contact_info';
const SET_PERSONAL_INFO = 'set_personal_info';
const LOGIN_FINISH = 'login_finish';
const CLOSE_SOCKET = 'close_socket';
const SET_STORAGE = 'set_storage';
const SET_SESSION_INFO = 'set_session_info';
const PUSH_SESSION_INFO = 'push_session_info';

const mutations = {

    [SET_CONTACT_INFO](state, contacts) {
        state.contacts = contacts;
    },

    [SET_PERSONAL_INFO](state, personal_info) {
        state.personal_info = personal_info;
    },

    [LOGIN_FINISH](state, {token, socket}) {
        state.token = token;
        state.socket = socket;
    },

    [CLOSE_SOCKET](state, {code, reason}) {
        let socket = state.socket;
        state.socket = null;
        socket?.close(code, reason);
    },

    [SET_STORAGE](state, storage) {
        state.storage = storage;
    },

    [SET_SESSION_INFO](state, sessions) {
        state.sessions = sessions;
    },

    [PUSH_SESSION_INFO](state, slave_login_id) {
        state.sessions.add(slave_login_id);
    }

};

const getters = {
    token: (state) => state.token,

    contacts: (state) => state.contacts,

    socket: (state) => state.socket,

    personal_info: (state) => state.personal_info,

    sessions: (state) => state.contacts.filter(contact => state.sessions.has(contact.login_id)),

    session_history: (state) => state.session_history
};

const actions = {

    async update_contacts({commit}, token) {
        const contacts = await account.get_contacts(token);
        commit(SET_CONTACT_INFO, contacts);
    },

    async update_personal_info({commit}, token) {
        const personal_info = await account.get_personal_info(token);
        commit(SET_PERSONAL_INFO, personal_info);
    },

    async login({commit, dispatch}, authentication) {
        const [token, socket] = await account.login(authentication);
        commit(LOGIN_FINISH, {token: token, socket: socket});
        await dispatch('update_contacts', token);
        await dispatch('update_personal_info', token);
        const storage = await new SessionStore().initialize(authentication.login_id);
        commit(SET_STORAGE, storage);
        const session_list = await storage.get_sessions();
        commit(SET_SESSION_INFO, new Set(session_list));
    },

    async logout({state, commit}) {
        await account.logout(state.token);
        commit(CLOSE_SOCKET, {code: 4001, reason: 'client logout'});
    },

    async new_session({state, commit}, slave_login_id) {
        if (!(await state.storage.has_session(slave_login_id))) {
            await state.storage.put_session(slave_login_id);
            commit(PUSH_SESSION_INFO, slave_login_id);
        }
    }

};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}
