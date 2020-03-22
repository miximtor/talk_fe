<template>
    <div id="app">
        <Login
                @login-success="page=2"
                v-if="page === 1">

        </Login>

        <Chat
                @logout-success="page=1"
                @connection-close="page=1"
                v-if="page===2">
        </Chat>

        <ErrorDialog></ErrorDialog>
    </div>
</template>

<script>
    import Login from "@/components/Login";
    import Chat from "@/components/Chat";
    import ErrorDialog from "@/components/dialog/ErrorDialog";

    export default {
        name: 'App',
        components: {Login, Chat, ErrorDialog},
        data() {
            return {
                page: 1
            }
        },
        mounted() {
        },

        methods: {}
    }
</script>

<style>

    #app {
        background: url("./assets/background.jpg");
        background-size: 100% 100%;
        min-height: 100vh;
        min-width: 100vh;
    }


</style>
