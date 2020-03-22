import {axios, handle_response} from "@/util/connection";


class Message {
    socket = {};
    async send(token, msg) {
        await axios.post('/message/send', {token: token, message: msg}).then(handle_response);
    }

    async accept(token, message_id) {
        await axios.post('/message/accept', {token: token, message_id: message_id}).then(handle_response);
    }

}

export const message = new Message();
