<template>
  <div class="h-20">
    <iframe :src="`https://www.facebook.com/plugins/like.php?href=https://www.gogojungle.co.jp${fbUrl}&width=100px&layout=button_count&locale=${fbLang}&action=like&size=small&show_faces=true&share=true&height=46&appId=${fbAppId}`" :width="wLoc[$i18n.locale]" height="40" class="fb-btn" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
  </div>
</template>

<script>
const langList = {
  ja: 'ja_JP',
  en: 'en_US',
  th: 'th_TH',
  ch: 'zh_CN',
  tw: 'zh_TW',
  vi: 'vi_VN',
}
export default {
  props: {
    url: {
      type: String,
    },
  },
  computed: {
    fbUrl() {
      return this.url || this.$route.path
    },
    fbLang() {
      return langList[this.$i18n.locale || 'ja']
    },
  },
  data() {
    return {
      fbAppId: process.env.FACEBOOK_CLIENT_ID,
      wLoc: {
        ja: 150,
        en: 110,
        th: 110,
        vi: 125,
        ch: 140,
        tw: 140,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.fb-btn {
  border: 0;
  overflow: hidden;
}
.h-20 {
  height: 20px;
}
</style>
