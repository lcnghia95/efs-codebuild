<template>
  <div class="change-lang pos-rel mb-15 mr-20 mt-10">
    <div class="current-lang flex cursor-pointer" @click="isShowLang = !isShowLang">
      <span class="flex mid center selected-lang">
        {{ language[0].title }}
        <i class="carret ml-5"></i>
      </span>
      <Earth />
    </div>
    <div class="show-lang pos-abs" v-show="isShowLang">
      <template v-for="(lang,i) in language">
        <div
          @click="changeLang(lang.lang)"
          v-if="lang.lang"
          :key="'lang' + i"
          class="text-center pos-rel cursor-pointer"
          :class="['lang-' + lang.lang, {'cur-lang': lang.lang == currentLang.lang}]"
        >
          {{ lang.title }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Earth from '@@/../components/icons/Earth.vue'
import { setCookie } from '@/utils/client/common'
import i18n from '@@/lang/components/change-lang.json'

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
  '/withdrawal/completed',
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
  i18n: { messages: i18n },
  components: {
    Earth,
  },
  mounted() {
    this.$nextTick(() => {
      $('body').on('click', e => {
        let el = e.target
        if (
          this.isShowLang &&
          !el.className.includes('show-lang') &&
          !el.className.includes('selected-lang') &&
          !el.parentElement.className.includes('show-lang') &&
          !el.parentElement.className.includes('selected-lang')
        ) {
          this.isShowLang = false
        }
      })
    })
  },
  methods: {
    async changeLang(lang) {
      if (!lang) {
        return
      }
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
  computed: {
    currentLang() {
      let curLang = this.language.find(item => item.lang === this.$i18n.locale)
      return curLang || this.language[0]
    },
    isSupportUrl() {
      return supportUrl(this.$route.path)
    }
  },
  data() {
    return {
      language: [
        {
          title: 'Languages',
          lang: null,
        },
        {
          title: '日本語',
          lang: 'ja',
        },
        {
          title: 'ภาษาไทย',
          lang: 'th',
        },
        {
          title: 'English',
          lang: 'en',
        },
        {
          title: '繁體中文',
          lang: 'tw',
        },
        {
          title: '简体中文',
          lang: 'ch',
        },
        {
          title: 'Tiếng Việt',
          lang: 'vi',
        },
      ],
      isShowLang: false,
    }
  }
}
</script>
<style lang="scss" scoped>
.change-lang { 
  z-index: 999;
  width: 170px;
  .main-notice {
    display: block;
    text-decoration: none;
    color: #666;
    position: absolute;
    top: 4px;
    left: calc((100% - 1000px) / 2);
    font-size: 13px;
  }
  .current-lang {
    border: 1px solid #b4b4b4;
    margin-left: auto;
    height: 27px;
    background: #fff;
    &:hover {
      background: #f5f5f5;
    }
    > i {
      color: #757575;
      width: 27px;
      height: 25px;
      padding: 5px;
      border-left: 1px solid #b4b4b4;
      background: #f5f5f5;
    }
    > span {
      -webkit-box-flex: 1;
      -ms-flex: 1 0 auto;
      flex: 1 0 auto;
      font-size: 12px;
      font-weight: 700;
      color: #797979;
      letter-spacing: 1px;
      text-align: center;
      padding-top: 2px;
      i.carret {
        border-top: 6px solid #797979;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }
    }
  }
  .show-lang {
    width: 170px;
    border: 1px solid #b4b4b4;
    top: 38px;
    right: 0;
    background: white;
    padding: 7px;
    > div {
      font-size: 14px;
      padding: 7px 10px;
      &:hover {
        background: #f5f5f5;
      }
      &:not(:last-child) {
        margin-bottom: 13px;
        &::before {
          content: "";
          position: absolute;
          bottom: -7px;
          left: 0;
          right: 0;
          width: 70%;
          height: 1px;
          margin: 0 auto;
          background: #b4b4b4;
        }
      }
    }
  }
  .lang-vi,
  .lang-en {
    font-family: Arial, sans-serif;
  }
  .disable-select {
    cursor: default;
  }
  .cur-lang {
    font-weight: bold;
    pointer-events: none;
  }
}
</style>