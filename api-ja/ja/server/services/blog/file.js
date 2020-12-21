const app = require('@server/server')
const fs = require('fs')
const formData = require('form-data')
const fileModel = app.models.Files

async function index(meta) {
  return await fileModel.find({
    where: {
      fileCategoryId: 6,
      masterId: meta.userId,
    },
    fields: {id: true, fileName: true, fileNumber: true, createdAt: true}
  })
}

/**
 * Upload a new image
 *
 * @param input
 * @param file
 * @param meta
 * @returns {Promise<Object>}
 */
async function upload(file, meta) {
  let userId = meta.userId
  if (!_validate(file) || userId === 0) {
    _deleteFile(file)
    return {}
  }

  let form = new formData(),
    fileServerUrl = process.env.FILE_HOST_URL

  return new Promise(((resolve, reject) => {
    form.append('file', fs.createReadStream(file.path), file.originalname)
    form.submit(fileServerUrl + 'upload/blog/user/' + userId, function(err, res) {
      _deleteFile(file)
      if (err) {
        return reject(err)
      }

      let body = ''
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', async function() {
        body = JSON.parse(body)
        resolve({
          number: body,
        })
      })
    })
  }))
}

/**
 * Validate given file
 *
 * @param file
 * @returns {boolean}
 * @private
 */
function _validate(file) {
  let maxSize = 5e6, // 5 MB,
    fileName = !file ? '' : file.originalname,
    fileSize = !file ? 0 : file.size,
    filtered = ['pdf', 'zip', 'rar']
      .filter(ext => (fileName.includes(ext) && fileSize <= maxSize))

  return filtered.length === 1
}

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

module.exports = {
  index,
  upload,
}
