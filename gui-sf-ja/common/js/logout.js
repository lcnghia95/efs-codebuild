export default async function(app, auth, req, res) {
  let uid = parseInt(req.cookies['uid'] || '')
  if (auth == 'logout') {
    for (let i = 0; i < 4; i++) {
      try {
        await app.GoGoHTTP.get('/logout')
        break
      } catch (e) {
        if (i == 3) {
          throw e
        }
        console.log('Call logout error', e)
        await new Promise(resolve => {
          setTimeout(() => {
            console.log('Retry call logout after 7 seconds')
            resolve()
          }, 7e3)
        })
      }
    }
    if (!Number.isNaN(uid) && uid > 0) {
      res.clearCookie('csid')
    }
  }
}