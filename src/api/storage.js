const JsStore = require('jsstore');

export class SessionStore {
    db;

    constructor() {
    }

    async initialize(login_id) {
        this.db = new JsStore.Connection(new Worker('dist/jsstore.worker.js'));
        await this.db.initDb({
            name: `history:${login_id}`,
            tables: [
                {
                    name: 'session',
                    columns: {
                        login_id: {primaryKey: true, notNull: true}
                    }
                },
                {
                    name: 'message',
                    columns: {
                        session: {dataType: 'string'},
                        message_id: {primaryKey: true},
                        from: {dataType: 'string'},
                        to: {dataType: 'string'},
                        type: {dataType: 'string'},
                        timestamp: {dataType: 'number'},
                        content: {dataType: 'string'}
                    }
                }
            ]
        });
        return this;
    }

    async get_sessions() {
        return (await this.db.select({from: 'session'})).map(session => session.login_id);
    }

    async has_session(slave_login_id) {
        let results = await this.db.select({
            from: 'session',
            where: {
                login_id: slave_login_id
            }
        });
        return results.length !== 0;
    }

    async put_session(slave_login_id) {
        await this.db.insert({
            into: 'session',
            values: [{login_id: slave_login_id}]
        });
    }

    async append_history(session, history) {
        await this.db.insert({
            into: 'message',
            values: [{session: session, ...history}]
        });
    }
}

export const storage = new SessionStore();
