export const axios = require('axios').default.create({
    baseURL: 'https://talk.maxtorm.wtf/bin/',
    headers: {'content-type': 'application/json'},
    timeout: 4000
});

export function handle_response(res) {
    if (res.data.ok) {
        return res.data;
    } else {
        throw new Error(res.data.reason);
    }
}

export const PeerStates = {
  peer: null,
};

