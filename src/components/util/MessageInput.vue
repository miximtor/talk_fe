<template>
    <div id="message-input">

        <div v-if="recording" style="display: flex;flex-grow: 1;height: 40px;margin-left: 10px; margin-right: 10px">
            <div style="width: 30px; display: flex; justify-content: center; align-items: center">
                <div style="border: 2px solid red; height: 20px; width: 20px; background: red; border-radius: 10px">
                </div>
            </div>
            <div style="display: flex; margin-left: 10px; width: 80px; justify-content: center; align-items: center">
                    <span style="font-size: 20px">
                        {{format_time(record_start_time, record_current_time)}}
                    </span>
            </div>

            <div style="flex-grow: 1; display: flex">
                <iv-button long style="height: 40px" type="primary">拖动到此取消录音</iv-button>
            </div>
        </div>

        <iv-upload v-if="!recording"
                   id="message-input__file-upload"
                   action=""
                   :show-upload-list="false"
                   :before-upload="on_before_upload">
            <i class="ivu-icon ivu-icon-md-attach" style="vertical-align: unset"></i>
        </iv-upload>

        <PerfectScrollbar v-if="!recording" id="message-input__text-scroll">
                <textarea id="message-input__text-input"
                          wrap="soft"
                          maxlength="400"
                          v-model="text" placeholder="在这里写消息 ...">
                </textarea>
        </PerfectScrollbar>

        <button v-if="text.length > 0"
                id="message-input__text-submit"
                @click="on_text_submit">
            <i class="ivu-icon ivu-icon-md-send" style="vertical-align: unset"></i>
        </button>

        <Mic v-if="text.length <= 0"
             @record-start="on_record_start"
             @record-stop="on_record_stop"
             @record-cancel="()=>{this.recording = false}">
        </Mic>

    </div>
</template>

<script>
    import Mic from '@/components/util/Mic'

    export default {
        name: "MessageInput",
        components: {Mic},
        mounted() {
            let self = this;
            self.$emit('resize');
        },

        data() {
            return {
                text: '',
                recording: false,
                record_start_time: 0,
                record_current_time: 0,
            }
        },

        watch: {
            text() {
                let self = this;

                const input = document.getElementById('message-input__text-input');
                const scroll = document.getElementById('message-input__text-scroll');

                input.style.height = '25px';
                scroll.style.height = '25px';
                if (self.text.length <= 0) {
                    self.$emit('resize');
                    return;
                }

                const height = input.scrollHeight;
                input.style.height = `${height}px`;
                scroll.style.height = `${Math.min(height, 160)}px`;
                self.$emit('resize');

            }
        },

        methods: {
            format_time(start, now) {
                let diff_secs = Math.floor((now - start) / 1000);
                let minutes = Math.floor(diff_secs/60);
                let seconds = Math.floor(diff_secs % 60);
                let minutes_str = minutes >= 10 ? minutes.toPrecision(2): `0${minutes}`;
                let seconds_str = seconds >= 10 ? seconds.toPrecision(2) : `0${seconds}`;
                return `${minutes_str}:${seconds_str}`;
            },

            on_record_start() {
                let self = this;

                self.recording = true;
                self.record_start_time = Date.now();
                self.record_current_time = Date.now();

                let f = () => {
                    self.record_current_time = Date.now();
                    if (self.recording) {
                        setTimeout(f, 1000);
                    }
                };
                f();
            },

            async on_record_stop(voice) {
                let self = this;
                self.recording = false;
                self.$emit('send-voice', voice);
            },

            on_before_upload(file) {
                let self = this;
                console.log(file);
                self.$emit('send-file', file);
                return false;
            },

            on_text_submit() {
                let self = this;
                self.$emit('send-text', self.text);
                self.text = '';
            }
        }
    }
</script>

<style scoped>

    #message-input {
        display: flex;
        flex-grow: 1;
        background: white;
        align-items: flex-end;
        border-radius: 4px;
    }

    #message-input__file-upload {
        font-size: 30px;
        width: 40px;
        height: 40px;
        color: rgb(64, 167, 227);
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
    }

    #message-input__text-scroll {
        height: 25px;
        flex-grow: 1;
        display: flex;
        align-self: center;
    }

    #message-input__text-input {
        font-weight: lighter;
        flex-grow: 1;
        border: none;
        overflow: hidden;
        resize: none;
        font-size: 16px;
        text-align: justify;
    }

    #message-input__text-submit {
        margin-left: 10px;
        margin-right: 10px;
        color: rgb(64, 167, 227);
        font-size: 30px;
        width: 40px;
        height: 40px;
        text-align: center;
        border: none;
        background: rgba(0, 0, 0, 0);
        outline: none;
    }

    #message-input__text-submit:hover, #message-input__text-submit:active, #message-input__text-submit:focus {
        box-shadow: none;
        border: none;
        outline: none;
    }

</style>
