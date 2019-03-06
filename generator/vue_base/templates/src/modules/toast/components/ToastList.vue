<template>
  <transition-group name="list" tag='div' class="container notification-container" v-if="collection[0]">
    <div class="row" v-for="each in collection" :key="each.id">
      <ToastChild :item="each"/>
    </div>
  </transition-group>
</template>

<script>
import ToastChild from './ToastChild'
export default {
  computed: {
    collection () {
      return this.$store.getters['toast/collection']
    }
  },
  components: {
    ToastChild
  }
}
</script>

<style>
  .container.notification-container {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .list-enter-active, .list-leave-active {
    transition: opacity .5s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
  }
</style>
