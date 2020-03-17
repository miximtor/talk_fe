<template>
    <modal name="register-dialog" height="auto" :clickToClose="false" styles="display: flex; flex-direction: column">
        <DialogTop name="register-dialog" title="账号注册"></DialogTop>

        <div id="register">
            <div v-if="current_page===0">
                <iv-form
                        ref="register_form0"
                        label-position="left"
                        :label-width="80"
                        :rules="register_form_validate"
                        :model="register_form"
                >
                    <iv-form-item label="头像" prop="avatar">
                        <AvatarUploader :size="100" :url="register_form.avatar"
                                        @success="on_avatar_upload_success"></AvatarUploader>
                    </iv-form-item>
                    <iv-form-item label="用户名" prop="login_id">
                        <iv-input type="text" size="large"
                                  placeholder="5-20位字母或数字"
                                  maxlength="20"
                                  v-model="register_form.login_id">
                        </iv-input>
                    </iv-form-item>
                    <iv-form-item label="密码" prop="login_password">
                        <iv-input type="password"
                                  size="large"
                                  placeholder="大写、小写字母，数字，特殊符号($?!@$%^&*-.)，8-20个字符"
                                  maxlength="20"
                                  v-model="register_form.login_password">
                        </iv-input>
                    </iv-form-item>
                    <iv-form-item label="确认密码" prop="login_password_confirm">
                        <iv-input
                                type="password"
                                size="large"
                                placeholder="再次输入密码"
                                maxlength="20"
                                v-model="register_form.login_password_confirm">
                        </iv-input>
                    </iv-form-item>
                </iv-form>
            </div>
            <div v-if="current_page === 1">
                <iv-form
                        ref="register_form1"
                        label-position="left"
                        :label-width="80"
                        :rules="register_form_validate"
                        :model="register_form"
                >
                    <iv-form-item label="昵称" prop="nick">
                        <iv-input
                                type="text"
                                size="large"
                                maxlength="20"
                                v-model="register_form.nick">
                        </iv-input>
                    </iv-form-item>
                    <iv-form-item label="邮箱" prop="email">
                        <iv-input
                                type="text"
                                size="large"
                                v-model="register_form.email"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="手机号" prop="phone">
                        <iv-input
                                type="text"
                                size="large"
                                v-model="register_form.phone"></iv-input>
                    </iv-form-item>
                </iv-form>
            </div>
            <div v-if="current_page === 2">
                <iv-form
                        ref="register_form2"
                        label-position="left"
                        :label-width="100"
                        :rules="register_form_validate"
                        :model="register_form"
                >
                    <iv-form-item label="密保问题1" prop="question1">
                        <iv-input type="text" size="large" v-model="register_form.question1"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="回答" prop="answer1">
                        <iv-input type="text" size="large" v-model="register_form.answer1"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="密保问题2" prop="question2">
                        <iv-input type="text" size="large" v-model="register_form.question2"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="回答" prop="answer2">
                        <iv-input type="text" size="large" v-model="register_form.answer2"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="密保问题3" prop="question3">
                        <iv-input type="text" size="large" v-model="register_form.question3"></iv-input>
                    </iv-form-item>
                    <iv-form-item label="回答" prop="answer3">
                        <iv-input type="text" size="large" v-model="register_form.answer3"></iv-input>
                    </iv-form-item>
                </iv-form>
            </div>
        </div>

        <div style="display: flex;justify-content: center; padding: 20px 20px">
            <iv-button-group shape="circle">
                <iv-button type="primary" @click="current_page--" :disabled="current_page<=0"
                           style="height: 40px; font-size: 16px">上一步
                </iv-button>
                <iv-button type="primary" @click.native="step(current_page)" style="height: 40px; font-size: 16px">
                    {{current_page === 2?'立即注册':'下一步'}}
                </iv-button>
            </iv-button-group>
        </div>

    </modal>
</template>

<script>
    import {axios, handle_response} from "@/util/connection";
    import AvatarUploader from "@/components/util/AvatarUploader";
    import DialogTop from "@/components/dialog/DialogTop";
    import {account} from "@/api/account";

    export default {
        components: {DialogTop, AvatarUploader},
        name: "RegisterDialog",

        data() {
            return {
                current_page: 0,
                register_form: {
                    login_id: '',
                    login_password: '',
                    login_password_confirm: '',
                    email: '',
                    phone: '',
                    avatar: '',
                    nick: '',
                    question1: '', answer1: '',
                    question2: '', answer2: '',
                    question3: '', answer3: '',
                },
                register_form_validate: {
                    login_id: [{required: true, validator: this.login_id_validator, trigger: 'blur'}],
                    login_password: [{required: true, validator: this.login_password_validator, trigger: 'blur'}],
                    login_password_confirm: [{
                        required: true,
                        validator: this.login_password_confirm_validator,
                        trigger: 'blur'
                    }],
                    avatar: [{required: true, message: '请上传头像', trigger: 'blur'}],
                    nick: [{required: true, message: '请输入昵称', trigger: 'blur'}],
                    email: [{required: true, validator: this.email_validator, trigger: 'blur'}],
                    phone: [{required: true, message: '请输入电话', trigger: 'blur'}],
                    question1: [{required: true, message: '请输入密保问题', trigger: 'blur'}],
                    answer1: [{required: true, message: '请输入密保回答', trigger: 'blur'}],
                    question2: [{required: true, message: '请输入密保问题', trigger: 'blur'}],
                    answer2: [{required: true, message: '请输入密保回答', trigger: 'blur'}],
                    question3: [{required: true, message: '请输入密保问题', trigger: 'blur'}],
                    answer3: [{required: true, message: '请输入密保回答', trigger: 'blur'}],
                },

            }
        },

        methods: {
            async login_id_validator(rule, value, callback) {
                if (!value.match(/^[a-zA-Z_][a-zA-Z0-9_]{5,20}$/i)) {
                    throw new Error('用户名不合法(5-20个字母数字，下划线)');
                }

                await axios.post('/account/checkloginid', {login_id: value}).then(handle_response);
                return callback();
            },

            login_password_validator(rule, value, callback) {
                let login_password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,20}$/gm;
                if (!value.match(login_password_regex)) {
                    throw new Error('必须包含大/小写字母，数字、特殊字符（$?!@$%^&*-.）长度8-20个字符');
                }
                return callback();
            },

            login_password_confirm_validator(rule, value, callback) {
                return value === this.register_form.login_password ? callback() : callback(new Error('与密码不一致'));
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

            on_avatar_upload_success(url) {
                let self = this;
                self.register_form.avatar = url;
            },

            async step(n) {
                let self = this;
                await self.$refs[`register_form${n}`].validate();

                if (n < 2) {
                    self.current_page = n + 1;
                    return;
                }

                await self.handle_register();
                self.register_form = {
                    login_id: '',
                    login_password: '',
                    login_password_confirm: '',
                    email: '',
                    phone: '',
                    avatar: '',
                    nick: '',
                    question1: '', answer1: '',
                    question2: '', answer2: '',
                    question3: '', answer3: '',
                }
            },

            async handle_register() {
                let self = this;
                try {
                    await account.register(self.register_form);
                    self.$modal.hide('register-dialog');
                    self.$Notice.info({
                        title: '注册成功'
                    });
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '注册失败',
                        content: e.message,
                    });
                }
            },
        }
    }
</script>

<style scoped>
    #register {
        margin-top: 40px;
        padding-left: 20px;
        padding-right: 20px;
    }

</style>
