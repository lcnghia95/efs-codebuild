<template>
  <section class="w-1000">
    <div class="flex space-between">
      <div class="left-block">
        <div class="slider-container w-full">
          <div ref="slider" class="owl-carousel owl-theme flex">
            <div class="item" v-for="(context, i) in topSliders" :key="'context-' + i" v-html="context.content"></div>
          </div>
        </div>
        <div class="flex space-between mb-10 mt-20">
          <div class="search-bar flex">
            <input type="text" :placeholder="$t('33')" v-model="searchKey" @keyup.enter="onSearch" />
            <button @click="onSearch"><Search /></button>
          </div>
          <div class="w-full flex flex-wrap pl-20">
            <a class="tags" :href="item.url" v-for="item in tags" :key="item.name + 'aw234ia'">{{ item.name }}</a>
          </div>
        </div>
        <div class="flex space-between" style="height: 780px;">
          <div>
            <div class="title-1">{{ $t('trecommend') }}</div>
            <CategorySlider01
              style="min-height: 630px; width: 375px;"
              v-if="Object.keys(apiData.recommend).length"
              :url-info="apiList.recommend"
              :list="apiData.recommend"
              :tabs="tabs.recommend"
            />
          </div>
          <div class="divide-line"></div>
          <div>
            <div class="title-1">{{ $t('tnew') }}</div>
            <CategorySlider01
              style="min-height: 630px; width: 375px;"
              v-if="Object.keys(apiData.new).length"
              :url-info="apiList.new"
              :list="apiData.new"
              :tabs="tabs.new"
            />
          </div>
        </div>
        <LazyComp01 min-height="400px">
          <div class="title-1 mt-10">{{ $t('trecent') }}</div>
          <CategorySlider02 
            v-if="Object.keys(recent).length"
            :list="recent"
            :tabs="tabs.recent"
          />
        </LazyComp01>
        <LazyComp01 class="flex space-between mt-5" min-height="630px" style="height: 780px;">
          <div style="width: 375px;">
            <div class="title-1">{{ $t('tpfree') }}</div>
            <CategorySlider01
              v-if="Object.keys(popularFree).length"
              :show-rank="true"
              :url-info="apiList.popularFree" 
              :list="{1: popularFree[3], 3: popularFree[1]}" 
              :tabs="tabs.popularFree"
            />
          </div>
          <div class="divide-line"></div>
          <div style="width: 375px;">
            <div class="title-1">{{ $t('treview') }}</div>
            <CategorySlider01
              v-if="Object.keys(review).length"
              :show-rank="true"
              :url-info="apiList.review" 
              :list="{1: review[1], 2: review[2]}" 
              :tabs="tabs.review"
            />
          </div>
        </LazyComp01>
      </div>
      <div class="right-block">
        <div class="title-2">{{ $t('tpcount') }}</div>
        <Tab 
          class="mt-15"
          :current="selected.popularCount" 
          :url-info="apiList.popularCount" 
          :list="apiData.popularCount"
          :tabs="tabs.popularCount"
        />
        <LazyComp01 class="mt-40" min-height="630px" style="margin-top: 23px;">
          <div class="title-2">{{ $t('tpprice') }}</div>
          <no-ssr>
            <Tab 
              style="min-height: 630px;"
              class="mt-15"
              :current="selected.popularPrice" 
              :url-info="apiList.popularPrice" 
              :list="popularPrice"
              :tabs="tabs.popularPrice"
            />
          </no-ssr>
        </LazyComp01>
      </div>
    </div>
  </section>
</template>

