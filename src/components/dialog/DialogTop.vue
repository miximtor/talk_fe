<template>
    <div id="top">
        <div>
        </div>
        <div id="title">
            <span>{{title}}</span>
        </div>
        <div style="display: flex;flex-direction: row-reverse">
            <iv-button type="text" @click="$modal.hide(name)">
                ❌
            </iv-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DialogTop",
        props: ['title', 'name']
    }
</script>

<style scoped>

    #top {
        display: grid;
        grid-template-columns: repeat(3, 33.33%);
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    #title {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        font-size: 22px;
        color: #464c5b;
        font-weight: bold;
        display: flex;
        justify-content: center;
    }

</style>
