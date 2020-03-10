<template>
    <div id="login">
        <span style="font-size: 32px;margin-bottom: 30px">WeTalk 在线网页聊天</span>
        <Form ref="login_form" label-position="left" id="form" :rules="login_form_validate" :model="login_form">
            <Form-item prop="login_id">
                <i-input type="text" size="large" v-model="login_form.login_id" placeholder="请输入用户名">
                    <Icon type="md-person" slot="prepend" style="font-size: 16px"></Icon>
                </i-input>
            </Form-item>
            <FormItem>
                <i-input type="password" size="large" v-model="login_form.login_password" placeholder="请输入密码">
                    <Icon type="md-lock" slot="prepend" style="font-size: 16px"></Icon>
                </i-input>
            </FormItem>
            <FormItem>
                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 40%">
                        <Button type="primary" long size="large" @click="onLogin">登录</Button>
                    </div>
                    <div style="width: 40%">
                        <Button ghost long size="large" @click="onRegister">注册</Button>
                    </div>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                login_form: {
                    login_id: '',
                    login_password: ''
                },
                login_form_validate: {
                    login_id: [
                        {
                            required: true,
                            validator: this.login_login_id_validator,
                            trigger: 'blur'
                        }
                    ],
                    login_password: [
                        {
                            required: true,
                            validator: this.login_password_validator,
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },

        methods: {

            login_login_id_validator(rule, value, callback) {
                return value.match(/^[a-zA-Z_][a-zA-Z0-9_]{5,20}$/i) ? callback() : callback(new Error('用户名不合法(5-20个字母数字，下划线)'));
            },

            async login_id_validator(rule, value, callback) {
                if (!value.match(/^[a-zA-Z_][a-zA-Z0-9_]{5,20}$/i)) {
                    return callback(new Error('用户名不合法(5-20个字母数字，下划线)'))
                } else {
                    let response = await this.$http.post('https://talk.maxtorm.wtf/bin/account/checkloginid', {login_id: value});
                    response = response.body;
                    return response.ok ? callback() : callback(new Error(response.reason));
                }
            },

            login_password_validator(rule, value, callback) {
                let login_password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,20}$/gm;
                if (!value.match(login_password_regex)) {
                    return callback(new Error('必须包含大/小写字母，数字、特殊字符（$?!@$%^&*-.）长度8-20个字符'))
                } else {
                    return callback();
                }
            },

            login_password_confirm_validator(rule, value, callback) {
                return value === this.register_form.login_password ? callback() : callback(new Error('与密码不一致'));
            },

            onLogin() {
                let self = this;
                self.$refs['login_form'].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    self.$emit('login', self.login_form);
                });
            },

            onRegister() {
                let self = this;
                self.$emit('click_register');
            },

            onAvatarUploadSuccess(response) {
                let self = this;
                self.register_form.avatar = response.url;
                self.avatar_upload_text = '加载中';
            }
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
</style>
