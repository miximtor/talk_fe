<template>
    <div id="contact">
        <span id="bar">详细信息</span>
        <iv-divider style="padding: 0;margin: 0; background: rgb(214,214,214)"></iv-divider>
        <div v-if="JSON.stringify(contact) !== '{}'" id="detail">
            <iv-avatar id="avatar" shape="square" size="150" :src="contact.avatar" ></iv-avatar>
            <span id="nick">{{contact.nick}}</span>
            <span>电话：{{contact.phone || '无'}}</span>
            <span>邮箱：{{contact.email || '无'}}</span>
            <iv-button type="success" style="margin-top: 20px; width: 150px" @click="()=>{this.$emit('start-message')}">发消息</iv-button>
        </div>
        <div v-else style="flex-grow: 1;display: flex;flex-direction: column;align-items: center">
            <span style="font-size: 16px;margin-top: 260px">请选择联系人</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Contact",
        props: ['contact'],
    }
</script>

<style scoped>

    #bar {
        font-size: 22px;
        font-weight: lighter;
        padding-top: 20px;
        padding-bottom: 20px;
        text-align: center
    }

    #contact {
        background: rgb(238, 238, 238);
        width: 60em;
        height: 50em;
        min-width: 800px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #detail {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
        color: black;
    }

    #avatar {
        margin-top: 50px;
    }

    #nick {
        margin-top: 10px;
        font-size: 22px;
    }

</style>
