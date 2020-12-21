<template>
  <div class="pb-50">
    <div class="title-showmore p-10 mb-5 mt-10">
      <b>{{ $t('t' + list[sub]) }}</b>
    </div>
    <div class="flex tools-tab-wrapp">
      <div v-for="(item, index) in tabList"
           :key="'item-' + index"
           class="tab flex mid center text-center cursor-pointer"
           :class="{'tab-active': index == selectedTab}"
           @click="onSelectTab(index)"
      >
        {{ $t(item.id) }}
      </div>
    </div>
    <div class="w-full flex space-between product-vertical-top p-15" v-if="dataShow.currentPage < 2">
      <div v-for="(product, idx) in dataTop[selectedTab + 1]"
           :key="'top-product-popular-'+ product.id + sub + selectedTab"
      >
        <ProductVertical01 :product="product" :rank="idx + 1" />
      </div>
    </div>
    <div class="flex flex-wrap p-5 center">
      <div v-for="(product, idx) in dataShow.data" :key="'product-popular-'+ product.id + sub + selectedTab">
        <ProductVertical01 :product="product" :rank="idx + (dataShow.currentPage - 1) * 20 + 4" class="mt-5" />
      </div>
    </div>
    <div class="text-center mt-25">
      <paging :cur-page="dataShow.currentPage"
              :total="dataShow.lastPage"
              :from="dataShow.pagingFrom"
              :to="dataShow.pagingTo"
              :has-scroll="true"
              theme-class="theme1"
              :scroll-offset="300"
              @pagingclick="onGetDataPage"
      />
    </div>
    <div class="text-center mt-50">
      <a href="/tools" class="no-underlying">
        <button class="btn-gotop">
          <div class="flex mid center">
            <ChevronLeft class="chervon-icon mr-10" />
            {{ $t('27') }}
          </div>
        </button>
      </a>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/tools-index.json'
import ProductVertical01 from '@/components/product/ProductVertical01.vue'
import Paging from '@/components/paging/Paging.vue'
import ChevronLeft from '@@/../components/icons/ChevronLeft.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import { calPaging, pushState } from '@/utils/client/common'
import title from '@@/../common/pages'
const list = {
  price: 2,
  count: 3,
  free: 4,
}
const obj = Object.assign(
  {
    validate({ params }) {
      return ['price', 'count', 'free'].includes(params.sub)
    },
    components: { ProductVertical01, Paging, ChevronLeft, GogoLink },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        list,
        dataShow: {
          1: {},
        },
      }
    },
    computed: {
      titleChunk() {
        return this.$t('tp' + this.sub)
      },
    },
    methods: {
      onSelectTab(tab) {
        this.selectedTab = tab
        this.onGetDataPage()
      },
      onGetDataPage(page = 1) {
        this.dataShow = calPaging(this.data[this.selectedTab + 1], page, 21, 4)

        let params = this.$route.params,
          url = 'tools/popular/' + params.sub,
          tmp
        tmp = this.tabList[this.selectedTab].url
        tmp && (url += '/' + tmp)
        page > 1 && (url += '/p/' + page)
        pushState(url, null, '', location.protocol + '//' + location.host)
      },
      descriptionTemplate() {
        return this.$t('dp' + this.sub)
      },
    },
    async asyncData({ app, params }) {
      let sub = params.sub,
        data = await app.GoGoHTTP.get(`/api/v3/surface/tools/popular/${sub}`, {
          params: {
            limit: 0,
          },
        }),
        dataShow,
        dataTop = {},
        curPage = parseInt(params.p) || 1,
        tabList = [
          { id: 12, url: '' },
          { id: 13, url: '1m' },
          { id: 14, url: '1w' },
          { id: 15, url: 'all' },
        ],
        tab = params.type || '',
        selectedTab = tabList.findIndex(e => e.url === tab)

      selectedTab = selectedTab === -1 ? 0 : selectedTab
      for (let i in data) {
        dataTop[i] = data[i].slice(0, 3)
        data[i] = data[i].slice(3, data[i].length)
      }
      dataShow = calPaging(data[selectedTab + 1] || [], curPage || 1, 21, 4)
      return {
        sub,
        data,
        dataShow,
        dataTop,
        tabList,
        selectedTab,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/popular/${sub}`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.title-showmore {
  font-size: 20px;
  color: #707070;
}
.tools-tab-wrapp {
  height: 40px;
  .tab {
    font-size: 12px;
    color: #666;
    flex: 1;
    border: 1px solid #e0dedc;
    line-height: 14px;
    border-right: 0;
    padding: 0 3px;
  }
  .tab-active {
    background: #9c3;
    color: white;
    border: 1px solid #9c3;
  }
}
.btn-gotop {
  padding: 15px 40px;
  color: white;
  background: #9c3;
  border-radius: 8px;
  font-size: 20px;
  border: none;
  outline: none;
}
.chervon-icon {
  width: 25px;
  height: 25px;
  background: white;
  color: #9c3;
  border-radius: 50%;
}
.product-vertical-top {
  background: #fffbef;
  div.product-JX0x5 /deep/ {
    padding: 5px;
    width: 28vw;
    min-height: 37vw;
    font-size: 14px;
    .product-name {
      padding: 0;
      font-size: 1.3em;
    }
    .prices {
      font-size: 14px;
      margin-top: 5px;
      strong {
        font-weight: normal;
      }
    }
    .gg-rating {
      font-size: 14px;
      justify-content: flex-end;
      align-items: center;
    }
    .sale {
      right: -8px;
      top: 15px;
      width: 60px;
      line-height: 12px;
      span {
        font-size: 10px;
      }
    }
    .sale-rank {
      top: 34px;
    }
    .rank {
      height: 40px;
      width: 40px;
      b {
        font-size: 16px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
div.product-JX0x5 /deep/ {
  .sale-rank {
    top: 42px;
  }
}
</style>
