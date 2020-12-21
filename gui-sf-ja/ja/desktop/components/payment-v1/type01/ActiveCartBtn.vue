<template>
  <div class="flex space-between">
    <button class="btn-cart-I8XMC flex mid center mb-5 orange" @click="addToCart">
      <ShopingCart class="shoping-cart mr-5" />
      <div v-if="info.status">
        <span class="ver-mid">{{ $t(info.externalUrl ? 19 : 1) }}</span>
      </div>
    </button>
    <div class="flex mid layout-col cursor-pointer heart-wrapp ml-5" @click="onFavorite">
      <div class="heart flex mid center" :title="favTitle">
        <Heart class="heart-icon" />
      </div>
      <b :title="favTitle" class="heart-number">{{ info.favoriteCount || 0 }}</b>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import ShopingCart from '@@/../components/icons/ShopingCart.vue'
import Heart from '@@/../components/icons/Heart.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ShopingCart,
    Heart,
  },
  data() {
    return {
      cartProcesssing: false,
    }
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    favTitle() {
      if (!this.$store.state.user.id) {
        return this.$t('11')
      }
      return this.info.isFavorite ? this.$t('12') : this.$t('13')
    },
  },
  methods: {
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
    async addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      if(this.info.externalUrl) {
        location.href = this.info.externalUrl
        return
      }
      this.$store.dispatch('cart/addToCart', {
        productId: this.info.productId,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-cart-I8XMC {
  width: 260px;
  height: 50px;
  line-height: 52px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border: none;
  outline: none;
  font-size: 22px;
  border-radius: 4px;
  &:hover {
    opacity: 0.85;
  }
  > span {
    margin-top: 2px;
  }
}
.orange {
  background-color: #f60;
}
.shoping-cart {
  width: 34px;
  height: 34px;
}
.ver-mid {
  vertical-align: middle;
}
.heart {
  border-radius: 50%;
  background: #ec5665;
  width: 35px;
  height: 35px;
  &:hover {
    opacity: 0.9;
  }
}
.heart-icon {
  margin-top: 2px;
  width: 20px;
  height: 20px;
  color: white;
}
.heart-number {
  font-size: 20px;
  color: #ec5665;
}
</style>
