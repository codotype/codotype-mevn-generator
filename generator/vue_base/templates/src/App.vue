<template>
  <div id="app">
    <AppNavbar/>
    <router-view/>
    <ToastList/>
  </div>
</template>

<script>
import AppNavbar from '@/components/Navbar'
// import AppFooter from '@/components/Footer'
import ToastList from '@/modules/toast/components/ToastList'

export default {
  name: 'app',

  // Top-Level Application Components
  components: {
    AppNavbar,
    // AppFooter,
    ToastList
  },

  created () {
    // Authenticates current user on application start
    this.$store.dispatch('auth/fetchUserProfile')
  },

  // Top-Level page Meta
  metaInfo: {
    title: 'Loading...', // set a title
    titleTemplate: '<%= blueprint.label %> - %s', // title is now "<%= blueprint.label %> - Loading..."
    htmlAttrs: {
      lang: 'en'
    }
  }
}
</script>

<style>
  html {
    height: 100%;
  }

  body {
    height: 100%;
  }

  .container-fluid, .container {
    height: 100%;
    padding-top: 4.5rem;
  }

  #app {
    height: 100%;
  }

  .app {
    height: 100%;
  }
</style>