<script>
import i18n from '@@/lang/desktop/tools-index.json'
import title from '@@/../common/pages'
import Tab from '@/components/tools/Tab.vue'
import CategorySlider01 from '@/components/tools/CategorySlider01.vue'
import CategorySlider02 from '@/components/tools/CategorySlider02.vue'
import Search from '@@/../components/icons/Search.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const apiList = {
  recommend: {
    urls: [
      'tools/osusume/campaign',
      'tools/osusume/indicator',
      'tools/osusume/tool',
      'tools/osusume/ebook',
      'tools/osusume/set',
    ],
    showmoreUrls: ['/tools/recommend', '/tools/recommend/indicator', '/tools/recommend/tool', '/tools/recommend/ebook', '/tools/recommend/set'],
  },
  popularPrice: {
    keyReplace: 'popular',
    urls: [
      'tools/psum/3m',
      'tools/psum/1m',
      'tools/psum/1w',
      'tools/psum/all',
    ],
    showmoreUrls: ['/tools/popular/price', '/tools/popular/price/1m', '/tools/popular/price/1w', '/tools/popular/price/all'],
  },
  popularCount: {
    keyReplace: 'popular',
    urls: [
      'tools/pcount/3m',
      'tools/pcount/1m',
      'tools/pcount/1w',
      'tools/pcount/all',
    ],
    showmoreUrls: ['/tools/popular/count', '/tools/popular/count/1m', '/tools/popular/count/1w', '/tools/popular/count/all'],
  },
  popularFree: {
    keyReplace: 'popular',
    urls: [
      'tools/free/3m',
      'tools/free/1m',
      'tools/free/1w',
      'tools/free/all',
    ],
    showmoreUrls: ['/tools/popular/free', '/tools/popular/free/1m', '/tools/popular/free/1w', '/tools/popular/free/all'],
  },
  new: {
    urls: [
      'tools/newproduct/kabu',
      'tools/newproduct/fx',
      'tools/newproduct/other',
    ],
    showmoreUrls: ['/tools/new/kabu', '/tools/new', '/tools/new/other'],
  },
  recent: {
    urls: [
      'tools/sold/fee',
      'tools/sold/free',
    ],
    showmoreUrls: ['/tools/recent', '/tools/recent/free'],
  },
  review: {
    urls: [
      'tools/productreview/average',
      'tools/productreview/count',
    ],
    showmoreUrls: ['/tools/review', '/tools/review/count'],
  },
}
const obj = Object.assign(
  {
    components: {
      Tab,
      CategorySlider01,
      CategorySlider02,
      Search,
      LazyComp01,
    },
    data() {
      return {
        searchKey: '',
        tabs: {
          recommend: {
            1: this.$t(6),
            2: this.$t(7),
            3: this.$t(8),
            4: this.$t(9),
            5: this.$t(10)
          },
          popularPrice: {
            1: this.$t(12),
            2: this.$t(13),
            3: this.$t(14),
            4: this.$t(15),
          },
          popularCount: {
            1: this.$t(12),
            2: this.$t(13),
            3: this.$t(14),
            4: this.$t(15),
          },
          popularFree: {
            1: this.$t(14),
            2: this.$t(13),
            3: this.$t(12),
            4: this.$t(15),
          },
          new: {
            1: this.$t(17),
            2: this.$t(18),
            3: this.$t(19),
          },
          recent: {
            1: this.$t(21),
            2: this.$t(22),
          },
          review: {
            1: this.$t(24),
            2: this.$t(25),
          },
        },
        titleChunk: this.$t('1'),
        popularPrice: {},
        popularFree: {},
        recent: {},
        review: {},
        tags: [],
        apiList,
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      topSliders() {
        return Object.values(
          this.$store.state.advertisements.topSliders || {}
        ).sort(() => (Math.random() > 0.5 ? 1 : -1))
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('31')
      },
      onSearch() {
        location.href = `/tools/search/?t=${this.searchKey}`
      }
    },
    mounted() {
      this.$nextTick(() => {
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          items: 1,
          dotClass: 'custom-dot',
        })
      })
      this.GoGoHTTP.get('/api/v3/surface/tools/popular/price', { params: {  limit: 10, } }).then(data => {
        this.popularPrice = data || {}
      })
      this.GoGoHTTP.get('/api/v3/surface/tools/popular/free', { params: { limit: 7, } }).then(data => {
        this.popularFree = data || {}
      })
      this.GoGoHTTP.get('/api/v3/surface/tools/recent', { params: { limit: 13, } }).then(data => {
        this.recent = data || {}
      })
      this.GoGoHTTP.get('/api/v3/surface/tools/review', { params: { limit: 7, } }).then(data => {
        this.review = data || {}
      })
      this.GoGoHTTP.get('/api/v3/surface/tools/search/keywords').then(data => {
        this.tags = data || []
      })
    },
    async asyncData({ app, req }) {
      let [
          recommend,
          popularCount,
          newP,
        ] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/tools/recommend', { params: { limit: 7, } }),
          app.GoGoHTTP.get('/api/v3/surface/tools/popular/count', { params: { limit: 10, } }),
          app.GoGoHTTP.get('/api/v3/surface/tools/new', { params: { limit: 7, } }),
        ]),
        apiData = {
          recommend: recommend || {},
          popularCount: popularCount || {},
          new: newP,
        },
        url = req.originalUrl || req.url,
        selected = {
          recommend: 1,
          popularPrice: 3,
          popularCount: 3,
          popularFree: 3,
          new: 1,
          recent: 1,
          review: 1,
        }
      url = url.substring(7, url.length)
      Object.keys(apiList).forEach(key => {
        let urls = apiList[key]['urls']
        urls.forEach((i, index) => {
          if(url && i.includes(url)) {
            selected[key] = index + 1
          }
        })
      })
      return {
        apiData,
        apiList,
        newP,
        selected,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools`,
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
.divide-line {
  height: 725px;
  width: 1px;
  background: #d0d5dc;
  margin-top: auto;
}
.tags {
  margin-right: 15px;
  color: #044fc7;
  &:hover {
    opacity: 0.7;
  }
}
.search-bar {
  height: 35px;
  border: 1px solid #969696;
  border-radius: 3px;
  width: 40%;
  min-width: 400px;
  margin-right: auto;
  background: #ddd;
  input {
    width: 85%;
    padding: 0 20px;
    border: none;
  }
  button {
    width: 15%;
    border: none;
    &:hover {
      opacity: 0.8;
    }
    .icon-cls {
      width: 20px;
      height: 17px;
    }
  }
}
.title-1 {
  font-size: 21px;
  font-weight: bold;
  color: #6e6e6e;
  line-height: 55px;
}
.title-2 {
  font-size: 14px;
  font-weight: 700;
  color: #6e6e6e;
}
.right-block {
  width: 200px;
  min-height: 630px;
  margin-bottom: 5px;
}
.left-block {
  width: calc(100% - 215px);
}
/deep/ .product-vertical {
  transition: all 1s ease;
}
div.product-vertical /deep/ {
  .price-cls strong {
    font-weight: normal;
  }
  .rate-num {
    margin-top: 2px;
    font-size: 10px;
  }
}
/deep/ .owl-stage-outer .item {
  display: block;
  max-height: 220px;
}
/deep/ .custom-dot {
  width: 70px;
  height: 8px;
  border-radius: 10px;
  border: none;
  background: #e6e9ed;
  margin: 0 5px;
  outline: none;
  transition: all 0.1s;
  &:hover,
  &.active {
    background: #434a54;
  }
}
.slider-container {
  height: 250px;
  overflow: hidden;
}
</style>
