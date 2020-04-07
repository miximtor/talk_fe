<template>
    <modal name="update-personal-info" styles="display: flex; flex-direction: column" height="auto" :draggable="true"
           @before-open="on_before_open">
        <DialogTop name="update-personal-info" title="更新个人信息"></DialogTop>
        <div id="update-personal-info-form">
            <iv-form label-position="left"
                     :label-width="80"
                     @submit.native.prevent=""
                     ref="update-personal-info-form"
                     :rules="update_personal_info_validate"
                     :model="update_personal_info_form">
                <iv-form-item label="头像" prop="avatar">
                    <AvatarUploader :size="100" :url="update_personal_info_form.avatar"
                                    @success="(url) => {this.update_personal_info_form.avatar = url}">
                    </AvatarUploader>
                </iv-form-item>
                <iv-form-item label="昵称" prop="nick">
                    <iv-input
                            type="text"
                            size="large"
                            maxlength="20"
                            v-model="update_personal_info_form.nick">
                    </iv-input>
                </iv-form-item>
                <iv-form-item label="邮箱" prop="email">
                    <iv-input
                            type="text"
                            size="large"
                            v-model="update_personal_info_form.email"></iv-input>
                </iv-form-item>
                <iv-form-item label="手机号" prop="phone">
                    <iv-input
                            type="text"
                            size="large"
                            v-model="update_personal_info_form.phone"></iv-input>
                </iv-form-item>
                <iv-button type="primary" long @click="on_click_update">立即更新</iv-button>
            </iv-form>
        </div>
    </modal>
</template>

<script>
    import DialogTop from "@/components/dialog/DialogTop"
    import AvatarUploader from "@/components/util/AvatarUploader"
    import {account} from "@/api/account";
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "UpdatePersonalInfoDialog",
        components: {DialogTop, AvatarUploader},
        computed: {
          ...mapGetters({
              token: 'token'
          })
        },
        data() {
            return {
                update_personal_info_form: {
                    email: '',
                    phone: '',
                    avatar: '',
                    nick: '',
                },
                update_personal_info_validate: {
                    avatar: [{required: true, message: '请上传头像', trigger: 'blur'}],
                    nick: [{required: true, message: '请输入昵称', trigger: 'blur'}],
                    email: [{required: true, validator: this.email_validator, trigger: 'blur'}],
                    phone: [{required: true, message: '请输入电话', trigger: 'blur'}],
                }
            }
        },
        methods: {
            ...mapActions({
                update_personal_info: 'update_personal_info'
            }),

            on_before_open(ev) {
                let self = this;
                self.update_personal_info_form.email = JSON.parse(JSON.stringify(ev.params.email));
                self.update_personal_info_form.phone = JSON.parse(JSON.stringify(ev.params.phone));
                self.update_personal_info_form.avatar = JSON.parse(JSON.stringify(ev.params.avatar));
                self.update_personal_info_form.nick = JSON.parse(JSON.stringify(ev.params.nick));
            },

            email_validator(rule, value, callback) {
                if (value === undefined || value.length === 0) {
                    return callback();
                }
                const regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
                if (!value.match(regex)) {
                    return callback(new Error('请输入正确的邮箱'));
                }
                return callback();
            },

            async on_click_update() {
                let self = this;
                await self.$refs['update-personal-info-form'].validate();
                await account.update_personal_info(self.token, self.update_personal_info_form);
                await self.update_personal_info();
                self.$modal.hide('update-personal-info');
            }
        }
    }
</script>

<style scoped>
    #update-personal-info-form {
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
    }
</style>
