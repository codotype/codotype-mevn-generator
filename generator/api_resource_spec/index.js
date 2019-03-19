module.exports = {
  name: 'ResourceSpec',
  async write ({ blueprint }) {

    // Store all spec filenames for inclusion in web_api/test/index.js
    let specPaths = []

    // Store all mock objects
    let mocks = {}

    // Iterates over each schema in the blueprint.schemas array
    // blueprint.schemas.forEach(async (schema) => {
    for (var i = blueprint.schemas.length - 1; i >= 0; i--) {
      let schema = blueprint.schemas[i]

      // Defines the schema-specific destination
      let resourceDest = 'backend/src/api/' + schema.identifier

      // Ensures the presence of the directory
      await this.ensureDir(resourceDest)

      // Defines filepath for spec test
      let specFilePath = resourceDest + '/' + schema.identifier + '.spec.js'

      // Stores the spec path
      specPaths.push(`../src/api/${schema.identifier}/${schema.identifier}.spec.js`)

      // Builds model mock
      let newModel = this.buildMock({ schemas: blueprint.schemas, schema: schema })
      let mockToken = `${schema.identifier.toUpperCase()}_MOCK`
      if (schema.identifier !== 'user') { mocks[mockToken] = newModel }

      // backend/api/resource/resource.spec.js
      await this.copyTemplate(
        this.templatePath('resource.spec.js'),
        this.destinationPath(specFilePath),
        { schema, mockToken }
      );

    }

    // Ensures the presence of the web_api/test directory
    await this.ensureDir('/backend/test')

    // Writes the entrypoint in web_api/test/index.js
    specPaths = specPaths.map((p) => {
      return `require('${p}');`
    })

    // Copy mocks
    await this.copyTemplate(
      this.templatePath('mocks.js'),
      this.destinationPath('/backend/test/mocks.js'),
      { mocks }
    );

    // Writes the template
    await this.copyTemplate(
      this.templatePath('test.js'),
      this.destinationPath('/backend/test/index.js'),
      { specPaths }
    );

  }

};
