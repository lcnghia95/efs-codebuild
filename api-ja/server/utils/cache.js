const path = require('path')
const mkdirp = require('mkdirp')
const CachemanFile = require('cacheman-file')
const CachemanMemory = require('cacheman-memory')
const crypto = require('crypto')

/**
 * Singleton cache instance and functions of it
 *
 * @return {{
 *    set: set,
 *    get: get,
 *    has: has,
 *    remove: remove
 * }}
 */
const cache = function () {
  /**
   * Cache singleton instance
   * @type {subject}
   */
  let instance = null

  /**
   * Init cache engine
   *
   * @private
   */
  function _init() {
    instance = _cacheEngineFactory(process.env.CACHE_ENGINE)
  }

  /**
   * Get cache engine base on given engine name
   *
   * @param {string} engine
   * @return {subject}
   * @private
   */
  function _cacheEngineFactory(engine) {
    if (engine == 'file') {
      let cachePath = path.join(__dirname, '../storage/cache')
      // Create file cache directory if it doesn't yet exist
      mkdirp.sync(cachePath)
      return new CachemanFile({ tmpDir: cachePath })
    } else {
      return new CachemanMemory()
    }
  }

  /**
   * Check for turn on/off cache
   *
   * @return {boolean}
   * @private
   */
  function _checkTurnOnCache() {
    return process.env.CACHE_ENABLE === 'true'
  }

  /**
   * Set new cache
   *
   * @param key
   * @param value
   * @param {number} time
   * @return {Promise<Object>}
   */
  async function set(key, value, time = 60) {
    // If cache was turn off, do nothing
    if (!_checkTurnOnCache()) {
      return { status: 0 }
    }

    // Init cache engine if it isn't init yet
    !instance && _init()

    // Promisify because library doesn't support promise
    return new Promise(((resolve, reject) => {
      // Set the value
      instance.set(key, value, time, function (error) {
        if (error) return reject(error)

        resolve({ status: 1 })
      })
    }))
  }

  /**
   * Get specific cached data
   *
   * @param key
   * @return {Promise<*>}
   */
  async function get(key) {
    // If cache was turn off, do nothing
    if (!_checkTurnOnCache()) {
      return null
    }

    // Init cache engine if it isn't init yet
    !instance && _init()

    // Promisify because library doesn't support promise
    return new Promise(((resolve, reject) => {
      instance.get(key, function (error, value) {
        if (error) return reject(error)

        resolve(value)
      })
    }))
  }

  /**
   * Check whenever specific key was cached
   *
   * @param key
   * @return {Promise<boolean>}
   */
  async function has(key) {
    // If cache was turn off, do nothing
    if (!_checkTurnOnCache()) {
      return false
    }

    // Init cache engine if it isn't init yet
    !instance && _init()

    // Promisify because library doesn't support promise
    return new Promise(((resolve, reject) => {
      instance.get(key, function (error, value) {
        if (error) return reject(error)

        resolve(!value ? false : true)
      })
    }))
  }

  /**
   * Remove specific keys
   *
   * @param key
   * @return {Promise<Object>}
   */
  async function remove(key) {
    // If cache was turn off, do nothing
    if (!_checkTurnOnCache()) {
      return { status: 0 }
    }

    // Init cache engine if it isn't init yet
    !instance && _init()

    // Promisify because library doesn't support promise
    return new Promise(((resolve, reject) => {
      instance.del(key, function (err) {
        if (err) return reject(err)

        resolve({ status: 1 })
      })
    }))
  }

  /**
   * Remove specific keys
   *
   * @return {Promise<Object>}
   */
  async function clear() {
    // If cache was turn off, do nothing
    if (!_checkTurnOnCache()) {
      return { status: 0 }
    }

    // Init cache engine if it isn't init yet
    !instance && _init()

    // Promisify because library doesn't support promise
    return new Promise(((resolve, reject) => {
      instance.clear(function (err) {
        if (err) return reject(err)

        resolve({ status: 1 })
      })
    }))
  }

  /**
   * Get fingerprint current request
   *
   * @param reqUrl
   * @return {string}
   * @private
   */
  function fingerprint(reqUrl, reqHeaders) {
    let key = reqUrl
    if (reqHeaders.platform === 'mobile') {
      key += reqHeaders.platform
    }
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex')
  }

  return {
    set,
    get,
    has,
    remove,
    clear,
    fingerprint,
  }
}

module.exports = cache()
