<template>
  <LoadingFull v-if="fetching" />
  <div class="container" v-else>

    <b-row>
      <div class="col-md-8">
        <h2>
          <i class="<%= schemaOptions.fontawesome_icon %>"></i>
          <%= schema.label_plural %>
        </h2>
      </div>

      <div class="col-md-4 text-right">
        <b-button variant="primary" to="/<%= schema.identifier_plural %>/new">
          <i class="fa fa-fw fa-plus"></i>
          New <%= schema.label %>
        </b-button>
      </div>
    </b-row>

    <!-- List View -->
    <b-row>
      <b-col lg="12">
        <SearchBar module='<%= schema.identifier %>'/>
      </b-col>
      <b-col lg="12">
        <b-pagination v-if="collection.length === perPage" :total-rows="totalRows" :value="currentPage" :per-page="perPage" @change="goToPage" />
      </b-col>
      <b-col lg="12">
        <ListView :collection="collection" />
      </b-col>
    </b-row>
  </div>
</template>

<!-- // // // //  -->

<script>

import ListView from '@/modules/<%= schema.identifier %>/components/<%= schema.class_name %>ListWidget'
import LoadingFull from '@/components/LoadingFull'
import SearchBar from '@/components/SearchBar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: '<%= schema.class_name %>List',
  components: {
    LoadingFull,
    ListView,
    SearchBar
  },
  metaInfo: {
    title: '<%= schema.label_plural %>'
  },
  created () {
    return this.fetch()
  },
  computed: mapGetters({
    fetching: '<%= schema.identifier %>/fetching',
    collection: '<%= schema.identifier %>/collection',
    totalRows: '<%= schema.identifier %>/count',
    perPage: '<%= schema.identifier %>/pageSize',
    currentPage: '<%= schema.identifier %>/currentPage'
  }),
  methods: mapActions({
    fetch: '<%= schema.identifier %>/fetchCollection',
    goToPage: '<%= schema.identifier %>/goToPage'
  })
}
</script>
