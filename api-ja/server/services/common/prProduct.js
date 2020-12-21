/**
 * Add `src=pr` to link URL (Related OAM-28297)
 *
 * @return {Array}
 */
function addSrc(data) {
  if (!data) {
    return []
  }

  return data.map(item => {
    item.detailUrl && (item.detailUrl += item.detailUrl.includes('?') ? '&src=pr' : '?src=pr')
    return item
  })
}

module.exports = {
  addSrc,
}
