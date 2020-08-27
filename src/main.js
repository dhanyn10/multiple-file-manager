import Vue from 'vue'
import App from './App.vue'
import {
  BootstrapVue,
  BootstrapVueIcons
} from 'bootstrap-vue'
import 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

const customTitlebar = require('custom-electron-titlebar')
let titlebar = new customTitlebar.Titlebar({
    icon: '/icon/multiple-file-manager.ico',
    backgroundColor: customTitlebar.Color.fromHex("#424242")
})

titlebar.updateTitle("Multiple File Manager")

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  render: h => h(App),
}).$mount('#app')
