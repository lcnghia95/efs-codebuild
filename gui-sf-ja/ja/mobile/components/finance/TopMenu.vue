<template>
  <div class="nav-wrapper">
    <div class="w-full flex mid">
      <a href="/finance/navi" class="nav-item" :class="{ 'active': selectedTab === 1 }">
        <span class="nav-text">{{ $t('2') }}</span>
      </a>
      <a href="/finance/mailmagazine" class="nav-item" :class="{ 'active': selectedTab === 2 }">
        <span class="nav-text">{{ $t('4') }}</span>
      </a>
      <a href="/finance/salons" class="nav-item" :class="{ 'active': selectedTab === 3 }">
        <span class="nav-text">{{ $t('1') }}</span>
      </a>
      <a href="/finance/videos" class="nav-item nav-item-last" :class="{ 'active': selectedTab === 4 }">
        <span class="nav-text">{{ $t('5') }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-top-menu.json'
export default {
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      pages: {
        '/finance/navi': 1,
        '/finance/mailmagazine': 2,
        '/finance/salons': 3,
        '/finance/videos': 4,
        '/finance/videos/premier': 4,
        '/finance/videos/new': 4,
        '/finance/videos/trend': 4,
        '/finance/videos/gogojungletv': 4,
        '/finance/videos/searchresult': 4,
      },
    }
  },
  computed: {
    selectedTab() {
      for (let pagesKey in this.pages) {
        if ((this.$route || { fullPath: '' }).fullPath.startsWith(pagesKey)) {
          return this.pages[pagesKey]
        }
      }
      return 0
    },
  },
}
</script>

<style lang="scss" scoped>
$c_border: #d9d9d9;
$c_a: #666;
$c_a_hover: #fff;
$c_a_hover_bg: #9b7543;
.nav-wrapper {
  border-bottom: 1px solid $c_border;
  &.border-top {
    border-top: 1px solid $c_border;
  }
}
.nav-item-last {
  border-right: 1px solid $c_border;
}
.nav-item {
  display: flex !important;
  text-align: center;
  color: $c_a;
  height: 45px;
  align-items: center;
  width: calc(100% / 4);
  border-left: 1px solid $c_border;
}
.nav-item:hover,
.nav-item.active {
  text-decoration: none;
  background: $c_a_hover_bg;
  color: $c_a_hover;
}
.nav-text {
  font-size: 15px;
  padding: 5px 0;
  margin: 0 auto;
}
</style>
