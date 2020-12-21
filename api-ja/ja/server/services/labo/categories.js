const app = require('@server/server')

const categoriesModel = app.models.LaboCategories
const subCategoriesModel = app.models.SubCategories
const fileUtils = app.utils.file

/**
 * Get all categories, also get list of categories waiting for accept
 * @param {*} isAccepted
 */
async function listCategories(isAccepted = 1) {
  const dataSubCat = await categoriesModel.find({
    where: {
      isAccepted: isAccepted,
    },
    order: ['id ASC'],
    fields: {
      id: true,
      name: true,
      icon: true,
      userId: (isAccepted == 0),
    },
  })

  return dataSubCat
}

/**
 * Get all sub categories of a category
 * @param {*} categoryId
 */
async function listSubCategories(categoryId) {
  const dataSubCat = await categoriesModel.findById(categoryId, {
    include: [
      {
        relation: 'hasSubCategories',
        scope: {
          where: {
            isAccepted: 1,
          },
          order: ['name ASC'],
          fields: {
            id: true,
            name: true,
            shortName: true,
            categoryId: true,
          },
        },
      },
    ],
    fields: {
      id: true,
      name: true,
      icon: true,
    },
  })

  return dataSubCat
}

/**
 * Get all sub categories waiting for accepted
 */
async function getSubWaitList() {
  const dataSubCat = await subCategoriesModel.find({
    include: [
      {
        relation: 'ofCategory',
        scope: {
          fields: {
            id: true,
            isAccepted: true,
            name: true,
          },
        },
      },
    ],
    where: {
      isAccepted: 0,
    },
    order: ['name ASC'],
    fields: {
      id: true,
      name: true,
      isAccepted: true,
    },
  })

  return dataSubCat
}

/**
 * Create new category, isAccepted = 0 until accepted by admin
 * @param {*} input
 * @param {*} meta
 */
async function newCategory(input, fileIcon, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId
  ) {
    fileUtils._deleteFile(fileIcon)
    return {}
  }
  const res = fileIcon
      ? await fileUtils.upload(fileIcon, `labo/user/${meta.userId}`, true)
      : null
    const newRecord = {
      name: input.name,
      userId: meta.userId,
      isAccepted: 0,
    }

  console.log('upload file response: ', res)
  if (res) {
    newRecord.icon = res.url
  }
  return await categoriesModel.create(newRecord)
}

/**
 * Create new subcategory, isAccepted = 0 until accepted by admin
 * @param {*} input
 * @param {*} meta
 */
async function newSubCategory(input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !input.categoryId
  ) {
    console.log('Can not create new subcategory, input not valid!')
    return {}
  }

  const foundCategory = await categoriesModel.count({
    id: input.categoryId,
  })
  if (foundCategory === 0) {
    console.log('Category not exist, could not create subcategory of ', input.categoryId)
  }
  const newSubCate = await subCategoriesModel.create({
    name: input.name,
    shortName: input.shortName || input.name.substring(0, 3).toUpperCase(),
    categoryId: input.categoryId,
    userId: meta.userId,
    isAccepted: 0,
  })

  return newSubCate
}

/**
 * Edit an existing category
 * @param {*} id
 * @param {*} input
 * @param {*} meta
 */
async function updateCategory(id, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !id
  ) {
    return {}
  }

  const category = await categoriesModel.findById(id)
  // TODO: validate userId
  if (!category) {
    return {}
  }
  // TODO: upload new icon
  category.name = input.name || category.name
  await category.save()
  return category
}

/**
 * edit an existing subcategory
 * @param {*} id
 * @param {*} input
 * @param {*} meta
 */
async function updateSubCategory(id, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !id
  ) {
    return {}
  }

  const subCate = await subCategoriesModel.findById(id)
  // TODO: validate userId
  if (!subCate) {
    return {}
  }
  // TODO: upload new icon
  subCate.name = input.name || subCate.name
  await subCate.save()
  return subCate
}

module.exports = {
  listCategories,
  listSubCategories,
  getSubWaitList,
  newCategory,
  newSubCategory,
  updateCategory,
  updateSubCategory,
}
