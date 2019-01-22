<template>
  <!-- <LoadingFull v-if="fetching" /> -->
  <!-- <div class="container" v-else> -->
  <div class="container">

    <%_ api_actions.filter(a => a.scope === 'ROOT' && ['POST', 'PUT'].includes(a.verb)).forEach((action) => { _%>
    <!-- Bootstrap Modal Component -->
    <b-modal v-if="isAdmin" :id="'<%= action.function_name %>Modal'"
      :title="'<%= action.label %>?'"
      @ok="<%= action.function_name %>(<%= action.function_name %>Payload)"
      ok-variant='success'
      ok-title='Submit'
      cancel-title='Cancel'
      cancel-variant='light'
    >
      {{ <%= action.function_name %>Payload }}
    </b-modal>
    <%_ }) _%>

    <b-row>
      <div class="col-md-8">
        <h2>
          <i class="<%= schemaOptions.fontawesome_icon %>"></i>
          <%= schema.label_plural %>
        </h2>
      </div>

      <div class="col-md-4 text-right">
        <%_ api_actions.filter(a => a.scope === 'ROOT').forEach((action) => { _%>
        <%_ if (['POST', 'PUT'].includes(action.verb)) { _%>
        <b-button v-if="isAdmin" variant="success" v-b-modal="'<%= action.function_name %>Modal'">
          <i class="fa fa-fw fa-plus"></i>
          <%= action.label %>
        </b-button>
        <%_ } else if (['GET'].includes(action.verb)) { _%>
        <b-button v-if="isAdmin" variant="primary" @click="<%= action.function_name %>()">
          <i class="fa fa-fw fa-plus"></i>
          <%= action.label %>
        </b-button>
        <%_ } _%>
        <%_ }) _%>
        <b-button v-if="isAdmin" variant="primary" to="/<%= schema.identifier_plural %>/new">
          <i class="fa fa-fw fa-plus"></i>
          New <%= schema.label %>
        </b-button>
      </div>
    </b-row>

    <!-- List View -->
    <LoadingFull v-if="fetching" />
    <b-row v-else>
      <b-col lg="12">
        <SearchBar module='<%= schema.identifier %>'/>
      </b-col>
      <b-col lg="12" v-if="collection.length >= perPage">
        <b-pagination :total-rows="totalRows" :value="currentPage" :per-page="perPage" @change="goToPage" />
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
  <%_ const filteredActions = api_actions.filter(a => a.scope === 'ROOT' && ['POST', 'PUT'].includes(a.verb)) _%>
  <%_ if (filteredActions.length) { _%>
  data () {
    return {
    <%_ filteredActions.forEach((action, index) => { _%>
      <%= action.function_name %>Payload: {}<%= helpers.trailingComma(filteredActions, index) %>
    <%_ }) _%>
    }
  },
  <%_ } _%>
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
    currentPage: '<%= schema.identifier %>/currentPage',
    currentUser: 'auth/current_user',
    isAdmin: 'auth/isAdmin'
  }),
  methods: mapActions({
    <%_ if (api_actions) { _%>
    <%_ api_actions.filter(a => ['POST','PUT', 'GET'].includes(a.verb) && a.scope === 'ROOT' ).forEach((action) => { _%>
    <%= action.function_name %>: '<%= schema.identifier %>/<%= action.function_name %>',
    <%_ }) _%>
    <%_ } _%>
    fetch: '<%= schema.identifier %>/fetchCollection',
    goToPage: '<%= schema.identifier %>/goToPage'
  })
}
</script>
