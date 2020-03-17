<template>
    <div id="mic">
        <div id="pop">
        </div>
        <button @click="on_mic_click">
            <i :class="mic.icon" :style="mic.style"></i>
        </button>
    </div>
</template>

<script>

    const CLOSE = 'close';
    const OPENING = 'opening';
    const OPEN = 'open';
    const CLOSING = 'closing';

    export default {
        name: "Mic",

        data() {
            return {
                mic: {
                    icon: 'ivu-icon ivu-icon-md-mic-off',
                    style: 'vertical-align: unset; color: gray',
                    state: CLOSE,
                },
                chunk: [],
                recorder: null
            }
        },

        methods: {
            async on_mic_click() {
                let self = this;
                switch (self.mic.state) {
                    case CLOSE:
                        self.mic.state = OPENING;
                        if (!(await self.configure_recorder())) {
                            self.mic.state = CLOSE;
                            return;
                        }
                        self.mic.state = OPEN;
                        self.mic.icon = 'ivu-icon ivu-icon-md-mic';
                        self.mic.style = 'vertical-align: unset; color: rgb(64, 167, 227)';
                        self.$emit('record-start');
                        self.recorder.start();
                        break;
                    case OPENING:
                        break;
                    case OPEN:
                        self.recorder.stop();
                        break;
                    case CLOSING:
                        break;
                }
            },

            async configure_recorder() {
                let self = this;
                try {

                    /*self.voice.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
                    self.voice.recorder = new
                    console.log(self.mic.voice.recorder);
                    self.voice.recorder.ondataavailable = ev => self.mic.voice.chunk.push(ev.data);
                    self.voice.recorder.onstop = () => {
                        self.voice.stream.getTracks().forEach(track => track.stop());
                        const voice = new Blob([self.mic.voice.chunk], {type: 'audio/mpeg'});
                        self.$emit('record-stop', voice);
                        self.mic.voice = {
                            stream: null,
                            recorder: null,
                            chunk: []
                        };
                    };
                     */
                    const Recorder = require('opus-recorder');
                    self.recorder = new Recorder({
                        encoderBitRate: 8000,
                        encoderSampleRate: 8000,
                        encoderPath: 'https://talk.maxtorm.wtf/dist/encoderWorker.min.js'
                    });
                    self.recorder.ondataavailable = data => self.chunk.push(data);
                    self.recorder.onstop = () => {
                        const voice = new Blob([self.chunk], {type: 'audio/ogg'});
                        console.log(voice);
                        self.$emit('record-stop', voice);
                        self.chunk = [];
                    };
                    return true;
                } catch (e) {
                    console.log(e);
                    self.$modal.show('error-dialog', {
                        title: '打开麦克风失败',
                        content: '请检查麦克风设备及权限'
                    });
                    return false;
                }
            }
        }
    }
</script>

<style scoped>
    #mic {
        margin-left: 10px;
        margin-right: 10px;
        width: 40px;
        height: 40px;
    }

    #mic button {
        width: 100%;
        height: 100%;
        font-size: 30px;
        outline: none;
        text-align: center;
        background: rgba(0, 0, 0, 0);
        border: none;
    }

</style>
