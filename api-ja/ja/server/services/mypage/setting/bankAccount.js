const app = require('@server/server')
const syncService = require('@services/common/synchronize')
const userCommonService = require('@services/common/user')
const commonEmailV1 = require('@@services/common/emailv1')
const utils = app.utils
const slack = utils.slack
const userBankAccountModel = app.models.UserBankAccounts
const FxonInfoAffuserModel = app.models.FxonInfoAffuser
const FxonInfoDotmoneyAccountModel = app.models.FxonInfoDotmoneyAccount
const WEBHOOK_URL = process.env.PAYMENT_SLACK_WEBHOOK
const NORMAL_ACCOUNT_TYPE = 1
const DOT_MONEY_ACCOUNT_TYPE = 2
const BANK_TYPE_MAP = {
  1: 'bank',
  2: 'dotmoney',
}

/**
 * Get payment (bank account) of current user
 *
 * @param {Object} input
 * @param {Object} meta
 * @return {Promise<Array>}
 */
async function index(input, meta) {
  if (!meta.userId) {
    return []
  }

  const accounts = await userBankAccountModel.find({
    where: {
      userId: meta.userId,
      bankType: {
        inq: [1, 2],
      },
      statusType: {
        inq: [1, 2, 3],
      },
    },
    fields: utils.query.fields(
      'id,statusType,bankType,bankName,bankBranchName,accountType,' +
      'accountNumber,accountHolder,isDisplay,userId',
    ),
  })

  return accounts.reduce((obj, record) => {
    record = _businessMapping(record)

    if (record.isRepayment) {
      obj.isRepayment = 1
    }
    obj.data.push(_object(record))

    return obj
  }, {
    data: [],
  })
}

/**
 * Update/create bank account of current user
 *
 * @param {number} id
 * @param {Array} input
 * @param {object} meta
 * @return {Promise<object>}
 */
async function update(id, input, meta) {
  delete input.requestId
  const length = input.length
  const userId = meta.userId || 0

  if (userId == 0 || length > 3) {
    return
  }

  const inputData = _generateUpdateData(input, userId, meta.ipAddress, meta.userAgent)
  const oldData = await _generatePreUpdateData(userId)
  const dotmoneyInput = inputData.find(_isDotmoney)
  const notifyBankAccountChange = dotmoneyInput ? false : true
  const bankAccountNumber = await _updateBankAccount(inputData, oldData, userId, notifyBankAccountChange)

  _handleDotMoney(dotmoneyInput, oldData.find(_isDotmoney), userId, bankAccountNumber)
}

/**
 * Mapping specific business logic into given record
 *
 * @param {object} record
 * @return {object}
 * @private
 */
function _businessMapping(record) {
  const number = record.accountNumber
  const statusType = record.statusType
  const isDisplay = record.isDisplay

  if (number.length === 16) {
    record.accountNumber = number.slice(0, 4) +
      '-' +
      number.slice(4, 8) +
      '-' +
      number.slice(8, 12) +
      '-' +
      number.slice(12, 16)
  }

  if (statusType === 2 || statusType === 3) {
    if (!isDisplay) {
      return {}
    }
    record.isRepayment = 4 - statusType
  }

  return record
}

/**
 * Convert response object
 *
 * @param {object} record
 * @return {Object}
 * @private
 */
function _object(record) {
  return utils.object.nullFilter({
    id: record.id,
    type: record.bankType,
    name: record.bankName,
    branch: record.bankBranchName,
    accountType: record.accountType,
    number: record.accountNumber,
    holder: record.accountHolder,
    isRepayment: record.isRepayment || 0,
    isDisplay: record.isDisplay || 0,
  })
}

// -----------------------------------------------------------------------------

/**
 * Generate update data base on input data
 *
 * @param {array} input
 * @param {number} userId
 * @param {string} ipAddress
 * @param {string} userAgent
 * @return {object}
 * @private
 */
function _generateUpdateData(input, userId, ipAddress, userAgent) {
  const hasRepayment = _hasRepayment(input)
  return input.map(account => {
    const isRepayment = account.isRepayment
    let statusType = 0
    const accountNumber = (account.number || '').split('-').join('')

    // statusType 1:振り込みのみ、2:振り込みかつ返金用、3:返金用のみ
    if (_isDotmoney(account)) {
      statusType = 1
    } else if (hasRepayment) {
      statusType = isRepayment === 1 ? 3 : 1
    } else {
      statusType = isRepayment === 2 ? 2 : 1
    }

    return utils.object.nullFilter({
      isValid: 1,
      userId: userId,
      statusType,
      bankType: account.type || 1,
      bankName: account.name || '',
      bankBranchName: account.branch || '',
      accountType: account.accountType || 0,
      accountNumber,
      accountHolder: account.holder || '',
      isDisplay: account.isDisplay != undefined ? account.isDisplay : (statusType === 3 ? 1 : null),
      ipAddress,
      userAgent,
    })
  })
}

