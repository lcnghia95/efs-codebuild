const app = require('@server/server')
const service = require('@server/services/labo/notifications')

async function markViewed(req, res) {
  try {
    res.json({
      numUpdated: await service.markViewed(
        req.body.ids,
        req.query.isSystem == 1
          ? service.NOTIF_TYPE.SYSTEM
          : service.NOTIF_TYPE.ARTICLE,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function storeSystemNotif(req, res) {
  try {
    res.json(await service.storeSystemNotif(req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getNotifications(req, res) {
  try {
    res.json(await service.getNotifications(
      req.query,
      req.query.isSystem == 1
        ? service.NOTIF_TYPE.SYSTEM
        : service.NOTIF_TYPE.ARTICLE,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countNewNotifications(req, res) {
  try {
    res.json(await service.countNewNotifications(
      req.query.isSystem == 1
        ? service.NOTIF_TYPE.SYSTEM
        : service.NOTIF_TYPE.ARTICLE,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  markViewed,
  storeSystemNotif,
  getNotifications,
  countNewNotifications,
}
