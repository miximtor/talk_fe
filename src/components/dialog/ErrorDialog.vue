<template>
    <modal name="error-dialog" @before-open="on_before_open" height="150" width="300" styles="display: flex; flex-direction: column">
        <span id="title" v-if="title">{{title}}</span>
        <iv-divider style="margin: 0;padding: 0" v-if="title"></iv-divider>
        <div id="content">
            <span>{{content}}</span>
        </div>
        <iv-button id="close-button"  :type="type" @click="$modal.hide('error-dialog')">确认</iv-button>
    </modal>
</template>

<script>
    export default {
        name: "ErrorDialog",
        data() {
          return {
              title: '',
              content: '',
              type: 'error'
          }
        },
        methods: {
            on_before_open(ev) {
                let self = this;
                self.title = ev.params.title;
                self.content = ev.params.content;
            }
        }
    }
</script>

<style scoped>
    #title {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font-size: 16px;
        color: #464c5b;
        font-weight: bold;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    #content {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font-size: 12px;
        color: #657180;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #close-button {
        margin: 2px;
    }

</style>
