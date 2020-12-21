const app = require('@server/server')
const blogModel = app.models.Blogs
const backgroundHeaderModel = app.models.StyleBackgroundHeader
const backgroundFooterModel = app.models.StyleBackgroundFooter
const headerTextModel = app.models.StyleHeaderText
const styleLayoutModel = app.models.StyleLayout

const objectUtil = require('@ggj/utils/utils/object')

/**
 * Get style settings of given blog
 *
 * @param slug
 * @returns {Promise<Object>}
 */
async function settings(slug) {
  // Encode uri for slug because slug was stored by uri encode in db
  slug = encodeURIComponent(slug)

  const blog = await blogModel.findOne({
    where: {
      isValid: 1,
      slug,
    },
    fields: {id: true},
  })

  if (!blog) {
    return {}
  }

  const [header, footer, headerText, layout] = await Promise.all([
    _backgroundHeader(blog.id),
    _backgroundFooter(blog.id),
    _headerText(blog.id),
    _layout(blog.id),
  ])

  return {
    background: {
      header: {
        imageId: header.imageId || null,
        backgroundColor: header.backgroundColor || '#eaeaea',
        height: header.height || 340,
      },
      footer: {
        imageId: footer.imageId || null,
        backgroundColor: footer.backgroundColor || '#eaeaea',
        height: footer.height || 340,
      },
      copyRightColor: footer.copyRightColor || '#000',
      same: footer.isSameHeader || 0,
    },
    headerText: {
      textAlign: headerText.textAlign || 0,
      fontSize: headerText.fontSize || 25,
      explanationTextSize: headerText.explanationTextSize || 12,
      color: headerText.color || '#000',
      marginTop: headerText.marginTop || 0,
    },
    layoutId: layout.layoutType || 1,
  }
}

/**
 * Get background header style settings of given blog
 *
 * @param id
 * @returns {Promise<Object>}
 * @private
 */
async function _backgroundHeader(id) {
  const setting = await backgroundHeaderModel.findOne({
    where: {
      isValid: 1,
      blogId: id,
    },
  })

  return setting || await backgroundHeaderModel.findOne({
    where: {
      isValid: 1,
      isDefault: 1,
    },
  })
}

/**
 * Get background footer style settings of given blog
 *
 * @param id
 * @returns {Promise<Object>}
 * @private
 */
async function _backgroundFooter(id) {
  const setting = await backgroundFooterModel.findOne({
    where: {
      isValid: 1,
      blogId: id,
    },
  })

  return setting || await backgroundFooterModel.findOne({
    where: {
      isValid: 1,
      isDefault: 1,
    },
  })
}

/**
 * Get header text style of given blog
 *
 * @param id
 * @returns {Promise<Object>}
 * @private
 */
async function _headerText(id) {
  const setting = await headerTextModel.findOne({
    where: {
      isValid: 1,
      blogId: id,
    },
  })

  return setting || await headerTextModel.findOne({
    where: {
      isValid: 1,
      isDefault: 1,
    },
  })
}

/**
 * Get layout setting of given blog
 *
 * @param id
 * @returns {Promise<Object>}
 * @private
 */
async function _layout(id) {
  const setting = await styleLayoutModel.findOne({
    where: {
      isValid: 1,
      blogId: id,
    },
  })

  return setting || await styleLayoutModel.findOne({
    where: {
      isValid: 1,
      isDefault: 1,
    },
  })
}

/**
 * Store/update settings for given blog with given data
 *
 * @param slug
 * @param input
 * @param meta
 * @returns {Promise<Array>}
 */
async function storeSettings(slug, input, meta) {
  // Encode uri for slug because slug was stored by uri encode in db
  slug = encodeURIComponent(slug)

  const blog = await blogModel.findOne({
    where: {
      userId: meta.userId,
      slug,
    },
  })

  if (!blog) {
    return []
  }

  const id = blog.id
  const header = input.background ? (input.background.header || {}) : {}
  const footer = input.background ? (input.background.footer || {}) : {}
  const copyRight = input.background ? (input.background.copyRightColor || null) : null
  const same = input.background ? input.background.same : null
  const headerText = input.headerText || {}
  const layout = input.layoutId || null
  const nullFilter = objectUtil.nullFilter
  
  return await Promise.all([
    backgroundHeaderModel.upsertWithWhere({blogId: id}, nullFilter({
      isValid: 1,
      blogId: id,
      imageId: header.imageId || 0,
      backgroundColor: header.backgroundColor,
      height: header.height,
    })),
    backgroundFooterModel.upsertWithWhere({blogId: id}, nullFilter({
      isValid: 1,
      isSameHeader: same,
      blogId: id,
      imageId: footer.imageId || 0,
      backgroundColor: footer.backgroundColor,
      height: footer.height,
      copyRightColor: copyRight,
    })),
    headerTextModel.upsertWithWhere({blogId: id}, nullFilter({
      isValid: 1,
      blogId: id,
      textAlign: headerText.textAlign,
      fontSize: headerText.fontSize,
      explanationTextSize: headerText.explanationTextSize,
      color: headerText.color,
      marginTop: headerText.marginTop,
    })),
    styleLayoutModel.upsertWithWhere({blogId: id}, nullFilter({
      isValid: 1,
      blogId: id,
      layoutType: layout,
    })),
  ])
}

module.exports = {
  settings,
  storeSettings,
}
