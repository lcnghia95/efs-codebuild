const configs = require('@ggj/configs')

module.exports = async function() {
  const ggConfigs = await configs.getConfigs()
  configs.setEnvVariables(ggConfigs)
  this.options.env = ggConfigs

  return ggConfigs
}
