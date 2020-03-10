<template>
    <div id="register">
        <span style="font-size: 32px;margin-bottom: 30px">WeTalk 在线网页聊天</span>
        <div id="form">
            <div style="display: flex; flex-direction: row-reverse">
                <Button type="warning" @click="onBack">返回</Button>
            </div>
            <Form
                    ref="register_form"
                    label-position="left"
                    :label-width="80"
                    :rules="register_form_validate"
                    :model="register_form">
                <FormItem label="头像" prop="avatar">
                    <Upload action="https://api.superbed.cn/upload"
                            :data="{token: '0c75c2b5ac14447a909cd739758f4d5a'}"
                            :on-success="onAvatarUploadSuccess"
                            :show-upload-list="false"
                            :format="['jpg','img','jpeg', 'png']">
                        <Avatar size="100" shape="square" :src="register_form.avatar">点击上传</Avatar>
                    </Upload>
                </FormItem>
                <FormItem label="用户名" prop="login_id">
                    <i-input type="text" size="large" placeholder="5-20位字母或数字"
                             v-model="register_form.login_id"></i-input>
                </FormItem>
                <FormItem label="密码" prop="login_password">
                    <i-input type="password" size="large" placeholder="包含大写、小写字母，数字，特殊符号($?!@$%^&*-.)，8-20个字符"
                             v-model="register_form.login_password"></i-input>
                </FormItem>
                <FormItem label="确认密码" prop="login_password_confirm">
                    <i-input type="password" size="large" placeholder="再次输入密码"
                             v-model="register_form.login_password_confirm"></i-input>
                </FormItem>
                <FormItem label="邮箱">
                    <i-input type="text" size="large" v-model="register_form.email"></i-input>
                </FormItem>
                <FormItem label="手机号">
                    <i-input type="text" size="large" v-model="register_form.phone"></i-input>
                </FormItem>
                <div style="display: flex; justify-content: center">
                    <Button type="primary" @click="onRegister" style="height: 60px; font-size: 16px">立即注册</Button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
            return {
                register_form: {
                    login_id: '',
                    login_password: '',
                    login_password_confirm: '',
                    email: '',
                    phone: '',
                    avatar: ''
                },
                register_form_validate: {
                    login_id: [{required: true, validator: this.login_id_validator, trigger: 'blur'}],
                    login_password: [{required: true, validator: this.login_password_validator, trigger: 'blur'}],
                    login_password_confirm: [{required: true, validator: this.login_password_confirm_validator, trigger: 'blur'}],
                    avatar: [{required: true, message: '请上传头像'}]
                },
            }
        },
        methods: {
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

            onAvatarUploadSuccess(response) {
                let self = this;
                self.register_form.avatar = response.url;
            },

            onRegister() {
                let self = this;
                self.$refs['register_form'].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    self.$emit('register', self.register_form);
                    self.register_drawer_show = false;
                    self.register_form = {
                        login_id: '',
                        login_password: '',
                        login_password_confirm: '',
                        email: '',
                        phone: ''
                    };
                });
            },

            onBack() {
                let self = this;
                self.register_form = {
                    login_id: '',
                    login_password: '',
                    login_password_confirm: '',
                    email: '',
                    phone: ''
                };
                self.$emit('click_back');
            }
        }
    }
</script>

<style scoped>
    #register {
        background: rgba(0, 0, 0, 0);
        min-height: 100vh;
        min-width: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    #form {
        border: gray;
        border-radius: 5px;
        width: 50em;
        background: white;
        padding: 50px;

    }
</style>