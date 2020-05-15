import Vue from 'vue'
import App from './App.vue'

import store from './store';

import {Form, FormItem, Input, Icon, Button, ButtonGroup, Upload, Spin, Divider, Avatar, Menu, MenuItem, Poptip} from "view-design";
import {List, Tabs, TabPane, Notice, Badge, Modal} from 'view-design';

import 'view-design/dist/styles/iview.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'


import VModal from 'vue-js-modal'

Vue.config.productionTip = false;
Vue.prototype.$Spin = Spin;
Vue.prototype.$Notice = Notice;
Vue.prototype.$IModal = Modal;

Vue.component('iv-form', Form);
Vue.component('iv-form-item', FormItem);
Vue.component('iv-input', Input);
Vue.component('iv-icon', Icon);
Vue.component('iv-button', Button);
Vue.component('iv-button-group', ButtonGroup);
Vue.component('iv-upload', Upload);
Vue.component('iv-divider', Divider);
Vue.component('iv-avatar', Avatar);
Vue.component('iv-menu', Menu);
Vue.component('iv-menu-item', MenuItem);
Vue.component('iv-poptip', Poptip);
Vue.component('iv-list', List);
Vue.component('iv-list-item', List.Item);
Vue.component('iv-tabs', Tabs);
Vue.component('iv-tab-pane', TabPane);
Vue.component('iv-badge', Badge);

Vue.use(PerfectScrollbar);
Vue.use(VModal);

new Vue({
    render: h => h(App),
    store
}).$mount('#app');

