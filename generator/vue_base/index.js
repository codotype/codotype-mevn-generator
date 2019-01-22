module.exports = {
  name: 'VueBase',
  async write () {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('client')
    )

    await this.renderComponent({ src: 'README.md', dest: 'client/README.md' })
    await this.renderComponent({ src: 'package.json', dest: 'client/package.json' })
    await this.renderComponent({ src: 'LICENSE', dest: 'client/LICENSE' })
    await this.renderComponent({ src: 'public/index.html', dest: 'client/public/index.html' })
    await this.renderComponent({ src: 'src/App.vue', dest: 'client/src/App.vue' })

  }
}
