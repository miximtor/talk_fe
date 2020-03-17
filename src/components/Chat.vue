<template>
    <div id="chat">

        <Info
                ref="info"
                @contact-click="(contact) => {this.current_select_contact = contact}"
                @session-click="(session) => {this.current_select_session = session}"
                @logout="on_logout"
                @menu-change="on_menu_change"
                @menu_click="on_menu_click">
        </Info>

        <div v-if="contact_visible">
            <Contact
                    :contact="current_select_contact"
                    @start-message="on_start_message">
            </Contact>
        </div>
        <div v-else>
            <Talk
                    :session="current_select_session">
            </Talk>
        </div>

    </div>
</template>

<script>
    import Info from "@/components/info/Info";
    import Contact from "@/components/talk/ContactDetail";
    import Talk from "@/components/talk/Talk";

    import {mapActions} from 'vuex';

    export default {

        name: "Chat",
        components: {Contact, Info, Talk},


        data() {
            return {
                active_name: 'contacts',
                current_select_contact: {},
                current_select_session: {},
                contact_visible: true
            }
        },

        methods: {

            ...mapActions({
                do_logout: 'logout'
            }),

            async on_logout() {
                let self = this;
                await self.do_logout();
                self.$emit('logout-success');
            },

            on_start_message() {
                let self = this;
                self.$refs['info'].start_message(self.current_select_contact);
                self.current_select_session = self.current_select_contact;
                self.contact_visible = false;
            },

            on_menu_change(name) {
                let self = this;
                self.contact_visible = name === 'contacts';
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
