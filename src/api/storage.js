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
                        sender: {dataType: 'string'},
                        to: {dataType: 'string'},
                        type: {dataType: 'string'},
                        timestamp: {dataType: 'number'},
                        content: {dataType: 'object'}
                    }
                }
            ]
        });
        return this;
    }

    async get_sessions() {
        return (await this.db.select({from: 'session'})).map(session => session.login_id);
    }

    async upsert_session(slave_login_id) {
        await this.db.insert({
            into: 'session',
            upsert: true,
            values: [{login_id: slave_login_id}]
        })
    }

    async upsert_message(session, message) {
        await this.db.insert({
            into: 'message',
            upsert: true,
            values: [{
                session: session,
                ...message
            }]
        });
    }

    async get_messages(session) {
        const messages = await this.db.select({
            from: 'message',
            where: {
                session: session
            },
            order: {
                by: 'timestamp',
                type: 'asc'
            }
        });
        messages.every(message => delete message.session);
        return messages;
    }
}

export const storage = new SessionStore();
