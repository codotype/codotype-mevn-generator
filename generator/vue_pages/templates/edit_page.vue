<template>
  <LoadingFull v-if="fetching" />
  <b-container v-else>

    <b-row>
      <b-col sm="12">
        <h2><%= schema.label %> - Edit</h2>
      </b-col>
    </b-row>

    <hr>

    <<%= schema.class_name %>Form />

    <b-row>
      <b-col sm="12" class="text-right">

        <b-button variant="secondary" to="/<%= schema.identifier_plural %>" class="mr-2">
          <i class="fa fa-fw fa-times"></i>
          Cancel
        </b-button>

        <b-button variant="primary" @click="formSubmit(model)">
          <i class="fa fa-fw fa-plus"></i>
          Update <%= schema.label %>
        </b-button>

      </b-col>
    </b-row>

  </b-container>
</template>

<!-- // // // //  -->

<script>
import { mapGetters, mapActions } from 'vuex'
import LoadingFull from '@/components/LoadingFull'
import <%= schema.class_name %>Form from '@/modules/<%= schema.identifier %>/components/<%= schema.class_name %>Form'

export default {
  name: '<%= schema.class_name %>EditPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  metaInfo: {
    title: '<%= schema.label %> - Edit'
  },
  components: {
    LoadingFull,
    <%= schema.class_name %>Form
  },
  created () {
    // this.fetchEditModel(this.id)
  },
  computed: mapGetters({
    currentUser: 'auth/current_user',
    isAdmin: 'auth/isAdmin',
    model: '<%= schema.identifier %>/editModel',
    fetching: '<%= schema.identifier %>/model/loading'
  }),
  methods: mapActions({
    fetchEditModel: '<%= schema.identifier %>/fetchEditModel',
    formSubmit: '<%= schema.identifier %>/form/updateModel'
  })
}
</script>
