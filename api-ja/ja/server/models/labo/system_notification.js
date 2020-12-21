module.exports = function (SystemNotification) {
  SystemNotification.observe('before delete', async function (ctx) {
    await ctx.Model.app.models.SystemNotifUser.destroyAll({
      notificationId: ctx.where.id
    })
  })

  // TODO: create records in SystemNotifUser model
  // SystemNotification.observe('after save', async function (ctx) {
  //   if (!ctx.isNewInstance) {
  //     return
  //   }
  //   let laboUsers = await ctx.Model.app.models.Users.find({
  //       where: {
  //         isLaboUser: 1,
  //         isValid: 1,
  //       },
  //       fields: { id: true }
  //     }),
  //     newRecords = laboUsers.map(user => {
  //       return {
  //         userId: user.id,
  //         notificationId: ctx.instance.id
  //       }
  //     })
  //   console.log('SystemNotif onCreated, users list: ', newRecords)
  //   // need await?
  //   ctx.Model.app.models.SystemNotifUser.create(newRecords)
  // })
}
