<template>
  <div class="w-1000 flex space-around">
    <div style="width: 70%;" class="flex layout-col">
      <span class="mb-30 mt-5 top-title">{{ $t('t' + listTitle[$route.params.showmore || $route.params.sub]) }}</span>
      <div class="flex mb-10">
        <button class="sub-cate-btn ml-5" 
                v-for="(item, index) in tabList"
                :class="{'active': index == selectedTab }"
                @click="onSelectTab(index)"
                :key="'item1-' + index"
        >
          {{ $t(item.id) }}
        </button>
      </div>
      <div class="flex layout-col pr-30">
        <ToolHorizontal02 v-for="item in dataShow.data" :item="item" :key="item.name" />
      </div>
      <div class="text-center mt-30 mb-60">
        <paging :cur-page="dataShow.currentPage"
                :total="dataShow.lastPage"
                :from="dataShow.pagingFrom"
                :to="dataShow.pagingTo"
                :has-scroll="true"
                theme-class="theme3"
                :scroll-offset="300"
                @pagingclick="onGetDataPage"
        />
      </div>
      <div class="w-full text-center">
        <a href="/tools" class="no-underlying">
          <button class="tool-index-btn">
            <ChevronLeft class="chervon-icon mr-10" />
            {{ $t(35) }}
          </button>
        </a>
      </div>
    </div>
    <div style="width: 25%; min-width: 300px;">
      <template v-for="item in leftMenu.cates">
        <a v-if="$route.path.includes(item.url)"
           class="cate-button mb-10 flex pl-15 active"
           :key="item.title + 'etqw'"
           :title="item.title"
        >
          <span :style="{ width: '260px', }" class="wrap-text">{{ item.title }}</span>
          <ChevronRight />
        </a>
        <a v-else
           :href="item.url" class="cate-button mb-10 flex pl-15"
           :key="item.title + 'etqw'"
           :title="item.title"
        >
          <span :style="{ width: '260px', }" class="wrap-text">{{ item.title }}</span>
          <ChevronRight />
        </a>
      </template>
      <br />
      <a :href="item.url" class="cate-button mb-10 blue flex pl-15" v-for="item in leftMenu.others" :key="item.title + 'a921s'" :title="item.title">
        <span :style="{ width: '260px', }" class="wrap-text">{{ item.title }}</span>
        <ChevronRight />
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/tools-index.json'
import { calPaging } from '@/utils/client/common'

import Paging from '@@/../components/paging/Paging.vue'
import ToolHorizontal02 from '@/components/tools/ToolHorizontal02.vue'
import ChevronLeft from '@@/../components/icons/ChevronLeft.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import { pushState } from '@/utils/client/common'

export default {
  components: {
    ToolHorizontal02,
    Paging,
    ChevronLeft,
    ChevronRight,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    listTitle: {
      type: Object,
      default() {
        return {}
      },
    },
    tabList: {
      type: Array,
      default() {
        return []
      },
    },
    type: {
      type: String,
      default() {
        return ''
      },
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      selectedTab: this.tabList.findIndex(e => e.url === this.type),
      leftMenu:  {
        cates: {
          1: {
            title: this.$t('trecommend'),
            url: '/tools/recommend'
          },
          2: {
            title: this.$t('tpprice_all'),
            url: '/tools/popular/price'
          },
          3: {
            title: this.$t('tpcount'),
            url: '/tools/popular/count'
          },
          4: {
            title: this.$t('tpfree_number'),
            url: '/tools/popular/free'
          },
          5: {
            title: this.$t('treview'),
            url: '/tools/review'
          },
          6: {
            title: this.$t('tnew'),
            url: '/tools/new'
          },
        },
        others: {
          1: {
            title: this.$t('34'),
            url: '/tools/search'
          },
          2: {
            title: this.$t('35'),
            url: '/tools'
          },
        },
      },
      curPage: this.$route.params.p || 1,
    }
  },
  computed: {
    dataShow() {
      return calPaging(this.data[this.selectedTab + 1] || [], this.curPage || 1, 30, 4)
    }
  },
  methods: {
    onSelectTab(tab) {
      this.selectedTab = tab
      this.onGetDataPage(1)
    },
    onGetDataPage(page = 1) {
      let params = this.$route.params,
        s = params.showmore || 'popular/' + params.sub,
        url = 'tools/' + s,
        tmp
      tmp = this.tabList[this.selectedTab].url
      tmp && (url += '/' + tmp)
      page > 1 && (url += '/p/' + page)
      pushState(
        url,
        null,
        '',
        location.protocol + '//' + location.host
      )
      this.curPage = page
    }
  }
}
</script>

<style lang="scss" scoped>

.top-title {
  color: #7d7d7d;
  font-size: 20px;
  line-height: 22px;
  font-weight: bold;
}
.cate-button {
  width: 300px;
  height: 53px;
  border: 1px solid #c8c8c8;
  border-radius: 5px;
  line-height: 50px;
  font-size: 15px;
  color: #7d7d7d;
  position: relative;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  .icon-cls {
    position: absolute;
    top: calc(50% - 8px);
    right: 10px;
    height: 17px;
    width: 17px;
    background: #aaa;
    color: #fff;
    border-radius: 35px;
    border: 1px solid #fff;
  }
  &.active {
    background: #aaa;
    color: #fff;
    .icon-cls {
      display: none;
    }
    &:hover {
      background: #aaa;
      color: #fff;
    }
  }
  &:hover {
    background: #cfcfcf;
    color: #fff;
  }
  &:active {
    opacity: 0.8;
  }
  &.blue {
    color: #5f95eb;
    background: #fff;
    border-color: #5f95eb;
    .icon-cls {
      background: #5f95eb;
    }
    &:hover {
      background: #5f95eb;
      color: #fff;
    }
    &:active {
      opacity: 0.8;
    }
  }
}
.sub-cate-btn {
  height: 34px;
  min-width: 100px;
  border: 1px solid #5f95eb;
  border-radius: 5px;
  background: #fff;
  color: #5f95eb;
  font-size: 15px;
  outline: none;
  &:hover {
    background: #edf4ff;
  }
  &:active {
    background: #5f95eb;
    color: #fff;
  }
  &.active {
    background: #5f95eb;
    color: #fff;
  }
}
.tool-index-btn {
  height: 53px;
  width: 300px;
  background: #fff;
  color: #5f95eb;
  border: 1px solid #5f95eb;
  border-radius: 5px;
  margin: 0 auto;
  font-size: 15px;
  position: relative;
  &:hover {
    color: #fff;
    background: #5f95eb;
  }
  .chervon-icon {
    width: 20px;
    height: 20px;
    background: #5f95eb;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    border: 1px solid #fff;
    left: 10px;
    top: calc(50% - 10px);
  }
}
</style>