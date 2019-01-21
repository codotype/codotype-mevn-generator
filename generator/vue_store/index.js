
module.exports = {
  name: 'ModuleStore',
  async write({ blueprint, configuration }) {
    // console.log('WRITING MODULE STORE')
    // Iterates over each schema in the this.options.build.blueprint.schemas array
    // return blueprint.schemas.forEach(async (schema) => {
    // } blueprint.schemas.forEach(async (schema) => {
    // TODo - replace with a single call to forEachSchema
    for (var i = blueprint.schemas.length - 1; i >= 0; i--) {
      const schema = blueprint.schemas[i]

      // // // //
      // TODO - abstract this elsewhere
      // Pulls model options from configuration object
      const schemaOptions = configuration.model_options[schema._id]

      // Isolates API Actions metadata
      let api_actions = configuration.api_actions[schema._id]
      if (!api_actions[0]) { api_actions = false }
      // // // //

      // TODO - abstract this into @codotype/utils
      let newModel = {}
      schema.attributes.forEach((attr) => {
        if (attr.datatype === 'STRING_ARRAY') {
          newModel[attr.identifier] = []
        } else if (attr.datatype === 'NUMBER') {
          newModel[attr.identifier] = 0
        } else if (attr.datatype === 'JSON') {
          newModel[attr.identifier] = {}
        } else {
          newModel[attr.identifier] = ''
        }
      })

      schema.relations.forEach((rel) => {
         if (rel.type === 'HAS_MANY') {
           newModel[rel.alias.identifier + '_ids'] = []
         } else if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) {
           newModel[rel.alias.identifier + '_id'] = ''
         }
      })

      // Ensures presence of requisite directory module + store directory
      await this.ensureDir('client/src/modules/' + schema.identifier)
      await this.ensureDir('client/src/modules/' + schema.identifier + '/store')

      // client/src/store/resource/actions.js
      await this.copyTemplate(
        this.templatePath('actions.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/actions.js'),
        { schema, api_actions }
      );

      // client/src/store/resource/getters.js
      await this.copyTemplate(
        this.templatePath('getters.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/getters.js'),
        { schema }
      );

      // client/src/store/resource/index.js
      await this.copyTemplate(
        this.templatePath('index.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/index.js'),
        { schema }
      );

      // client/src/store/resource/constants.js
      // TODO - how can we get newModel to print as a JavaScript object, rather than stringified JSON?
      await this.copyTemplate(
        this.templatePath('constants.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/constants.js'),
        { schema: schema, newModel: JSON.stringify(newModel, null, 2) }
      );

      // client/src/store/resource/mutations.js
      await this.copyTemplate(
        this.templatePath('mutations.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/mutations.js'),
        { schema }
      );

      // client/src/store/resource/state.js
      await this.copyTemplate(
        this.templatePath('state.js'),
        this.destinationPath('client/src/modules/' + schema.identifier + '/store/state.js'),
        { schema }
      );

    // }) // FOREACH
    } // FOR
    // console.log('WROTE MODULE STORE')

  }

};
