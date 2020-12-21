<template>
  <section class="mb-50">
    <div v-for="(list, i) in apiList" class="list-more" :key="'list-' + i">
      <div class="tools-title pl-10 flex space-between pr-10 pt-15">
        <a :href="calTarget(list.key)">{{ $t('t' + (i + 1)) }}</a>
      </div>
      <div class="flex mt-10 tools-tab-wrapp">
        <div v-for="(item, index) in tabList[i]"
             :key="'item-' + index"
             class="tab flex mid center text-center cursor-pointer"
             v-wrap-lines="2"
             :class="{'tab-active': index == selected[list.key]}"
             @click="onSelectTab(list.key, index)"
        >
          <b>{{ $t(item) }}</b>
        </div>
      </div>
      <div class="mt-10 pb-20">
        <LazyComp01 :timeout="2e3 + 1e3*i"
                    class="mt-25 pb-20" min-height="240px"
                    @comp-ready="onSliderReady('slider' + i)"
                    v-if="dataShow[list.key] && dataShow[list.key].length"
                    :always-show="i === 0"
        >
          <div class="owl-carousel owl-theme flex" :ref="'slider' + i">
            <ProductVertical01 v-for="(item, ii) in dataShow[list.key]" :key="'mss332iu' + ii" :product="item" type="tools"
                               :rank="(i == 1 || i == 2 || i == 3 || i == 6) ? (ii + 1) : null"
            >
              <img class="pos-abs owl-lazy" :data-src="'/img/products/' + item.id + '/small'" />
            </ProductVertical01>
          </div>
        </LazyComp01>
        <ShowMore class="mt-20 mr-15" :href="calTarget(list.key)" />
      </div>
      <div class="w-full flex center mt-30" v-if="banners.advertiseBanners && (banners.advertiseBanners[0] || {})[i]">
        <a class="banner" :href="banners.advertiseBanners[0][i].landingPageUrl"><img :src="banners.advertiseBanners[0][i].bannerUrl" alt="" /></a>
      </div>
    </div>
  </section>
</template>

