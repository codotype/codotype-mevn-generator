module.exports = {
  name: 'MEVN-Scripts',
  async write ({ configuration }) {
    await this.renderComponent({ src: 'package.json', dest: 'package.json' })
    await this.renderComponent({ src: '.markdownlintrc', dest: '.markdownlintrc' })

    if (configuration.deployment.netlify) {
      await this.renderComponent({ src: 'netlify.toml', dest: 'netlify.toml' })
    }
  }
}