
module.exports = {
  name: 'ModulePages',
  async forEachSchema({ blueprint, configuration, schema }) {

    // Pulls model options from configuration object
    const schemaOptions = configuration.model_options[schema._id]

    // Defines destination directory for files in this loop
    const moduleRoot =  'client/src/modules/' + schema.identifier

    // Isolates API Actions metadata
    let api_actions = configuration.api_actions[schema._id]
    if (!api_actions[0]) { api_actions = false }

    // Ensures existence of pages directory
    await this.ensureDir(moduleRoot + '/pages')

    // client/src/modules/resource/pages/list.vue
    await this.copyTemplate(
      this.templatePath('list_page.vue'),
      this.destinationPath(moduleRoot + '/pages/list.vue'),
      { schema, schemaOptions, api_actions, admin: false }
    )

    // client/src/modules/resource/pages/new/index.vue
    await this.copyTemplate(
      this.templatePath('new_page.vue'),
      this.destinationPath(moduleRoot + '/pages/new.vue'),
      { schema }
    )

    // client/src/modules/resource/pages/edit.vue
    await this.copyTemplate(
      this.templatePath('edit_page.vue'),
      this.destinationPath(moduleRoot + '/pages/edit.vue'),
      { schema }
    )

    // client/src/modules/resource/pages/show.vue
    await this.copyTemplate(
      this.templatePath('show_page.vue'),
      this.destinationPath(moduleRoot + '/pages/show.vue'),
      { schema }
    )

    // client/src/modules/resource/pages/admin.vue
    if (configuration.model_options[schema._id].generate_admin_page) {
      await this.copyTemplate(
        this.templatePath('list_page.vue'),
        this.destinationPath(moduleRoot + '/pages/admin.vue'),
        { schema, schemaOptions, api_actions, admin: true }
      )
    }

  }
};
