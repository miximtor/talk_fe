<template>
    <div id="talk" v-if="current_session">
        <div id="top">
            <div id="banner">
                <div>
                </div>
                <div style="display: flex; justify-content: center">
                    <span id="bar">{{current_session.nick}}</span>
                </div>
                <div style="display: flex; justify-content: flex-end">
                    <iv-poptip placement="bottom-end" trigger="hover" padding="0px 0px">
                        <button class="talk_button" v-show="current_session.login_id !== 'sys'">
                            <i class="ivu-icon ivu-icon-md-more" style="vertical-align: unset; color: gray"></i>
                        </button>
                        <div slot="content">
                            <iv-button-group :vertical="true" style="width: 100%">
                                <iv-button long>发起视频通话</iv-button>
                                <iv-button long @click="delete_friend">删除好友</iv-button>
                                <iv-button long>加入黑名单</iv-button>
                            </iv-button-group>
                        </div>
                    </iv-poptip>
                </div>
            </div>
            <iv-divider style="padding: 0;margin: 0; background: rgb(214,214,214)"></iv-divider>
        </div>

        <div id="content">
            <MessageViewer :height="content_height" ref="message-viewer">
            </MessageViewer>
        </div>

        <div id="bottom" v-show="current_session.login_id !== 'sys'">
            <MessageInput
                    @resize="on_resize"
                    @send-text="send_text"
                    @send-voice="send_voice"
                    @send-file="send_file">
            </MessageInput>
        </div>

    </div>
    <div id="talk_no_session" v-else>
        <span style="font-size: 30px">未选择聊天</span>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    import MessageViewer from "@/components/util/MessageViewer";
    import MessageInput from "@/components/util/MessageInput"
    import {media} from "@/api/media";
    import {v4 as UUIDv4} from 'uuid';


    export default {
        name: "Talk",

        components: {MessageViewer, MessageInput},

        computed: {
            ...mapGetters({
                current_session: 'current_session',
                login_id: 'login_id'
            }),

        },

        data() {
            return {
                content_height: 0
            };
        },

        watch: {
            current_session() {
                let self = this;
                self.$nextTick()
                    .then(() => self.on_resize())
                    .then(() => self.$refs['message-viewer'].scroll_bottom());
            }
        },

        methods: {

            ...mapActions({
                send_message: 'send_message',
                delete_friend: 'delete_friend'
            }),

            on_resize() {
                let self = this;
                const talk = document.getElementById('talk');
                const top = document.getElementById('top');
                const bottom = document.getElementById('bottom');
                self.content_height = talk.clientHeight - top.clientHeight - bottom.clientHeight;
            },

            async send_text(text) {
                let self = this;
                await self.send_message(self.construct_message('message-text', {text: text}));
            },

            async send_voice(voice) {
                let self = this;
                const url = await media.upload(`voice-${UUIDv4()}-mp3`, voice, () => {
                });

                await self.send_message(self.construct_message('message-voice', {url: url}));
            },

            async send_file(file) {
                let self = this;
                self.$Notice.info({
                    title: '文件上传中',
                    desc: file.name
                });
                const url = await media.upload(file.name, file, () => {
                });
                await self.send_message(self.construct_message('message-file', {
                    url: url,
                    name: file.name,
                    size: file.size
                }));
            },

            construct_message(type, content) {
                let self = this;
                return {
                    message_id: UUIDv4(),
                    from: self.login_id,
                    sender: self.login_id,
                    to: self.current_session.login_id,
                    type: type,
                    timestamp: Date.now(),
                    content: content,
                    version: 1
                };
            }

        }
    }
</script>


<style scoped>

    #talk {
        background: rgb(238, 238, 238);
        width: 55em;
        height: 50em;
        min-width: 800px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    #talk_no_session {
        background: rgb(238, 238, 238);
        width: 55em;
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


</style>
