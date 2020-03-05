<template>
    <div id="chat">
        <div id="menu">
            <div id="info">
                <img src="../assets/webwxgeticon.jpg" style="width: 40px;height: 40px;border-radius: 3px"/>
                <span style="font-size: 16px; color: snow; margin-left: 10px;font-weight: bold; width: 70%">Max Wong</span>
                <button style="background: rgba(0,0,0,0); border: none" @click="menu_visible=true">
                    <icon type="md-menu" style="font-size: 24px; color: rgb(119,119,119)"></icon>
                </button>
                <Drawer :closable="false" placement="left" v-model="menu_visible" width="300">
                    <div id="drawer">
                        <List>
                            <ListItem>
                                <Button class="menu_content" ghost type="text">
                                    <Icon type="md-contact"/>
                                   修改信息
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="menu_content" ghost type="text">
                                    <Icon type="md-search"/>
                                    添加好友
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="menu_content" ghost type="text">
                                    <Icon type="md-people"/>
                                    创建群聊
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="menu_content" ghost type="text" @click="handleQuit">
                                    <Icon type="md-power"/>
                                    退出
                                </Button>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </div>

            <Divider style="margin: 0; background: rgb(36,39,44)"></Divider>
        </div>
        <div id="talk">

        </div>
    </div>
</template>

<script>
    export default {
        name: "Chat",
        data() {
            return {
                menu_visible: false
            }
        },
        methods: {
            handleQuit() {
                let self= this;
                self.$emit('quit');

            }
        }
    }
</script>

<style scoped>
    #chat {
        background: rgba(0, 0, 0, 0);
        min-height: 100vh;
        min-width: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #menu {
        background: rgb(46, 50, 56);
        width: 300px;
        min-height: 80vh;
        border-radius: 5px;
    }

    #talk {
        background: rgb(238, 238, 238);
        width: 800px;
        border-radius: 5px;
        min-height: 80vh;
    }

    #info {
        display: flex;
        align-items: center;
        padding: 15px;
    }

    #drawer .ivu-list-item{
        border: none;
    }


    .menu_content {
        width: 100%;
        font-size: 16px;
        color: gray;
        display: flex;
        justify-content: left;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
    }

    .menu_content:hover, .menu_content:focus{
        color: black;
        border-color: gray;
        box-shadow: none;
    }

</style>
