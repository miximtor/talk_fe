<template>
    <div id="chat">

        <Info
                ref="info"
                @logout="on_logout"
                @menu-change="(name) => {this.contact_visible = name === 'contacts'}"
                @menu_click="on_menu_click">
        </Info>

        <div v-if="contact_visible">
            <ContactDetail
                    @start-message="on_start_message">
            </ContactDetail>
        </div>
        <div v-else>
            <Talk></Talk>
        </div>

    </div>
</template>

<script>
    import Info from "@/components/info/Info";
    import ContactDetail from "@/components/talk/ContactDetail";
    import Talk from "@/components/talk/Talk";

    import {mapActions, mapMutations, mapGetters} from 'vuex';

    export default {

        name: "Chat",
        components: {ContactDetail, Info, Talk},
        computed: {
            ...mapGetters({
                current_contact: 'current_contact',
                socket_state: 'socket_state'
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

        data() {
            return {
                active_name: 'contacts',
                contact_visible: true
            }
        },

        methods: {

            ...mapActions({
                logout: 'logout',
                upsert_session: 'upsert_session',
                update_messages: 'update_messages'
            }),

            ...mapMutations({
                set_current_session: 'set_current_session'
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

                self.$refs['info'].change_menu_selection('session');
                self.contact_visible = false;
            },

            on_menu_click(name) {
                let self = this;
                if (name === 'modify_personal_info') {
                    self.modify_personal_info_form = JSON.parse(JSON.stringify(self.personal_info));
                    self.modify_personal_info_modal_visible = true;
                } else {
                    self.$emit('menu_click', name);
                }
            },

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
