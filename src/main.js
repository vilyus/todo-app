import Vue from 'vue'

import 'normalize.css'

import './registerBaseComponents'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// see also src/stylus/variables.styl
Vue.prototype.$colors = {
  white: '#fff',
  grey1: '#efefef',
  grey2: '#aaa',
  grey3: '#999',
  grey4: '#888',
  grey5: '#333',
  dark: '#2c3e50',
  danger: '#b66',
  success: '#696',
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
