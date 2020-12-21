<template>
  <div class="lang flex flex-wrap space-between">
    <div v-for="lang in language" 
         :key="lang.lang" @click="changeLang(lang.lang)" :class="['lang-item lang-' + lang.lang]"
    >
      <Lzimg class="img" width="14" :alt="lang.title" :data-src="lang.src" />
      <div class="title">{{ lang.title }}</div>
    </div>
  </div>
</template>

<script>
import Lzimg from "@@/../components/Lzimg.vue"
import { setCookie } from '@/utils/client/common'

const URLS = [
  '/systemtrade/search',
  '/login',
  '/logout',
  '/register',
  '/info',
  '/password/reset',
  '/inquiry',
  '/post',
  '/search',
]

function isSupportUrl(url) {
  return (
    URLS.some(e => url.startsWith(e)) ||
    (url.startsWith('/systemtrade') &&
      url.includes('fx') &&
      !url.includes('economics') &&
      url !== '/systemtrade/fx'
    )
  )
}

export default {
  components: {
    Lzimg
  },
  data() {
    return {
      language: [
        {
          title: "English",
          lang: "en",
          src: "/img/assets/mobile/user/lang2.svg"
        },
        {
          title: "日本語",
          lang: "ja",
          src: "/img/assets/mobile/user/ja.png"
        },
        {
          title: "简体中文",
          lang: "ch",
          src: "/img/assets/mobile/user/cn.png"
        },
        {
          title: "繁體中文",
          lang: "tw",
          src: "/img/assets/mobile/user/tw.png"
        },
        {
          title: "Tiếng Việt",
          lang: "vi",
          src: "/img/assets/mobile/user/vn.png"
        },
        {
          title: "ภาษาไทย",
          lang: "th",
          src: "/img/assets/mobile/user/th.png"
        },
      ]
    }
  },
  methods: {
    async changeLang(lang) {
      setCookie('lang', lang)
      if (this.$store.state.user.id) {
        await this.GoGoHTTP.post('/api/v3/language/change')
      }
      if (this.$route.path.startsWith('/cart') || this.$route.path.startsWith('/users')) {
        location.reload()
        return
      }
      let langs = this.langSupported(),
        // ou = location.href.replace(location.origin, ''),
        ou = location.pathname,
        hasAppendUrl = langs.some(e => ou.startsWith(`/${e}`))
      // TODO: remove this block when release
      if (langs.includes(lang) && isSupportUrl(ou)) {
        location.href = `/${lang}${ou.substring(hasAppendUrl ? 3: 0, ou.length)}${location.search}`
        return
      }
      location.href = ((hasAppendUrl ? `${ou.substring(3, ou.length)}` : ou) || '/') + location.search
    },
  },
}
</script>

<style lang="scss" scoped>
.lang {
  border-bottom: solid #575757 1px;
  padding: 15px 20px 15px 25px;
  color: #afafaf;
}
.img {
  margin-right: 3px;
  margin-bottom: 3px;
  max-width: 14px;
}
.lang-item {
  padding: 3px 0;
  width: 33%;
  align-items: center;
}
.lang-vi {
  font-family: Arial, sans-serif;
}
.lang-vi, .lang-ja {
  text-align: center;
}
.title {
  width: 70px;
  display: inline-block;
  text-align: left;
}
.lang-th, .lang-ch {
  text-align: right;
}
</style>