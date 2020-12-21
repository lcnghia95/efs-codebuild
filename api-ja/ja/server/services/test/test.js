// const app = require('@server/server')

//models
// const reviewModel = app.models.Reviews


// utils
// const arrayUtil = app.utils.array
// const objectUtil = app.utils.object
// const stringUtil = app.utils.string

/**
 * test
 *
 * @param {Undefined}
 * @return {Undefined}
 * @public
 */
async function show() {
  if (process.env.NODE_ENV != 'local') {
    return {}
  }

  return {}
}

module.exports = {
  show
}
