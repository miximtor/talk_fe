<template>
    <div id="info">

        <PersonalInfo
                @logout="()=>this.$emit('logout')">
        </PersonalInfo>
        <iv-tabs :value="active_name" id="switch" @on-click="on_menu_selection_change">
            <iv-tab-pane icon="md-contacts" name="contacts">

                <ContactList
                        ref="contacts"
                        @contact-click="(contact) => {this.$emit('contact-click', contact)}">
                </ContactList>
            </iv-tab-pane>
            <iv-tab-pane icon="md-chatboxes" name="session">
                <SessionList
                        ref="session"
                        @session-click="(session) => {this.$emit('session-click', session)}">
                </SessionList>
            </iv-tab-pane>
        </iv-tabs>
    </div>
</template>

<script>
    import PersonalInfo from "@/components/info/PersonalInfo";
    import ContactList from "@/components/info/ContactList";
    import SessionList from "@/components/info/SessionList";

    export default {
        name: "Info",
        components: {SessionList, ContactList, PersonalInfo},

        data() {
            return {
                active_name: 'contacts',
            }
        },

        methods: {
            on_menu_click(name) {
                let self = this;
                self.$emit('menu_click', name);
            },

            change_menu_selection(name) {
                let self = this;
                self.active_name = name;
            },

            on_menu_selection_change(name) {
                let self = this;
                self.change_menu_selection(name);
                self.$emit('menu-change', name);
            },

            start_message(contact) {
                let self = this;
                self.$refs['session'].use_session(contact.login_id);
                self.change_menu_selection('session');
            }

        }
    }
</script>

<style>
    #switch .ivu-tabs-bar{
        margin-bottom: 0;
        border-bottom: 2px solid #464c5b;
    }

    #switch .ivu-tabs-nav-scroll {
        display: flex;
    }

    #switch .ivu-tabs-nav {
        flex-grow: 1;
        display: flex;
    }

    #switch .ivu-tabs-tab {
        color: white;
        font-size: 28px !important;
        flex-grow: 1;
        display: flex;
        margin: 0;
        justify-content: center;
    }

    #switch .ivu-tabs-ink-bar {
        width: 0;
        height: 0;
    }

    #switch .ivu-icon {
        width: 30px;
        height: 30px;
    }

    #switch .ivu-tabs-tab-active {
        color: rgb(60, 175, 54);
    }
</style>

<style scoped>
    #info {
        background: rgb(46, 50, 56);
        width: 20em;
        height: 50em;
        min-width: 300px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }


    #switch {
        background: rgba(0, 0, 0, 0);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

</style>
