<template>
  <div>
    <a href="/finance/navi/articles" :class="{'active': this.currentTab === this.tabIndex.articles}" class="fi-tab flex mid center">{{ $t('1') }}</a>
    <a href="/finance/navi/series" :class="{'active': this.currentTab === this.tabIndex.series}" class="fi-tab flex mid center">{{ $t('2') }}</a>
    <button ref="category" :class="{'active': this.currentTab === this.tabIndex.category}" class="fi-tab category-btn" trigger="focus" data-toggle="popover">
      <span class="caret"></span> {{ $t('3') }}
    </button>
    <div ref="catList" class="hide">
      <div class="flex space-between h-full">
        <a :href="'/finance/navi/authors'" class="cat-item block w-full no-underlying">{{ this.$t('12') }}</a>
      </div>
      <!-- Backup for later version that support categories -->
      <!-- <div class="flex space-between h-full">
        <div class="grow11 border-right pr-10">
          <a v-for="(catl,index) in catL" :key="index+'gVd2W'" :href="catl.href" class="cat-item block w-full no-underlying">{{ catl.text }}</a>
        </div>
        <div class="grow11 ml-10">
          <a v-for="(catr,index) in catR" :key="index+'sG7wQ'" :href="catr.href" class="cat-item block w-full no-underlying">{{ catr.text }}</a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-tab.json'

const tabIndex = {
  none: 0,
  articles: 1,
  series: 2,
  category: 3,
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
      catL: [
        { text: this.$t('4'), href: '/finance/navi/articles/cat/1' },
        { text: this.$t('5'), href: '/finance/navi/articles/cat/2' },
        { text: this.$t('6'), href: '/finance/navi/articles/cat/3' },
        { text: this.$t('7'), href: '/finance/navi/articles/cat/4' },
        { text: this.$t('8'), href: '/finance/navi/articles/cat/5' },
      ],
      catR: [
        { text: this.$t('9'), href: '/finance/navi/articles/cat/6' },
        { text: this.$t('10'), href: '/finance/navi/articles/cat/7' },
        { text: this.$t('12'), href: '/finance/navi/authors' },
        { text: this.$t('11'), href: '/finance/navi/articles/cat/8' },
      ],
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
        return tabIndex.series
      }
      if (this.$route.path.includes('/finance/navi/authors')) {
        return tabIndex.category
      }
      return tabIndex.none
    },
  },
}
</script>


<style lang="scss" scoped>
.fi-tab {
  padding: 5px 20px;
  height: 40px;
  background: white;
  font-size: 15px;
  color: #2d2d2d;
  text-decoration: none;
  border: 1px solid #d4d4d4;
  border-right: none;
  &:last-child {
    border-right: 1px solid #d4d4d4;
  }
  &:hover {
    background: #d4d4d4;
    color: white;
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
  border-bottom: 2px solid #9c8871;
  box-shadow: none;
}
/deep/ .arrow {
  left: 103px !important;
}
</style>

<docs>
  ```vue
    <template>
      <Tab/>
    </template>
  ```
</docs>
