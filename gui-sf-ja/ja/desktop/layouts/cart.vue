<template>
  <section>
    <div class="p-10" style="font-size: 13px; line-height: 15px; border-bottom: 1px solid #f1f1f1;">{{ $t('1') }}</div>
    <div class="w-full top-header flex space-between flex-wrap mid">
      <a :href="logoHref">
        <i :is="LogoComp" class="logo-cls" title />
      </a>
      <ChangeLang />
    </div>
    <nuxt class="body mh-body" />
    <Footer02 class="cart-footer" />
    <Spinner v-if="isLoading" />
    <no-ssr>
      <ScrollTopButton />
    </no-ssr>
  </section>
</template>
<script>
import Logoja from '@@/../components/icons/Logoja.vue'
import Logoen from '@@/../components/icons/Logoen.vue'
import Logoth from '@@/../components/icons/Logoth.vue'
import Logovi from '@@/../components/icons/Logovi.vue'
import Footer02 from '@/components/footer/Footer02.vue'
import Spinner from '@@/../components/Spinner.vue'
import ChangeLang from '@@/../components/header/ChangeLang.vue'
import ScrollTopButton from '@/components/ScrollTopButton.vue'
import i18n from '@@/lang/common/layout-cart.json'

export default {
  i18n: { messages: i18n },
  components: { Logoja, Logoen, Logoth, Logovi, Footer02, ChangeLang, Spinner, ScrollTopButton },
  mounted() {
    this.$nuxt.$on('cart/showSpinner', show => {
      this.isLoading = show
    })
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    LogoComp() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `Logo${this.$i18n.locale}`
      }
      return 'Logoja'
    },
    logoHref() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `/${this.$i18n.locale}`
      }
      return '/'
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  .w-1000 {
    width: 100% !important;
  }
}
@media only screen and (min-width: $min-width) {
  .scroll-btn {
    display: none !important;
  }
}
@media only screen and (max-device-width: $max-width) {
  html,
  body {
    width: auto !important;
    font-size: 15px;
  }
}
@media only screen and (min-device-width: $min-width) and (max-device-width: 1024px) {
  html,
  body {
    width: 1025px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
/* stylelint-disable */
@media only screen and (max-width: $max-width) {
  .logo-cls {
    width: 125px !important;
    height: 45px !important;
  }
  .change-lang {
    margin: 0;
    width: 100%;
  }
  /deep/ .change-lang {
    z-index: 9;
    width: 140px !important;
    height: 27px;
    & > div {
      width: 100% !important;
    }
  }
  .cart-footer {
    margin-top: 0 !important;
  }
}
@media only screen and (min-width: 1000px) {
  /deep/ .change-lang {
    z-index: 9;
    width: 170px !important;
    height: 27px;
    & > div {
      width: 100% !important;
    }
  }
}
.top-header {
  background: white;
  box-shadow: 0 3px 4px #ededed;
  padding: 10px 5px;
  a {
    display: inline-block;
  }
  .logo-cls {
    width: 175px;
    height: 45px;
  }
}
.cart-footer {
  margin-top: 100px;
}
.lang-vi {
  font-family: Arial, sans-serif;
}
.mh-body {
  min-height: calc(100vh - 576px);
}
</style>
