import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import VueResource from 'vue-resource';

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(VueResource);

new Vue({
  render: h => h(App),
  http: {
    headers: {
      ContentType: 'application/json'
    }
  }
}).$mount('#app');

