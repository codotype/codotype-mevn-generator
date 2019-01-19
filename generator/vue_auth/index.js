module.exports = {
  name: 'VueAuth',
  async write () {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('client/src/modules/auth')
    )

    await this.renderComponent({
      src: 'pages/register/index.vue',
      dest: 'client/src/modules/auth/pages/register/index.vue'
    })

    // await this.renderComponent({ src: 'src/App.vue', dest: 'client/src/App.vue' })

  }
}
