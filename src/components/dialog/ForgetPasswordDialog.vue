<template>
    <modal name="forget-password-dialog" styles="display: flex; flex-direction: column" height="auto">
        <DialogTop name="forget-password-dialog" title="找回密码"></DialogTop>

        <div id="forget-password">
            <div v-if="current_page === 0">
                <iv-form ref="forget_password_form"
                         :label-width="80"
                         label-position="left"
                         :model="forget_password_form"
                         :rules="forget_password_validate_rules">
                    <iv-form-item label="用户名" prop="login_id">
                        <iv-input
                                type="text"
                                maxlength="20"
                                v-model="forget_password_form.login_id"
                        >
                        </iv-input>
                    </iv-form-item>
                    <div style="margin-bottom: 24px">
                        <span style="width: 80px;margin-bottom: 24px;padding: 10px 12px 10px 0">安全问题1</span>
                        <span>{{forget_password_form.question1}}</span>
                    </div>
                    <iv-form-item label="回答" prop="answer1">
                        <iv-input v-model="forget_password_form.answer1"></iv-input>
                    </iv-form-item>
                    <div style="margin-bottom: 24px">
                        <span style="width: 80px;margin-bottom: 24px;padding: 10px 12px 10px 0">安全问题2</span>
                        <span>{{forget_password_form.question2}}</span>
                    </div>
                    <iv-form-item label="回答" prop="answer2">
                        <iv-input v-model="forget_password_form.answer2"></iv-input>
                    </iv-form-item>
                    <div style="margin-bottom: 24px">
                        <span style="width: 80px;margin-bottom: 24px;padding: 10px 12px 10px 0">安全问题3</span>
                        <span>{{forget_password_form.question3}}</span>
                    </div>
                    <iv-form-item label="回答" prop="answer3">
                        <iv-input v-model="forget_password_form.answer3"></iv-input>
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
                    {{current_page === 1?'立即重置':'下一步'}}
                </iv-button>
            </iv-button-group>
        </div>
    </modal>
</template>

<script>
    import {axios, handle_response} from "@/util/connection";
    import DialogTop from "@/components/dialog/DialogTop";

    export default {
        name: "ForgetPasswordDialog",
        components: {DialogTop},
        data() {
            return {
                current_page: 0,
                forget_password_form: {
                    login_id: '',
                    question1: '',
                    question2: '',
                    question3: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                },
                forget_password_validate_rules: {
                    login_id: [{required: true, validator: this.login_id_validator, trigger: 'blur'}],
                    answer1: [{required: true, validator: this.answer1_validator, trigger: 'blur'}],
                    answer2: [{required: true, validator: this.answer2_validator, trigger: 'blur'}],
                    answer3: [{required: true, validator: this.answer3_validator, trigger: 'blur'}]
                },

            };
        },
        methods: {
            async login_id_validator(rule, value, callback) {
                let self = this;
                const questions = (await axios.post('/account/getsecurityquestion', {login_id: value}).then(handle_response)).data;
                self.forget_password_form.question1 = questions.question1;
                self.forget_password_form.question2 = questions.question2;
                self.forget_password_form.question3 = questions.question3;
                return callback();
            },

            async answer1_validator(rule, value, callback) {
                let self = this;
                if (value.length === 0) {
                    return callback(new Error('请回答问题'));
                }
                await self.validate_answer(1, value);
                return callback();
            },

            async answer2_validator(rule, value, callback) {
                let self = this;
                if (value.length === 0) {
                    return callback(new Error('请回答问题'));
                }
                await self.validate_answer(1, value);
                return callback();
            },

            async answer3_validator(rule, value, callback) {
                let self = this;
                if (value.length === 0) {
                    return callback(new Error('请回答问题'));
                }
                await self.validate_answer(1, value);
                return callback();
            },

            async validate_answer(index, value) {
                let self = this;
                await axios.post('/account/validatesecurityquestion', {
                    login_id: self.forget_password_form.login_id,
                    index: index,
                    answer: value
                }).then(handle_response);
            },

            async step(n) {
                let self = this;
                if (n === 0) {
                    self.$refs['forget_password_validator'].validate(valid => {
                       if (!valid) {
                           return;
                       }
                       self.current_page++;
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
