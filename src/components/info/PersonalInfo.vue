<template>
    <div id="personal_info">
        <iv-avatar size="50" shape="square" :src="personal_info.avatar"></iv-avatar>
        <span id="personal_nick">{{personal_info.nick}}</span>
        <iv-poptip placement="top-end" trigger="hover" padding="0px 0px">
            <iv-button icon="md-menu" id="personal_preference"></iv-button>
            <div slot="content" id="personal_preference_menu">
                <iv-list>
                    <iv-list-item>
                        <iv-button class="personal_preference_menu_item" ghost type="text" @click="$modal.show('update-personal-info', personal_info)">
                            <iv-icon type="md-contact"/>
                            修改信息
                        </iv-button>
                    </iv-list-item>
                    <iv-list-item>
                        <iv-button class="personal_preference_menu_item" ghost type="text">
                            <iv-icon type="md-lock"/>
                            修改密码
                        </iv-button>
                    </iv-list-item>
                    <iv-list-item>
                        <iv-button class=personal_preference_menu_item ghost type="text" @click="$modal.show('add-friend-dialog')">
                            <iv-icon type="md-search"/>
                            添加好友
                        </iv-button>
                    </iv-list-item>
                    <iv-list-item>
                        <iv-button class="personal_preference_menu_item" ghost type="text" @click="()=>this.$emit('logout')">
                            <iv-icon type="md-power"/>
                            退出
                        </iv-button>
                    </iv-list-item>
                </iv-list>
            </div>
        </iv-poptip>
        <AddFriendDialog></AddFriendDialog>
        <UpdatePersonalInfoDialog></UpdatePersonalInfoDialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import AddFriendDialog from '@/components/dialog/AddFriendDialog';
    import UpdatePersonalInfoDialog from '@/components/dialog/UpdatePersonalInfoDialog';

    export default {
        name: "PersonalInfo",
        components: {AddFriendDialog, UpdatePersonalInfoDialog},

        computed: {
            ...mapGetters({
                personal_info: 'personal_info'
            })
        },

        methods: {
        }
    }
</script>

<style scoped>
    #personal_info {
        display: flex;
        align-items: center;
        padding: 15px 15px 15px 15px;
    }

    #personal_nick {
        font-size: 16px;
        color: snow;
        margin-left: 10px;
        font-weight: bold;
        flex-grow: 1;
    }

    #personal_preference {
        color: white;
        background: rgba(0, 0, 0, 0);
        border: none;
        box-shadow: none;
        font-size: 20px;
        font-weight: lighter;
        padding: 0;
        margin-left: 10px;
    }


    #personal_preference_menu .ivu-list-item {
        padding: 5px;
    }

    .personal_preference_menu_item {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        width: 100%;
        font-size: 16px;
        color: #464c5b;
        display: flex;
        justify-content: left;
        align-items: center;
        text-align: center;
    }

    .personal_preference_menu_item:hover, .personal_preference_menu_item:focus {
        color: #464c5b;
        background: rgb(245, 245, 245);
        border-color: rgba(0, 0, 0, 0);
        box-shadow: none;
    }
</style>
