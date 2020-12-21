<template>
  <div class="h-20" style="min-width: 47px;">
    <a :href="'http://b.hatena.ne.jp/entry/s/www.gogojungle.co.jp' + shareUrl" class="hatena-bookmark-button" data-hatena-bookmark-layout="basic-counter" :title="title">
      <img src="https://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="" width="20" height="20" class="border-none">
    </a>
  </div>
</template>

<script>
export default {
  props: ['url', 'title'],
  computed: {
    shareUrl() {
      return this.url || this.$route.fullPath || ''
    },
  },
  mounted() {
    if (!$('script[id=st-hatena]').length) {
      let el = document.createElement('script')
      el.setAttribute('type', 'text/javascript')
      el.setAttribute('async', 'async')
      el.setAttribute('id', 'st-hatena')
      el.setAttribute('src', 'https://b.st-hatena.com/js/bookmark_button.js')
      document.getElementsByTagName('head')[0].appendChild(el)
    }
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
