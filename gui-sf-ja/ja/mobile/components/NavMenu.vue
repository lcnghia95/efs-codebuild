<template>
  <no-ssr>
    <div class="nav-menu">
      <nav class="flex layout-col sidebar">
        <div class="home-menu pl-20 pt-25 pb-25 flex mid">
          <Home class="mr-5" />
          <a href="/">{{ $t('1') }}</a>
        </div>
        <div v-for="(item, idx) in sideMenus" class="pt-15 pb-15 pl-20 border-bottom pos-rel" :key="'65lIJRavR'+idx">
          <a v-if="item.url!='/logout'" :href="item.url" class="link">
            {{ item.title }}
          </a>
          <a v-else-if="userId" :href="item.url">{{ item.title }}</a>
          <span class="new-item" v-if="item.isNew">NEW</span>
          <!--<nuxt-link :to="item.url" v-else class="link">-->
          <!--{{ item.title }}-->
          <!--</nuxt-link>-->
        </div>
      </nav>
      <div class="overlay" @click="onShowMenu"></div>
    </div>
  </no-ssr>
</template>

<script>
import i18n from '@@/lang/components-mobile/navmenu.json'
import Home from '@@/../components/icons/Home.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Home,
  },
  data() {
    return {
      sideMenus: [
        {
          title: this.$t('2'),
          url: '/systemtrade',
          isNew: true,
        },
        {
          title: this.$t('9'),
          url: '/systemtrade/stocks',
        },
        {
          title: this.$t('3'),
          url: '/tools',
        },
        {
          title: this.$t('4'),
          url: '/finance/navi',
        },
        {
          title: this.$t('17'),
          url: '/finance/salons',
        },
        {
          title: this.$t('25'),
          url: 'https://real-trade.tech/ja',
        },
        {
          title: this.$t('23'),
          url: '/kabu-api',
        },
        {
          title: this.$t('22'),
          url: 'https://labo.gogojungle.co.jp/',
        },
        {
          title: this.$t('13'),
          url: '/crowdsourcing',
        },
        {
          title: this.$t('10'),
          url: process.env.BLOG_URL,
        },
        {
          title: this.$t('7'),
          url: '/review',
        },
        {
          title: this.$t('8'),
          url: '/products',
        },
        {
          title: this.$t('19'),
          url: this.fxonUrl('/portfolio'),
        },
        {
          title: this.$t('20'),
          url: '/markets',
        },
        {
          title: this.$t('11'),
          url: '/markets/economics',
        },
        {
          title: this.$t('12'),
          url: '/markets/charts',
        },
        {
          title: this.$t('16'),
          url: '/markets/spreads',
        },
        {
          title: this.$t('18'),
          url: '/finance/videos',
        },
        {
          title: this.$t('6'),
          url: '/event',
        },
        {
          title: this.$t('14'),
          url: '/companies',
        },
        {
          title: this.$t('26'),
          url: '/systemtrade/converter',
        },
        {
          title: this.$t('24'),
          url: '/logout',
        },
      ],
      isShowOverlay: false,
    }
  },
  methods: {
    onShowMenu() {
      $(this.$el).removeClass('active')
      $('body').css('overflow', 'visible')
    },
  },
  computed: {
    userId() {
      return this.$store.state.user.id 
    }
  }
}
</script>

<style lang="scss" scoped>
.border-bottom:not(:last-child) {
  border-bottom: 1px solid #a09fa0;
}
.sidebar {
  position: fixed;
  top: 0;
  left: -79%;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: white;
  overflow-y: auto;
  padding-bottom: 100px;
  z-index: 1001;
  visibility: hidden;
  transition: 500ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  a {
    display: block;
    .link {
      color: #00002d;
    }
  }
  .home-menu {
    background: #00002d;
    a {
      color: white;
      letter-spacing: 1px;
      text-decoration: none;
      padding-top: 2px;
    }
    i {
      width: 25px;
      height: 25px;
      color: white;
    }
  }
}
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.54);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: 500ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.active {
  .sidebar {
    left: 0;
    visibility: visible;
  }
  .overlay {
    visibility: visible;
    opacity: 1;
  }
}
.new-item {
  color: #fff;
  background: #ff6901;
  font-size: 10px;
  display: inline-block;
  padding: 1px 4px;
  border-radius: 3px;
  top: 14px;
  right: 10px;
  -webkit-transform: rotate(-9deg);
  transform: rotate(-9deg);
  position: absolute;
  z-index: 1;
}
</style>
