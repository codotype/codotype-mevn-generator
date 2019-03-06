module.exports = {
  name: 'MEVN-Readme',
  async write ({ configuration }) {

    // Pulls `generate_docker_compose` from configuration.options
    // const { generate_docker_compose } = configuration.options

    await this.renderComponent({ src: 'README.md', dest: 'README.md' })
    await this.renderComponent({ src: 'client.md', dest: 'frontend/README.md' })
    await this.renderComponent({ src: 'server.md', dest: 'backend/README.md' })

  }
}