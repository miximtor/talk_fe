<template>
    <div id="uploader" :style="`width: ${size}px; height: ${size}px`">
        <iv-upload
                action=""
                accept="image/*"
                :disabled="upload_disabled"
                :before-upload="on_before_upload"
                :show-upload-list="false">
            <div id="avatar" :style="`height: ${size}px; width: ${size}px; display: flex; justify-content: center; align-items: center`">
                <img :src="url" :style="`width: ${size}px; height: ${size}px; border-radius: 4px;`" v-if="url" alt="Loading"/>
                <iv-icon :type="hint.icon" :class="hint.class" :size="size/2" v-else></iv-icon>
            </div>
        </iv-upload>
    </div>
</template>

<script>
    import Compress from 'browser-image-compression';
    import {axios} from "@/util/connection";

    export default {
        name: "Uploader",
        props: ['size', 'url'],
        data() {
            return {
                hint: {
                    icon: 'md-camera',
                    class: ''
                },
                upload_disabled: false
            }
        },
        methods: {
            on_before_upload(file) {
                let self = this;
                (async () => {
                    try {
                        self.hint = {icon: 'ios-loading', class: 'spin'};
                        self.upload_disabled = true;

                        const avatar = await Compress(file, {maxWidthOrHeight: 200, maxSizeMB: 0.1});
                        let form = new FormData();
                        form.append('file', avatar);
                        form.append('token', '0c75c2b5ac14447a909cd739758f4d5a');
                        const response = await axios.post('https://api.superbed.cn/upload', form, {timeout: 0}).then(response => response.data);
                        if (response.err !== 0) {
                            self.$modal.show("error-dialog", {
                                title: '上传失败',
                                content: response.msg
                            });
                            return;
                        }
                        self.$emit('success', response.url);
                    } catch (e) {
                        self.$modal.show("error-dialog", {
                            title: '上传失败',
                            content: e.message
                        });
                    } finally {
                        self.hint = {icon: 'ios-camera', class: ''};
                        self.upload_disabled = false;
                    }
                })();
                return false;
            }
        }
    }
</script>

<style scoped>
    #avatar {
        background: rgb(204, 204, 204);
        border-radius: 4px;
    }

    .spin {
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
