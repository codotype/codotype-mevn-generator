// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Meta from 'vue-meta'
import App from '@/App'
import router from '@/routers'
import store from '@/store'
import configureModerator from '@/store/mediator'
// import FullCalendar from 'vue-full-calendar'
// import 'fullcalendar/dist/fullcalendar.css'
configureModerator(store, router)

// vue-full-calendar
// https://www.npmjs.com/package/vue-full-calendar
// Vue.use(FullCalendar)

//<full-calendar
//  defaultView="month"
//  @event-selected="this.$router.push('/events/' + a.eventId)"
//  :events="calendarEvents"/>
///>

// calendarEvents () {
//   return this.collection.map((e) => {
//     return {
//       eventId: e._id,
//       title: e.label,
//       start: e.start
//       // end: e.start + e.duration,
//     }
//   })
// }

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
