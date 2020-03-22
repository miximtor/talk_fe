<template>
    <div id="contact_info">
        <PerfectScrollbar>
            <iv-list>
                <iv-list-item v-for="(contact, index) of contacts" :key="index">
                    <iv-button class="contact_info_item" @click.native="on_contact_click(contact)">
                        <iv-avatar size="50" shape="square" :src="contact.avatar"></iv-avatar>
                        <span style="margin-left: 20px">{{contact.nick}}</span>
                    </iv-button>
                </iv-list-item>
            </iv-list>
        </PerfectScrollbar>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "ContactList",

        computed: {
            ...mapGetters({
                contacts: 'contacts'
            })
        },

        methods: {

            ...mapMutations({
                set_current_contact: 'set_current_contact'
            }),


            on_contact_click(contact) {
                let self = this;
                self.set_current_contact(contact);
            }
        }
    }
</script>

<style scoped>

    .ps {
        height: 575px;
    }

    #contact_info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    #contact_info .ivu-list-item {
        padding: 0;
        border-bottom: rgba(0, 0, 0, 0);
    }

    .contact_info_item {
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
    }

    .contact_info_item:hover {
        box-shadow: none;
        background: rgba(0, 0, 0, 0);
        border-color: rgba(0, 0, 0, 0);
        color: white;
    }

    .contact_info_item:focus {
        background: rgb(58, 63, 69);
        color: white;
        box-shadow: none;
    }


</style>
