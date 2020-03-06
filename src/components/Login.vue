<template>
    <div id="login">
        <span style="font-size: 32px;margin-bottom: 30px">WeTalk 在线网页聊天</span>
        <Form ref="login_form" label-position="left" id="form">
            <Form-item>
                <i-input type="text" size="large" :value.sync="login_form.login_id" placeholder="请输入用户名">
                    <Icon type="md-person" slot="prepend" style="font-size: 16px"></Icon>
                </i-input>
            </Form-item>

            <FormItem>
                <i-input type="password" size="large" :value.sync="login_form.login_password" placeholder="请输入密码">
                    <Icon type="md-lock" slot="prepend" style="font-size: 16px"></Icon>
                </i-input>
            </FormItem>

            <FormItem>
                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 40%">
                        <Button type="primary" long size="large" @click="onLogin">登录</Button>
                    </div>
                    <div style="width: 40%">
                        <Button ghost long size="large">注册</Button>
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
          }
        },

        methods: {
            onLogin() {
                let self = this;
                self.$emit('login', self.login_form);
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

    #form  {
        width: 400px;
    }
</style>
