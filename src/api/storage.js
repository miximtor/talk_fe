import Dexie from 'dexie';

Dexie.debug = process.env.NODE_ENV !== 'production';

export class SessionStore {
    db;

    constructor() {
    }

    async initialize(login_id) {
        this.db = new Dexie(`session:${login_id}`, {autoOpen: false});
        this.db.version(1).stores({
            session: 'login_id',
            message: 'id, from, type, timestamp'
        });
        await this.db.open();
        return this;
    }

    async get_sessions() {
        let session_list = [];
        await this.db.session.each(session => session_list.push(session.login_id));
        return session_list;
    }

    async has_session(slave_login_id) {
        return (await this.db.session.get(slave_login_id)) !== undefined;
    }

    async put_session(slave_login_id) {
        await this.db.session.put({login_id: slave_login_id});
    }
}

export let session_store = new SessionStore();