/**
 * Check if input data have repayment account information or not
 *
 * @param input
 * @return {boolean}
 * @private
 */
function _hasRepayment(input) {
  return input.find(account => {
    return account.isRepayment === 1
  }) && true
}

/**
 * Generate pre update (old) data of current user
 *
 * @param userId
 * @return {Promise<*>}
 * @private
 */
async function _generatePreUpdateData(userId) {
  return await userBankAccountModel.find({
    where: {
      userId: userId,
      isValid: {
        inq: [0, 1],
      },
    },
    fields: utils.query.fields(
      'id,isValid,statusType,bankType,bankName,bankBranchName,' +
      'accountType,accountNumber,accountHolder,isDisplay',
    ),
  })
}

/**
 * Update bank account of current user base on old and new data
 *
 * @param {Object} inputData
 * @param {Object} oldData
 * @param {number} userId
 * @param {Boolean} isNotify
 * @return {string}
 * @private
 */
async function _updateBankAccount(inputData, oldData, userId, isNotify = true) {
  const inputRecord = inputData.find(account => account.bankType == NORMAL_ACCOUNT_TYPE)
  const oldRecord = oldData.find(account => account.bankType == NORMAL_ACCOUNT_TYPE)
  const accountNumber = (inputRecord || {}).accountNumber || ''
  let notify = 0

  if (inputRecord && !oldRecord) {
    notify = 1
    const record = await _create(inputRecord, userId)
    _syncBankAccount(record.id)
  } else if (!inputRecord && oldRecord) {
    await _remove(oldRecord)
    _syncBankAccount(oldRecord.id, true)
  } else if (inputRecord && oldRecord) {
    const keys = ['isValid', 'bankType', 'bankName', 'bankBranchName',
      'accountType', 'accountNumber', 'accountHolder',
    ]
    if (keys.find(key => inputRecord[key] != oldRecord[key])) {
      notify = 1
      await _update(oldRecord.id, inputRecord)
      _syncBankAccount(oldRecord.id)
    }
  }

  if (isNotify && notify == 1) {
    _sendSlackNotify(accountNumber, NORMAL_ACCOUNT_TYPE, userId)
  }
  
  return accountNumber
}

/**
 * Check if account is dotmoney or not
 *
 * @param {Object} account
 * @return {Boolean}
 * @private
 */
function _isDotmoney(account) {
  return account.bankType == DOT_MONEY_ACCOUNT_TYPE
}

/**
 * Check and update dotmoney account
 *
 * @param {Object} inputData
 * @param {Object} oldData
 * @param {number} userId
 * @param {string} bankAccountNumber
 * @return {void}
 * @private
 */
function _handleDotMoney(inputRecord, oldRecord, userId, bankAccountNumber) {
  const accountNumber = (inputRecord || {}).accountNumber || ''
  let notify = 0
  if (!inputRecord && oldRecord && oldRecord.isValid == 1) {
    notify = 2
    _remove(oldRecord)
    _syncDotmoney(userId, '', true)
  } else if (inputRecord && !oldRecord) {
    notify = 1
    _create(inputRecord, userId)
    _syncDotmoney(userId, accountNumber)
  } else if (inputRecord && oldRecord) {
    const keys = ['isValid', 'accountNumber', 'isDisplay']
    if (keys.find(key => inputRecord[key] != oldRecord[key])) {
      if (inputRecord['isDisplay'] == 0 && oldRecord['isDisplay'] == 1) {
        notify = 2
      } else {
        notify = 1
      }
      _update(oldRecord.id, inputRecord)
      _syncDotmoney(userId, accountNumber)
    }
  }
  if (notify == 1) {
    _sendSlackNotify(accountNumber, DOT_MONEY_ACCOUNT_TYPE, userId)
  } else if (notify == 2) {
    if (bankAccountNumber.length > 0) {
      _sendSlackNotify(bankAccountNumber, NORMAL_ACCOUNT_TYPE, userId)
    }
  }
}

/**
 * Sync bank account data to fx-on
 *
 * @param {number} id
 * @param {Boolean} isDelete
 * @return {void}
 * @private
 */
