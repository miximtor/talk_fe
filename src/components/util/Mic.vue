<template>
    <div id="mic" :style="mic.background">
        <button
                @mousedown="on_mouse_down"
                @mouseup="on_mouse_up"
                @mouseleave="on_mouse_leave">
            <i :class="mic.icon" :style="mic.style"></i>
        </button>
    </div>
</template>

<script>
    const MicRecorder = require('mic-recorder-to-mp3');


    const MIC_CLOSE = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: gray',
        background: 'background: rgba(0, 0, 0, 0)',
        state: 'close'
    };


    const MIC_OPEN = {
        icon: 'ivu-icon ivu-icon-md-mic',
        style: 'vertical-align: unset; color: rgb(64, 167, 227)',
        background: 'background: rgb(227,241,250)',
        state: 'open'
    };

    export default {
        name: "Mic",

        data() {
            return {
                mic: MIC_CLOSE,
                recorder: new MicRecorder({bitRate: 8}),
                available: false,
            }
        },

        async mounted() {
            let self = this;
            try {
                await self.recorder.start();
                await self.recorder.stop();
                self.available = true;
            } catch (e) {
                self.$modal.show('error-dialog', {
                    title: '检查麦克风失败',
                    content: '请确认麦克风设备及权限'
                });
            }
        },

        methods: {
            async on_mouse_down() {
                let self = this;
                if (!self.available) {
                    self.$modal.show('error-dialog', {
                        title: '无法录音',
                        content: '请检查麦克风设备及权限'
                    });
                    return;
                }

                try {
                    await self.recorder.start();
                    self.$emit('record-start');
                    self.mic = MIC_OPEN;
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '打开麦克风失败',
                        content: '请检查麦克风设备及权限'
                    });
                }
            },

            async on_mouse_up() {
                let self = this;
                try {
                    self.mic = MIC_CLOSE;
                    const [,voice] = await self.recorder.stop().getMp3();
                    self.$emit('record-stop', voice);
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '录音失败',
                        content: '请检查麦克风设备及权限'
                    });
                }
            },

            async on_mouse_leave() {
                let self = this;
                if (self.mic.state === 'open') {
                    try {
                        self.mic = MIC_CLOSE;
                        await self.recorder.stop();
                        self.$emit('record-cancel');
                    } catch (e) {
                        self.$modal.show('error-dialog', {
                            title: '录音失败',
                            content: e.message
                        });
                    }
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
        border-radius: 20px;
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
