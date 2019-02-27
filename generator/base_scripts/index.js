module.exports = {
  name: 'MEVN-Scripts',
  async write ({ configuration }) {
    await this.renderComponent({ src: 'package.json', dest: 'package.json' })
  }
}