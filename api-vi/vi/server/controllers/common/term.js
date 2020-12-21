const term = require('@services/term/term')
const metaUtil = require('@@server/utils/meta')

async function privacy(req, res) {
  try {
    res.json(await term.privacy())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function service(req, res) {
  try {
    res.json(await term.service())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function display(req, res) {
  try {
    res.json(await term.display())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function affiliate(req, res) {
  try {
    res.json(await term.affiliate())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function operation(req, res) {
  try {
    res.json(await term.operation())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function transaction(req, res) {
  try {
    res.json(await term.transaction())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function crowdsourcing(req, res) {
  try {
    res.json(await term.crowdsourcing())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function index(req, res) {
  try {
    const userId = _userId(req)
    res.json(await term.index(userId, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function contract(req, res) {
  try {
    const userId = _userId(req)
    res.json(await term.contract(userId, req.params.id, req.params.saleId, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function user(req, res) {
  res.json(await term.user())
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  const {
    userId,
  } = metaUtil.meta(req, ['userId'])
  return userId || 0
}

module.exports = {
  privacy,
  service,
  display,
  affiliate,
  operation,
  transaction,
  crowdsourcing,
  index,
  contract,
  user,
}
