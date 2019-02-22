module.exports = {
  name: 'NodeExpressResources',
  async forEachSchema({ blueprint, configuration, schema }) {

    // Pulls `generate_api_doc` from configuration.options
    // Used to conditionally generate APIDoc headers
    // const { generate_api_doc } = configuration.options
    const generate_api_doc = true

    // Pulls schema api_actions
    // TODO - IMPLEMENT IN META.JSON
    let schemaApiActions = []
    if (configuration.api_actions[schema.identifier]) {
      schemaApiActions = configuration.api_actions[schema.identifier]
    }

    // Defines the schema-specific destination
    let resourceDest = 'server/src/api/' + schema.identifier

    // Ensures the presence of the directory
    await this.ensureDir(resourceDest)

    // src/api/resource/resource.model.js
    if (schema.identifier === 'user') {

      // const requiredUserAttributes = schema.attributes.filter(r => r.required)
      const requiredUserAttributes = schema.attributes
      const inlineDeconstrction = requiredUserAttributes.map(r => r.identifier).join(', ')

      await this.copyTemplate(
        this.templatePath('user.resource.model.js'),
        this.destinationPath(resourceDest + '/' + schema.identifier + '.model.js'),
        { schema, inlineDeconstrction }
      );
    } else {
      await this.copyTemplate(
        this.templatePath('resource.model.js'),
        this.destinationPath(resourceDest + '/' + schema.identifier + '.model.js'),
        { schema }
      );
    }

    // src/api/resource/resource.controller.js
    await this.copyTemplate(
      this.templatePath('resource.controller.js'),
      this.destinationPath(resourceDest + '/' + schema.identifier + '.controller.js'),
      { schema, generate_api_doc, schemaApiActions }
    );

    // src/api/resource/index.js
    await this.copyTemplate(
      this.templatePath('index.js'),
      this.destinationPath(resourceDest + '/index.js'),
      { schema, schemaApiActions }
    );

  }

};
