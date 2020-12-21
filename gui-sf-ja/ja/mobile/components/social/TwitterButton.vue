<template>
  <div class="h-20">
    <iframe
      :src="`https://platform.twitter.com/widgets/tweet_button.html?size=${btnSize}&url=https://www.gogojungle.co.jp${tweetUrl}&via=www.gogojungle.co.jp&lang=${tweetLang}&text=${title}`" :width="size.width" :height="size.height" title="Tweet" class="tweet-btn"/>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: Object,
      default: () => {
        return {
          width: 75,
          height: 40,
        }
      },
    },
    btnSize: {
      type: String,
      default: 'm',
    },
  },
  computed: {
    tweetUrl() {
      return this.url || this.$route.path
    },
    tweetLang() {
      return this.$i18n.locale || 'ja'
    },
  },
}
</script>

<style lang="scss" scoped>
.tweet-btn {
  border: 0;
  overflow: hidden;
}
.h-20 {
  height: 20px;
}
</style>
