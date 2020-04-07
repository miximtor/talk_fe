const OSS = require('ali-oss');
const base64 = require('base-64');

class Media {
    oss = null;
    constructor() {
        this.oss = new OSS({
            accessKeyId: base64.decode('TFRBSTRGYmtjcFF3bWpvS3U2ZlVSd2paDQo='),
            accessKeySecret: base64.decode('cDc0TmJ6VGtBbzBsRzdZTERqVHlQNUhTdDNOREVw'),
            bucket: 'talk-audio',
            endpoint: 'oss-cn-shenzhen.aliyuncs.com'
        });
    }

    async upload(name, content, progress) {
        console.log(progress);
        return (await this.oss.put(name, content)).url;
    }
}

export let media = new Media();
