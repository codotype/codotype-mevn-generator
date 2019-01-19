module.exports = {
  name: 'VueAuth',
  async write ({ blueprint }) {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('client/src/modules/auth')
    )

    const userSchema = blueprint.schemas.find(s => s.identifier === 'user')

    // const requiredUserAttributes = userSchema.attributes.filter(r => r.required)
    const requiredUserAttributes = userSchema.attributes
    await this.renderComponent({
      src: 'pages/register/index.vue',
      dest: 'client/src/modules/auth/pages/register/index.vue',
      options: { requiredUserAttributes }
    })

    const inlineDeconstrction = requiredUserAttributes.map(r => r.identifier).join(', ')
    await this.renderComponent({
      src: 'store/actions.js',
      dest: 'client/src/modules/auth/store/actions.js',
      options: { inlineDeconstrction }
    })

  }
}
