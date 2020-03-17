export const axios = require('axios').default.create({
    baseURL: 'https://talk.maxtorm.wtf/bin/',
    headers: {'content-type': 'application/json'},
    timeout: 1000
});

export function handle_response(res) {
    if (res.data.ok) {
        return res.data;
    } else {
        throw new Error(res.data.reason);
    }
}


class Connection {
    token = '';
    socket;
    login_id = '';

    constructor() {
    }


    setup_keepalive() {
        setTimeout(() => {
            this.socket.sendPacked({type: 'keepalive', token: this.token});
            this.setup_keepalive();
        }, 120000);
    }

    async logout() {
        await axios.post('/account/logout', {token: this.token}).then(handle_response);
        this.socket.close(4001, 'client close');
    }
}

export const connection = new Connection();
