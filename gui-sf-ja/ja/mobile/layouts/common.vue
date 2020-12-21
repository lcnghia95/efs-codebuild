<template>
  <div v-if="isArticleDetailPage || isNaviTop">
    <app-header v-if="isNaviTop" :back-label="$t(20)" back-link="" :right-label="$t(21)" :hide-back-btn="isNaviTop" />
    <slot class="body"></slot>
    <Footer class="footer" />
  </div>
  <div v-else-if="isSeriesDetailPage || isSearchPage || isAuthorPage || isSeriesListPage || isArticleListPage">
    <app-header :back-label="$t(20)" back-link="" :right-label="$t(21)" :hide-back-btn="true" />
    <navi-header :is-list-page="!isSeriesDetailPage" />
    <slot class="body"></slot>
    <Footer class="footer" />
  </div>
  <main v-else>
    <Header />
    <slot class="body"></slot>
    <Footer />
    <no-ssr>
      <ScrollTopButton />
    </no-ssr>
  </main>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ScrollTopButton from '@/components/ScrollTopButton.vue'
import '@/assets/form.css'
import criteo from '@@/../common/js/criteo'
import NaviMixin from '@@/../common/containers/navi/mixin'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'

import AppHeader from "@@/../common/components/app-header"
import NaviHeader from "@@/../common/components/navi/navi-header"

export default {
  mixins:[NaviMixin],
  i18n: {
    messages: i18n,
  },
  components: {
    Header,
    Footer,
    ScrollTopButton,
    AppHeader,
    NaviHeader
  },
  mounted() {
    criteo.call(this)
  },
}
</script>
<style lang="scss" scoped>
.banner:hover img {
  opacity: 0.85;
}
</style>