function _syncBankAccount(id, isDelete = false) {
  syncService.syncDataToFxon('user_bank_accounts', id, {
    is_valid: isDelete ? 0 : 1,
  })
}

/**
 * Check and update dotmoney account for fx-on DB
 *
 * @param {number} userId
 * @param {number} accountNumber
 * @param {Boolean} isDelete
 * @return {void}
 * @private
 */
async function _syncDotmoney(userId, accountNumber, isDelete = false) {
  const now = Date.now()
  const oldPartnerId = userCommonService.oldPartnerId(userId)
  let [fxonRecord, affUserRecord] = await Promise.all([
    FxonInfoDotmoneyAccountModel.findOne({
      where: {
        UserId: oldPartnerId,
        ModeId: 3,
        IsValid: {
          inq: [0, 1],
        },
      },
      fields: {
        Id: true,
      },
    }),
    FxonInfoAffuserModel.findOne({
      where: {
        id: oldPartnerId,
        isvalid: 1,
      },
      fields: {
        id: true,
        banktype: true,
      },
    }),
  ])

  const affUserData = { updateddate: now }

  if(!affUserRecord) {
    affUserData.id = oldPartnerId
    affUserData.isvalid = 1
    affUserData.createddate = now
  }

  // Delete
  if (isDelete && fxonRecord && fxonRecord.IsValid != 0) {
    fxonRecord.IsValid = 0
    fxonRecord.Account = ''
    fxonRecord.UpdatedDate = now
    FxonInfoDotmoneyAccountModel.upsert(fxonRecord)
    affUserData.banktype = 0
    if(affUserRecord) {
      affUserRecord.updateAttributes(affUserData)
    } else {
      FxonInfoAffuserModel.create(affUserData)
    }
    return
  }

  // Init for insert
  if (!fxonRecord) {
    fxonRecord = {}
    fxonRecord.UserId = oldPartnerId
    fxonRecord.CreatedDate = now
  }

  // Insert & Update
  fxonRecord.IsValid = 1
  fxonRecord.ModeId = 3
  fxonRecord.Account = utils.crypto.encrypt(accountNumber)
  fxonRecord.UpdatedDate = now
  FxonInfoDotmoneyAccountModel.upsert(fxonRecord)
  // Special log for banktype
  //    Have dotmoney → banktype = 1
  //    No dotmoney → banktype = 0

  affUserData.banktype = 1
  if(affUserRecord) {
    affUserRecord.updateAttributes(affUserData)
  } else {
    FxonInfoAffuserModel.create(affUserData)
  }
}

/**
 * Create new bank account
 *
 * @param {Object} account
 * @param {Number} userId
 * @return {void}
 * @private
 */
async function _create(account, userId) {
  const res = await userBankAccountModel.create(account)
  if(res) {
    const user = await userCommonService.getUser(userId, {
      id: true,
      firstName: true,
      lastName: true,
      mailAddress: true,
      languages: true,
    })
    const content = {
      user_id: userId,
      last_name: user.lastName || '',
      first_name: user.firstName || '',
    }
    commonEmailV1.sendByUserId(user.id, content, 29, user.languages || 1)
  }
  return res
}

/**
 * Update bank account
 *
 * @param {number} id
 * @param {Object} account
 * @return {void}
 * @private
 */
function _update(id, account) {
  userBankAccountModel.updateAll({
    // MEMO: cannot ignore this condition isValid: {inq: [0, 1]}
    isValid: {
      inq: [0, 1],
    },
    id,
  }, account)
}

/**
 * Create new bank account
 *
 * @param {Object} account
 * @param {number} userId
 * @return {void}
 * @private
 */
function _remove(account) {
  userBankAccountModel.updateAll({
    id: account.id,
  }, {
    isValid: 0,
    isDisplay: 0,
    accountType: 0,
    accountNumber: '',
    accountHolder: '',
    bankName: '',
    bankBranchName: '',
  })
}

/**
 * Send notify to slack for changed bank accounts
 *
 * @param {object} account
 * @param {number} userId
 * @return {void}
 * @private
 */
function _sendSlackNotify(accountNumber, bankType, userId) {
  const slackText = `*お客様が口座情報を変更しました。*
  - *user_id*: ${userId}
  - *bank_type*: ${BANK_TYPE_MAP[bankType]}
  - *account_number*: ${accountNumber || ''}
  - *update_at*: ${utils.time.sqlDate()}`

  slack.send(slackText, null, WEBHOOK_URL)
}

module.exports = {
  index,
  update,
}
