<template>
  <div id="app">
    <Navbar/>
    <router-view />
    <ToastList/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import ToastList from '@/modules/toast/components/ToastList'

export default {
  name: 'app',
  components: {
    Navbar,
    ToastList
  },
  created () {
    this.$store.dispatch('auth/fetchUserProfile') // Authenticates current user on application start
  },
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

  #app {
    height: 100%;
  }

  .app {
    height: 100%;
  }
</style>
