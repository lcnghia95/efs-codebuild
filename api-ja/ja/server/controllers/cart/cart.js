'use strict'

const app = require('@server/server')
const cartService = require('@services/cart/cart')
const headerService = require('@services/cart/header')
const completeService = require('@services/cart/complete')

/**
 * Get meta information from request header
 *
 * @returns {Object}
 * @private
 */
function _meta(req, res, option = {}) {
  const affiliateInformation = option.affiliate ?
      headerService.affiliateInformation(req) : {}

    const fields = option.client ? ['userId', 'ipAddress', 'referer', 'userAgent'] :
      ['userId']

  if (option.langType) {
    fields.push('langType')
  }

  return Object.assign(
    app.utils.meta.meta(req, fields), {
      cartSessionId: headerService.cartSessionId(req, res),
    },
    affiliateInformation,
  )
}

/**
 * Add a product to cart
 * @public
 */
async function add(req, res) {
  const meta = _meta(req, res, {
    langType: true,
    affiliate: true,
  })
  res.json(await cartService.add(
    req.params.pId,
    meta,
    req.query,
  ))
}

/**
 * Get cart index data
 * @public
 */
async function index(req, res) {
  res.json(await cartService.index(_meta(req, res, {langType: true})))
}

/**
 * Remove a product from cart
 * @public
 */
async function remove(req, res) {
  res.json(await cartService.remove(req.params.pId, _meta(req, res, {langType: true})))
}

/**
 * Edit a product in cart
 * @public
 */
async function edit(req, res) {
  res.json(await cartService.edit(
    req.params.pId,
    req.body,
    _meta(req, res, {langType: true}),
  ))
}

/**
 * Select payment method, dvd option
 * @public
 */
async function select(req, res) {
  const input = res.body || {}
    const option = {
      maxAge: 3600,
      httpOnly: true,
    }
  res.cookie('cpayid', input.payId || 0, option)
  res.cookie('cdvdoption', input.dvdOption || 0, option)
  res.send()

  console.info('CART SELECT %j', input)
}

/**
 * Get cart confirm data
 * @public
 */
async function confirm(req, res) {
  const [dvdOption, payId] = [
    headerService.dvdOption(req),
    headerService.payId(req),
  ]
  res.json(await cartService.confirm(
    payId,
    dvdOption,
    _meta(req, res, {langType: true}),
  ))
}

/**
 * Checkout and process payment
 *
 * @public
 */
async function checkout(req, res) {
  const payId = headerService.payId(req)
    const meta = _meta(req, res, {
      client: true,
      langType: true,
    })
    const dvdOpt = headerService.dvdOption(req)
  meta.storeId = req.body.storeId
  const json = await cartService.checkout(
    req.body.userInfo || {},
    payId,
    dvdOpt,
    meta,
  )
  console.info('CART CHECKOUT %O', {
    meta,
    data: json || 'null',
    payId,
    dvdOpt,
  })
  headerService.postCheckoutHandler(res)
  res.json(json)
}

/**
 * Get sales information
 *
 * @public
 */
async function complete(req, res) {
  const meta = app.utils.meta.meta(req, ['userId'])
    const sessionId = req.body.sessionId
    const info = {
      userId: meta.userId,
      sessionId,
    }
  console.info('CART COMPLETE info %j', info)
  const json = await completeService.index(meta.userId, sessionId)
  console.info('CART COMPLETE CONTROLLER %j', json)
  res.json(json)
}

/**
 * Remove all salons product from cart
 * @public
 */
async function removeSalons(req, res) {
  await cartService.removeSalons(_meta(req, res))
  res.json({})
}

/**
 * Remove all salons product from cart
 * @public
 */
async function rollback(req, res) {
  const meta = app.utils.meta.meta(req, ['userId'])
  await cartService.rollback(meta.userId, req.body.sessionId)
  res.json({})
}

/**
 * Add userId to cart after login
 * @public
 */
async function sync(req, res) {
  res.json(await cartService.sync(_meta(req, res)))
}

async function alsoBought(req, res) {
  res.json(await cartService.alsoBought(_meta(req, res)))
}

module.exports = {
  index,
  add,
  edit,
  sync,
  remove,
  select,
  confirm,
  checkout,
  rollback,
  complete,
  removeSalons,
  alsoBought,
}
