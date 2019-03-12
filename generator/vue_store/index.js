
module.exports = {
  name: 'ModuleStore',
  async forEachSchema({ blueprint, configuration, schema }) {

    // Isolates API Actions metadata
    let api_actions = configuration.api_actions[schema.identifier]
    // if (!api_actions[0]) { api_actions = [] }

    // // // //

    // Defines the newModel data
    let newModel = this.buildDefault({ schemas: blueprint.schemas, schema: schema })

    // Ensures presence of requisite directory module + store directory
    await this.ensureDir('frontend/src/modules/' + schema.identifier)
    await this.ensureDir('frontend/src/modules/' + schema.identifier + '/store')

    // frontend/src/store/resource/actions.js
    await this.copyTemplate(
      this.templatePath('actions.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/actions.js'),
      { schema, api_actions }
    );

    // frontend/src/store/resource/getters.js
    await this.copyTemplate(
      this.templatePath('getters.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/getters.js'),
      { schema, api_actions }
    );

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

    // frontend/src/store/resource/mutations.js
    await this.copyTemplate(
      this.templatePath('mutations.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/mutations.js'),
      { schema, api_actions }
    );

    // frontend/src/store/resource/state.js
    await this.copyTemplate(
      this.templatePath('state.js'),
      this.destinationPath('frontend/src/modules/' + schema.identifier + '/store/state.js'),
      { schema, api_actions }
    );

    // }) // FOREACH
    // } // FOR
    // console.log('WROTE MODULE STORE')
  }

};
