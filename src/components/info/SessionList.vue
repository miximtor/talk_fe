<template>
    <div id="session_info">
        <PerfectScrollbar>
            <iv-list>
                <iv-list-item v-for="(session, index) of sessions" :key="index">
                    <iv-button class="session_info_item" @click="on_session_click(session)">
                        <iv-badge :dot="false">
                            <iv-avatar size="50" shape="square" :src="session.avatar"></iv-avatar>
                        </iv-badge>
                        <span style="margin-left: 20px">{{session.nick}}</span>
                    </iv-button>
                </iv-list-item>
            </iv-list>
        </PerfectScrollbar>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';

    export default {
        name: "SessionList",
        computed: {
            ...mapGetters({
                sessions: 'sessions'
            })
        },

        methods: {

            ...mapActions({
                upsert_session: 'upsert_session',
                update_messages: 'update_messages'
            }),

            ...mapMutations({
                set_current_session: 'set_current_session'
            }),


            on_session_click(session) {
              let self = this;
              self.set_current_session(session.login_id);
              self.update_messages(session.login_id);
            },

        }
    }
</script>

<style scoped>
    #session_info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    #session_info .ivu-list-item {
        padding: 0;
        border-bottom: rgba(0, 0, 0, 0);
    }

    .session_info_item {
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

    .session_info_item:hover {
        box-shadow: none;
        background: rgba(0, 0, 0, 0);
        border-color: rgba(0, 0, 0, 0);
        color: white;
    }

    .session_info_item:focus {
        background: rgb(58, 63, 69);
        color: white;
        box-shadow: none;
    }
</style>
