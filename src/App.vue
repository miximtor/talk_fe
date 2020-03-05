<template>
    <div id="app">
        <Login @login="onLogin" v-if="!login_success"></Login>
        <Chat @quit="onQuit" v-else></Chat>
    </div>
</template>

<script>
    import Login from "@/components/Login";
    import Chat from "@/components/Chat";

    export default {
        name: 'App',
        components: {Login, Chat},
        data() {
            return {
                login_success: false,
            }
        },
        methods: {
            onQuit() {
                let self = this;
                self.login_success = false;
            },
            onLogin() {
                let self = this;
                self.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 18
                                }
                            }),
                            h('div', '登陆中')
                        ]);
                    }
                });
                setTimeout(() => {
                    self.login_success = true;
                    self.$Spin.hide();
                }, 3000);
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

    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }

</style>
