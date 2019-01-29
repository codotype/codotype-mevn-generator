<template>
  <!-- <LoadingFull v-if="fetching" /> -->
  <!-- <div class="container" v-else> -->
  <div class="container">

    <%_ api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload && a.scope === 'ROOT').forEach((action) => { _%>
    <<%=action.class_name + 'Modal' %> v-if="isAuthenticated" />

    <%_ }) _%>
    <b-row>
      <b-col sm="12" md="8">
        <h2>
          <i class="<%= schemaOptions.fontawesome_icon %>"></i>
          <%_ if (action) { _%>
          <%= schema.label %> - <%= action.label %>
          <%_ } else { _%>
          <%= schema.label_plural %>
          <%_ } _%>
        </h2>
      </b-col>

      <b-col sm="12" md="4" class="text-right">
        <%_ api_actions.filter(a => a.scope === 'ROOT').forEach((action) => { _%>
        <%_ if (['POST', 'PUT'].includes(action.verb) && action.payload) { _%>
        <b-button
          v-if="isAdmin"
          variant="success"
          @click="$store.commit('<%= schema.identifier %>/<%= action.uri %>/showingModal', true)"
        >
          <i class="fa fa-fw fa-plus"></i>
          <%= action.label %>
        </b-button>

        <%_ } else if (['GET'].includes(action.verb)) { _%>
        <b-button
          v-if="isAdmin"
          variant="primary"
          to="/<%= schema.identifier_plural %>/<%= action.uri %>"
        >
          <i class="fa fa-fw fa-plus"></i>
          <%= action.label %>
        </b-button>

        <%_ } _%>
        <%_ }) _%>
        <b-button
          v-if="isAdmin"
          variant="primary"
          to="/<%= schema.identifier_plural %>/new"
        >
          <i class="fa fa-fw fa-plus"></i>
          New <%= schema.label %>
        </b-button>

      </b-col>
    </b-row>

    <!-- List View -->
    <LoadingFull v-if="fetching" />
    <b-row v-else>
      <b-col lg="12">
        <SearchBar module='<%= schema.identifier %>'/>
      </b-col>
      <b-col lg="12" v-if="count >= perPage">
        <b-pagination :total-rows="count" :value="currentPage" :per-page="perPage" @change="goToPage" />
      </b-col>
      <b-col lg="12">
        <ListView :collection="collection" />
      </b-col>
    </b-row>
  </div>
</template>

<!-- // // // //  -->

<script>

import ListView from '@/modules/<%= schema.identifier %>/components/<%= schema.class_name %>List'
<%_ api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload && a.scope === 'ROOT').forEach((action) => { _%>
import <%=action.class_name + 'Modal' %> from '@/modules/<%= schema.identifier %>/components/<%= action.class_name %>Modal'
<%_ }) _%>
import LoadingFull from '@/components/LoadingFull'
import SearchBar from '@/components/SearchBar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: '<%= schema.class_name %>List',
  components: {
    LoadingFull,
    ListView,
    <%_ api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload && a.scope === 'ROOT').forEach((action) => { _%>
    <%=action.class_name + 'Modal' %>,
    <%_ }) _%>
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
    count: '<%= schema.identifier %>/count',
    perPage: '<%= schema.identifier %>/pageSize',
    currentPage: '<%= schema.identifier %>/currentPage',
    currentUser: 'auth/current_user',
    isAuthenticated: 'auth/is_authenticated',
    isAdmin: 'auth/isAdmin'
  }),
  methods: mapActions({
    fetch: '<%= schema.identifier %>/fetchCollection',
    goToPage: '<%= schema.identifier %>/goToPage'
  })
}
</script>
