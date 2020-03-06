<template>
    <div id="chat">

        <div id="info">
            <div id="personal">
                <Avatar size="50" shape="square" :src="personal_info.avatar"></Avatar>
                <span id="nick">{{personal_info.nick}}</span>

                <Poptip placement="bottom-start" trigger="click">
                    <Button icon="md-menu" id="preference"></Button>
                    <div slot="content" id="preference_menu">
                        <List>
                            <ListItem>
                                <Button class="preference_item" ghost type="text">
                                    <Icon type="md-contact"/>
                                    修改信息
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="preference_item" ghost type="text">
                                    <Icon type="md-search"/>
                                    添加好友
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="preference_item" ghost type="text">
                                    <Icon type="md-people"/>
                                    创建群聊
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button class="preference_item" ghost type="text" @click="handleQuit">
                                    <Icon type="md-power"/>
                                    退出
                                </Button>
                            </ListItem>
                        </List>
                    </div>
                </Poptip>
            </div>

            <Menu mode="horizontal" active-name="session" id="switch">
                <MenuItem name="session">
                    <Icon type="md-chatboxes"></Icon>
                </MenuItem>
                <Divider type="vertical" style="height: 2em; background: black"></Divider>
                <MenuItem name="contacts">
                    <Icon type="md-contacts"></Icon>
                </MenuItem>
            </Menu>
        </div>

        <div id="talk">
            <div id="name">
                <span id="name_content">测试</span>
                <Divider id="name_divider"></Divider>
            </div>
            <div id="talk_content">
            </div>
            <Divider></Divider>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Chat",
        props: ['personal_info'],
        data() {
            return {
                menu_visible: false,
                chat_session: []
            }
        },
        methods: {
            handleQuit() {
                let self = this;
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

    #info {
        background: rgb(46, 50, 56);
        width: 20em;
        height: 50em;
        min-width: 300px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    #talk {
        background: rgb(238, 238, 238);
        width: 60em;
        height: 50em;
        min-width: 800px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    #personal {
        display: flex;
        align-items: center;
        padding: 15px 15px 0;
    }

    #nick {
        font-size: 16px;
        color: snow;
        margin-left: 10px;
        font-weight: bold;
        flex-grow: 1;
    }

    #preference {
        color: white;
        background: rgba(0, 0, 0, 0);
        border: none;
        box-shadow: none;
        font-size: 22px;
        padding: 0;
        margin-left: 10px;
    }

    #preference_menu .ivu-list-item {
        padding: 0;
    }


    .preference_item {
        width: 100%;
        font-size: 20px;
        font-weight: lighter;
        color: black;
        display: flex;
        justify-content: left;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .preference_item:hover, .preference_item:focus {
        color: black;
        background: rgb(245,245,245);
        border-color: rgba(0, 0, 0, 0);
        box-shadow: none;
    }

    #switch {
        background: rgba(0, 0, 0, 0);
        font-size: 32px;
        display: flex;
        align-items: center;
    }

    #switch .ivu-menu-item, .ivu-menu-item:hover {
        color: white;
        font-size: 28px;
        border-bottom: none;
        flex-grow: 1;
        text-align: center;
    }

    #switch .ivu-menu-item-selected {
        border-bottom: none;
        color: rgb(60, 175, 54);
    }

    #switch::after {
        background: black;
    }

    #name {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #name_content {
        font-size: 22px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    #name_divider {
        margin: 0;
        background: darkgray;
        max-width: 95%;
        min-width: 95%;
    }

    #talk_content {
        height: 55vh;
    }

</style>
