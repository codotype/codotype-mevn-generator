module.exports = {
  name: 'VueAuth',
  async write ({ blueprint }) {

    await this.copyDir(
      this.templatePath(),
      this.destinationPath('frontend/src/modules/auth')
    )

    const userSchema = blueprint.schemas.find(s => s.identifier === 'user')

    // const requiredUserAttributes = userSchema.attributes.filter(r => r.required)
    const requiredUserAttributes = userSchema.attributes
    await this.renderComponent({
      src: 'pages/register/index.vue',
      dest: 'frontend/src/modules/auth/pages/register/index.vue',
      options: { requiredUserAttributes }
    })

    // TODO - make inlineDeconstruction a helper function
    const inlineDeconstrction = requiredUserAttributes.map(r => r.identifier).join(', ')
    await this.renderComponent({
      src: 'store/index.js',
      dest: 'frontend/src/modules/auth/store/index.js',
      options: { inlineDeconstrction }
    })

  }
}
