import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home.vue'
import Test from '@/pages/Test.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/test', name: 'Test', component: Test }
  ]
})
