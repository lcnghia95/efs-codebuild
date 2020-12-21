<template>
  <div>
    <a href="/finance/navi" :class="{'active': this.currentTab === this.tabIndex.top}" class="fi-tab flex mid center">{{ $t('5') }}</a>
    <a href="/finance/navi/articles" :class="{'active': this.currentTab === this.tabIndex.articles}" class="fi-tab flex mid center">{{ $t('1') }}</a>
    <a href="/finance/navi/series" :class="{'active': this.currentTab === this.tabIndex.series}" class="fi-tab flex mid center">{{ $t('2') }}</a>
    <!--    <a href="/finance/videos" :class="{'active': this.currentTab === this.tabIndex.video}" class="fi-tab flex mid center">{{ $t('3') }}</a>-->
    <!--    <a v-if="$route.path !== '/finance/navi'" href="/finance/salons" :class="{'active': this.currentTab === this.tabIndex.salon}" class="fi-tab flex mid center">{{ $t('4') }}</a>-->
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/series-tab.json'

const tabIndex = {
  none: 0,
  articles: 1,
  series: 2,
  category: 3,
  top: 5
}
export default {
  i18n: {
    messages: i18n,
  },
  mounted() {
    let vm = this
    $(this.$refs.category).popover({
      placement: 'bottom',
      html: true,
      trigger: 'focus',
      delay: { show: 0, hide: 1500 },
      template:
        '<div class="popover" style="width: 300px;border-radius: 0;" role="tooltip"><div class="arrow"></div><div class="popover-content" style="padding: 10px;"></div></div>',
      content: function() {
        return $(vm.$refs.catList).html()
      },
    })
    $(this.$refs.category).on('shown.bs.popover', function() {
      $(vm.$refs.category).addClass('bg')
    })
    $(this.$refs.category).on('hidden.bs.popover', function() {
      $(vm.$refs.category).removeClass('bg')
    })
  },
  data() {
    return {
      tabIndex: tabIndex,
      currentTab: this.focusedTab() || tabIndex.none,
    }
  },

  methods: {
    focusedTab() {
      // calculate current focused tab:
      if (this.$route.path.includes('/finance/navi/articles')) {
        return this.$route.path.includes('/cat/')
          ? tabIndex.category
          : tabIndex.articles
      }
      if (this.$route.path.includes('/finance/navi/series')) {
        console.log('1')
        return tabIndex.series
      }
      if (this.$route.path.includes('/finance/navi/authors')) {
        return tabIndex.category
      }
      if (this.$route.path.includes('/finance/navi')) {
        console.log('3')
        return tabIndex.top
      }
      return tabIndex.none
    },
  },
}
</script>


<style lang="scss" scoped>
.fi-tab {
  font-size: 15px;
  color: #c9c9c9;
  padding: 5px 20px;
  height: 40px;
  &:hover {
    color: #2a2a2a;
    text-decoration: none;
  }
}
.category-btn {
  outline: none;
  border-right: 1px solid #d4d4d4;
  &.bg {
    background: #d4d4d4;
    color: white;
  }
}
.border-right {
  border-right: 1px solid #d5d5d5;
}
.block {
  display: block;
}
.cat-item {
  padding: 2px 5px;
  &:hover {
    background: #f1f0f1;
  }
}
.active {
  color: #2a2a2a;
  border-bottom: 2px solid #2a2a2a;
  box-shadow: none;
}
/deep/ .arrow {
  left: 103px !important;
}
@media only screen and (max-width: 768px) {
  .fi-tab {
    padding: 5px 15px;
  }
}
</style>

