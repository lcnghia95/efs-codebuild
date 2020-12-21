<template>
  <div class="err-layout flex layout-col" :style="{top: !!$store.state.user.id ? '230px' : '200px'}">
    <h3 class="mt-40" style="font-weight: bold;">
      {{ error.exists ? $t('5') : $t('1') }}
    </h3>
    <div class="flex img-area">
      <img src="/img/assets/pc/common/robot2.png" alt="robot-error" style="width: 137px; height: 120px;" />
      <img src="/img/assets/pc/common/error-404.png" alt="error-404" class="ml-30" style="width: 214px; height: 120px;" />
    </div>
    <h3 class="mt-40 mb-30" style="font-weight: bold;">
      {{ error.exists ? $t('6') : $t('2') }}
    </h3>
    <div style="font-weight: bold; font-size: 18px;">
      <a style="text-decoration: underline; color: #000;" href="/">
        {{ $t('3') }}
      </a>
      <span v-show="!error.exists">&nbsp;|&nbsp;</span>
      <a style="text-decoration: underline; color: #000;" href="javascript:history.back();" v-show="!error.exists">
        {{ $t('4') }}
      </a>
    </div>
    <div class="mt-30">{{ $t('7') }}</div>
    <div class="flex mid link-area mt-5">
      <a @click="changeLang('ja')" class="mr-10">日本語 </a>|
      <a @click="changeLang('en')" class="ml-10 mr-10">English </a>|
      <a @click="changeLang('th')" class="ml-10 mr-10">ภาษาไทย </a>|
      <a @click="changeLang('ch')" class="ml-10 mr-10">简体中文 </a>|
      <a @click="changeLang('tw')" class="ml-10 mr-10">繁體中文 </a>|
      <a @click="changeLang('vi')" style="font-family: Arial, sans-serif;" class="ml-10">Tiếng Việt </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/common/layout-error.json'
import { setCookie } from '@/utils/client/common'
export default {
  i18n: {messages: i18n},
  props: ['error'],
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
.link-area {
  a {
    display: block;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>