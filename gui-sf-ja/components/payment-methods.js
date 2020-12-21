import { gotoLogin } from '@/utils/client/common'
export default {
  data() {
    return {
      cartActions: {
        getProductFn: this.getProductFn,
        onFavorite: this.withCheckLogin(this.onFavorite),
        addPortfolio: this.withCheckLogin(this.addPortfolio),
        addToCart: this.withCheckLogin(this.addToCart),
      },
    }
  },
  methods: {
    withCheckLogin(fn) {
      let vm = this
      return function() {
        if (!vm.$store.state.user.id) {
          gotoLogin()
        } else {
          return fn()
        }
      }
    },
    addToCart(form) {
      if (Object.keys(this.cartInfo).length) {
        $(form).submit()
      }
    },
    getProductFn(password) {
      if (!this.getProductPassword) {
        console.error(
          'please define "getProductPassword" function to get product information'
        )
      } else {
        return this.getProductPassword(password)
      }
    },
    onFavorite() {
      let url =
        `/api/v3/surface/favorite/${this.cartInfo.id}` +
        (this.cartInfo.isFavorite === 1 ? '/remove' : '')
      this.GoGoHTTP.post(url, { pId: this.cartInfo.id }).then(() => {
        this.$set(this.cartInfo, 'isFavorite', this.cartInfo.isFavorite ? 0 : 1)
      })
    },
    addPortfolio() {
      let url =
        `/api/v3/surface/portfolio/${this.cartInfo.id}` +
        (this.cartInfo.isPortfolio === 1 ? '/remove' : '/select')
      this.GoGoHTTP.post(url, { pId: this.cartInfo.id }).then(() => {
        this.$set(
          this.cartInfo,
          'isPortfolio',
          this.cartInfo.isPortfolio ? 0 : 1
        )
      })
    },
  },
}
