
module.exports = {
  name: 'ModuleStore',
  async forEachSchema({ blueprint, configuration, schema }) {

    // Isolates API Actions metadata
    let api_actions = configuration.api_actions[schema.identifier] || []

    // Defines the newModel data
    let newModel = this.buildDefault({ schemas: blueprint.schemas, schema: schema })

    // Ensures presence of requisite directory module + store directory
    await this.ensureDir('frontend/src/modules/' + schema.identifier)
    await this.ensureDir('frontend/src/modules/' + schema.identifier + '/store')

    // frontend/src/store/resource/index.js
    await this.copyTemplate(
      this.templatePath('index.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/index.js'),
      { schema, api_actions }
    );

    // frontend/src/store/resource/constants.js
    // TODO - how can we get newModel to print as a JavaScript object, rather than stringified JSON?
    await this.copyTemplate(
      this.templatePath('constants.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/constants.js'),
      { schema: schema, newModel: JSON.stringify(newModel, null, 2) }
    );

    // frontend/src/store/resource/actions.js
    // await this.copyTemplate(
    //   this.templatePath('actions.js'),
    //   this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/actions.js'),
    //   { schema, api_actions }
    // );

    // frontend/src/store/resource/getters.js
    // await this.copyTemplate(
    //   this.templatePath('getters.js'),
    //   this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/getters.js'),
    //   { schema, api_actions }
    // );

    // frontend/src/store/resource/mutations.js
    // await this.copyTemplate(
    //   this.templatePath('mutations.js'),
    //   this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/mutations.js'),
    //   { schema, api_actions }
    // );

    // frontend/src/store/resource/state.js
    // await this.copyTemplate(
    //   this.templatePath('state.js'),
    //   this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/state.js'),
    //   { schema, api_actions }
    // );

    for (var i = schema.relations.length - 1; i >= 0; i--) {
      let rel = schema.relations[i]
      // frontend/src/store/resource/actions.js

      let pluralization
      if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) {
        pluralization = rel.alias.class_name
      } else {
        pluralization =  rel.alias.class_name_plural
      }

      await this.copyTemplate(
        this.templatePath('relationModule.js'),
        this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/related' + pluralization + 'Module.js'),
        { schema, rel }
      );

    }

  }

};
