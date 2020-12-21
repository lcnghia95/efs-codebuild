<template>
  <div class="pb-50">
    <div class="title-showmore p-10 mb-5 mt-10">
      <b>{{ $t('t' + list[showmore]) }}</b>
    </div>
    <div class="flex tools-tab-wrapp">
      <div v-for="(item, index) in tabList[showmore]"
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
           :key="'top-product-'+ product.id + showmore + selectedTab + ($route.params.sub || '')"
      >
        <ProductVertical01 :product="product"
                           :rank="(showmore == 'review') ? (idx + 1) : null"
        />
      </div>
    </div>
    <div class="flex flex-wrap p-5 center">
      <div v-for="(product, idx) in dataShow.data" :key="'product-'+ product.id + showmore + selectedTab + idx">
        <ProductVertical01 :product="product"
                           :rank="(showmore == 'review') ? (idx + (dataShow.currentPage - 1) * 20 + 4) : null"
        />
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
  recommend: 1,
  new: 5,
  recent: 6,
  review: 7,
}
const obj = Object.assign(
  {
    validate({ params }) {
      return ['recommend', 'new', 'recent', 'review'].includes(params.showmore)
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
        return this.$t('t' + this.showmore)
      },
    },
    methods: {
      onSelectTab(tab) {
        this.selectedTab = tab
        this.onGetDataPage(1)
      },
      onGetDataPage(page = 1) {
        this.dataShow = calPaging(this.data[this.selectedTab + 1], page, 21, 4)

        let params = this.$route.params,
          url = 'tools/' + params.showmore,
          tmp
        tmp = this.tabList[params.showmore][this.selectedTab].url
        tmp && (url += '/' + tmp)
        page > 1 && (url += '/p/' + page)
        pushState(url, null, '', location.protocol + '//' + location.host)
      },
      descriptionTemplate() {
        return this.$t('d' + this.showmore)
      },
    },
    async asyncData({ app, params }) {
      let showmore = params.showmore,
        data = await app.GoGoHTTP.get(`/api/v3/surface/tools/${showmore}`, {
          params: {
            limit: 0,
          },
        }),
        dataShow,
        dataTop = {},
        curPage = parseInt(params.p) || 1,
        tab = params.type || '',
        tabList = {
          recommend: [
            { id: 6, url: '' },
            { id: 7, url: 'indicator' },
            { id: 8, url: 'tool' },
            { id: 9, url: 'ebook' },
            { id: 10, url: 'set' },
          ],
          new: [
            { id: 17, url: 'kabu' },
            { id: 18, url: '' },
            { id: 19, url: 'other' },
          ],
          recent: [{ id: 21, url: '' }, { id: 22, url: 'free' }],
          review: [{ id: 24, url: '' }, { id: 25, url: 'count' }],
        },
        selectedTab = tabList[params.showmore].findIndex(e => e.url === tab)

      selectedTab = selectedTab === -1 ? 0 : selectedTab
      for (let i in data) {
        dataTop[i] = data[i].slice(0, 3)
        data[i] = data[i].slice(3, data[i].length)
      }
      dataShow = calPaging(data[selectedTab + 1] || [], curPage || 1, 21, 4)
      return {
        showmore,
        data,
        dataShow,
        dataTop,
        selectedTab,
        tabList,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/${showmore}`,
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
  border-radius: 5px;
  font-size: px;
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
      font-size: 14px;
      height: 38px;
    }
    .prices {
      font-size: 14px;
      margin-top: 5px;
      strong {
        font-weight: normal;
      }
    }
    .price-cls {
      min-height: 8vw;
    }
    .gg-rating {
      font-size: 14px;
      justify-content: flex-end;
      align-items: center;
    }
    .sale {
      right: -8px;
      top: 14px;
      width: 60px;
      line-height: 12px;
      span {
        font-size: 10px;
      }
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
</style>
