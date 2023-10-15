export class TemplateData {
  constructor ({
    template,
    globalVars,
    siteData
  }) {
    Object.assign(this, template)
    this.globalVars = globalVars
    this.siteData = siteData
  }

  async resolveVars () {
    const {
      globalVars,
      siteData
    } = this

    const finalVars = {
      siteData,
      template: this,
      ...globalVars
    }

    return finalVars
  }
}
