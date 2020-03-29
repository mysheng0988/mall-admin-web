import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap';
import '@/icons' // icon
import '@/permission' // permission control
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.config.productionTip = false
Vue.use(VueAMap);
Vue.use(Viewer);

VueAMap.initAMapApiLoader({
  key: '88c9bb8dea021721ce5eb52511e90a35',
  plugin: ['AMap.Geocoder','AMap.Autocomplete','AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  uiVersion:'1.0.14',
  v: '1.4.4'
});
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
