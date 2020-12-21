import {
  state as CommonState,
  mutations as commonMutations,
} from "@@/../common/store/navi/navi"

export const state = () => ({
  ...CommonState,
})

export const mutations = {
  ...commonMutations,
}
