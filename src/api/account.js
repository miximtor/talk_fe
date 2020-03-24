import {axios, handle_response} from "@/util/connection";

class Account {

    async get_contacts(token) {
        return (await axios.post('/relation/getcontacts', {token: token}).then(handle_response)).data;
    }

    async get_personal_info(token) {
        return (await axios.post('/account/getpersonalinfo', {token: token}).then(handle_response)).data;
    }

    async login(authentication) {
        const token = (await axios.post('/account/login', authentication).then(handle_response)).token;
        let socket = new WebSocket(`wss://talk.maxtorm.wtf/service?token=${token}`);
        try {
            await new Promise((resolve, reject) => {
                socket.onopen = () => {
                    socket.onopen = () => {};
                    socket.onerror = () => {};
                    resolve();
                };

                socket.onerror = () => {
                    reject();
                };
            });
        } catch (e) {
            throw new Error('Socket连接建立失败');
        }
        return [token, socket];
    }

    async register(register_form) {
        await axios.post('/account/register', register_form).then(handle_response);
    }

    async search(token, key_text) {
        return (await axios.post('/relation/search', {token: token, key_text: key_text}).then(handle_response)).data;
    }

}

export const account = new Account();
