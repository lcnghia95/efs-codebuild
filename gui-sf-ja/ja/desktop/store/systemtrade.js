export default {
  state: () => ({ 
    hatenaCount: 0
  }),
  mutations: {
    setHatenaCount(state, hatenaCount) {
      state.hatenaCount = hatenaCount
    }
  },
  getters: {
    hatenaCount(state) {
      return state.hatenaCount
    }
  }
}
