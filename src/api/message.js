import {axios, handle_response} from "@/util/connection";


class Message {
    socket = null;
    async send(token, msg) {
        await axios.post('/message/send', {token: token, message: msg}).then(handle_response);
    }
}

export const message = new Message();
