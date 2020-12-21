<template>
  <div class="h-20" :style="{width: $i18n.locale == 'ja' ? '80px' : '55px'}">
    <div class="line-it-button" :data-lang="lineLang" data-type="share-a" data-ver="3" :data-url="`https://www.gogojungle.co.jp${lineUrl}`" data-color="default" data-size="small" data-count="false"></div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '/',
    },
  },
  mounted() {
    if (!$('script[id=st-line]').length) {
      let el2 = document.createElement('script')
      el2.setAttribute('id', 'st-line')
      el2.setAttribute('src', 'https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js')
      el2.setAttribute('async', 'async')
      el2.setAttribute('defer', 'defer')
      document.getElementsByTagName('head')[0].appendChild(el2)
    }
  },
  computed: {
    lineUrl() {
      return this.url || this.$route.path
    },
    lineLang() {
      return this.langList[this.$i18n.locale || 'ja']
    },
  },
  data() {
    return {
      langList: {
        ja: 'ja',
        en: 'en',
        th: 'th',
        ch: 'zh_CN',
        tw: 'zh_TW',
      },
    }
  },
  methods: {
    onRender() {
      /* eslint-disable no-undef */
      LineIt.loadButton()
      /* eslint-enable no-undef */
    },
  },
}
</script>

<style lang="scss" scoped>
.h-20 {
  height: 20px;
}
</style>
