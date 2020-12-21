<template>
  <div class="w-1000 cart-confirm flex space-between">
    <div class="left-content">
      <div class="title-complete flex mid w-full pb-10">
        <cart />
        <h2>{{ $t('1') }}</h2>
      </div>
      <div class="mt-40">
        <!-- Order Number -->
        <dl class="complete-cell flex mb-20">
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b>{{ $t('5') }}</b>
          </dt>
          <dd class="flex mid fs-12 pb-10 pl-20 pr-10">
            {{ data.sessionId }}
          </dd>
        </dl>

        <!-- Transfer number -->
        <dl class="complete-cell flex mb-20" v-if="data.payId && data.transferNumber">
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b>{{ $t('6') }}</b>
          </dt>
          <dd class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10">
            <p class="fs-24 mb-0">
              {{ data.transferNumber }}
            </p>
            <p class="mb-0">
              {{ $t('9') }}
            </p>
          </dd>
        </dl>

        <!-- Payment Account -->
        <dl
          class="complete-cell flex mb-20"
          v-if="data.payId == 1 || data.payId == 5"
        >
          <dt class="flex layout-col center fs-12 pl-20 pr-15">
            <b>{{ $t('7') }}</b>
            <p class="txt-note mt-15 mb-0">
              {{ $t('8') }}
            </p>
          </dt>
          <dd class="flex layout-col center fs-12">
            <ul class="pt-25 pb-25 pl-20 pr-10 mb-0 border-b-dot">
              <span v-html="$t('ggj-pays.1')"></span>
            </ul>
            <ul class="pt-25 pb-25 pl-20 pr-20 mb-0 border-b-dot">
              <span v-html="$t('ggj-pays.2')"></span>
            </ul>
            <ul class="pt-25 pb-25 pl-20 pr-20 mb-0">
              <span v-html="$t('ggj-pays.3')"></span>
            </ul>
          </dd>
        </dl>

        <!-- Bank info -->
        <dl
          class="complete-cell flex mb-20"
          v-if="data.payId == 5 && data.salonsPrice"
        >
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b>{{ $t('10') }}</b>
          </dt>
          <dd class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10">
            <p class="mb-0" v-html="buildSalonPay()"></p>
          </dd>
        </dl>

        <!-- Deadline -->
        <dl class="complete-cell flex mb-20" v-if="data.expiredAt">
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b>{{ $t('12') }}</b>
          </dt>
          <dd class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10">
            <p class="mb-0">
              {{ formatTime(data.expiredAt, 8) }}
            </p>
          </dd>
        </dl>

        <!-- Company Code & Order Number -->
        <dl
          class="complete-cell flex flex-wrap mb-20"
          v-if="data.code1 && data.code2"
        >
          <dt class="flex mid fs-12 pl-20 pr-15 border-b-dot">
            <b v-html="$t('13')"></b>
          </dt>
          <dd
            class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10 border-b-dot"
          >
            <p class="fs-20 mb-0">
              {{ data.code1 }}
            </p>
          </dd>
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b v-html="$t('14')"></b>
          </dt>
          <dd class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10">
            <p class="fs-20 mb-0">
              {{ data.code2 }}
            </p>
          </dd>
        </dl>

        <!-- Online Number -->
        <dl class="complete-cell flex" v-if="data.code">
          <dt class="flex mid fs-12 pl-20 pr-15">
            <b v-html="$t('15')"></b>
          </dt>
          <dd class="flex layout-col center fs-12 pt-15 pb-10 pl-20 pr-10">
            <p class="fs-20 mb-0">
              {{ data.code }}
            </p>
          </dd>
        </dl>
      </div>
      <a
        href="http://www.paydesign.co.jp/service/guide/famima.html"
        target="_blank"
        v-if="data.code1 && data.code2"
      >
        <img
          src="/img/assets/pc/cart/store_famia.jpg"
          alt="store_famia"
          class="mt-15 border-all hidden-xs"
        />
        <picture class="visible-xs-block">
          <source type="image/webp" srcset="/img/assets/pc/cart/mobile_store_famia.webp" sizes="100%" />
          <source type="image/jpeg" srcset="/img/assets/pc/cart/mobile_store_famia.jpg" sizes="100%" />
          <img src="/img/assets/pc/cart/mobile_store_famia.jpg" alt="mobile_store_famia" sizes="100%" />
        </picture>
      </a>
      <a
        href="http://www.paydesign.co.jp/service/guide/onlinekessai.html"
        target="_blank"
        v-if="data.code"
      >
        <img
          src="/img/assets/pc/cart/store_kessai.jpg"
          alt="store_kessai"
          class="mt-15 border-all hidden-xs"
        />
        <picture class="visible-xs-block">
          <source type="image/webp" srcset="/img/assets/pc/cart/mobile_store_kessai.webp" sizes="100%" />
          <source type="image/jpeg" srcset="/img/assets/pc/cart/mobile_store_kessai.jpg" sizes="100%" />
          <img src="/img/assets/pc/cart/mobile_store_kessai.jpg" alt="mobile_store_kessai" sizes="100%" />
        </picture>
      </a>
      <CartSteps
        :step="2"
        :confirm-url="data.confirmUrl"
        :type-ids="data.typeIds"
        class="reponsive-cart"
      />
    </div>
    <div class="right-content">
      <CartSteps
        :step="2"
        :confirm-url="data.confirmUrl"
        :type-ids="data.typeIds"
      />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/cart-complete.json'
