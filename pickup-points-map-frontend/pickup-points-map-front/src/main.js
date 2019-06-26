// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate, { Validator } from 'vee-validate'
import pl from 'vee-validate/dist/locale/pl'
import store from './store'
import VuexGeolocation from 'vuex-geolocation'

const vuexGeolocation = VuexGeolocation.sync(store)
Vue.use(vuexGeolocation)
Vue.prototype.$store = store

Vue.config.productionTip = false
Vue.use(VeeValidate)

Validator.localize('pl', pl)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
