<template>
    <div id="message-viewer" :style="`height: ${height}px`">
        <PerfectScrollbar id="message-viewer-scroll" :style="`height: ${height}px; width: 100%`">
            <iv-list id="message-viewer-list">
                <iv-list-item v-for="(message, index) of messages" :key="index">
                    <div v-if="message.from === personal_info.login_id"
                         id="message-self">
                        <iv-avatar size="40" shape="square" :src="personal_info.avatar" class="message-avatar self"/>
                        <div class="message-content self">
                            <div class="message-content-time self">
                                <span>{{fmt(message.timestamp)}}</span>
                            </div>
                            <div class="message-content-wrapper self">
                                <div v-if="message.type==='text'" class="message-content-content text">
                                    <span>{{message.content}}</span>
                                </div>
                                <div v-if="message.type === 'voice'" class="message-content-content voice">
                                    <audio controls :src="message.content"></audio>
                                </div>
                                <div v-if="message.type === 'file'" class="message-content-content file">
                                    <span>文件： {{JSON.parse(message.content).name}}</span>
                                    <iv-button @click="download(JSON.parse(message.content).name, JSON.parse(message.content).url)">下载</iv-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else
                         id="message-others">
                        <iv-avatar size="40" shape="square" :src="session.avatar" class="message-avatar others"/>
                        <div class="message-content others">
                            <div class="message-content-time others">
                                <span>{{fmt(message.timestamp)}}</span>
                            </div>

                            <div class="message-content-wrapper others">
                                <div v-if="message.type==='text'" class="message-content-content text">
                                    <span>{{message.content}}</span>
                                </div>
                                <div v-if="message.type === 'voice'" class="message-content-content voice">
                                    <audio controls :src="message.content"></audio>
                                </div>
                                <div v-if="message.type === 'file'" class="message-content-content file">
                                    <span>文件: {{JSON.parse(message.content).name}}</span>
                                    <iv-button @click="download(JSON.parse(message.content).name, JSON.parse(message.content).url)">下载</iv-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </iv-list-item>
            </iv-list>
        </PerfectScrollbar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    const strftime = require('strftime');

    export default {
        name: "MessageViewer",
        props: ['height', 'session', 'messages'],

        computed: {
            ...mapGetters({
                personal_info: 'personal_info'
            })
        },
        data() {
            return {
            }
        },

        methods: {
            fmt(timestamp) {
                const DATE_FMT_STR = '%Y-%m-%d %H:%M:%S';
                return strftime(DATE_FMT_STR, new Date(timestamp));
            },

            download(name,url) {
                let link = document.createElement('a');
                link.href = url;
                link.download = name;
                link.target = '_blank';
                link.click();
            }
        }
    }
</script>

<style>
    #message-viewer-list .ivu-list-item{
        border: none;
        padding: 0;
        margin-top: 10px;
    }
</style>

<style scoped>
    #message-viewer {
        display: flex;
        width: 100%;
    }


    #message-self {
        display: flex;
        flex-grow: 1;
        flex-direction: row-reverse;
        align-items: flex-start;
    }

    #message-others {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
    }

    .message-avatar.self{
        margin-right: 10px;
    }

    .message-avatar.others{
        margin-left: 10px;
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
        background: rgb(178,226,129);
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

    .message-content-content.voice audio{
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
        flex-direction: column;
    }

    .message-content-content.file span {
        font-size: 18px;
        margin-bottom: 10px;
    }

</style>
