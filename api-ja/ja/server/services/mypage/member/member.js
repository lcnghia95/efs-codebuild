const Parser = require('rss-parser')

async function validateRss(url) {
  const parser = new Parser()
  let feed
  try {
    feed = await parser.parseURL(url)
  } catch (error) {
    return undefined
  }
  return feed
}

module.exports = {
  validateRss,
}
