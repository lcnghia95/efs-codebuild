export const state = {
  searchType: '',
  bcRoutes: [],
}

export const mutations = {
  setSearchType: function(state, searchType) {
    state.searchType = searchType
  },
  setBC: function(state, bcRoutes) {
    state.bcRoutes = bcRoutes
  },
  pushBC: function(state, bcRoute) {
    state.bcRoutes.push(bcRoute)
  },
}
