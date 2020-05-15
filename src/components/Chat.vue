<template>
    <div id="chat">

        <Info
                ref="info"
                @logout="on_logout"
                @menu-change="(name) => {this.contact_visible = name === 'contacts'}">
        </Info>

        <div v-if="contact_visible">
            <ContactDetail
                    @start-message="on_start_message">
            </ContactDetail>
        </div>
        <div v-else>
            <Talk @media-call="on_media_call"></Talk>
        </div>

        <MediaCallDialog></MediaCallDialog>
    </div>

</template>

<script>
    import Info from "@/components/info/Info";
    import ContactDetail from "@/components/talk/ContactDetail";
    import Talk from "@/components/talk/Talk";
    import {PeerStates} from "@/util/connection";
    import Peer from 'peerjs';

    import {mapActions, mapMutations, mapGetters} from 'vuex';

    import MediaCallDialog from "@/components/dialog/MediaCallDialog";

    export default {

        name: "Chat",
        components: {ContactDetail, Info, Talk, MediaCallDialog},
        computed: {
            ...mapGetters({
                current_contact: 'current_contact',
                socket_state: 'socket_state',
                login_id: 'login_id',
                media_state: 'media_state'
            })
        },

        watch: {
            socket_state(new_state) {
                let self = this;
                if (new_state === 'error') {
                    self.$modal.show('error-dialog', {
                        title: '与服务器连接断开',
                        content: '请重新登录'
                    });
                    self.$emit('connection-close');
                }
            }
        },

        mounted() {
            let self = this;
            PeerStates.peer = new Peer(self.login_id, {
                host: 'talk.maxtorm.wtf',
                path: 'voip',
                secure: true,
                port: 443,
                config: {
                    'iceServers': [
                        {
                            'url': 'turn:turn.talk.maxtorm.wtf',
                            'username': 'wetalk',
                            'credential': 'wetalk',
                            credentialType: "password"
                        }
                    ]
                },
                debug: 3
            });

            self.set_media_state('initialized');

            PeerStates.peer.on('connection', data_conn => {
                if (self.media_state !== 'initialized') {
                    data_conn.send('refuse');
                    setTimeout(()=>{data_conn.close()}, 1000);
                    return;
                }

                data_conn.on('close', () => {
                    self.$modal.hide('media-call-dialog');
                });

                data_conn.on('error', () => {
                    self.$modal.hide('media-call-dialog');
                });

                self.$modal.show('media-call-dialog', {
                    type: 'passive',
                    data_conn: data_conn,
                    who: data_conn.peer
                });

            });
        },

        data() {
            return {
                active_name: 'contacts',
                contact_visible: false
            }
        },

        methods: {

            ...mapActions({
                logout: 'logout',
                upsert_session: 'upsert_session',
                update_messages: 'update_messages'
            }),

            ...mapMutations({
                set_current_session: 'set_current_session',
                set_media_state: 'set_media_state'
            }),

            async on_logout() {
                let self = this;
                await self.logout();
                self.$emit('logout-success');
            },

            async on_start_message() {
                let self = this;
                await self.upsert_session(self.current_contact.login_id);
                self.set_current_session(self.current_contact.login_id);
                await self.update_messages(self.current_contact.login_id);

                self.$refs['info'].change_menu_selection('sessions');
                self.contact_visible = false;
            },

            async on_media_call(who) {
                let self = this;
                self.$modal.show('media-call-dialog', {
                    type: 'initiative',
                    who: who
                });
            }

        }
    }
</script>

<style scoped>

    #chat {
        background: rgba(0, 0, 0, 0);
        min-height: 100vh;
        min-width: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }


</style>
