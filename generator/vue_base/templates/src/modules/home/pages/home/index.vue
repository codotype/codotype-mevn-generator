<template>
  <b-row class="h-100 align-items-center">
    <b-col lg="12">

      <b-row>
        <b-col lg="12" class="text-center">
          <p class="mb-0">Built with</p>
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col lg="12" class="text-center">
          <!-- <img src="@/assets/logo.png"> -->
          <h1 class='display-1' style="font-family: monospace;">codotype</h1>
        </b-col>
      </b-row>

      <b-row class="my-4">
        <b-col lg="12" class="text-center">
          <a class="btn btn-lg btn-outline-dark mx-2" href="https://codotype.io" target="_blank">
            <i class="fa fa-desktop"></i>
            codotype.io
          </a>

          <a class="btn btn-lg btn-outline-dark mx-2" href="https://codotype.github.io" target="_blank">
            <i class="fa fa-book"></i>
            Documentation
          </a>
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'Home',
    metaInfo: {
      title: 'Home'
    }
  }
</script>
