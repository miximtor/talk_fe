<template>
    <div id="message-viewer"
         :style="`height: ${height}px`"
         @contextmenu.prevent="$refs['message_menu'].open">
        <PerfectScrollbar id="message-viewer-scroll"
                          ref="message-viewer-scroll"
                          :options="{wheelSpeed : 2}"
                          :style="`height: ${height}px; width: 100%`">
            <div class="message-viewer-item"
                 :id="`message-${message.message_id}`"
                 v-for="(message, index) of messages"
                 :key="index">
                <div :class="`message-wrapper ${get_message_from(message)}`"  >
                    <iv-avatar size="40"
                               shape="square"
                               :src="get_message_avatar(message)"
                               :class="`message-avatar ${get_message_from(message)}`">
                    </iv-avatar>
                    <div :class="`message-content ${get_message_from(message)}`">
                        <div :class="`message-content-time ${get_message_from(message)}`">
                            <span>{{fmt(message.timestamp)}}</span>
                        </div>
                        <div :class="`message-content-wrapper ${get_message_from(message)}`" @contextmenu.prevent.stop="$refs['message_menu'].open($event, message)">
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
                        </div>
                    </div>
                </div>
            </div>
        </PerfectScrollbar>
        <vue-context ref="message_menu" style="width: 120px; min-width: unset; padding: 0">
            <template slot-scope="scope">
                <li v-if="scope.data">
                    <button class="message-context-button"
                            @click.prevent="on_delete_message(scope.data.message_id)">
                        删除
                    </button>
                </li>
                <li v-if="scope.data">
                    <button v-show="get_message_from(scope.data) === 'self'"
                            class="message-context-button">
                        撤回
                    </button>
                </li>
                <li v-if="!scope.data">
                    <button class="message-context-button">
                        删除所有消息
                    </button>
                </li>
            </template>
        </vue-context>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    const strftime = require('strftime');

    import VueContext from 'vue-context';
    import 'vue-context/src/sass/vue-context.scss';


    export default {
        name: "MessageViewer",
        props: ['height', 'session'],
        components: { VueContext },
        computed: {
            ...mapGetters({
                personal_info: 'personal_info',
                messages: 'messages'
            })
        },

        methods: {

            ...mapActions({
               delete_message: 'delete_message'
            }),

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
                return message.sender === self.personal_info.login_id ? self.personal_info.avatar : self.session.avatar;
            },

            scrollToMessage(message_id) {
                const message = document.getElementById(`message-${message_id}`);
                if (message === null) {
                    return;
                }
                const scroll = document.getElementById('message-viewer-scroll');
                scroll.scrollTop = message.offsetTop;
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

            async on_delete_message(message_id) {
                let self = this;
                await self.delete_message(message_id);
            }

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
        background: rgb(178, 226, 129);
        padding: 10px;
        border-radius: 5px;
        margin-top: 5px;
        width: auto;
        height: auto;
        max-width: 400px;
        max-height: 300px;
        overflow-y: hidden;
    }

    .message-content-wrapper.others {
        align-self: flex-start;
    }

    .message-content-wrapper.self {
        align-self: flex-end;
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
        width: 200px;
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
        max-width: 150px;
        overflow-x: hidden;
    }

    .message-content-content.file-size {
        font-size: 10px;
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