<script>
import i18n from '@@/lang/mobile/tools-index.json'
import ProductVertical01 from '@/components/product/ProductVertical01.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { pushState } from '@/utils/client/common'
import { mapGetters } from 'vuex'
import title from '@@/../common/pages'
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const obj = Object.assign(
  {
    components: {
      ProductVertical01,
      ChevronRight,
      ShowMore,
      LazyComp01,
    },
    data() {
      return {
        selectedCategory: [],
        selectedKeyword: [],
        apiData: {},
        dataShow: {
          recommend: [],
          popularPrice: [],
          popularCount: [],
          popularFree: [],
          new: [],
          recent: [],
          review: [],
        },
        tabList: [
          [9, 10, 11, 12, 13],
          [14, 15, 16, 17],
          [14, 15, 16, 17],
          [14, 15, 16, 17],
          [18, 19, 20],
          [21, 22],
          [23, 24],
        ],
        showList: {
          recommend: 'recommend',
          popularPrice: 'popular',
          popularCount: 'popular',
          popularFree: 'popular',
          new: 'new',
          recent: 'recent',
          review: 'review',
        },
        subList: {
          popularPrice: 'price',
          popularCount: 'count',
          popularFree: 'free',
        },
        idles: [4822, 4543, 3454, 5345, 3923, 4822, 4543],
        titleChunk: this.$t('1'),
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      ...mapGetters({
        banners: 'getAdvertisements',
      }),
    },
    methods: {
      onSliderReady(ref) {
        this.$nextTick(() => {
          $(this.$refs[ref]).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            loop: true,
            autoplay: true,
            smartSpeed: 500,
            autoplayHoverPause: true,
            responsive: {
              0: {
                items: 3,
              },
              400: {
                items: 4,
              },
              600: {
                items: 6,
              },
            },
          })
        })
      },
      onSelectTab(_list, _tab) {
        // change url according to user actions
        for (let i = 0, l = this.apiList.length; i < l; i++) {
          let e = this.apiList[i]
          if (e.key === _list && e.urls[_tab]) {
            pushState(
              'tools/' + e.urls[_tab],
              null,
              '',
              location.protocol + '//' + location.host
            )
            break
          }
        }

        if (this.selected[_list] === _tab) {
          return
        }
        this.selected[_list] = _tab
        this.$set(this.dataShow, _list, null)
        this.$nextTick(() => {
          this.$set(this.dataShow, _list, this.apiData[_list][_tab + 1] || [])
          window.scrollTo(window.scrollX, window.scrollY - 10)
          window.scrollTo(window.scrollX, window.scrollY + 10)
        })
      },
      calTarget(list) {
        let api = this.apiList.find(e => e.key === list),
          url = api.showmoreUrls[this.selected[list]]
        return (
          '/tools/' +
          (api.keyReplace || list) +
          (url ? '/' + api.showmoreUrls[this.selected[list]] : '')
        )
      },
      descriptionTemplate() {
        return this.$t('32')
      },
    },
    async asyncData({ app, req }) {
      let apiData = await app.GoGoHTTP.get('/api/v3/surface/tools'),
        dataShow = {
          recommend: (apiData.recommend || [])[1] || [],
          popularPrice: (apiData.popularPrice || [])[1] || [],
          popularCount: (apiData.popularCount || [])[1] || [],
          popularFree: (apiData.popularFree || [])[1] || [],
          new: (apiData.new || [])[1] || [],
          recent: (apiData.recent || [])[1] || [],
          review: (apiData.review || [])[1] || [],
        },
        url = req.originalUrl || req.url,
        apiList = [
          {
            key: 'recommend',
            urls: [
              'osusume/campaign',
              'osusume/indicator',
              'osusume/tool',
              'osusume/ebook',
              'osusume/set',
            ],
            showmoreUrls: ['', 'indicator', 'tool', 'ebook', 'set'],
          },
          {
            key: 'popularPrice',
            keyReplace: 'popular',
            urls: ['psum/3m', 'psum/1m', 'psum/1w', 'psum/all'],
            showmoreUrls: ['price', 'price/1m', 'price/1w', 'price/all'],
          },
          {
            key: 'popularCount',
            keyReplace: 'popular',
            urls: ['pcount/3m', 'pcount/1m', 'pcount/1w', 'pcount/all'],
            showmoreUrls: ['count', 'count/1m', 'count/1w', 'count/all'],
          },
          {
            key: 'popularFree',
            keyReplace: 'popular',
            urls: ['free/3m', 'free/1m', 'free/1w', 'free/all'],
            showmoreUrls: ['free', 'free/1m', 'free/1w', 'free/all'],
          },
          {
            key: 'new',
            urls: ['newproduct/kabu', 'newproduct/fx', 'newproduct/other'],
            showmoreUrls: ['kabu', '', 'other'],
          },
          {
            key: 'recent',
            urls: ['sold/fee', 'sold/free'],
            showmoreUrls: ['', 'free'],
          },
          {
            key: 'review',
            urls: ['productreview/average', 'productreview/count'],
            showmoreUrls: ['', 'count'],
          },
        ],
        selected = {
          recommend: 0,
          popularPrice: 0,
          popularCount: 0,
          popularFree: 0,
          new: 0,
          recent: 0,
          review: 0,
        }
      url = url.substring(7, url.length)
      for (let i = 0, l = apiList.length; i < l; i++) {
        const e = apiList[i]
        for (let j = 0, m = e.urls.length; j < m; j++) {
          if (url.includes(e.urls[j])) {
            selected[e.key] = j
            break
          }
        }
      }
      return {
        apiData,
        dataShow,
        apiList,
        selected,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools`,
          },
        ],
      }
    },
    mounted() {
      let me = this
      this.$nextTick(() => {
        me.apiList.forEach((a, index) => {
          me.onSliderReady('slider' + index)
        })
      })
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.banner {
  text-align: center;
  min-width: 80%;
  img {
    width: 100%;
  }
}
.list-more {
  overflow-x: hidden;
  &:nth-child(odd) {
    background: white;
  }
  &:nth-child(even) {
    background: #f7f7f7;
  }
}
.tools-title {
  a {
    font-size: 17px;
    color: #666;
    font-weight: bold;
  }
}
.tools-tab-wrapp {
  height: 40px;
  .tab {
    font-size: 15px;
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
.btn-loadmore {
  /deep/ a {
    color: #424a54;
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: #434a54;
    font-size: 15px;
    border-radius: 50%;
    i.icon-cls {
      width: 15px;
      height: 14px;
      color: white;
      margin-left: 1px;
    }
  }
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
  padding: 10px;
}
.have-rank /deep/ .product-JX0x5 /deep/ {
  min-height: 240px;
}
@media only screen and (max-width: 600px) {
  /deep/ .slider-container {
    > div {
      width: calc(100vw / 3) !important;
      .product-JX0x5 {
        width: calc((100vw / 3) - 30px);
      }
    }
  }
}
</style>
