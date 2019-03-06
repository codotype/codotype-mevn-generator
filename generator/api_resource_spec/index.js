module.exports = {
  name: 'ResourceSpec',
  async write ({ blueprint }) {

    // Store all spec filenames for inclusion in web_api/test/index.js
    let specPaths = []

    // Iterates over each schema in the blueprint.schemas array
    blueprint.schemas.forEach(async (schema) => {

      // Defines the schema-specific destination
      let resourceDest = 'backend/src/api/' + schema.identifier

      // Ensures the presence of the directory
      await this.ensureDir(resourceDest)

      // Defines filepath for spec test
      let specFilePath = resourceDest + '/' + schema.identifier + '.spec.js'

      // Stores the spec path
      specPaths.push(specFilePath)

      // backend/api/resource/resource.spec.js
      if (schema.identifier === 'user') {
        await this.copyTemplate(
          this.templatePath('user.spec.js'),
          this.destinationPath(specFilePath),
          { schema }
        );
      } else {
        await this.copyTemplate(
          this.templatePath('resource.spec.js'),
          this.destinationPath(specFilePath),
          { schema }
        );
      }

    })

    // Ensures the presence of the web_api/test directory
    await this.ensureDir('/backend/test')

    // Writes the entrypoint in web_api/test/index.js
    specPaths = specPaths.map((p) => {
      return `require('../${p}');`
    })

    // Writes the template
    await this.copyTemplate(
      this.templatePath('test.js'),
      this.destinationPath('/backend/test/index.js'),
      { specPaths }
    );

  }

};
