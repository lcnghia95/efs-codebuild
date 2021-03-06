/**
 * Display paging information
 *
 * @param {Array} array
 * @param {Number} page
 * @param {Number} total
 * @param {Number} displayRange
 * @returns {Object}
 * @public
 */
function addPagingInformation(data, page, total, limit, displayRange = 4) {
  if (!limit) {
    limit = data.length
  }

  // Parse input data (Value from url params is string)
  page = parseInt(page)
  limit = parseInt(limit)

  let lastPage = Math.ceil(total / limit),
    pagingFrom = Math.max(page - displayRange / 2, 1),
    pagingTo = Math.min(page + displayRange / 2, lastPage),
    range = pagingTo - pagingFrom
  if (range != 0 && range < displayRange && displayRange < lastPage) {
    if (displayRange - range <= lastPage - pagingTo) {
      pagingTo = pagingTo + displayRange - range
    } else {
      pagingFrom = pagingFrom - (displayRange - range)
    }
  }

  return {
    total,
    currentPage: page,
    lastPage,
    pagingFrom,
    pagingTo,
    data,
  }
}

/**
 * Calculate offset object for use in query data
 *
 * @param page
 * @param limit
 * @returns {Object}
 * @public
 */
function getOffsetCondition(page = 1, limit = 20) {
  page = page === undefined || page === null ? 1 : page // Avoid undefined
  limit = limit === undefined || limit === null ? 20 : limit // Avoid undefined
  return {
    skip: (page - 1) * limit,
    limit: limit,
  }
}

module.exports = {
  addPagingInformation,
  getOffsetCondition,
}
