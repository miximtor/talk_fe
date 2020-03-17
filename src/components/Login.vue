<template>
    <div id="login">
        <span style="font-size: 32px;margin-bottom: 30px">WeTalk 在线网页聊天</span>
        <iv-form ref="login_form" label-position="left" id="form" :rules="login_form_validate" :model="login_form">
            <iv-form-item prop="login_id">
                <iv-input type="text" maxlength="20" size="large" v-model="login_form.login_id" placeholder="请输入用户名">
                    <iv-icon type="md-person" slot="prepend" style="font-size: 16px"></iv-icon>
                </iv-input>
            </iv-form-item>
            <iv-form-item style="margin-bottom: 0">
                <iv-input type="password" maxlength="20" size="large" v-model="login_form.login_password"
                          placeholder="请输入密码">
                    <iv-icon type="md-lock" slot="prepend" style="font-size: 16px"></iv-icon>
                </iv-input>
            </iv-form-item>
            <div style="display: flex; justify-content: flex-end; margin-bottom: 25px">
                <a href="javascript:void(0)" style="color: gray"
                   @click="()=>{this.$modal.show('forget-password-dialog')}">忘记密码?</a>
            </div>
            <iv-form-item>
                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 40%">
                        <iv-button type="primary" long size="large" @click="on_login">登录</iv-button>
                    </div>
                    <div style="width: 40%">
                        <iv-button ghost long size="large" @click="()=>{this.$modal.show('register-dialog')}">注册
                        </iv-button>
                    </div>
                </div>
            </iv-form-item>
        </iv-form>
        <RegisterDialog></RegisterDialog>
        <ForgetPasswordDialog></ForgetPasswordDialog>
    </div>
</template>

<script>
    import RegisterDialog from "@/components/dialog/RegisterDialog"
    import ForgetPasswordDialog from "@/components/dialog/ForgetPasswordDialog"
    import {mapActions} from 'vuex';

    export default {
        name: "Login",
        components: {ForgetPasswordDialog, RegisterDialog},
        data() {
            return {
                login_form: {login_id: '', login_password: ''},
                login_form_validate: {
                    login_id: [{required: true, validator: this.login_id_validator, trigger: 'blur'}],
                    login_password: [{required: true, validator: this.login_password_validator, trigger: 'blur'}]
                }
            }
        },

        methods: {

            ...mapActions({
                do_login: 'login'
            }),

            login_id_validator(rule, value, callback) {
                return value.match(/^[a-zA-Z_][a-zA-Z0-9_]{5,20}$/i) ? callback() : callback(new Error('用户名不合法(5-20个字母数字，下划线)'));
            },

            login_password_validator(rule, value, callback) {
                let login_password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,20}$/gm;
                if (!value.match(login_password_regex)) {
                    return callback(new Error('必须包含大/小写字母，数字、特殊字符（$?!@$%^&*-.）长度8-20个字符'))
                } else {
                    return callback();
                }
            },

            async on_login() {
                let self = this;
                await self.$refs['login_form'].validate();
                self.$Spin.show();
                try {
                    await self.do_login(self.login_form);
                    self.$emit('login-success');
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '登录失败',
                        content: e.message
                    });
                } finally {
                    self.$Spin.hide();
                }
            },

            on_register() {
                let self = this;
                self.$modal.show('register-dialog');
            },
        }
    }
</script>

<style scoped>
    #login {
        background: rgba(0, 0, 0, 0);
        min-height: 100vh;
        min-width: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    #form {
        width: 400px;
    }

    .spin {
        animation: ani-demo-spin 1s linear infinite;
    }

    .hint {
        font-size: 18px;
    }
</style>
