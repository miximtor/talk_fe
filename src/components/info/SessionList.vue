<template>
    <div id="session_info">
        <PerfectScrollbar style="height: 575px">
            <div :style="get_styles(system_session)">
                <iv-button class="session_info_item" @click="on_session_click(system_session)">
                    <iv-badge :dot="!!new_message[system_session.login_id]">
                        <iv-avatar size="50" shape="square" :src="system_session.avatar"></iv-avatar>
                    </iv-badge>
                    <span style="margin-left: 20px">{{system_session.nick}}</span>
                </iv-button>
            </div>
            <div v-for="(session, index) of sessions" :key="index" :style="get_styles(session)">
                <iv-button class="session_info_item" @click="on_session_click(session)">
                    <iv-badge :dot="!!new_message[session.login_id]">
                        <iv-avatar size="50" shape="square" :src="session.avatar"></iv-avatar>
                    </iv-badge>
                    <span style="margin-left: 20px">{{session.nick}}</span>
                </iv-button>
            </div>
        </PerfectScrollbar>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import {system_session} from "@/api/account";

    export default {
        name: "SessionList",
        computed: {
            ...mapGetters({
                sessions: 'sessions',
                current_session: 'current_session',
                new_message: 'new_message'
            })
        },

        data() {
            return {
                system_session: system_session
            }
        },


        methods: {

            ...mapActions({
                update_messages: 'update_messages',
            }),

            ...mapMutations({
                set_current_session: 'set_current_session'
            }),

            async on_session_click(session) {
                let self = this;
                await self.update_messages(session.login_id);
                await self.set_current_session(session.login_id);
            },

            get_styles(session) {
                let self = this;
                if (!self.current_session || !session || session.login_id !== self.current_session.login_id) {
                    return 'background: rgba(0, 0, 0, 0)'
                } else {
                    return 'background: rgb(58, 63, 69)'
                }
            },

            on_leave() {
                let self = this;
                self.set_current_session('');
            }

        }
    }
</script>

<style scoped>

    .session_info_item, .session_info_item:hover, .session_info_item:focus, .session_info_item:active {
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
