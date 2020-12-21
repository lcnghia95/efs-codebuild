<template>
  <header class="flex layout-col">
    <div v-if="userName" class="user-name nav-wrapper--fi pl-15 wrap-text"><b>{{ userName }}</b></div>
    <NavMenu />
    <!-- <div class="pos-rel" v-if="$store.state.camBan && !$store.state.user.id" 
         :style="{ background: todayColor[today.getDay()], border: `1px solid` + todayColor[today.getDay()] }"
    >
      <a href="/newcampaign">
        <img class="head-banner" src="/img/assets/mobile/common/banner_mobile.png" />
      </a>
      <span class="close-banner" @click="closeBanner"><Plus class="close-icon" /></span>
    </div> -->
    <div class="p-10" style="font-size: 13px; line-height: 15px;">{{ $t('10') }}</div>
    <div class="flex space-between div-height">
      <div class="flex layout-col mid center" @click="onShowMenu">
        <Menu />
      </div>
      <div class="flex content-end ">
        <a :href="headingHref" class="logo-top text-center">
          <i :is="LogoComp" class="logo-cls" title=" " />
        </a>
      </div>
    </div>
    <div id="search-bar-header" class="search-box pb-10 pl-5 pr-5" v-if="searchBox">
      <form :action="actionUrl()" ref="searchForm">
        <template v-if="!isSystemtradeShow">
          <input type="hidden" name="cx" :value="gcsKey" />
          <input type="hidden" name="cof" value="FORID:10" />
          <input type="hidden" name="ie" value="UTF-8" />
          <!-- <input name="siteurl" type="hidden" value="/search"> -->
        </template>
        <div class="flex search-bar">
          <TextField class="text-field" :left-icon="search" :input-attr="attr" :icon-click="onBackClick" />
          <span @click="onBackClick" class="btn-search"> {{ this.$t('6') }} </span>
        </div>
      </form>
    </div>
    <div id="menu-cls" class="flex menu-cls space-around">
      <a v-for="(item, i) in icons" :href="item.url" :key="i"
         class="flex layout-col mid grow1 pos-rel"
         :style="{width: 'calc(100% / ' + icons.length + ')'}"
         v-if="item.isShow"
      >
        <i :is="item.comp" class="svg-size" />
        <span v-html="item.title"></span>
        <span v-if="item.url === '/cart' && $store.state.cartCnt" class="org-number pos-abs ml-20">
          {{ $store.state.cartCnt }}
        </span>
      </a>
    </div>
  </header>
</template>

<script>
import Menu from '@@/../components/icons/Menu.vue'
import Pencil from '@@/../components/icons/Pencil.vue'
import Key from '@@/../components/icons/Key.vue'
import CommentDots from '@@/../components/icons/CommentDots.vue'
import Cart from '@@/../components/icons/Cart.vue'
import BookOpen from '@@/../components/icons/BookOpen.vue'
import Search from '@@/../components/icons/Search.vue'
import TextField from '@/components/form/TextField.vue'
import NavMenu from '@/components/NavMenu.vue'
import i18n from '@@/lang/components-mobile/header.json'
import User from '@@/../components/icons/User.vue'
import Logoja from '@@/../components/icons/Logoja.vue'
import Logoen from '@@/../components/icons/Logoen.vue'
import Logoth from '@@/../components/icons/Logoth.vue'
import Logovi from '@@/../components/icons/Logovi.vue'
// import Plus from '@@/../components/icons/Plus.vue'
// import { setCookie } from '@/utils/client/common'

