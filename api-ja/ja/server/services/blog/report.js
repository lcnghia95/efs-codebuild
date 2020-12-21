const app = require('@server/server')
const blogModel = app.models.Blogs

const timeUtils = require('@ggj/utils/utils/time')

async function periodReport(input, meta) {
  const from = !input.from ? 0 : input.from * 1000
  const to = !input.to ? 0 : input.to * 1000
  const blogId = parseInt(input.blogId) || 0
  const condition = {
    where: {
      userId: meta.userId,
    },
    fields: {id: true},
    include: [{
      relation: 'posts',
      scope: {
        include: [{
          relation: 'postAccess',
          scope: {
            where: {
              and: [{
                createdAt: {gt: from},
              }, {
                createdAt: {lte: to},
              }],
            },
            fields: {createdAt: true},
          },
        }],
      }, 
    }],
  }

  // filter by blogId
  if (blogId) {
    condition.where['id'] = blogId
  }

  const data = _getPostAccessData(await blogModel.find(condition))
  const res = Object.keys(data).reduce((acc, time) => {
    acc.push({
      surveyedAt: timeUtils.toUnix(time),
      total: data[time],
    })
    return acc
  }, []).sort((a, b) => b.surveyedAt - a.surveyedAt)

  return res.reduce((arr, record) => {
    arr[0].push(record.surveyedAt)
    arr[1].push(record.total)
    return arr
  }, [[], []])
}

function _getPostAccessData(blogs) {
  return blogs
    .filter(blog => blog.posts().length)
    .reduce((acc, blog) => {
      blog.posts().forEach(post => {
        post.postAccess().forEach(postAc => {
          const time = timeUtils.sqlDate(postAc.createdAt * 1000, 'yyyy-MM-dd')
          acc[time] = acc[time] + 1 || 1
        })
      })
      return acc
    }, {})
}

module.exports = {
  periodReport,
}
