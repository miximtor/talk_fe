<template>
    <div id="talk">

        <div id="top">
            <div id="banner">
                <div>
                </div>
                <div style="display: flex; justify-content: center">
                    <span id="bar">{{session.nick}}</span>
                </div>
                <div style="display: flex; justify-content: flex-end">
                    <button>
                        <i class="ivu-icon ivu-icon-md-more" style="vertical-align: unset; color: gray"></i>
                    </button>
                </div>
            </div>
            <iv-divider style="padding: 0;margin: 0; background: rgb(214,214,214)"></iv-divider>
        </div>

        <div id="content">
        </div>

        <div id="bottom">
            <Mic @record-start="recording = true" @record-stop="on_stop_record_voice"></Mic>

            <div v-if="!recording" style="display: flex;flex-grow: 1">
                <PerfectScrollbar id="text_input_scroll">
                    <textarea id="text_input" wrap="soft" @input="resize" v-model="msg.content"/>
                </PerfectScrollbar>

                <div id="typing_menu">
                    <iv-upload id="upload" action="" :show-upload-list="false">
                        <i class="ivu-icon ivu-icon-md-attach" style="vertical-align: unset"></i>
                    </iv-upload>
                    <button @click="on_msg_send">
                        <i class="ivu-icon ivu-icon-md-send" style="vertical-align: unset"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Mic from '@/components/util/Mic';
    import {media} from "@/api/media";

    export default {
        name: "Talk",
        props: ['session'],
        components: {Mic},
        mounted() {
            let self = this;
            const support_wasm = WebAssembly && typeof WebAssembly.instantiate === 'function';
            const support_user_media = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
            self.media_available = support_wasm && support_user_media;
        },

        data() {
            return {
                media_available: false,
                msg: {
                    type: 'text',
                    content: ''
                },
                recording: false
            };
        },
        methods: {
            on_msg_send() {

            },

            async on_record_stop(voice) {
                const [name] = await media.upload(voice);
                console.log(name);
            },


            async on_stop_record_voice() {


            },

            resize() {
                const textarea = document.getElementById('text_input');
                const textarea_scrollbar = document.getElementById('text_input_scroll');

                textarea.style.height = '40px';
                textarea_scrollbar.style.height = '40px';
                const height = textarea.scrollHeight;
                textarea.style.height = `${height}px`;
                textarea_scrollbar.style.height = `${Math.min(height, 160)}px`;
            },

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


    #typing_menu {
        display: flex;
    }

    #text_input_scroll {
        height: 40px;
        flex-grow: 1;
        display: flex;
    }

    #text_input {
        font-weight: lighter;
        flex-grow: 1;
        border: none;
        overflow: hidden;
        resize: none;
        font-size: 16px;
        padding-left: 10px;
        padding-right: 10px;
    }

    button {
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

    button:hover, button:active, button:focus {
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