const GCS_KEY = {
  en: '012690000178031241993:25ucukfzmyn',
  th: '012690000178031241993:y6rzyfwh2yc',
  vi: '012690000178031241993:xpqbaepzsj3'
}
export default {
  props: {
    showSearchBox: Boolean,
  },
  i18n: { messages: i18n },
  components: {
    Menu,
    Pencil,
    Key,
    CommentDots,
    Cart,
    BookOpen,
    Logoja,
    Logoen,
    Logoth,
    Logovi,
    Search,
    TextField,
    NavMenu,
    User,
    // Plus,
  },
  computed: {
    icons() {
      return [
        {
          comp: 'Pencil',
          title: this.$t('1'),
          url: '/register',
          isShow: !this.$store.state.user.id,
        },
        {
          comp: 'Key',
          title: this.$t('2'),
          url: this.keyUrl,
          isShow: !this.$store.state.user.id,
        },
        {
          comp: 'User',
          title: this.$t('7'),
          url: '/mypage',
          isShow: this.$store.state.user.id,
        },
        {
          comp: 'CommentDots',
          title: this.$t('3'),
          url: '/info',
          isShow: true,
        },
        {
          comp: 'Cart',
          title: this.$t('4'),
          url: '/cart',
          isShow: true,
        },
        {
          comp: 'BookOpen',
          title: this.$t('5'),
          url: '/post/1/15376',
          isShow: true,
        },
      ]
    },
    keyUrl() {
      return this.$route.name == 'products' ? `/login?u=${this.$route.fullPath}` : '/login'
    },
    gcsKey() {
      return GCS_KEY[this.$i18n.locale] || '012690000178031241993:kfgxqharxde'
    },
    LogoComp() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `Logo${this.$i18n.locale}`
      }
      return 'Logoja'
    },
    headingHref() {
      let langs = this.langSupported(),
        lang = this.$i18n.locale
      if (langs.includes(lang)) {
        return `/${lang}`
      }
      return '/'
    },
    userName() {
      return this.$store.state.user.id ? (this.$store.state.user.name || this.$t('8') ) : null 
    }
  },
  data() {
    return {
      searchBox: !~['auth', 'password-reset', 'register', 'kabu-api'].indexOf(
        this.$route.name
      ) && !this.showSearchBox,
      search: Search,
      attr: {
        placeholder: this.$t('9'),
        name: 'q',
      },
      isSystemtradeDev: this.$route.path === '/systemtrade/developers',
      isProductsShow: this.$route.path === '/products',
      isSystemtradeShow:
        this.$route.fullPath.indexOf('/systemtrade') === 0 &&
        !this.$route.params.id,
      // today: new Date,
      // todayColor: ['#16a085', '#6ac4de', '#003567', '#5844ac', '#b436b1', '#e6445d', '#f1ae4d' ],
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
  },
  methods: {
    onBackClick() {
      $(this.$refs.searchForm).submit()
    },
    onShowMenu() {
      $('.nav-menu').addClass('active')
      $('body').css('overflow', 'hidden')
    },
    actionUrl() {
      if (this.isSystemtradeDev) {
        ('/systemtrade/developers')
      } else if (this.isSystemtradeShow) {
        return '/systemtrade/search'
      } 
      else if (this.isProductsShow) {
        return '/products'
      } 
      else {
        return '/search'
      }
    },
    // closeBanner() {
    //   let period = 3653 * 24 * 60
    //   setCookie('camBan', 0, period)
    //   this.$store.commit('setCamBan', false)
    // },
  },
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  .div-height {
    height: 60px;
    div:first-child {
      padding-left: 5px;
    }
    div:last-child {
      width: 85%;
      .logo-top {
        display: block;
        max-width: 150px;
        margin: 0 3vw 0 0;
      }
    }
  }
  .logo-cls {
    width: 100%;
    max-height: 55px;
  }
}
.menu-cls {
  border-top: solid 1px #a1a1a1;
  border-bottom: solid 1px #a1a1a1;
  transition: all 1s;
  a {
    text-align: center;
    text-decoration: none;
    &:not(:last-child) {
      border-right: solid 1px #a1a1a1;
    }
  }
  span {
    color: #000031;
    transition: all 0.2s;
    &.org-number {
      font-size: 11px;
      background: #ff6a02;
      border-radius: 5px;
      color: white;
      padding: 0 4px 0;
      top: 5px;
    }
  }
}
.icon-cls {
  color: #000031;
  transition: all 0.4s;
}
.search-box {
  width: 100%;
  z-index: 999;
  &.small-search-click {
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 0 !important;
    opacity: 1 !important;
    /deep/ i {
      color: #000031;
    }
  }
  .btn-search {
    flex: 1 0 auto;
    border: solid 0.5px #000031;
    padding: 5px 0 5px;
    line-height: 30px;
    text-align: center;
    color: white;
    background: #000031;
    cursor: pointer;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 40px;
  }
  .text-field {
    flex: 1 0 65%;
  }
  /deep/ {
    .text-feild {
      height: 40px;
      flex-direction: row-reverse;
      padding-left: 5px;
      border-color: #000031;
      border-radius: 5px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border: solid 2px #000031;
      input {
        height: 28px;
      }
      i.icon-cls {
        width: 28px;
        height: 28px;
      }
    }
    .input-size {
      margin-right: 2px;
    }
  }
}
.user-name {
  background-color: #e7e7e7;
  color: #5bc870;
  line-height: 2.08;
}
.svg-size {
  width: 30px;
  height: 30px;
}
.head-banner {
  margin: auto;
  width: 100%;
}
.close-banner {
  position: absolute;
  right: 3px;
  top: 1px;
  transform: rotate(45deg);
  .close-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
    color: #9ca3b4;
  }
}
</style>
