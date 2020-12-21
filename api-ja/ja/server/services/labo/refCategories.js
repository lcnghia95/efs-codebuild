const app = require('@server/server')

const categoriesModel = app.models.RefCategories
const subjectsModel = app.models.RefSubjects

/**
 * Get all categories, also get list of categories waiting for accept
 * @param {*} isAccepted
 */
async function listRefCategories() {
  const dataRefCates = await categoriesModel.find({
    fields: {
      id: true,
      name: true,
      shortName: true,
    },
  })

  return dataRefCates
}

/**
 * Get all categories, also get list of categories waiting for accept
 * @param {*} isAccepted
 */
async function refSubjectInfo(refCategoryId, subjectId) {
  const subjectData = await subjectsModel.findOne({
    where: {
      id: subjectId,
      refCategoryId,
    },
    fields: {
      id: true,
      name: true,
    },
  })

  return subjectData
}

/**
 * Get all sub categories of a category
 * @param {*} refCategoryId
 */
async function listSubjects(refCategoryId) {
  const dataSubjects = await categoriesModel.findById(refCategoryId, {
    include: [
      {
        relation: 'hasSubjects',
        scope: {
          // order: ['id ASC'],
          fields: {
            id: true,
            name: true,
            refCategoryId: true,
          },
        },
      },
    ],
    fields: {
      id: true,
      name: true,
      shortName: true,
    },
  })

  return dataSubjects
}

/**
 * Create new ref category
 * @param {*} input
 * @param {*} meta
 */
async function newCategory(input, fileIcon, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId
  ) {
    return {}
  }
  const newRecord = {
    name: input.name,
    shortName: input.shortName,
  }

  return await categoriesModel.create(newRecord)
}

/**
 * Create new ref subject inside a category
 * @param {*} input
 * @param {*} meta
 */
async function newSubject(input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !input.refCategoryId
  ) {
    console.log('Can not create new reference subject, input not valid!')
    return {}
  }

  const foundCategory = await categoriesModel.count({
    id: input.refCategoryId,
  })
  if (foundCategory === 0) {
    console.log('Reference category not exist, could not create subject of ', input.refCategoryId)
  }
  const newSubCate = await subjectsModel.create({
    name: input.name,
    refCategoryId: input.refCategoryId,
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
 * edit an existing subject
 * @param {*} id
 * @param {*} input
 * @param {*} meta
 */
async function updateSubject(id, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !id
  ) {
    return {}
  }

  const subCate = await subjectsModel.findById(id)
  // TODO: validate userId
  if (!subCate) {
    return {}
  }
  subCate.name = input.name || subCate.name
  await subCate.save()
  return subCate
}

module.exports = {
  listRefCategories,
  listSubjects,
  refSubjectInfo,
  newCategory,
  newSubject,
  updateCategory,
  updateSubject,
}
