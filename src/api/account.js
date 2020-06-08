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

    async add_friend(token, master_login_id, slave_login_id) {
        await axios.post('/relation/addfriend', {token: token,master_login_id: master_login_id, slave_login_id: slave_login_id});
    }

    async update_personal_info(token, form) {
        await axios.post('/account/updatepersonalinfo', {token: token, ...form});
    }

    async get_security_question(login_id) {
        return (await axios.post('/account/getsecurityquestion', {login_id: login_id}).then(handle_response)).data;
    }

    async reset_password(security_questions) {
        return (await axios.post('/account/resetpassword', {...security_questions}).then(handle_response)).data;
    }

    async delete_friend(token, slave_login_id) {
        return await axios.post('/relation/deletefriend', {token: token, slave_login_id: slave_login_id}).then(handle_response);
    }

    async blacklist_friend(token, slave_login_id) {
        return await axios.post('/relation/blacklistfriend', {token: token, slave_login_id: slave_login_id}).then(handle_response);
    }

    async add_friend_reply(token, message, state) {
        await axios.post('/relation/addfriendreply', {token: token, message: message, state: state})
    }

}

export const account = new Account();
export const system_session = {
    nick: '系统消息',
    login_id: 'sys',
    avatar: 'https://pic.imgdb.cn/item/5e80a0c0504f4bcb04671ace.png'
};
