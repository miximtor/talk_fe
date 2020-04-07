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
                        message_id: {primaryKey: true, notNull: true},
                        from: {dataType: 'string'},
                        sender: {dataType: 'string'},
                        to: {dataType: 'string'},
                        type: {dataType: 'string'},
                        timestamp: {dataType: 'number'},
                        content: {dataType: 'object'},
                        version: {dataType: 'number', notNull: true}
                    }
                }
            ]
        });
        return this;
    }

    async get_sessions() {
        return (await this.db.select({from: 'session'})).map(session => session.login_id);
    }

    async upsert_session(session) {
        await this.db.insert({
            into: 'session',
            upsert: true,
            values: [{login_id: session}]
        })
    }

    async delete_session(session) {
        await this.db.remove({
            from: 'session',
            where: {
                login_id: session
            }
        });
        await this.db.remove({
            from: 'message',
            where: {
                session: session
            }
        });
    }

    async upsert_message_version(session, message) {
        const result = await this.db.select({
            from: 'message',
            where: {
                message_id: message.message_id
            }
        });
        if (result.length > 0 && message.version <= result[0].version) {
            return false;
        }
        await this.db.insert({
            into: 'message',
            upsert: true,
            values: [{
                session: session,
                ...message
            }]
        });
        return true;
    }

    async delete_message(message_id) {
        await this.db.remove({
            from: 'message',
            where: {
                message_id: message_id
            }
        })
    }

    async delete_all_message(session) {
        await this.db.remove({
            from: 'message',
            where: {
                session: session
            }
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
