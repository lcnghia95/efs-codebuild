import {
  state as CommonState,
  mutations as commonMutations,
  getters as CommonGetters
} from "@@/../common/store/navi/finance"

export const state = () => ({
  ...CommonState
})

export const mutations = {
  ...commonMutations
}

export const getters = {
  ...CommonGetters
}
