import Vue from 'vue'
export const EventBus = new Vue()
export const EventBusConst = {
  SYSTEMTRADE_GO_COMMUNITY: 'SYSTEMTRADE_GO_COMMUNITY',
}
if (process.browser) {
  Object.defineProperty(Vue.prototype, '$eb', {
    get: function get() { return EventBus },
  })
  Object.defineProperty(Vue.prototype, '$ebc', {
    get: function get() { return EventBusConst },
  })
}
