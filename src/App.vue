<template>
    <div id="app">
        <Register
                @click_back="on_click_back"
                @register="onRegister"
                v-if="page === 0"></Register>

        <Login
                @login="onLogin"
                @click_register="on_click_register"
                v-if="page === 1"></Login>

        <Chat
                :personal_info="personal_info"
                :contact_info_list="contact_info_list"
                @quit="onQuit"
                @update="onUpdatePersonalInfo"
                v-if="page===2"></Chat>
    </div>
</template>

<script>
    import Login from "@/components/Login";
    import Chat from "@/components/Chat";
    import Register from "@/components/Register";

    export default {
        name: 'App',
        components: {Register, Login, Chat},
        data() {
            return {
                page: 1,
                login_token: '',
                personal_info: {
                    avatar: '',
                    login_id: ''
                },
                contact_info_list: [],
                socket: null,
            }
        },
        methods: {
            onQuit() {
                let self = this;
                self.page = 1;
                if (self.socket) {
                    self.socket.close();
                }
            },

            handleLoginFailure(reason) {
                let self = this;
                self.$Spin.hide();
                self.$Notice.open({
                    title: '登录失败',
                    desc: reason
                });
                if (self.socket) {
                    self.socket.close(4001, reason);
                    self.socket = null;
                }
            },

            async onLogin(authentication_info) {
                let self = this;
                self.$Spin.show({
                    render: h =>
                        h('div', [h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {type: 'ios-loading', size: 18}
                        }), h('div', '登陆中')])
                });

                const response = await self.$http.post('https://talk.maxtorm.wtf/bin/account/login', authentication_info);
                if (!response.body.ok) {
                    self.handleLoginFailure(response.body.reason);
                    return;
                }
                self.login_token = response.body.token;
                self.socket = new WebSocket('wss://talk.maxtorm.wtf/bin/message');

                self.socket.onopen = () => {
                    self.socket.send(JSON.stringify({token: self.login_token, login_id: authentication_info.login_id}));
                };

                self.socket.onmessage = async ev => {
                    let response = JSON.parse(ev.data);
                    if (!response.ok) {
                        self.handleLoginFailure(response.reason);
                        return;
                    }
                    response = await self.$http.post('https://talk.maxtorm.wtf/bin/account/getpersonalinfo', {token: self.login_token});
                    response = response.body;
                    if (!response.ok) {
                        self.handleLoginFailure(response.reason);
                        return;
                    }
                    self.personal_info = response.data;

                    response = await self.$http.post('https://talk.maxtorm.wtf/bin/account/getcontacts', {token: self.login_token});
                    response = response.body;
                    if (!response.ok) {
                        self.handleLoginFailure(response.reason);
                        return;
                    }
                    self.contact_info_list = response.data;
                    self.$Spin.hide();
                    self.page = 2;
                };
            },

            on_click_register() {
                let self = this;
                self.page = 0;
            },

            on_click_back() {
                let self = this;
                self.page = 1;
            },

            async onRegister(register_info) {
                let self = this;
                let response = await self.$http.post('https://talk.maxtorm.wtf/bin/account/register', register_info);
                response = response.body;
                if (response.ok) {
                    self.$Notice.open({
                        title: '注册成功',
                        desc: ''
                    });
                    self.page = 1;
                } else {
                    self.$Notice.open({
                        title: '注册失败',
                        desc: response.reason
                    })
                }
            },

            async onUpdatePersonalInfo(modified_personal_info) {
                let self = this;
                let response = await self.$http.post('https://talk.maxtorm.wtf/bin/account/updatepersonalinfo', {token: self.login_token, ...modified_personal_info});
                response = response.body;
                if (response.ok) {
                    self.personal_info = response.data;
                }
            }

        }
    }
</script>

<style>

    #app {
        background: url("./assets/background.jpg");
        background-size: 100% 100%;
        min-height: 100vh;
        min-width: 100vh;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

</style>
