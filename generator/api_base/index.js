module.exports = {
  name: 'NodeExpressBase',
  async write ({ blueprint }) {

    // Copies server base code
    await this.copyDir(
      this.templatePath(),
      this.destinationPath('backend')
    )

    const userSchema = blueprint.schemas.find(s => s.identifier === 'user')
    const inlineDeconstrction = userSchema.attributes.map(r => r.identifier).join(', ')

    await this.renderComponent({
      src: 'src/api/auth/auth.controller.js',
      dest: 'backend/src/api/auth/auth.controller.js',
      options: { inlineDeconstrction }
    })

    await this.renderComponent({ src: 'LICENSE', dest: 'backend/LICENSE' })
    await this.renderComponent({ src: 'package.json', dest: 'backend/package.json' })
  }
}
