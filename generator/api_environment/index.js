module.exports = {
  name: 'NodeExpressEnvironment',
  async write () {
    await this.renderComponent({ src: 'env-dev.txt', dest: 'server/.env' })
    await this.renderComponent({ src: 'env-docker.txt', dest: 'server/.env.docker' })
  }
}
