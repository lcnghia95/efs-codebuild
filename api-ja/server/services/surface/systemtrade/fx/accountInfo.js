const modelUtil = require('@server/utils/model')

async function getAccountInfoByIds(ids) {
  const conditions = {
    where: {
      IsValid: 1,
      Id: {
        inq: ids
      }
    },
    limit: 3,
    fields: {
      Id: true,
      Name: true,
      AccountDate: true,
      UserId: true,
      ModeId: true
    },
  }
  const accountList = await modelUtil.find('fx_account', '_info_account',
    conditions)

  return accountList.map((account) => ({
    id: account.Id,
    userId: account.UserId,
    accountDate: account.AccountDate,
    name: account.Name,
    modeId: account.ModeId,
  }))
}

module.exports = {
  getAccountInfoByIds,
}
