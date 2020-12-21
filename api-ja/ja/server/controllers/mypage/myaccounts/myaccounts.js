const app = require('@server/server')
const service = require('@services/mypage/myaccounts/myaccounts')
const meta = app.utils.meta

async function index(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.index(userId))
}
async function license(req, res) {
  const {
    userId,
    langType,
  } = _metaInfo(req)

  if (userId == 0) {
    res.json({})
    return
  }

  res.json(await service.license(userId, langType))
}

async function create(req, res) {
  const metaOpt = meta.meta(req, ['ipAddress', 'userAgent'])
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.create(req.body, metaOpt))
}
async function update(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.update(req.body))
}

async function deleteLicense(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.deleteLicense(req.body))
}
async function deleteMagicNumber(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.deleteMagicNumber(req.params.id))
}
async function updateMagicNumber(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.updateMagicNumber(req.body))
}

async function updateRelatedProducts(req, res) {
  const userId = _userId(req)
  if (userId === 0) {
    res.json({})
    return
  }
  const newBody = req.body
  res.json(await service.updateRelatedProducts(newBody))
}
async function createMagicNumber(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.createMagicNumber(req.body.accountId))
}

async function getRealTradeEmails(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }

  res.json(await service.getRealTradeEmails(userId))
}

async function editRealTradeEmail(req, res) {
  const metaData = meta.meta(req, ['userId', 'ipAddress', 'userAgent'])
  const email = req.body.email || {}
  const accounts = req.body.accounts || []
  if (!metaData.userId || (!email.mailAddress && !accounts.length)) {
    res.json({})
    return
  }

  res.json(await service.editRealTradeEmail(metaData, email, accounts))
}

async function getNotifyAccounts(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await service.getNotifyAccounts(userId))
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  const {
    userId,
  } = meta.meta(req, ['userId'])
  return userId || 0
}

/**
 * Get meta info from request
 *
 * @returns {object}
 */
function _metaInfo(req) {
  const {
    userId,
    langType,
  } = meta.meta(req, ['userId', 'langType'])

  return  {
    userId,
    langType,
  }
}

module.exports = {
  index,
  license,
  create,
  update,
  deleteLicense,
  createMagicNumber,
  deleteMagicNumber,
  updateMagicNumber,
  updateRelatedProducts,
  getRealTradeEmails,
  editRealTradeEmail,
  getNotifyAccounts,
}
