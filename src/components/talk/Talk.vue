<template>
    <div id="talk" v-if="session">

        <div id="top">
            <div id="banner">
                <div>
                </div>
                <div style="display: flex; justify-content: center">
                    <span id="bar">{{session.nick}}</span>
                </div>
                <div style="display: flex; justify-content: flex-end">
                    <button class="talk_button">
                        <i class="ivu-icon ivu-icon-md-more" style="vertical-align: unset; color: gray"></i>
                    </button>
                </div>
            </div>
            <iv-divider style="padding: 0;margin: 0; background: rgb(214,214,214)"></iv-divider>
        </div>

        <div id="content">
            <MessageViewer
                :session="session"
                :height="content_height">

            </MessageViewer>
        </div>

        <div id="bottom">
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
                    <iv-button long style="height: 40px" type="primary">取消录音</iv-button>
                </div>
            </div>


            <iv-upload v-if="!recording" id="upload" action="" :show-upload-list="false">
                <i class="ivu-icon ivu-icon-md-attach" style="vertical-align: unset"></i>
            </iv-upload>

            <PerfectScrollbar v-if="!recording" id="text_input_scroll">
                <textarea id="text_input"
                          wrap="soft"
                          @input="handle_resize"
                          v-model="text" placeholder="Write a message ... "
                          autofocus="autofocus"/>
            </PerfectScrollbar>

            <button v-if="text"
                    class="talk_button"
                    @click="send_text">
                <i class="ivu-icon ivu-icon-md-send" style="vertical-align: unset"></i>
            </button>

            <Mic v-if="!text"
                 @record-start="on_record_start"
                 @record-stop="on_record_stop">
            </Mic>

        </div>

    </div>
    <div id="talk_no_session" v-else >
        <span style="font-size: 30px">未选择聊天</span>
    </div>

</template>

<script>
    import {media} from "@/api/media";
    import {v4 as UUIDv4} from 'uuid';
    import {mapActions, mapGetters} from 'vuex';

    import Mic from '@/components/util/Mic';
    import MessageViewer from "@/components/util/MessageViewer";

    export default {
        name: "Talk",
        components: {MessageViewer, Mic},

        computed: {
            ...mapGetters({
                session: 'current_session'
            }),

        },

        data() {
            return {
                media_available: false,
                text: '',
                recording: false,
                record_start_time: 0,
                record_current_time: 0,
                content_height: 0
            };
        },

        mounted() {
            let self = this;
            self.handle_resize();
        },

        methods: {

            ...mapActions({
                send_message: 'send_message'
            }),

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
                const location = await media.upload(voice, `voice-${UUIDv4()}`);
                await self.send_voice(location);
            },


            handle_resize() {
                let self = this;
                if (!self.session) {
                    return;
                }

                const textarea = document.getElementById('text_input');
                const textarea_scrollbar = document.getElementById('text_input_scroll');
                textarea.style.height = '25px';
                textarea_scrollbar.style.height = '25px';
                const height = textarea.scrollHeight;
                textarea.style.height = `${height}px`;
                textarea_scrollbar.style.height = `${Math.min(height, 160)}px`;

                const content = document.getElementById('content');
                const top = document.getElementById('top');
                const bottom = document.getElementById('bottom');
                const talk = document.getElementById('talk');

                self.content_height = talk.clientHeight - bottom.clientHeight - top.clientHeight;
                content.style.height = `${self.content_height}px`;
            },

            async send_text() {
                let self = this;
                await self.send_message({type: 'message-text', content: {text: self.text}, to: self.session.login_id});
                self.text = '';
            },

            async send_voice(url) {
                let self = this;
                await self.send_message({type: 'message-voice', content:{url: url}, to: self.session.login_id});
            }

        }
    }
</script>


<style scoped>

    #talk {
        background: rgb(238, 238, 238);
        width: 60em;
        height: 50em;
        min-width: 800px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    #talk_no_session {
        background: rgb(238, 238, 238);
        width: 60em;
        height: 50em;
        min-width: 800px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #banner {
        display: grid;
        grid-template-columns: repeat(3, 33.33%);
        align-items: center;
    }

    #bar {
        font-size: 20px;
        font-weight: lighter;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center
    }

    #content {
        flex-grow: 1;
    }

    #bottom {
        display: flex;
        background: white;
        align-items: flex-end;
        padding-bottom: 10px;
        padding-top: 10px;
        border-radius: 4px;
    }

    #text_input_scroll {
        height: 25px;
        flex-grow: 1;
        display: flex;
        align-self: center;
    }

    #text_input {
        font-weight: lighter;
        flex-grow: 1;
        border: none;
        overflow: hidden;
        resize: none;
        font-size: 16px;
        text-align: justify;
    }

    #text_input:active, #text_input:hover , #text_input:focus{
        border: none;
        outline: none;
    }

    .talk_button {
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

    .talk_button:hover, .talk_button:active, .talk_button:focus {
        box-shadow: none;
        border: none;
        outline: none;
    }


    #upload {
        font-size: 30px;
        width: 40px;
        height: 40px;
        color: rgb(64, 167, 227);
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
    }


</style>
