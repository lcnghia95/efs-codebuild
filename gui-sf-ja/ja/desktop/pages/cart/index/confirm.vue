<template>
  <div class="w-1000 cart-confirm flex space-between">
    <div class="left-cart">
      <div class="title-complete flex mid w-full pb-10 mb-35" v-if="!isErr">
        <cart />
        <h2 class="title">{{ $t('1') }}</h2>
      </div>
      <ProductInformation class="mt-40" v-if="!isErr" />
      <CartUserInfo @infochange="onInfoChange"
                    class="p-5 cart-user"
                    :user-data="userData"
                    v-if="!isErr"
      />
      <CartSteps class="reponsive-cart" :step="1" />
      <p v-if="payId == 3" v-html="$t('6')" class="mt-10 fs-11 p-5 bottom-text"></p>
    </div>
    <div class="right-cart">
      <CartSteps :step="1" />
    </div>
    <GogoModal
      class="err-modal"
      :show="isShowModal"
      @update:show="val => (isShowModal = val)"
      :width="450"
      :height="200"
      :cancel-text="''"
    >
      <div slot="modal-header"></div>
      <div slot="modal-body">
        <div class="err-body flex center pt-50 pl-20 pr-20">
          <span class="warning flex mid center mr-5">!</span>
          <span>{{ $t('cart-errors.' + isErr) }}</span>
        </div>
        <div class="flex mid center mb-30">
          <button class="btn-simple btn-submit" @click="onAccept">{{ $t(7) }}</button>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/cart-confirm.json'
import title from '@@/../common/pages'
import ProductInformation from '@/components/cart/ProductInformation.vue'
import CartUserInfo from '@/components/cart/CartUserInfo.vue'
import CartSteps from '@/components/cart/CartSteps.vue'
import Cart from '@@/../components/icons/Cart.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import { getIp } from '@@/../utils/server'
import {trackingCheckoutProgress} from '@@/../common/js/ga/ecom-enhance'

const obj = Object.assign(
  {
    components: {
      ProductInformation,
      CartUserInfo,
      CartSteps,
      Cart,
      GogoModal,
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      if (this.isErr) {
        this.isShowModal = true
      } else {
        trackingCheckoutProgress(this.data.buyNow)
      }
    },
    data() {
      return {
        titleChunk: this.$t('2'),
        descriptionChunk: this.$t('4'),
        isShowModal: false
      }
    },
    async asyncData({ app, redirect, store, req }) {
      let data = await app.GoGoHTTP.post('/api/v3/cart/confirm'),
        userData
      console.log('[%s] CART CONFIRM %j', getIp(req), data)
      if (data && data.error) {
        return {
          isErr: data.error
        }
      }
      if (!data || (!data.buyer && !req.body.info) || !data.info) {
        return redirect(302, '/cart')
      }
      userData = req.body.info ? JSON.parse(req.body.info) : data.buyer
      store.commit('cart01/setData', data)
      store.commit('cart01/setPayId', data.info)
      store.commit('cart01/setDvd', data.info)
      store.commit('cart01/setUserData', userData)
      return {
        data,
        isErr: false,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/cart/confirm',
          },
        ],
        // userData,
      }
    },
    methods: {
      onInfoChange(info) {
        let ud = Object.assign({}, this.userData, info)
        this.$store.commit('cart01/setUserData', ud)
      },
      keywordsTemplate() {
        return this.$t('3')
      },
      onAccept() {
        location.href = '/cart'
      },
    },
    computed: {
      dvdOpt() {
        return this.$store.getters['cart01/dvdOpt']
      },
      payId() {
        return this.$store.getters['cart01/payId']
      },
      userData() {
        return this.$store.getters['cart01/buyer']
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  .right-cart {
    display: none;
  }
  .left-cart {
    width: 100% !important;
  }
  .cart-confirm .fs-11.bottom-text {
    font-size: 15px;
  }
  /deep/ .prod-info {
    width: 100% !important;
    font-size: 15px;
    .item .col {
      &.wrapp-info {
        width: 100%;
        margin-top: 17px;
      }
      &.wrapp-cb {
        margin-top: 10px;
        width: 100%;
      }
    }
  }
  /deep/ .cart-info {
    width: 100% !important;
    font-size: 15px;
  }
  /deep/ .agree-all {
    width: 100% !important;
  }
  /deep/ .modal-dialog {
    .modal-title {
      margin-left: 0 !important;
    }
    .modal-body {
      .a-row input {
        margin: 8px 0 !important;
        width: 100% !important;
      }
      .info-area {
        padding: 20px 20px 30px !important;
        .co-red {
          margin-left: 0 !important;
        }
        .arow {
          font-size: 14px !important;
        }
        .sl-QFVuO {
          width: 100% !important;
          .sl-area {
            width: 100% !important;
            height: auto !important;
            padding: 5px 10px !important;
          }
        }
      }
    }
    /deep/ .modal-footer button {
      padding: 4px 12px;
    }
  }
  .info-area {
    line-height: 30px;
    padding: 5px 15px !important;
  }
  .reponsive-cart {
    display: block !important;
    width: 100% !important;
    margin: 15px auto;
    max-width: 540px;
    padding: 10px;
  }
}
.reponsive-cart {
  display: none;
}
.cart-confirm {
  color: #2d2d2d;
  padding: 50px 0;
  .left-cart {
    width: 600px;
  }
  .right-cart {
    width: 330px;
  }
  .title-complete {
    color: #2d2d2d;
    border-bottom: 1px solid #d9d9d9;
    h2 {
      font-size: 22px;
      margin: 5px 0 0 5px;
    }
  }
  .fs-11 {
    font-size: 11px;
  }
}
.err-modal /deep/ {
  .err-body {
    color: #2d2d2d;
    height: 120px;
    overflow-y: auto;
    .warning {
      border-radius: 50%;
      background: #f60;
      font-weight: bold;
      width: 20px;
      height: 20px;
      flex: 0 0 20px;
      color: white;
      ~ span {
        font-size: 16px;
      }
    }
  }
}
.btn-simple {
  border-radius: 5px;
  min-width: 160px;
  min-height: 35px;
  margin: 0 10px;
  border: 0;
  outline: none;
  white-space: pre-line;
  word-break: break-word;
  &.btn-submit {
    background: #ff7d02;
    color: white;
    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
