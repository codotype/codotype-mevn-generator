
module.exports = {
  name: 'MEVN_APP',
  async write () {

    // Client
    await this.composeWith('./vue_base')
    await this.composeWith('./vue_auth')
    await this.composeWith('./vuex_store')
    await this.composeWith('./vue_navbar')
    await this.composeWith('./vue_store')
    await this.composeWith('./vue_router')
    await this.composeWith('./vue_pages')
    await this.composeWith('./vue_components')

    // Server
    await this.composeWith('./api_base')
    await this.composeWith('./api_environment')
    await this.composeWith('./api_resource')
    await this.composeWith('./api_routes')
    // await this.composeWith('./api_resource_spec')

    // Docs & Scripts
    await this.composeWith('./base_readmes')
    await this.composeWith('./base_scripts')

  }
}
