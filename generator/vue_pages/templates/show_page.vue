<template>
  <LoadingFull v-if="fetching" />
  <div class="container" v-else>

    <<%= schema.class_name %>Detail :model="model" :fetching="fetching" />

    <b-tabs lazy>
      <%_ schema.relations.forEach((rel) => { _%>
      <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
      <b-tab title="<%= rel.alias.label %>" >
        <Related<%= rel.alias.class_name %>Detail :model="<%= rel.alias.identifier %>" v-if="<%= rel.alias.identifier %>._id" />
      </b-tab>

      <%_ } else if (['REF_BELONGS_TO', 'HAS_MANY'].includes(rel.type)) { _%>
      <b-tab title="<%= rel.alias.label_plural %>" >
        <Related<%= rel.alias.class_name_plural %>List :collection="<%= rel.alias.identifier_plural %>" />
      </b-tab>

      <%_ } _%>
      <%_ }) _%>
    </b-tabs>

  </div>
</template>

<!-- // // // //  -->

<script>
import { mapGetters, mapActions } from 'vuex'
import LoadingFull from '@/components/LoadingFull'
import <%= schema.class_name %>Detail from '@/modules/<%= schema.identifier %>/components/<%= schema.class_name %>Detail'
<%_ schema.relations.forEach((rel) => { _%>
<%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
import Related<%= rel.alias.class_name %>Detail from '@/modules/<%= schema.identifier %>/components/Related<%= rel.alias.class_name %>Detail'
<%_ } else if (['HAS_MANY', 'REF_BELONGS_TO'].includes(rel.type)) { _%>
import Related<%= rel.alias.class_name_plural %>List from '@/modules/<%= schema.identifier %>/components/Related<%= rel.alias.class_name_plural %>List'
<%_ } _%>
<%_ }) _%>

export default {
  props: ['id'],
  name: '<%= schema.identifier %>_show',
  metaInfo: {
    title: '<%= schema.label %>s - Show'
  },
  components: {
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    Related<%= rel.alias.class_name %>Detail,
    <%_ } else if (['REF_BELONGS_TO', 'HAS_MANY'].includes(rel.type)) { _%>
    Related<%= rel.alias.class_name_plural %>List,
    <%_ } _%>
    <%_ }) _%>
    <%= schema.class_name %>Detail,
    LoadingFull
  },
  created () {
    this.fetch(this.id)
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    this.<%= 'fetch' + rel.alias.class_name %>(this.id)
    <%_ } else if (rel.type === 'HAS_MANY') { _%>
    this.<%= 'fetch' + rel.alias.class_name_plural %>(this.id)
    <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
    this.<%= 'fetch' + rel.alias.class_name_plural %>(this.id)
    <%_ } _%>
    <%_ }) _%>
  },
  methods: mapActions({
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    <%= 'fetch' + rel.alias.class_name %>: '<%= schema.identifier %>/<%= 'fetch' + rel.alias.class_name %>',
    <%_ } else if (rel.type === 'HAS_MANY') { _%>
    <%= 'fetch' + rel.alias.class_name_plural %>: '<%= schema.identifier %>/<%= 'fetch' + rel.alias.class_name_plural %>',
    <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
    <%= 'fetch' + rel.alias.class_name_plural %>: '<%= schema.identifier %>/<%= 'fetch' + rel.alias.class_name_plural %>',
    <%_ } _%>
    <%_ }) _%>
    fetch: '<%= schema.identifier %>/fetchModel',
    onConfirmDestroy: '<%= schema.identifier %>/deleteModel'
  }),
  computed: mapGetters({
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    <%= rel.alias.identifier %>: '<%= schema.identifier %>/<%= rel.alias.identifier %>',
    <%_ } else if (rel.type === 'HAS_MANY') { _%>
    <%= rel.alias.identifier_plural %>: '<%= schema.identifier %>/<%= rel.alias.identifier_plural %>',
    <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
    <%= rel.alias.identifier_plural %>: '<%= schema.identifier %>/<%= rel.alias.identifier_plural %>',
    <%_ } _%>
    <%_ }) _%>
    currentUser: 'auth/current_user',
    isAdmin: 'auth/isAdmin',
    model: '<%= schema.identifier %>/model',
    fetching: '<%= schema.identifier %>/fetching'
  })
}
</script>
