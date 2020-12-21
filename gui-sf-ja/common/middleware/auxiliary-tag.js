import {decrypt} from '@@/../utils/crypto'
export default function({ req, res, error }) {
  if (req && req.query.auxTag) {
    const aidCookie = req.cookies['aid'] || ''
    const refCookie = req.cookies['ref'] || ''

    const enTag = req.query.auxTag
    try {
      const deAuxiliryTag = decrypt(enTag)
      const seperateCharacterIndex = deAuxiliryTag.indexOf('_')
      const aid = parseInt(deAuxiliryTag.substr(0, seperateCharacterIndex + 1))
      const referer = deAuxiliryTag.substr(seperateCharacterIndex + 1)

      let opt = {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 2592000000), // 30 days
      }

      if (aid !== aidCookie)
        res.cookie('aid', aid, opt)
      if (referer !== refCookie)
        res.cookie('ref', referer, opt)
    } catch (e) {
      return error({ statusCode: 404 })
    }
  }
  // OAM-19449: force to override aid cookie
  if (req.query.utm_source) {
    res.clearCookie('ref') //OAM-22123: delete ref cookie with utm_source parameter
    res.cookie('aid', 1, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 2592000000), // 30 days
    })
  }

  // Forced affiliate user to GGJ (120001) with src parameter
  // https://gogojungle.backlog.jp/view/OAM-28291
  if (req.query.src) {
    res.cookie('aid', 1, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 2592000000), // 30 days
    })
  }
}
