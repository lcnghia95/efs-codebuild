const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonEmailV1 = require('@@services/common/emailv1')
const commonAuth = require('@services/common/auth')
const syncService = require('@services/common/synchronize')
const salesService = require('@services/common/sale')

const arrayUtil = require('@ggj/utils/utils/array')

// Models
const userModel = app.models.Users
const userLoginModel = app.models.UserLogin
const userEmailAddressesModel = app.models.UserEmailAddresses
const userWithdrawalModel = app.models.UserWithdrawal
const webAuthModel = app.models.WebAuthAccounts
const saleModel = app.models.Sales

async function withdraw(input, meta) {
  const user = await _getUser(meta.userId)
  const err = await _validate(user)
  const userId = meta.userId

  if (err) {
    return err
  }

  commonAuth.revokeUser(input.requestId)
  await Promise.all([
    _sendEmail(user),
    _deleteUser(userId),
    _deleteUserLogin(userId),
    _deleteEmail(userId),
    _updateSalesData(userId),
    _updateWebAuthData(userId),
    _createUserWithdrawal(input, userId),
  ])

  return {code: 200}
}

async function _getUser(userId) {
  return await commonUser.getUser(userId, {
    id: true,
    isBuyuser: true,
    isDeveloper: true,
    isAffiliate: true,
    isMarchant: true,
    mailAddress: true,
    nickName: true,
    lastName: true,
    firstName: true,
    languages: true,
  })
}

async function _validate(user) {
  if (!user) {
    return {code: 400}
  }

  if (user.isMarchant) {
    return {code: 'E40004'}
  }

  if (user.isDeveloper && await _isHasSoldProduct()) {
    return {code: 'E40005'}
  }

  if (user.isAffiliate && (await _isUnPaid() || await _isHasSoldProduct())) {
    return {code: 'E40006'}
  }

  return null
}

async function _isUnPaid() {
  // TODO
  return false
}

async function _isHasSoldProduct() {
// TODO
  return false
}

async function _createUserWithdrawal(input, userId) {
  await userWithdrawalModel.create({
    isValid: 1,
    userId,
    withdrawalAt: Date.now(),
    reason: input.reason || null,
  })
}

async function _deleteUser(userId) {
  await userModel.updateAll({
    id: userId,
  }, {
    isValid: 0,
    statusType: 0,
  })
  syncService.syncDataToFxon('users', userId, {
    is_valid: 0,
  })
}

async function _deleteUserLogin(userId) {
  await userLoginModel.updateAll({
    userId,
  }, {
    isValid: 0,
    statusType: 0,
  })
}

async function _deleteEmail(userId) {
  await userEmailAddressesModel.destroyAll({
    userId,
  })
}

async function _updateSalesData(userId) {
  const sales = await saleModel.find({
    where: {
      userId,
    },
    fields: {id: true},
  })

  if(!sales.length) {
    return
  }

  const saleIds = arrayUtil.column(sales, 'id', true)
  const data = [
    {
      ids: saleIds,
      data: {status_type: 4},
    },
  ]
  // Update sale data use new service
  salesService.updateSalesViaNewService(data)
}

async function _updateWebAuthData(userId) {
  await webAuthModel.updateAll({
    userId,
  }, {
    isValid: 0,
  })
}

async function _sendEmail(user) {
  // Must send by email address, because this account probably
  // has been remove
  await commonEmailV1.send(user.mailAddress, {
    user_id: user.id,
    last_name: user.lastName || '',
    first_name: user.firstName || '',
    nick_name: user.nickName,
  }, 8, user.languages)
}

module.exports = {
  withdraw,
}
