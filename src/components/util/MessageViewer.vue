<template>
    <div id="message-viewer"
         :style="`height: ${height}px`"
         @contextmenu.prevent="$refs['message_menu'].open">
        <PerfectScrollbar id="message-viewer-scroll"
                          ref="message-viewer-scroll"
                          :options="{wheelSpeed : 2}"
                          :style="`height: ${height}px; width: 100%`" @ps-y-reach-end="on_scroll_reach_end">
            <div :id="`message-${message.message_id}`"
                 v-for="(message, index) of messages"
                 :key="index"
                 class="message-viewer-item">
                <div :class="`message-wrapper ${get_message_from(message)}`"
                     v-if="message.type !== 'message-delete' && message.type !== 'message-revoke'">
                    <iv-avatar size="40"
                               shape="square"
                               :src="get_message_avatar(message)"
                               :class="`message-avatar ${get_message_from(message)}`">
                    </iv-avatar>
                    <div :class="`message-content ${get_message_from(message)}`">
                        <div :class="`message-content-time ${get_message_from(message)}`">
                            <span>{{fmt(message.timestamp)}}</span>
                        </div>

                        <div :class="`message-content-wrapper ${get_message_from(message)}`"
                             @contextmenu.prevent.stop="$refs['message_menu'].open($event, message)">
                            <div v-if="message.type === 'message-text'"
                                 class="message-content-content text">
                                <span>{{message.content.text}}</span>
                            </div>

                            <div v-if="message.type === 'message-voice'"
                                 class="message-content-content voice">
                                <audio controls :src="message.content.url"></audio>
                            </div>

                            <div v-if="message.type === 'message-file'"
                                 class="message-content-content file"
                                 @click="download(message.content.name, message.content.url)">
                                <div class="message-content-content file-meta">
                                    <span class="message-content-content file-name">{{message.content.name}}</span>
                                    <span class="message-content-content file-size">{{file_size(message.content.size)}}</span>
                                </div>
                                <iv-icon class="message-content-content file-icon" type="md-document"/>
                            </div>

                            <div v-if="message.type === 'message-add-friend'"
                                 class="message-content-content add-friend">
                                <span>
                                    {{message.content.who}} 想要添加你为好友
                                </span>
                                <div class="message-content-content add-friend__buttons">
                                    <iv-button-group>
                                        <iv-button @click="add_friend_reply({msg: message, reply: 'ok'})" :disabled="message.content.state !== 'wait'">同意</iv-button>
                                        <iv-button @click="add_friend_reply({msg: message, reply: 'refuse'})" :disabled="message.content.state !== 'wait'">拒绝</iv-button>
                                        <iv-button @click="add_friend_reply({msg: message, reply: 'blacklist'})" :disabled="message.content.state !== 'wait'">拉黑</iv-button>
                                    </iv-button-group>
                                </div>
                            </div>

                            <div v-if="message.type === 'message-add-friend-refuse'"
                                class="message-content-content add-friend">
                                <span>
                                    {{message.content.who}} 拒绝了你的好友申请
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </PerfectScrollbar>
        <vue-context ref="message_menu" style="width: 120px; min-width: unset; padding: 0">
            <template slot-scope="scope">
                <li v-if="scope.data">
                    <button class="message-context-button"
                            @click.prevent="delete_message({session: current_session.login_id, msg: scope.data})">
                        删除
                    </button>
                </li>
                <li v-if="scope.data">
                    <button v-show="get_message_from(scope.data) === 'self'"
                            class="message-context-button"
                            @click="revoke_message(scope.data)">
                        撤回
                    </button>
                </li>
                <li v-if="!scope.data">
                    <button class="message-context-button"
                            @click="delete_all_message(current_session.login_id)">
                        删除所有消息
                    </button>
                </li>
            </template>
        </vue-context>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';

    const strftime = require('strftime');

    import VueContext from 'vue-context';
    import 'vue-context/src/sass/vue-context.scss';

    export default {
        name: "MessageViewer",
        props: ['height'],
        components: {VueContext},
        computed: {
            ...mapGetters({
                personal_info: 'personal_info',
                messages: 'messages',
                current_session: 'current_session',
            })
        },

        mounted() {
            let self = this;
            self.scroll_bottom();
        },

        methods: {

            ...mapMutations({
                set_new_message: 'set_new_message'
            }),

            ...mapActions({
                delete_message: 'delete_message',
                revoke_message: 'revoke_message',
                delete_all_message: 'delete_all_message',
                add_friend_reply: 'add_friend_reply'
            }),

            scroll_bottom() {
                let self = this;
                const scroll = self.$refs['message-viewer-scroll'].$el;
                scroll.scrollTop = scroll.scrollHeight;
            },

            fmt(timestamp) {
                const DATE_FMT_STR = '%Y-%m-%d %H:%M:%S';
                return strftime(DATE_FMT_STR, new Date(timestamp));
            },

            download(name, url) {
                let link = document.createElement('a');
                link.href = url;
                link.download = name;
                link.target = '_blank';
                link.click();
            },

            get_message_from(message) {
                let self = this;
                return message.sender === self.personal_info.login_id ? 'self' : 'others';
            },

            get_message_avatar(message) {
                let self = this;
                return message.sender === self.personal_info.login_id ? self.personal_info.avatar : self.current_session.avatar;
            },

            file_size(size) {
                let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                let i = 0;
                while (size >= 1024) {
                    size /= 1024;
                    ++i;
                }
                return size.toFixed(1) + ' ' + units[i];
            },

            on_scroll_reach_end() {
                let self = this;
                self.set_new_message({
                    session: self.current_session.login_id,
                    new_message: false
                });
            },

        }
    }
