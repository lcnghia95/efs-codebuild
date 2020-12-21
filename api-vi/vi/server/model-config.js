const aspConfig = require('./configs/model_configs/asp')
// const authConfig = require('./configs/model_configs/auth')
// const blogConfig = require('./configs/model_configs/blog')
const commonConfig = require('./configs/model_configs/common')
// const companiesConfig = require('./configs/model_configs/companies')
// const crowdsourcingConfig = require('./configs/model_configs/crowdsourcing')
// const eventsConfig = require('./configs/model_configs/events')
// const logsConfig = require('./configs/model_configs/logs')
const masterConfig = require('./configs/model_configs/master')
// const naviConfig = require('./configs/model_configs/navi')
const privacyConfig = require('./configs/model_configs/privacy')
// const salonsConfig = require('./configs/model_configs/salons')
const surfacesConfig = require('./configs/model_configs/surfaces')
// const videosConfig = require('./configs/model_configs/videos')

const meta = {
  _meta: {
    sources: [
      'loopback/common/models',
      'loopback/server/models',
      // './models/events',
      './models/common',
      './models/privacy',
      './models/master',
      './models/surfaces',
      // './models/companies',
      './models/fxonAsp',
      // './models/navi',
      // './models/blog',
      // './models/logs',
      // './models/salons',
      // './models/videos',
      // './models/crowdsourcing',
    ],
    mixins: [
      'loopback/common/mixins',
      'loopback/server/mixins',
      '../common/mixins',
      './mixins',
    ],
  },
}

module.exports = Object.assign(
  {},
  meta,
  aspConfig,
  // authConfig,
  // blogConfig,
  commonConfig,
  // companiesConfig,
  // crowdsourcingConfig,
  // eventsConfig,
  // logsConfig,
  masterConfig,
  // naviConfig,
  privacyConfig,
  // salonsConfig,
  surfacesConfig,
  // videosConfig,
)
