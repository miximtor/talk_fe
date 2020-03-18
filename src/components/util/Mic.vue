<template>
    <div id="mic">
        <div id="pop">
        </div>
        <button @click="on_mic_click" :disabled="mic.state === 'OPENING' || mic.state === 'CLOSING'">
            <i :class="mic.icon" :style="mic.style"></i>
        </button>
    </div>
</template>

<script>
    const MicRecorder = require('mic-recorder-to-mp3');

    const CLOSE = 'close';
    const OPENING = 'opening';
    const OPEN = 'open';
    const CLOSING = 'closing';

    const MIC_CLOSE = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: gray',
        state: CLOSE,
    };

    const MIC_OPENING = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: gray',
        state: OPENING,
    };

    const MIC_OPEN = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: rgb(64, 167, 227)',
        state: OPEN
    };

    const MIC_CLOSING = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: rgb(64, 167, 227)',
        state: CLOSING
    };

    export default {
        name: "Mic",

        data() {
            return {
                mic: MIC_CLOSE,
                recorder: new MicRecorder({bitRate: 8})
            }
        },

        methods: {
            async on_mic_click() {
                let self = this;
                switch (self.mic.state) {
                    case CLOSE:
                        self.mic = MIC_OPENING;
                        if (!await self.start_recorder()) {
                            self.mic = MIC_CLOSE;
                            return;
                        }
                        self.mic = MIC_OPEN;
                        break;
                    case OPEN:
                        self.mic = MIC_CLOSING;
                        await self.stop_recorder();
                        self.mic = MIC_CLOSE;
                        break;
                }
            },

            async start_recorder() {
                let self = this;
                try {
                    await self.recorder.start();
                    self.$emit('record-start');
                    return true;
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '打开麦克风失败',
                        content: '请检查麦克风设备及权限'
                    });
                    return false;
                }
            },

            async stop_recorder() {
                let self = this;
                try {
                    const [,voice] = await self.recorder.stop().getMp3();
                    self.$emit('record-stop', voice);
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '录音失败',
                        content: '请检查麦克风设备及权限'
                    });
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
