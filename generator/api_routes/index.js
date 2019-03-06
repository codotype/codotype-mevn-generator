module.exports = {
  name: 'NodeExpressRouter',
  async write () {
    await this.renderComponent({ src: 'routes.js', dest: 'backend/src/routes.js' })
  }
}
