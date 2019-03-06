// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Meta from 'vue-meta'
import App from '@/App'
import router from '@/routers'
import store from '@/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// TODO - figure out what's happening with the mediator pattern, how to best handle routing
import configureModerator from '@/store/mediator'
configureModerator(store, router)

// vue-meta
// supports `meta` object returned with `module.defaults`
Vue.use(Meta)

// bootstrap-vue
// Bootstrap components and directives
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  store,
  router: router,
  render: h => h(App)
}).$mount('#app')
