<template>
  <div class="error-page">
    <h4 style="font-weight: bold; margin: 40px 0;">
      {{ error.exists ? $t('5') : $t('1') }}
    </h4>
    <div class="flex img-area">
      <img src="/img/assets/pc/common/robot2.png" alt="robot-error" style="width: 30vw; max-width: 137px; height: auto; max-height: 120px;" />
      <img src="/img/assets/pc/common/error-404.png" alt="error-404" class="ml-20" style="width: 30vw; max-width: 214px; height: auto; max-height: 120px;" />
    </div>
    <h4 style="font-weight: bold; margin: 40px 0 30px 0;">
      {{ error.exists ? $t('6') : $t('2') }}
    </h4>
    <div style="font-weight: bold; font-size: 14px;">
      <a style="text-decoration: underline; color: #000;" href="/">
        {{ $t('3') }}
      </a>
      <span v-show="!error.exists">&nbsp;|&nbsp;</span>
      <a
        style="text-decoration: underline; color: #000;"
        href="javascript:history.back();"
        v-show="!error.exists"
      >
        {{ $t('4') }}
      </a>
    </div>
    <div class="mt-30">{{ $t('7') }}</div>
    <div class="flex mid link-area mt-5 mb-20">
      <a @click="changeLang('ja')" style="cursor: pointer;">日本語 </a>|
      <a @click="changeLang('en')" style="cursor: pointer;">English </a>|
      <a @click="changeLang('th')" style="cursor: pointer;">ภาษาไทย </a>|
      <a @click="changeLang('ch')" style="cursor: pointer;">简体中文 </a>|
      <a @click="changeLang('tw')" style="cursor: pointer;">繁體中文 </a>|
      <a @click="changeLang('vi')" style="font-family: Arial, sans-serif; cursor: pointer;">Tiếng Việt </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/common/layout-error.json'
import { setCookie } from '@/utils/client/common'

export default {
  layout: 'errlay',
  props: ['error'],
  i18n: {messages: i18n},
  head() {
    return {
      title: this.titlei18n
    }
  },
  data() {
    return {
      titlei18n: this.error.exists ? this.$t('titleNonExists') : this.$t('title'),
    }
  },
  computed: {
    baseUrl() {
      if (this.langSupported().some(e => this.$route.path.startsWith(`/${e}`))) {
        return this.$route.fullPath.substr(3)
      }
      return this.$route.fullPath
    }
  },
  methods: {
    changeLang(lang = '') {
      setCookie('lang', lang)
      if (this.langSupported().some(e => lang === e)) {
        location.href = `/${lang}${this.baseUrl}`
        return
      } else {
        location.href = this.baseUrl
      }

    }
  }
}
</script>
<style lang="scss" scoped>
.err-layout {
  padding: 0 2%;
}
.link-area a {
  display: block;
  font-weight: bold;
  cursor: pointer;
  width: calc(100% / 6);
  text-align: center;
}
</style>