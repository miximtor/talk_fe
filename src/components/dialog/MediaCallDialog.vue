<template>
    <modal name="media-call-dialog" height="auto" :clickToClose="false" styles="display: flex; flex-direction: column;" width="700px"
           @before-open="on_before_open" @before-close="on_before_close">
        <DialogTop name="media-call-dialog" title="视频聊天"></DialogTop>
        <div v-if="media_state === 'open_stream'" style="display: flex; justify-content: center; margin-top: 40px; margin-bottom: 40px">
            <span style="font-size: 22px">请允许您的麦克风、摄像头权限</span>
        </div>
        <div v-if="media_state === 'initiative_calling'" style="display: flex; flex-direction: column; align-items: center; margin: 40px;">
            <span style="font-size: 22px">等待{{who}}确认...</span>
            <iv-button long type="primary" style="margin-top: 40px" @click="$modal.hide('media-call-dialog')">挂断</iv-button>
        </div>
        <div v-if="media_state === 'passive_confirm'" style="display: flex; flex-direction: column; align-items: center; margin: 40px;">
            <span style="font-size: 22px">{{who}}想跟你聊天</span>
            <div style="display: flex;margin-top: 40px; flex-grow: 1; align-self: stretch; justify-content: space-around">
                <iv-button long type="primary" @click="passive_open1">确认</iv-button>
                <div style="width: 20px"></div>
                <iv-button long type="error" @click="$modal.hide('media-call-dialog')">拒绝</iv-button>
            </div>
        </div>
        <div v-if="media_state === 'connecting'" style="display: flex; justify-content: center; margin-top: 40px; margin-bottom: 40px">
            <span style="font-size: 22px">连接中</span>
        </div>
        <div v-if="media_state === 'calling'" style="display: flex; flex-direction: column; margin-bottom: 10px; align-items: center">
            <div style="display: flex; width: 680px; justify-content: space-around">
                <video style="width: 320px; height: 240px" :volume.prop="0" id="self-stream" autoplay :srcObject.prop="stream"></video>
                <video style="width: 320px; height: 240px" id="remote-stream" autoplay :srcObject.prop="remote_stream"></video>
            </div>
            <div style="width: 600px">
                <iv-button long type="error" @click="$modal.hide('media-call-dialog')" style="margin-top: 10px;">挂断</iv-button>
            </div>
        </div>
    </modal>
</template>

<script>
    import DialogTop from "@/components/dialog/DialogTop";
    import {PeerStates} from "@/util/connection";
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        name: "MediaCallDialog",
        components: {DialogTop},
        data() {
            return {
                who: '',
                stream: null,
                remote_stream: null,
                media_conn: null,
                data_conn: null
            }
        },

        computed: {
            ...mapGetters({
                media_state: 'media_state'
            })
        },

        methods: {

            ...mapMutations({
                set_media_state: 'set_media_state'
            }),

            async on_before_open(ev) {
                let self = this;
                self.who = ev.params.who;
                switch (ev.params.type) {
                    case 'passive':
                        self.passive_open(ev.params);
                        break;
                    case 'initiative':
                        await self.initiative_open(ev.params);
                        break;
                }
            },

            async initiative_open(params) {
                let self = this;
                try {
                    self.set_media_state('open_stream');
                    self.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

                    self.set_media_state('initiative_calling');
                    self.data_conn = PeerStates.peer.connect(params.who, {reliable: true});

                    self.data_conn.on('data', (data) => {
                        if (data === 'refuse') {
                            self.$modal.show('error-dialog', {title: '通话失败', content: `${self.who}拒绝了你的请求`});
                            return;
                        }
                        self.set_media_state('connecting');
                        self.media_conn = PeerStates.peer.call(params.who, self.stream);

                        self.media_conn.on('stream', remote_stream => {
                            self.remote_stream = remote_stream;
                            self.set_media_state('calling');
                        });

                        self.media_conn.on('close', () => {
                            self.$modal.hide('media-call-dialog');
                        });

                        self.media_conn.on('error', () => {
                            self.$modal.hide('media-call-dialog');
                        });
                    });

                    self.data_conn.on('close', () => {
                        self.$modal.hide('media-call-dialog');
                    });

                    self.data_conn.on('error', () => {
                        self.$modal.hide('media-call-dialog');
                    });

                    PeerStates.peer.on('error', err => {
                        if (err.type === 'peer-unavailable') {
                            self.$modal.show('error-dialog', {title: '链接失败', content: `${self.who}目前不在线`});
                        } else {
                            self.$modal.show('error-dialog', {title: '链接失败', content: err.type});
                        }
                        self.$modal.hide('media-call-dialog');
                    });

                } catch (e) {
                    console.log(e);
                    self.$modal.hide('media-call-dialog');
                }
            },

            passive_open(params) {
                let self = this;
                self.data_conn = params.data_conn;
                self.set_media_state('passive_confirm');
            },

            async passive_open1() {
                let self = this;
                self.set_media_state('open_stream');
                self.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

                self.set_media_state('connecting');
                self.data_conn.send('1');
                PeerStates.peer.on('call', media_conn => {
                    self.media_conn = media_conn;
                    self.media_conn.answer(self.stream);
                    self.media_conn.on('stream', remote_stream => {
                        self.remote_stream = remote_stream;
                        self.set_media_state('calling');
                    });

                    self.media_conn.on('close', () => {
                        self.$modal.hide('media-call-dialog');
                    });

                    self.media_conn.on('error', () => {
                        self.$modal.hide('media-call-dialog');
                    });

                })

                self.set_media_state('passive_calling');
            },

            on_before_close() {
                let self = this;
                self.set_media_state('initialized');
                self.stream?.getTracks().forEach(track => {
                    track.stop();
                });
                self.remote_stream?.getTracks().forEach(track => {
                    track.stop();
                });
                self.stream = null;
                self.remote_stream = null;
                self.data_conn?.close();
                self.data_conn = null;
                self.media_conn?.close();
                self.media_conn = null;
            }
        }
    }
</script>

<style scoped>

</style>
