<template>
  <div>
    <div id="fb-root"/>
    <div class="fb-comments" :data-href="'https://gogojungle.co.jp' + (($route || {}).fullPath || '/')" :data-width="commentWidth" data-numposts="5"/>
  </div>
</template>

<script>
const languages = { ja: 'ja_JP', en: 'en_US', th: 'th_TH', vi: 'vi_VN' }
export default {
  props: {
    commentWidth: {
      type: Number,
      default() {
        return 500
      },
    },
  },
  mounted() {
    let l = languages[localStorage.getItem('lang') || 'ja'],
      d = document,
      s = 'script',
      id = 'facebook-jssdk',
      js,
      fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s)
    js.id = id
    js.src = `https://connect.facebook.net/${l}/sdk.js#xfbml=1&version=v2.12&appId=548191458859890&autoLogAppEvents=1`
    fjs.parentNode.insertBefore(js, fjs)
  },
}
</script>
