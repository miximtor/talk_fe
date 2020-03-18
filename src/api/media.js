const COS = require('cos-js-sdk-v5');

class Media {
    cos = null;
    constructor() {
        this.cos = new COS({
            SecretId: 'AKIDJPPAh0AqOjyMWTsftrgGgs66qLbcdr66',
            SecretKey: '7zd092fBRS7kBsGPM4XlsmR4SbWDg5GC'
        });
    }

    async upload(content, key) {
        return new Promise((resolve, reject) => {
            this.cos.putObject({
                Bucket: 'voice-1253676805',
                Region: 'ap-guangzhou',
                Key: key,
                Body: content
            }, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data.Location);
            });
        });
    }
}

export let media = new Media();
