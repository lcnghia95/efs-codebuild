const fs = require('fs')
const formData = require('form-data')
const path = require('path')
const multer = require('multer')
const mkdirp = require('mkdirp')
const parseUrl = require('url').parse

/**
 * Multer config for using disk storage instead of storing entire files on memory (ram)
 */
const diskStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    mkdirp('./server/storage/tmp', function (err) {
      err && console.log('multer upload failed: ', err)
      cb(null, './server/storage/tmp')
    })
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
  }
})
const multerUpload = multer({ storage: diskStorage }).single('file')
const multerUploadMul = multer({ storage: diskStorage }).array('file')

/**
 * Delete given file if it was exist
 *
 * @param file
 * @returns {Promise<void>}
 * @private
 */
async function _deleteFile(file) {
  fs.unlink(file.path, error => {
    if (error) {
      console.log(
        `Error to delete file by path: ${file.path}. ${error.message}`
      )
    }
  })
}

/**
 * Upload a file/image to storage server
 * @param {*} file
 * @param {*} uploadPath: 'path/to/file/'
 * @param {*} isImg
 * @returns {Promise<Object>}
 */
async function upload(file, uploadPath, isImg = false) {
  if (!_validate(file, isImg)) {
    _deleteFile(file)
    return {}
  }

  let form = new formData(),
    destinationPath = (
      isImg
        ? process.env.IMG_HOST_URL
        : process.env.FILE_HOST_URL + 'upload/'
    ) + uploadPath,
    config = parseUrl(destinationPath),
    options = {
      port: config.port,
      path: config.pathname,
      host: config.hostname,
      protocol: config.protocol,
      headers: !isImg ? {} : {
        [process.env.IMG_ACCESS_KEY]: process.env.IMG_ACCESS_VALUE
      }
    }
  return new Promise((resolve, reject) => {
    form.append('file', fs.createReadStream(file.path), file.originalname)
    form.submit(options, function(err, res) {
      _deleteFile(file)
      if (err) {
        console.log('Submit file to file server failed: ', err)
        return reject(err)
      }

      let body = ''
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', async function() {
        try {
          let responseData = JSON.parse(body)
          responseData.url = '/' + uploadPath + '/' + responseData.number
          resolve(responseData)
        } catch (e) {
          reject(e)
        }
      })
    })
  })
}

/**
 * Validate image/file
 *
 * @param file
 * @param userId
 * @returns {boolean}
 * @private
 */
async function _validate(file, isImg) {
  let maxSize = isImg ? 3e7 : 5e6, // img: 30 MB, file: 5MB
    fileName = !file ? '' : file.originalname,
    fileSize = !file ? 0 : file.size,
    filtered = (
      isImg
        ? ['.png', '.jpg', '.bmp', '.gif', '.jpeg']
        : ['pdf', 'zip', 'rar']
    )
      .filter(
        ext => {
          path.extname(fileName).toLowerCase().includes(ext)
        })

  return filtered.length === 1 && fileSize <= maxSize
}

module.exports = {
  multerUpload,
  multerUploadMul,
  _deleteFile,
  upload,
}