import title from '@@/../common/pages'
import CartSteps from '@/components/cart/CartSteps.vue'
import Cart from '@@/../components/icons/Cart.vue'
import criteo from '@@/../common/js/criteo/cart-complete'
import { getIp } from '@@/../utils/server'

const obj = Object.assign(
  {
    components: {
      Cart,
      CartSteps,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('2'),
        descriptionChunk: this.$t('4'),
      }
    },
    mounted() {
      criteo.call(this)
      window._lt('send', 'cv', {
        type: 'Conversion'
      },['127144fe-a505-481b-a8ef-02f938eecf5c'])
    },
    methods: {
      keywordsTemplate() {
        return this.$t('3')
      },
      buildSalonPay() {
        let prices = this.data.salonsPrice || []
        if (!prices) {
          return ''
        }
        let text,
          price3m = '',
          price = ''
        price += this.formatNumber(prices)
        price3m += this.formatNumber(prices * 3)

        text = this.$t('11').replace('%s', price3m)
        text = text.replace('%s', price)

        return text
      },
    },
    async asyncData({ app, store, req, route, redirect }) {
      let data,
        sessionId = route.query.ssid || route.query.SID
      if (sessionId) {
        console.log('[%s] CART COMPLETE sessionId', getIp(req), sessionId)
        data = await app.GoGoHTTP.post('/api/v3/cart/complete', { sessionId })
      } else if (req.body && req.body.checkoutData) {
        console.log('[%s] CART COMPLETE req.body', getIp(req), req.body)
        data = JSON.parse(req.body.checkoutData)
        let res = await app.GoGoHTTP.post('/api/v3/cart/complete', {
          sessionId: data.sessionId,
        })
        data.trackTransaction = res.trackTransaction
      }

      if (
        !data ||
        !Object.keys(data).length ||
        !data.sessionId ||
        data.payId === undefined
      ) {
        console.log('[%s] CART COMPLETE redirect', getIp(req), data)
        return redirect(302, '/cart')
      }
      if (data.failed) {
        console.log('[%s] CART COMPLETE redirect error', getIp(req), data)
        return redirect(301, '/cart/error')
      }
      store.commit('cart01/setPayId', {
        payId: data.payId,
      })
      return {
        data,
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  .right-content {
    display: none;
  }
  .left-content {
    width: 100% !important;
    padding: 10px;
  }
  .reponsive-cart {
    display: block !important;
    width: 100% !important;
    margin: 15px auto;
    max-width: 540px;
  }
}
.reponsive-cart {
  display: none;
}
.cart-confirm {
  padding: 50px 0;
  .left-content {
    width: 600px;
    .title-complete {
      color: #2d2d2d;
      border-bottom: 1px solid #d9d9d9;
      h2 {
        font-size: 22px;
        margin: 5px 0 0 5px;
      }
    }
    .complete-cell {
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      dt {
        width: 110px;
        min-height: 70px;
        border-right: 1px solid #d9d9d8;
        p {
          font-weight: normal;
        }
      }
      dd {
        width: calc(100% - 110px);
        ul {
          list-style: none;
          li {
            line-height: 20px;
          }
        }
      }
    }
  }
  dt,
  dd,
  p,
  li {
    white-space: pre-line;
    word-break: break-word;
  }
  span {
    line-height: 20px;
  }
  .fs-20 {
    font-size: 20px;
  }
  .fs-24 {
    font-size: 24px;
  }
  .border-b-dot {
    border-bottom: 1px dotted #d9d9d9;
  }
  img {
    max-width: 100%;
  }
  .border-all {
    border: 1px solid #d9d9d9;
  }
}
</style>
