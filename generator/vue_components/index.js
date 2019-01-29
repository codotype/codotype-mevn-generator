
module.exports = {
  name: 'ModuleComponents',
  async write({ blueprint, configuration }) {

    // Iterates over each schema in the blueprint.schemas array
    // blueprint.schemas.forEach(async (schema) => {
    for (var i = blueprint.schemas.length - 1; i >= 0; i--) {
      const schema = blueprint.schemas[i]

      // Pulls model options from configuration object
      const schemaOptions = configuration.model_options[schema._id]

      // Isolates API Actions metadata
      let api_actions = configuration.api_actions[schema._id]

      // Destination for module / components directory
      const moduleComponentsDest = 'client/src/modules/' + schema.identifier + '/components/'

      // Ensures module components directory
      this.ensureDir(moduleComponentsDest)

      // client/src/modules/resource/components/ResourceForm.vue
      await this.copyTemplate(
        this.templatePath('form_component.vue'),
        this.destinationPath(moduleComponentsDest + schema.class_name + 'Form.vue'),
        { schema }
      )

      // client/src/modules/resource/components/ResourceListWidget.vue
      await this.copyTemplate(
        this.templatePath('list-component.vue'),
        this.destinationPath(moduleComponentsDest + schema.class_name + 'List.vue'),
        { schema, schemaOptions, api_actions }
      );
      // client/src/modules/resource/components/ResourceDetail.vue
      // client/src/components/resource_ListWidget.vue
      await this.copyTemplate(
        this.templatePath('detail-component.vue'),
        this.destinationPath(moduleComponentsDest + schema.class_name + 'Detail.vue'),
        { schema, api_actions }
      );

      // Generates API Action modals
      if (api_actions[0]) {
        api_actions.forEach(async (action) => {
          await this.copyTemplate(
            this.templatePath('action-modal.vue'),
            this.destinationPath(moduleComponentsDest + action.class_name + 'Modal.vue'),
            { schema, action }
          )
        })
      }

      // Generate relational components
      // schema.relations.forEach(async (rel) => {
      let rel;
      let related_schema;
      for (var j = schema.relations.length - 1; j >= 0; j--) {
        rel = schema.relations[j]

        related_schema = blueprint.schemas.find(s => s._id === rel.related_schema_id)
        // TODO - add HAS_MANY UI
        if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) {
          await this.copyTemplate(
            this.templatePath('belongs-to-component.vue'),
            this.destinationPath(moduleComponentsDest + 'Related' + rel.alias.class_name + 'Detail.vue'),
            { schema, related_schema, rel }
          )
        } else if (rel.type === 'HAS_MANY') {
          await this.copyTemplate(
            this.templatePath('owns-many-component.vue'),
            this.destinationPath(moduleComponentsDest + 'Related' + rel.alias.class_name_plural + 'List.vue'), // TODO - RENAME THIS
            { schema, related_schema, rel }
          )
        } else if (rel.type === 'REF_BELONGS_TO') {
          await this.copyTemplate(
            this.templatePath('owns-many-component.vue'),
            this.destinationPath(moduleComponentsDest + 'Related' + rel.alias.class_name_plural + 'List.vue'), // TODO - RENAME THIS
            { schema, related_schema, rel }
          )
        }
      // })
      }

    }

  }

};
