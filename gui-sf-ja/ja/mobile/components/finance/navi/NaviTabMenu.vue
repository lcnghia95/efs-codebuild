<template>
  <div class="tab-box">
    <a href="/finance/navi" :class="{'active': currentTab === tabIndex.top}" class="fi-tab flex mid center">{{ $t('0') }}</a>
    <a href="/finance/navi/articles" :class="{'active': currentTab === tabIndex.articles}" class="fi-tab flex mid center">
      {{ $t('1') }}
    </a>
    <a href="/finance/navi/series" :class="{'active': currentTab === tabIndex.series}" class="fi-tab flex mid center">
      {{ $t('2') }}
    </a>
    <a ref="category" :class="{'active': currentTab === tabIndex.category}" class="fi-tab category-btn flex mid center" trigger="focus" data-toggle="popover">
      {{ $t('3') }} <span class="caret c-cat"/>
    </a>
    <div ref="catList" class="hide">
      <div class="flex space-between h-full">
        <a :href="'/finance/navi/authors'" class="cat-item block w-full no-underlying">{{ this.$t('12') }}</a>
      </div>
      <!-- TODO: Backup for later version that support categories -->
      <!-- <div class="flex space-between h-full">
        <div class="grow11 border-right pr-10">
          <a v-for="(cat, index) in cat" :key="index+'gVd2W'" :href="cat.href" class="cat-item block w-full no-underlying">{{ cat.text }}</a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-tab-menu.json'

const tabIndex = {
  none: -1,
  top: 0,
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
      cat: [
        { text: this.$t('4'), href: '/finance/navi/articles/cat/1' },
        { text: this.$t('5'), href: '/finance/navi/articles/cat/2' },
        { text: this.$t('6'), href: '/finance/navi/articles/cat/3' },
        { text: this.$t('7'), href: '/finance/navi/articles/cat/4' },
        { text: this.$t('8'), href: '/finance/navi/articles/cat/5' },
        { text: this.$t('9'), href: '/finance/navi/articles/cat/6' },
        { text: this.$t('10'), href: '/finance/navi/articles/cat/7' },
        { text: this.$t('12'), href: '/finance/navi/authors' },
        { text: this.$t('11'), href: '/finance/navi/articles/cat/8' },
      ],
      tabIndex,
      currentTab: this.focusedTab(),
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
      if (this.$route.path == '/finance/navi/series') {
        return tabIndex.series
      }
      if (this.$route.path == '/finance/navi/authors') {
        return tabIndex.category
      }
      if (this.$route.path == '/finance/navi') return tabIndex.top
      return tabIndex.none
    },
  },
}
</script>


<style lang="scss" scoped>
.tab-box {
  background: rgb(243, 240, 239);
}
.fi-tab {
  width: 25%;
  height: 40px;
  font-size: 3.5vw;
  color: #707070;
  text-decoration: none;
}
.category-btn {
  outline: none;
  &.bg {
    background: #d4d4d4;
    color: white;
  }
}
.block {
  display: block;
}
.cat-item {
  padding: 2px 5px;
}
.active {
  color: #9c8871;
  font-weight: bold;
  box-shadow: none;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 80%;
    height: 2px;
    background: #9c8871;
  }
}
.c-cat {
  color: #a0a0a0;
}
/deep/ .arrow {
  left: 230px !important;
}
</style>

<docs>
  ```vue
    <template>
      <Tab/>
    </template>
  ```
</docs>
