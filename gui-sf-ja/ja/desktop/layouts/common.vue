<template>
  <div v-if="isNaviTop || isArticleDetailPage">
    <app-header v-if="isNaviTop" :back-label="$t(20)" back-link="" :right-label="$t(21)" hide-back-btn />
    <slot class="body"></slot>
    <Footer class="footer" />
  </div>
  <div v-else-if="isSeriesDetailPage || isSearchPage || isAuthorPage|| isSeriesListPage || isArticleListPage">
    <app-header :back-label="$t(20)" back-link="" :right-label="$t(21)" :hide-back-btn="true" />
    <navi-header :is-list-page="!isSeriesDetailPage" />
    <slot class="body series-page"></slot>
    <Footer class="footer" />
  </div>
  <section v-else>
    <Header />
    <BreadCrumb01 />
    <TopBanner v-if="$route.path.startsWith('/kabu-api')" />
    <main class="w-full mt-10">
      <div class="banner w-1000 pos-rel">
        <a
          v-if="banners && banners[1]"
          class="banner-left pos-abs cursor-pointer"
          :href="banners[1].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[1].bannerUrl" width="170" height="1170" alt="" />
        </a>
        <a
          v-if="banners && banners[2]"
          class="banner-right pos-abs cursor-pointer"
          :href="banners[2].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[2].bannerUrl" width="170" height="1170" alt="" />
        </a>
        <a
          v-if="banners && banners[3]"
          class="cursor-pointer mb-20"
          :href="banners[3].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[3].bannerUrl" width="1000" height="130" alt="" />
        </a>
      </div>
      <slot class="body"></slot>
    </main>
    <Footer class="footer" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import BreadCrumb01 from '@@/../components/common/BreadCrumb01.vue'
import TopBanner from '@/components/kabu/TopBanner.vue'
import criteo from '@@/../common/js/criteo'
import NaviMixin from '@@/../common/containers/navi/mixin'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'

import AppHeader from "@@/../common/components/app-header"
import NaviHeader from "@@/../common/components/navi/navi-header"

export default {
  mixins: [NaviMixin],
  i18n: {
    messages: i18n,
  },
  components: {
    Header,
    Footer,
    BreadCrumb01,
    TopBanner,
    AppHeader,
    NaviHeader
  },
  computed: {
    ...mapGetters({
      banners: 'getBanners',
    })
  },
  mounted() {
    criteo.call(this)
  },
}
</script>

<style>
/* stylelint-disable */
@media only screen and (max-device-width: 1024px) {
  html,
  body {
    width: 1025px;
  }
}
</style>
<style lang="scss" scoped>
.series-page {
  background: #e8e8e84f;
}
.banner {
  z-index: 999;
  a {
    display: block;
    &.banner-left {
      top: 0;
      left: -190px;
    }
    &.banner-right {
      top: 0;
      right: -190px;
    }
  }
}
/deep/ .banner-detail {
  display: none;
  margin-bottom: 20px;
  max-width: 100%;
}
@media only screen and (max-width: 1370px) {
  .banner {
    display: none;
  }
  /deep/ .banner-detail {
    display: block;
  }
}
@media (min-width: 1000px) {
  body {
    font-size: 14px;
  }
}
.footer,
header {
  min-width: 1024px;
}
/* stylelint-enable */
</style>
