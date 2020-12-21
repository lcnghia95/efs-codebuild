<template>
  <div id='header-01'>
    <div class="header-logout" v-if="$store.state.user.id">
      <div class="ml-10 mr-20">
        <b>{{$t('47')}}</b>
      </div>
      <div class="flex ml-20">
        <span v-html="$t('9') + $t('8', {name: checkLength(userName)}) "></span>
        <a :href="`${prefix}/logout`">
          <div class="wrap-text">{{ $t('7') }}</div>
          <SignOut class="icon-cls" />
        </a>
      </div>
    </div>
    <!-- <div v-if="$store.state.camBan && !$store.state.user.id" class="pos-rel" >
      <a  class="flex head-banner" href="/newcampaign"
        v-bind:style="{ background: todayColor[today.getDay()], border: `1px solid` + todayColor[today.getDay()] }">
        <img style="margin: auto;" src="/img/assets/pc/common/banner_pc.png" width="1000" height="60" />
      </a>
      <span class="close-banner" @click="closeBanner"><Plus class="close-icon" /></span>
    </div> -->
    <div class="flex space-between mid">
      <div class="ml-10"><b v-if="!$store.state.user.id">{{$t('47')}}</b></div>
      <ChangeLang />
    </div>
    <div class="head-wrapp">
      <h1 class="m-0">
        <span class="heading-cls">{{ heading }}</span>
        <a :href="headingHref" class="logo-head">
          <i :is="LogoComp" class="logo-cls" title=""/>
        </a>
      </h1>
      <div class="header-search-block flex space-between">
        <input type="text" maxlength="80" class="header-search-input" :placeholder="$t('10')" v-model="searchQuery" @keyup="submitByEnter" style="width: 270px" />
        <button class="header-search-button" @click="submit">
          <span class="glyphicon glyphicon-search"></span>
        </button>
      </div>
      <div class="top-bar-new">
        <div class="top-bar-links">
          <a :href="$t('sellerUrl')"><b>{{ $t('43') }}</b></a>
          <a :href="$t('affUrl')"><b>{{ $t('44') }}</b></a>
        </div>
        <ul class="header-icon-list">
          <li class="header-icon-item" v-for="(icon, index) in icons" v-if="icon.isShow" :key="'oslF8'+index" style="min-width: 56px;">
            <a :href="icon.url" class="header-icon-item-link">
              <i class="icon-cls" :is="icon.comp" />
              <div class="header-icon-item-title">
                <div :style="icon.style" v-html="icon.title"></div>
              </div>
            </a>
            <span v-if="icon.url === '/cart' && $store.state.cartCnt" class="show-cart flex mid center">
              {{ $store.state.cartCnt }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/header.json'
import ChangeLang from '@@/../components/header/ChangeLang.vue'
import Pencil from '@@/../components/icons/Pencil.vue'
import Key from '@@/../components/icons/Key.vue'
import CommentDots from '@@/../components/icons/CommentDots.vue'
import Cart from '@@/../components/icons/Cart.vue'
import BookOpen from '@@/../components/icons/BookOpen.vue'
import Search from '@@/../components/icons/Search.vue'
import SignOut from '@@/../components/icons/SignOut.vue'
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
  i18n: { messages: i18n },
  components: {
    Pencil,
    Key,
    CommentDots,
    Cart,
    BookOpen,
    Search,
    SignOut,
    User,
    ChangeLang,
    Logoja,
    Logoen,
    Logoth,
    Logovi,
    // Plus
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
  },
  methods: {
    checkLength(userName){
      return userName.length>50 ? `${userName.slice(0,50)}...`: userName
    },
    submitByEnter(e) {
      if (e.keyCode == 13) {
        this.submit()
      }
    },
    submit() {
      let cx = GCS_KEY[this.$i18n.locale] || '012690000178031241993:kfgxqharxde',
        cof = 'FORID%3A10',
        ie = 'UTF-8',
        lr = this.langSupported().includes(this.$i18n.locale) ? `lang_${this.$i18n.locale}` : 'lang_ja',
        q = this.searchQuery
      if (!this.searchQuery) {
        return
      }
      location.href = `/search?cx=${cx}&cof=${cof}&lr=${lr}&ie=${ie}&q=${q}`
    },
    switchToMobile() {
      setCookie('forceRenderDesktop', '', 0)
      // TODO: Hieu Nguyen - Correct finance navi structure
      if (this.$route.path.includes('/t/')) {
        location.href = this.$route.path.replace(
          '/articles/searchresult/',
          '/searchresult/'
        )
      } else {
        location.reload()
      }
    },
    // closeBanner() {
    //   let period = 3653 * 24 * 60
    //   setCookie('camBan', 0, period)
    //   this.$store.commit('setCamBan', false)
    // },
  },
  computed: {
    prefix() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `/${this.$i18n.locale}`
      }
      return ''
    },
    icons() {
      return [
        {
          comp: 'Pencil',
          title: this.$t('1'),
          url: this.$t('registerUrl'),
          isShow: !this.$store.state.user.id,
        },
        {
          comp: 'Key',
          title: this.$t('2'),
          url: this.prefix + '/login',
          isShow: !this.$store.state.user.id,
        },
        {
          comp: 'User',
          title: this.$t('32'),
          url: '/mypage',
          isShow: this.$store.state.user.id,
        },
        {
          comp: 'CommentDots',
          title: this.$t('3'),
          url: this.prefix + '/info',
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
          url: this.$t('guideUrl'),
          isShow: true,
        },
      ]
    },
    heading() {
      let path = this.$route.path,
        bcRoutes = this.$store.state.bcRoutes || []
      if (this.h1Obj[path]) {
        return this.h1Obj[path]
      } else if (bcRoutes.length) {
        let item = bcRoutes.slice(-1)[0] || {}
        return item.name || this.$t('breadcrumbs02')[item.path] || 'GogoJungle'
      } else {
        return 'GogoJungle'
      }
    },
    headingHref() {
      let langs = this.langSupported(),
        lang = this.$i18n.locale
      if (langs.includes(lang)) {
        return `/${lang}`
      }
      return '/'
    },
    LogoComp() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `Logo${this.$i18n.locale}`
      }
      return 'Logoja'
    },
  },
  data() {
    let searchQuery = this.$nuxt._route.query
    
    return {
      h1Obj: {
        '/systemtrade': this.$t('h1-heading.1'),
        '/systemtrade/fx': this.$t('h1-heading.2'),
        '/systemtrade/stocks': this.$t('h1-heading.3'),
      },
      searchQuery: searchQuery.q && !searchQuery.isindex ? searchQuery.q : '',
      search: Search,
      attr: {
        placeholder: this.$t('6'),
      },
      showLogout: true,
      user: {},
      isLogin: false,
      cartCnt: null,
      userName: this.$store.state.user.name || this.$t('45'),
      // today: new Date,
      // todayColor: ['#16a085', '#6ac4de', '#003567', '#5844ac', '#b436b1', '#e6445d', '#f1ae4d' ]
    }
  },
}
</script>
<style lang="scss" scoped>
.icon-cls {
  display: inline-block;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
}
.header-logout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #edf4f4;
  padding: 5px;
  line-height: 20px;
  color: #8b8b8b;
  a {
    display: flex;
    align-items: center;
    color: #8b8b8b;
    text-decoration: none;
    margin: 0 20px 0 35px;
    cursor: pointer;
    .icon-cls {
      width: 24px;
      height: 24px;
    }
  }
}
.head-wrapp {
  bottom: 10px;
  width: 1000px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  .heading-cls {
    position: fixed;
    z-index: -1;
    top: -300px;
  }
  h1 {
    width: 250px;
    height: 83px;
    white-space: nowrap;
    position: relative;
    bottom: 10px;
    a {
      position: absolute;
      top: 0;
      left: 0;
      width: 250px;
      height: 83px;
    }
    .logo-cls {
      width: 250px;
      height: 83px;
    }
  }
  .header-search-block {
    border-radius: 23px;
    margin: 5px 10px 0 20px;
    overflow: hidden;
    display: flex;
    height: 42px;
    border: 1px solid #bcb5b9;
    input {
      font-size: 14px;
      padding-left: 30px;
      &.header-search-input {
        height: 42px;
        line-height: 47px;
        border: 0;
        outline: none;
        overflow: hidden;
        &::placeholder {
          color: #aeaead;
        }
      }
    }
    .header-search-button {
      background-color: white;
      width: 40px;
      height: 44px;
      padding: 0;
      border: 0;
      color: #777;
      font-size: 15px;
      outline: none;
      &:hover {
        background-color: #eee;
      }
    }
  }
  .top-bar-new {
    display: flex;
    flex: 0 1 auto;
    position: relative;
    .top-bar-links {
      position: absolute;
      top: -27px;
      font-size: 12px;
      right: 6px;
      display: flex;
      text-align: right;
      a {
        padding: 0 10px;
        &:nth-child(1) {
          color: #5844ac;
          border-left: none;
        }
        &:nth-child(2) {
          color: #ff1493;
        }
      }
    }
    .header-icon-list {
      display: flex;
      list-style: none;
      margin-bottom: 0;
      padding-left: 5px;
      .header-icon-item {
        cursor: pointer;
        text-align: center;
        position: relative;
        line-height: 20px;
        &:hover {
          background: #eef7fc;
        }
        .header-icon-item-link {
          display: block;
          color: #333;
          text-decoration: none;
          /deep/ i {
            width: 30px;
            height: 30px;
            color: #888;
          }
          .header-icon-item-title {
            color: #666;
            font-size: 12px;
            line-height: 12px;
            padding: 0 10px;
            margin-top: 1px;
            border-right: 1px solid #ccc;
            > div {
              white-space: nowrap;
            }
          }
        }
        &:last-child {
          .header-icon-item-title {
            border-right: none;
          }
        }
        .show-cart {
          position: absolute;
          top: 0;
          right: 5px;
          background: #ff6900;
          color: white;
          font-size: 10px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
.head-banner {
  &:hover {
    opacity: 0.7;
  }
}
.close-banner {
  position: absolute;
  right: 10px;
  top: 3px;
  transform: rotate(45deg);
  color: #9ca3b4;
  .close-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
}
</style>