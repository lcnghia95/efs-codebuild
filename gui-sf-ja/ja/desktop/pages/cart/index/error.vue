<template>
  <div class="w-1000 flex mid layout-col cart-error">
    <div class="flex mid fs-22 notify-ctn">
      <div class="warning flex mid center mr-5">
        <span>!</span>
      </div>
      <span class="notify-text" v-html="$t('2')"></span>
    </div>
    <a class="fs-22 inquiry-url" href="/inquiry">https://www.gogojungle.co.jp/inquiry</a>
    <div class="w-full flex mid space-around link-area">
      <a class="mr-15" href="/">{{ $t('3') }}</a>
      <a href="/cart">{{ $t('4') }}</a>
    </div>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import Loading from '@@/../components/icons/Loading.vue'
import i18n from '@@/lang/desktop/cart-err.json'

const obj = Object.assign(
  {
    components: { Loading },
    i18n: { messages: i18n },
    data() {
      return {
        titleChunk: this.$t('1'),
      }
    },
    async asyncData({ app, req, route }) {
      if (route.query.ssid) {
        await app.GoGoHTTP.post('/api/v3/cart/rollback', {
          sessionId: route.query.ssid,
        })
      }
      console.log('err', req.body)
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  .cart-error {
    padding: 34px 10px 70px 10px !important;
    .notify-text {
      margin: 10px 0;
      font-size: 18px !important;
      text-align: center;
    }
    .inquiry-url {
      font-size: 17px !important;
    }
    .notify-ctn {
      flex-direction: column;
    }
    .warning {
      border-radius: 50%;
      background: #f60;
      font-weight: bold;
      width: 74px;
      flex: 0 0 74px;
      height: 74px;
      margin: 0;
      color: white;
      font-size: 50px;
    }
    .link-area {
      margin: 11px 0;
      font-size: 15px;
    }
  }
}
@media only screen and (min-width: $min-width) {
  .cart-error {
    padding-top: 104px;
    padding-bottom: 70px;
    .fs-22 {
      font-size: 22px;
    }
    .warning {
      border-radius: 50%;
      background: #f60;
      font-weight: bold;
      width: 24px;
      flex: 0 0 24px;
      height: 24px;
      color: white;
    }
    .link-area {
      padding: 50px 70px;
      a {
        font-size: 18px;
      }
    }
  }
}
</style>
