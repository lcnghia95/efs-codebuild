const app = require('@server/server')
const service = require('@server/services/labo/socials')

async function bookmarkArticle(req, res) {
  try {
    res.json(await service.bookmark(
      req.params.id,
      service.TYPE.ARTICLE,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function bookmarkAnswer(req, res) {
  try {
    res.json(await service.bookmark(
      req.params.id,
      service.TYPE.ANSWER,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function bookmarkRefArticle(req, res) {
  try {
    res.json(await service.bookmark(
      req.params.id,
      service.TYPE.REF_ARTICLE,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function bookmarkRefComment(req, res) {
  try {
    res.json(await service.bookmark(
      req.params.id,
      service.TYPE.REF_COMMENT,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countArticleBookmarks(req, res) {
  try {
    res.json({
      count: await service.countBookmarks(
        req.params.id,
        service.TYPE.ARTICLE,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countAnswerBookmarks(req, res) {
  try {
    res.json({
      count: await service.countBookmarks(
        req.params.id,
        service.TYPE.ANSWER,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countRefArticleBookmarks(req, res) {
  try {
    res.json({
      count: await service.countBookmarks(
        req.params.id,
        service.TYPE.REF_ARTICLE,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countRefCommentBookmarks(req, res) {
  try {
    res.json({
      count: await service.countBookmarks(
        req.params.id,
        service.TYPE.REF_COMMENT,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function removeBookmark(req, res) {
  try {
    res.json({
      status: await service.removeBookmark(
        req.params.id,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getBookmarks(req, res) {
  try {
    res.json(await service.getBookmarks(req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function likeArticle(req, res) {
  try {
    res.json({
      status: await service.like(
        req.params.id,
        service.TYPE.ARTICLE,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function likeAnswer(req, res) {
  try {
    res.json({
      status: await service.like(
        req.params.id,
        service.TYPE.ANSWER,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function likeRefArticle(req, res) {
  try {
    res.json({
      status: await service.like(
        req.params.id,
        service.TYPE.REF_ARTICLE,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function likeRefComment(req, res) {
  try {
    res.json({
      status: await service.like(
        req.params.id,
        service.TYPE.REF_COMMENT,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countArticleLikes(req, res) {
  try {
    res.json({
      count: await service.countLikes(
        req.params.id,
        service.TYPE.ARTICLE,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countAnswerLikes(req, res) {
  try {
    res.json({
      count: await service.countLikes(
        req.params.id,
        service.TYPE.ANSWER,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countRefArticleLikes(req, res) {
  try {
    res.json({
      count: await service.countLikes(
        req.params.id,
        service.TYPE.REF_ARTICLE,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function countRefCommentLikes(req, res) {
  try {
    res.json({
      count: await service.countLikes(
        req.params.id,
        service.TYPE.REF_COMMENT,
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function removeLike(req, res) {
  try {
    res.json({
      status: await service.removeLike(
        req.params.id,
        app.utils.meta.meta(req, ['userId']),
      ),
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function saveBookmarkList(req, res) {
  try {
    const userId = app.utils.meta.meta(req, ['userId']).userId
    if(!userId){
      return 0
    }
    res.json(await service.saveBookmarkList(req.body.listBookmark,userId))

  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  bookmarkArticle,
  countArticleBookmarks,
  bookmarkRefArticle,
  countRefArticleBookmarks,
  bookmarkAnswer,
  countAnswerBookmarks,
  bookmarkRefComment,
  countRefCommentBookmarks,
  removeBookmark,
  getBookmarks,
  likeArticle,
  countArticleLikes,
  likeRefArticle,
  countRefArticleLikes,
  likeAnswer,
  countAnswerLikes,
  likeRefComment,
  countRefCommentLikes,
  removeLike,
  saveBookmarkList,
}
