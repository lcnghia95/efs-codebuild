<template>
  <div class="nav-wrapper--fi">
    <nav class="nav--fi w-1000 flex">
      <a
        :href="Object.keys(pages)[0]"
        class="nav__i--fi"
        :class="{ active: selectedTab === 1 }"
      >
        <div class="border-in w-full flex mid center">
          <navi-icon class="nav__icon--fi" />
          <span class="nav__a-txt--fi">{{ $t('2') }}</span>
        </div>
      </a>
      <a
        :href="Object.keys(pages)[1]"
        class="nav__i--fi"
        :class="{ active: selectedTab === 2 }"
      >
        <div class="border-in w-full flex mid center">
          <File class="nav__icon--fi" />
          <span class="nav__a-txt--fi">{{ $t('4') }}</span>
        </div>
      </a>
      <a
        :href="Object.keys(pages)[2]"
        class="nav__i--fi"
        :class="{ active: selectedTab === 3 }"
      >
        <div class="border-in w-full flex mid center">
          <graduation-cap class="nav__icon--fi" />
          <span class="nav__a-txt--fi">{{ $t('1') }}</span>
        </div>
      </a>
      <a
        :href="Object.keys(pages)[3]"
        class="nav__i--fi"
        :class="{ active: selectedTab === 4 }"
      >
        <div class="border-in w-full flex mid center nav__i-last--fi">
          <youtube class="nav__icon--fi" />
          <span class="nav__a-txt--fi">{{ $t('3') }}</span>
        </div>
      </a>
    </nav>
  </div>
</template>

<script>
import GraduationCap from '@@/../components/icons/GraduationCap.vue'
import NaviIcon from '@@/../components/icons/NaviIcon.vue'
import Youtube from '@@/../components/icons/Youtube.vue'
import File from '@@/../components/icons/File.vue'
import i18n from '@@/lang/components-desktop/finance-top-menu.json'
export default {
  components: {
    GraduationCap,
    NaviIcon,
    Youtube,
    File,
  },
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
$c_border: #4d4439;
$c_a: #666;
$c_a_hover: #fff;
$c_a_hover_bg: #4d4439;
.nav-wrapper--fi {
  border-bottom: 3px solid $c_border;
  border-top: 1px solid $c_border;
  &.border-top {
    border-top: 1px solid $c_border;
  }
}
.border-in {
  margin: 10px -1px;
  border-left: 1px solid $c_border;
}
.nav__icon--fi {
  width: 27px;
  height: 27px;
}
.nav__i-last--fi {
  border-right: 1px solid $c_border;
}
.nav__i--fi {
  display: flex !important;
  justify-content: center;
  align-items: center;
  color: $c_a;
  height: 56px;
  width: 250px;
  font-size: 28px;
  &:hover, &.active {
    text-decoration: none;
    background: $c_a_hover_bg;
    color: $c_a_hover;
  }
  &.active {
    margin-right: -1px;
  }
}
.nav__a-txt--fi {
  font-size: 16px;
  margin: 0 7px 0 7px;
}
</style>
