const app = require('@server/server')
const service = require('@server/services/blog/file')
const multer = require('multer')
const mkdirp = require('mkdirp')

/**
 * Multer config for using disk storage instead memory storage (ram)
 * Use disk storage because we need to storage a lot of large file, so memory storage  can't be enough capacity
 */
const diskStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    mkdirp('./server/storage/tmp', function () {
      cb(null, './server/storage/tmp')
    })
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const multerUpload = multer({ storage: diskStorage }).single('file')

/**
 * Get all file current user
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function index(req, res) {
  try {
    res.json(await service.index(app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

/**
 * Upload given img into img server
 *
 * @param req
 * @param res
 */
async function upload(req, res) {
  multerUpload(req, res, async function(err) {
    if (err) {
      return res.sendStatus(500)
    }

    try {
      res.json(await service.upload(req.file, app.utils.meta.meta(req, ['userId'])))
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  })
}

module.exports = {
  index,
  upload,
}
