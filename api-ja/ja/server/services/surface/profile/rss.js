const FeedParser = require('feedparser')
const request = require('request') // for fetching the feed

/**
 * Get all rss articles from given rss url
 *
 * @param {string} url
 * @returns {Promise<array>}
 */
function feedRss(url) {
  let req = request({
      url,
      followRedirect: false,
    }),
    feedparser = new FeedParser({addmeta: false}),
    data = []

  return new Promise(((resolve, reject) => {
    req.on('error', function (error) {
      reject(error)
    })

    req.on('response', function (res) {
      let stream = this // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        reject()
      }
      else {
        stream.pipe(feedparser)
      }
    })

    feedparser.on('error', function (error) {
      reject(error)
    })

    feedparser.on('readable', function () {
      let stream = this, // `this` is `feedparser`, which is a stream
        item = stream.read()

      while (item) {
        data.push(item)
        item = stream.read()
      }
    })

    feedparser.on('end', function () {
      resolve(data)
    })
  }))
}

module.exports = {
  feedRss
}
