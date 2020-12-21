<template>
  <div class="h-20">
    <iframe
      :src="`https://www.facebook.com/plugins/like.php?href=https://www.gogojungle.co.jp${fbUrl}&width=${width}&layout=button_count&locale=${fbLang}&action=like&size=${size}&show_faces=true&share=true&height=${height}&appId=${fbAppId}`"
      :width="width || wLoc[$i18n.locale]"
      :height="height || '40'"
      class="fb-btn"
      scrolling="no"
      frameborder="0"
      allowTransparency="true"
    />
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
    size: {
      type: String,
      validator(value) {
        return ['small', 'large'].includes(value)
      },
      default() {
        return 'small'
      }
    },
    width: {
      type: [String, Number],
      default() {
        return 0
      }
    },
    height: {
      type: [String, Number],
      default() {
        return 0
      }
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
        ja: 152,
        en: 130,
        th: 135,
        vi: 145,
        ch: 110,
        tw: 110,
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
