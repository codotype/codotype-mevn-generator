module.exports = {
  name: 'VueBase',
  async write () {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('client')
    )

    await this.renderComponent({ src: 'public/index.html', dest: 'client/public/index.html' })
    await this.renderComponent({ src: 'src/App.vue', dest: 'client/src/App.vue' })

  }
}
