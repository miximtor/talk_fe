<template>
    <div id="chat">

        <Modal v-model="modify_personal_info_modal_visible" title="修改信息" ok-text="更新" @on-ok="onPersonalInfoUpdate">
            <Form :label-width="80">
                <FormItem label="头像" prop="avatar">
                    <Upload action="https://api.superbed.cn/upload"
                            :data="{token: '0c75c2b5ac14447a909cd739758f4d5a'}"
                            :on-success="onAvatarUploadSuccess"
                            :show-upload-list="false"
                            accept="image/png, image/jpeg">
                        <Avatar size="100" shape="square" :src="modify_form.avatar"/>
                    </Upload>
                </FormItem>
                <FormItem label="邮箱">
                    <i-input type="text" size="large" v-model="modify_form.email"></i-input>
                </FormItem>
            </Form>
        </Modal>

        <div id="info">
            <div id="personal">
                <Avatar size="50" shape="square" :src="personal_info.avatar"></Avatar>
                <span id="nick">{{personal_info.login_id}}</span>

                <Poptip placement="bottom-start" trigger="click" :disabled="modify_personal_info_modal_visible">
                    <Button icon="md-menu" id="preference"></Button>
                    <div slot="content" id="preference_menu">
                        <List>
                            <ListItem>
                                <Button class="preference_item" ghost type="text" @click="onModifyPersonalInfoClicked">
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

            <Menu mode="horizontal" :active-name="active_name" id="switch" @on-select="onSelect">
                <MenuItem name="session">
                    <Icon type="md-chatboxes"></Icon>
                </MenuItem>
                <Divider type="vertical" style="height: 2em; background: black"></Divider>
                <MenuItem name="contacts">
                    <Icon type="md-contacts"></Icon>
                </MenuItem>
            </Menu>

            <div v-if="active_name === 'contacts'" id="contact_info">
                <List>
                    <ListItem v-for="(contact, index) of contact_info_list" :key="index">
                            <Button class="contact_info_item">
                                <Avatar size="50" shape="square" :src="contact.avatar"></Avatar>
                                <span style="margin-left: 20px">{{contact.login_id}}</span>
                            </Button>
                    </ListItem>
                </List>
            </div>

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
        props: ['personal_info', 'contact_info_list'],
        data() {
            return {
                menu_visible: false,
                chat_session: [],
                active_name: 'contacts',
                modify_personal_info_modal_visible: false,
                modify_form: {
                    avatar: ''
                }
            }
        },
        methods: {
            handleQuit() {
                let self = this;
                self.$emit('quit');
            },

            onSelect(name) {
                let self = this;
                self.active_name = name;
            },

            onModifyPersonalInfoClicked() {
                let self = this;
                self.modify_personal_info_modal_visible = true;
                self.modify_form = JSON.parse(JSON.stringify(self.personal_info));
            },

            onAvatarUploadSuccess(response) {
                let self = this;
                self.modify_form.avatar = response.url;
            },

            onPersonalInfoUpdate() {
                let self = this;
                self.$emit('update', self.modify_form);
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
        font-size: 22px;
        font-weight: lighter;
        color: black;
        display: flex;
        justify-content: left;
        align-items: center;
        padding-top: 25px;
        padding-bottom: 25px;
    }

    .preference_item:hover, .preference_item:focus {
        color: black;
        background: rgb(245,245,245);
        border-color: rgba(0, 0, 0, 0);
        box-shadow: none;
    }

    #contact_info {
        flex-grow: 1;
        padding: 0;
    }

    #contact_info .ivu-list-item {
        padding: 0;
    }

    .contact_info_item {
        height: 100%;
        width: 100%;
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        color: white;
        border: none;
        background: rgba(0, 0, 0, 0);
        font-size: 16px;
        font-weight: lighter;
    }

    .contact_info_item:hover {
        box-shadow: none;
        background: rgba(0, 0, 0, 0);
        border-color: rgba(0, 0, 0, 0);
        color: white;
    }

    .contact_info_item:focus {
        background: rgb(58,63,69);
        color: white;
        box-shadow: none;
    }

    #preference_menu .ivu-menu-item {
        padding: 0;
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
