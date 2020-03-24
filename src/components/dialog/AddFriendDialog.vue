<template>
    <modal name="add-friend-dialog" styles="display: flex; flex-direction: column" height="auto" :draggable="true" @before-open="on_before_open">
        <DialogTop name="add-friend-dialog" title="添加好友"></DialogTop>
        <div id="add-friend-form">
            <iv-form label-position="left" inline style="display: flex" @submit.native.prevent="">
                <iv-form-item style="flex-grow: 1">
                    <iv-input v-model="key_text"></iv-input>
                </iv-form-item>
                <iv-form-item>
                    <iv-button type="primary" @click.prevent="search_account">立即搜索</iv-button>
                </iv-form-item>
            </iv-form>
        </div>
        <div id="add-friend-result">
            <span id="add-friend-result__head">为您找到{{search_accounts.length}}个账号</span>
            <PerfectScrollbar style="height: 300px" v-if="search_accounts.length > 0">
                <div class="add-friend-result__item" v-for="(account, index) of search_accounts" :key="index">
                    <iv-avatar shape="square" size="80" :src="account.avatar"></iv-avatar>
                    <div style="flex-grow: 1; display: flex; flex-direction: column; margin-left: 10px; justify-content: space-between">
                        <span>用户名：{{account.login_id}}</span>
                        <span>昵称：{{account.nick}}</span>
                        <span>邮箱：{{account.email || '无'}}</span>
                        <span>电话：{{account.phone || '无'}}</span>
                    </div>
                    <div style="flex-grow: 1; display: flex; flex-direction: row-reverse">
                        <iv-button type="primary" @click="add_friend(account.login_id)">添加好友</iv-button>
                    </div>
                </div>
            </PerfectScrollbar>
        </div>
    </modal>
</template>

<script>
    import DialogTop from "@/components/dialog/DialogTop"
    import {account} from "@/api/account";
    import {mapGetters} from 'vuex';

    export default {
        components: {DialogTop},
        name: "AddFriendDialog",
        data() {
            return {
                key_text: '',
                search_accounts: [],
                accounts_state: []
            }
        },

        computed: {
            ...mapGetters({
                token: 'token'
            })
        },

        methods: {
            async search_account() {
                let self = this;
                if (self.key_text.length <= 0) {
                    return;
                }
                self.search_accounts = await account.search(self.token, self.key_text);
            },

            async add_friend(login_id) {
                console.log(login_id);
            },

            on_before_open() {
                let self = this;
                self.key_text = '';
                self.search_accounts = [];
                self.accounts_state = [];
            }
        }
    }
</script>

<style scoped>
    #add-friend-form {
        margin-left: 20px;
        margin-right: 20px;
    }

    #add-friend-result {
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
    }

    #add-friend-result__head {
        font-size: 16px;
    }

    .add-friend-result__item {
        margin-top: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        display: flex;
    }


</style>
