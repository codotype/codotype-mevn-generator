module.exports = {
  name: 'NodeExpressEnvironment',
  async write () {
    await this.renderComponent({ src: 'env-dev.txt', dest: 'backend/.env' })
    await this.renderComponent({ src: 'env-test.txt', dest: 'backend/.env.test' })
    await this.renderComponent({ src: 'env-docker.txt', dest: 'backend/.env.docker' })
  }
}
