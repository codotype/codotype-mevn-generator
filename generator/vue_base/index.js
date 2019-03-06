module.exports = {
  name: 'VueBase',
  async write () {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('frontend')
    )

    await this.renderComponent({ src: 'package.json', dest: 'frontend/package.json' })
    await this.renderComponent({ src: 'LICENSE', dest: 'frontend/LICENSE' })
    await this.renderComponent({ src: 'public/index.html', dest: 'frontend/public/index.html' })
    await this.renderComponent({ src: 'src/App.vue', dest: 'frontend/src/App.vue' })

  }
}
