export const state = () => ({
  toolsCategories: [],
  toolsKeywords: [],
  toolsText: '',
})

export const mutations = {
  setToolsCategories: function(state, categories) {
    state.toolsCategories = categories
  },
  setToolsKeywords: function(state, keywords) {
    state.toolsKeywords = keywords
  },
  setToolsText: function(state, text) {
    state.toolsKeywords = text
  },
}

export const getters = {
  getToolsCategories: state => {
    return state.toolsCategories
  },
  getToolsKeywords: state => {
    return state.toolsKeywords
  },
  getToolsText: state => {
    return state.toolsText
  },
}
