<template>
    <div id="contact_info">
        <PerfectScrollbar style="height: 575px">
            <div v-for="(contact, index) of contacts" :key="index" :style="get_styles(contact)">
                <iv-button class="contact_info_item" @click="set_current_contact(contact)">
                    <iv-avatar size="50" shape="square" :src="contact.avatar"></iv-avatar>
                    <span style="margin-left: 20px">{{contact.nick}}</span>
                </iv-button>
            </div>
        </PerfectScrollbar>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "ContactList",

        computed: {
            ...mapGetters({
                contacts: 'contacts',
                current_contact: 'current_contact'
            })
        },

        methods: {

            ...mapMutations({
                set_current_contact: 'set_current_contact'
            }),


            get_styles(contact) {
                let self = this;
                if (!self.current_contact || contact.login_id !== self.current_contact.login_id) {
                    return 'background: rgba(0, 0, 0, 0)'
                } else {
                    return 'background: rgb(58, 63, 69)'
                }
            },

            on_leave() {
                let self = this;
                self.set_current_contact(null);
            }

        }
    }
</script>

<style scoped>

    #contact_info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .contact_info_item, .contact_info_item:hover, .contact_info_item:focus, .contact_info_item:active {
        height: 100%;
        width: 100%;
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        color: white;
        border: none;
        background: rgba(0, 0, 0, 0);
        font-size: 16px;
        font-weight: lighter;
        box-shadow: none;
    }


</style>