</script>

<style>
</style>

<style scoped>
    #message-viewer {
        display: flex;
        width: 100%;
    }

    .message-viewer-item {
        border: none;
        padding: 0;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .message-viewer-item.invisible {
        height: 0;
        margin: 0;
    }

    .message-wrapper {
        display: flex;
        flex-grow: 1;
    }

    .message-wrapper.self {
        flex-direction: row-reverse;
        align-items: flex-start;
    }

    .message-wrapper.others {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
    }

    .message-avatar.self {
        margin-right: 15px;
    }

    .message-avatar.others {
        margin-left: 15px;
    }

    .message-content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }


    .message-content.self {
        margin-right: 10px;
    }

    .message-content.others {
        margin-left: 10px;
    }

    .message-content-time {
        display: flex;
        font-size: 10px;
        font-weight: bold;
    }

    .message-content-time.self {
        flex-direction: row-reverse;
    }

    .message-content-wrapper {
        display: flex;
        flex-grow: 1;
        margin-top: 5px;
        width: auto;
        height: auto;
        max-width: 400px;
        max-height: 300px;
        overflow: hidden;
    }

    .message-content-wrapper.others {
        align-self: flex-start;
    }

    .message-content-wrapper.self {
        align-self: flex-end;
    }

    .message-content-content.text {
        background: rgb(178, 226, 129);
        border-radius: 5px;
        padding: 10px;
    }

    .message-content-content.voice audio {
        display: flex;
        background: rgba(0, 0, 0, 0);
        border: none;
    }

    .message-content-content.voice audio:active, audio:focus {
        border: none;
        outline: none;
    }

    .message-content-content.file {
        display: flex;
        padding: 10px;
        border: 1px solid #657180;
        border-radius: 10px;
    }

    .message-content-content.file-icon {
        font-size: 50px;
    }

    .message-content-content.file-meta {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    .message-content-content.file-name {
        font-size: 16px;
        font-weight: bold;
        width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        text-align: left;
        direction: ltr;
    }

    .message-content-content.file-size {
        font-size: 10px;
        margin-top: 5px;
    }

    .message-content-content.add-friend {
        background: lightgray;
        border-radius: 5px;
        padding: 10px;
    }

    .message-content-content.add-friend__buttons {
        margin-top: 10px;
    }

    .message-context-button {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 5px;
        background: white;
        border: none;
        outline: none;
        font-size: 16px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .message-context-button:hover {
        background: rgb(245, 245, 245);
        outline: none;
    }


</style>
