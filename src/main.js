import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import Print from '@/utils/print' // 引入附件的js文件
import Pchart from '@/utils/printChart' // 引入附件的js文件
import drag from '@/directive/el-drag-dialog'
import plTable from 'pl-table'
import 'pl-table/themes/index.css'
// import 'pl-table/themes/plTableStyle.css'
import VueDND from 'awe-dnd'
import onlyNumber from '@/directive/only_number'
Vue.use(onlyNumber) // 添加此行=>使用该全局指令
Vue.use(plTable)
Vue.use(VueDND)
Vue.use(Print)
Vue.use(Pchart)
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)

import formCreate from '@form-create/element-ui'
Vue.use(formCreate)

Vue.directive('drag', drag)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
