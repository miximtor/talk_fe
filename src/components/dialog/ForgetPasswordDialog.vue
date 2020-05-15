<template>
    <modal name="forget-password-dialog" styles="display: flex; flex-direction: column" height="auto" :clickToClose="false"
           @before-open="on_before_open">
        <DialogTop name="forget-password-dialog" title="找回密码"></DialogTop>

        <div id="forget-password">
            <iv-form label-position="left" inline style="display: flex" @submit.native.prevent=""
                     v-show="!question_show">
                <iv-form-item style="flex-grow: 1">
                    <iv-input v-model="form.login_id"></iv-input>
                </iv-form-item>
                <iv-form-item>
                    <iv-button type="primary" @click.prevent="on_click_find_back">查找账号</iv-button>
                </iv-form-item>
            </iv-form>

            <iv-form label-position="left"
                     @submit.native.prevent=""
                     :label-width="80"
                     v-show="question_show"
                     :model="form"
                     :rules="rules"
                     ref="form">
                <iv-form-item label="用户名">
                    <span>{{form.login_id}}</span>
                </iv-form-item>
                <iv-form-item label="问题一">
                    <span>{{form.question1}}</span>
                </iv-form-item>
                <iv-form-item label="回答" prop="answer1">
                    <iv-input v-model="form.answer1"></iv-input>
                </iv-form-item>
                <iv-form-item label="问题二">
                    <span>{{form.question2}}</span>
                </iv-form-item>
                <iv-form-item label="回答" prop="answer2">
                    <iv-input v-model="form.answer2"></iv-input>
                </iv-form-item>
                <iv-form-item label="问题三">
                    <span>{{form.question2}}</span>
                </iv-form-item>
                <iv-form-item label="回答" prop="answer2">
                    <iv-input v-model="form.answer3"></iv-input>
                </iv-form-item>
                <iv-form-item label="密码" prop="login_password">
                    <iv-input type="password" v-model="form.login_password"></iv-input>
                </iv-form-item>
                <iv-form-item label="确认密码" prop="login_password_confirm">
                    <iv-input type="password" v-model="form.login_password_confirm"></iv-input>
                </iv-form-item>
                <iv-button long type="primary" @click="on_submit_find_back">立即重置</iv-button>
            </iv-form>
        </div>

    </modal>
</template>

<script>
    import DialogTop from "@/components/dialog/DialogTop";
    import {account} from "@/api/account";

    export default {
        name: "ForgetPasswordDialog",
        components: {DialogTop},
        data() {
            return {
                form: {
                    login_id: '',
                    question1: '',
                    question2: '',
                    question3: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    login_password: '',
                    login_password_confirm: ''
                },
                rules: {
                    answer1: [{required: true, message: '请输入回答', trigger: 'blur'}],
                    answer2: [{required: true, message: '请输入回答', trigger: 'blur'}],
                    answer3: [{required: true, message: '请输入回答', trigger: 'blur'}],
                    login_password: [{required: true, validator: this.login_password_validator, trigger: 'blur'}],
                    login_password_confirm: [{
                        required: true,
                        validator: this.login_password_confirm_validator,
                        trigger: 'blur'
                    }],
                },
                question_show: false,

            };
        },
        methods: {
            on_before_open() {
                let self = this;
                self.form = {
                    login_id: '',
                    question1: '',
                    question2: '',
                    question3: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    login_password: '',
                    login_password_confirm: ''
                };
                self.question_show = false;
            },

            async on_click_find_back() {
                let self = this;
                try {
                    if (self.form.login_id.length <= 0) {
                        throw Error('请输入用户名');
                    }
                    const questions = await account.get_security_question(self.form.login_id);
                    self.form.question1 = questions.question1;
                    self.form.question2 = questions.question2;
                    self.form.question3 = questions.question3;
                    self.question_show = true;
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '错误',
                        content: e.message
                    });
                }
            },

            async login_password_validator(rule, value, callback) {
                let login_password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,20}$/gm;
                if (!value.match(login_password_regex)) {
                    throw new Error('必须包含大/小写字母，数字、特殊字符（$?!@$%^&*-.）长度8-20个字符');
                }
                return callback();
            },

            async login_password_confirm_validator(rule, value, callback) {
                return value === this.form.login_password ? callback() : callback(new Error('与密码不一致'));
            },

            async on_submit_find_back() {
                let self = this;
                await self.$refs.form.validate();
                try {
                    await account.reset_password(self.form);
                    self.$Notice.info({
                        title: '密码重置成功'
                    });
                    self.$modal.hide('forget-password-dialog');
                } catch (e) {
                    self.$modal.show('error-dialog', {
                        title: '重置失败',
                        content: e.message
                    });
                }
            }
        }
    }
</script>

<style scoped>
    #forget-password {
        padding: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }


</style>
