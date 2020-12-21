<template>
  <div>
    <div class="tab flex space-between">
      <div class="w-full tab-item"
           :class="{ 'active': dataCurrent == index }"
           v-for="(item, index) in dataTabs"
           @click="onTabClick(index)"
           :key="item + 'tabesa01'"
      >
        {{ item }}
      </div>
    </div>
    <div class="tab-content pt-10 pb-10 pl-5 pr-5">
      <ToolHorizontal :rank="index + 1" :item="item" v-for="(item, index) in list[dataCurrent]" :key="item.id" />
      <a class="mt-10 mb-5 cate-link-btn flex content-end" :href="(urlInfo.showmoreUrls || {})[dataCurrent - 1]">
        <div class="mr-5">
          {{ $t('1') }}
        </div>
        <div><ChevronRight /></div>
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/common-showmore.json'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import ToolHorizontal from '@/components/tools/ToolHorizontal.vue'
import { pushState } from '@/utils/client/common'

export default {
  components: {
    ToolHorizontal,
    ChevronRight,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    tabs: {
      type: Object,
      default() {
        return {
          1: 1
        }
      },
    },
    current: {
      type: Number,
      default() {
        return 1
      },
    },
    list: {
      type: Object,
      default() {
        return {}
      },
    },
    urlInfo: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      dataCurrent: this.current,
      dataTabs: this.tabs,
    }
  },
  mounted() {
    this.dataCurrent = this.current
    this.dataTabs = this.tabs
  },
  methods: {
    onTabClick(index) {
      this.dataCurrent = index
      pushState(
        ((this.urlInfo || {}).urls || [])[index - 1],
        null,
        '',
        location.protocol + '//' + location.host
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {
  .tab-item {
    border: 1px solid #d0d5dc;
    border-bottom-color: #a0a0a0;
    padding: 2px 0;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    color: #787878;
    &.active {
      border-bottom: none;
      border-color: #a0a0a0;
      color: #5f95eb;
    }
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
  }
}
.tab-content {
  border-left: 1px solid #a0a0a0;
  border-right: 1px solid #a0a0a0;
  border-bottom: 1px solid #a0a0a0;
  height: calc(100% - 30px);
}
.cate-link-btn {
  height: 12px;
  width: 100%;
  font-size: 12px;
  background: #fff;
  border-radius: 5px;
  color: #5f95eb;
  text-align: right;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  .icon-cls {
    height: 16px;
    width: 16px;
    border: 1px solid #fff;
    border-radius: 25px;
    background: #5f95eb;
    color: #fff;
  }
  &:hover {
    opacity: 0.8;
  }
}
.tool-item /deep/ {
  height: 99px;
  padding: 15px 8px !important;
  .tool-item-image {
    height: 72px;
    width: 72px;
    img {
      height: 72px;
      width: 72px;
    }
    .rank {
      height: 21px;
      width: 21px;
    }
    .sale {
      top: -5px;
      right: -8px;
    }
  }
  .tool-item-content {
    width: calc(100% - 76px) !important;
    height: 76px;
    padding-left: 5px !important;
    line-height: 12px;
    font-size: 12px;
    .gg-rating {
      font-size: 11px !important;
    }
    .prices {
      min-height: 34px;
    }
  }
}
</style>

<docs>
```vue
<template>
  <Tab :tabData="tabData"/>
</template>
<script>
  import Tab from './Tab.vue';
  export default {
    data() {
      return {
        tabData: {
          tabs: {
            1: '3ヶ月間',
            2: '1ヶ月間',
            3: '1週間',
            4: '全期間',
          },
          detailUrl: '#'
        }
      }
    },
  }
</script>
```
</docs>