<template>
  <section>
    <div class="head-menu flex flex-wrap">
      <IconHeader :item="item" :type="i" v-for="(item, i) in list" :key="'icon-' + i">
        <b v-if="item.text">{{ item.text }}</b>
        <i :is="item.icon" v-if="item.icon" />
      </IconHeader>
    </div>
    <BubbleChart02 :chart="rankingActive" style="min-height: 450px; margin-top: 20px; margin-bottom: 10px;" />
    <div class="mb-20 flex content-end">
      <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 12px; margin-right: 20px;">{{ $t('17') }}</a>
    </div>
    <h2 class="title m-0">{{ $t(18) }}</h2>
    <LazyComp01 class="pt-10 pb-20" @comp-ready="onSliderReady('.rt-ranking', { dots: false, loop: true, })" min-height="240px">
      <div class="owl-carousel owl-theme rt-ranking">
        <RealtradeRankingProduct
          class="top-product"
          :product="product"
          :key="'product-' + product.id"
          v-for="(product, index) in rtRanking"
          :rank="index + 1"
        />
      </div>
    </LazyComp01>
    <h2 class="title m-0">{{ $t('2') }}</h2>

    <LazyComp01 class="pt-10 pb-20" @comp-ready="onSliderReady('.slider1')" min-height="240px">
      <div class="owl-carousel owl-theme slider1">
        <ProductVertical07 class="top-product" :product="product" v-for="product in newProduct"
                           :key="'product-' + product.id"
        />
      </div>
    </LazyComp01>
    <div class="banner-wrapp w-full flex center mt-30 p-5" v-if="banner[0]">
      <a :href="banner[0][0].landingPageUrl"><img class="w-full" :src="banner[0][0].bannerUrl" alt="" /></a>
    </div>
    <h2 class="title p-10 mt-20 mb-0">{{ $t('3') }}</h2>
    <LazyComp01 class="pt-10 pb-20" @comp-ready="onSliderReady('.slider2')" min-height="240px">
      <div class="owl-carousel owl-theme slider2 ">
        <ProductVertical06 class="top-product" :product="product" v-for="product in bestsell"
                           :key="'product-' + product.id"
        />
      </div>
    </LazyComp01>
    <div class="banner-wrapp w-full flex center mt-30 p-5" v-if="banner[1]">
      <a :href="banner[1][0].landingPageUrl"><img class="w-full" :src="banner[1][0].bannerUrl" alt="" /></a>
    </div>
    <div class="title mt-20 flex mid space-between">
      <h2 class="subtitle p-0 m-0"><b>{{ $t('4') }}</b></h2>
      <ShowMore class="border" :target="'/review'" />
    </div>
    <div class="flex layout-col reviews">
      <ProductReview v-for="(rv,i) in reviews" :key="'review-' + i" :product="rv" />
    </div>
    <div class="banner-wrapp w-full flex center mb-30 p-5" v-if="banner[2]">
      <a :href="banner[2][0].landingPageUrl"><img class="w-full" :src="banner[2][0].bannerUrl" alt="" /></a>
    </div>
  </section>
</template>
<script>
import IconHeader from '@/components/systemtrade/IconHeader.vue'
import ProductVertical06 from '@/components/product/ProductVertical06.vue'
import ProductVertical07 from '@/components/product/ProductVertical07.vue'
import ProductReview from '@/components/product/ProductReview.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/systemtrade.json'
import Medal from '@@/../components/icons/Medal.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import Sync from '@@/../components/icons/Sync.vue'
import icons from '@/js/systemtrade/icons'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'
import RealtradeRankingProduct from '@/components/product/RealtradeRankingProduct.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const obj = Object.assign(
  {
    components: {
      IconHeader,
      RealtradeRankingProduct,
      ProductVertical06,
      ProductVertical07,
      ProductReview,
      ShowMore,
      BalanceScale,
      Medal,
      Sync,
      LazyComp01,
      BubbleChart02,
    },
    mounted() {
      this.onSliderReady('.slider1')
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        list: [
          Object.assign(
            {
              type: 'fx',
              url: '/systemtrade/fx',
            },
            icons['fx']
          ),
          Object.assign(
            {
              type: 'stocks',
              url: '/systemtrade/stocks',
            },
            icons['stocks']
          ),
          Object.assign(
            {
              type: 'newproduct',
              url: '/systemtrade/newproduct',
            },
            icons['newproduct']
          ),
          Object.assign(
            {
              type: 'sell',
              url: '/systemtrade/sell',
            },
            icons['sell']
          ),
          Object.assign(
            {
              type: 'profitrate',
              url: '/systemtrade/profitrate',
            },
            icons['profitrate']
          ),
          Object.assign(
            {
              type: 'profit',
              url: '/systemtrade/profit',
            },
            icons['profit']
          ),
          Object.assign(
            {
              type: 'profitfactor',
              url: '/systemtrade/profitfactor',
            },
            icons['profitfactor']
          ),
          Object.assign(
            {
              type: 'riskreturn',
              url: '/systemtrade/riskreturn',
            },
            icons['riskreturn']
          ),
          Object.assign(
            {
              type: 'realasset',
              url: '/systemtrade/realasset',
            },
            icons['realasset']
          ),
        ],
        titleChunk: this.$t('1'),
      }
    },
    async asyncData({ app }) {
      let [data, rankingActive] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/systemtrade/all', { params: { rtRankingLimit: 30 } }),
        app.GoGoHTTP.get('/api/v3/surface/top/rankingActive'),
      ]) 
      return {
        bestsell: data.bestsell || [],
        newProduct: data.newProduct || [],
        reviews: data.reviews || [],
        rankingActive,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade`,
          },
        ],
        rtRanking: data.rtRanking || []
      }
    },
    computed: {
      banner() {
        return this.$store.state.advertisements.advertiseBanners || {}
      },
    },
    methods: {
      descriptionTemplate() {
        return this.$t('6')
      },
      onSliderReady(cls, options = {}) {
        let defaultOpt = {
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: false,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 3,
            },
            350: {
              items: 4,
            },
            500: {
              items: 6,
            },
          },
        }
        this.$nextTick(() => {
          $(cls).owlCarousel({
            ...defaultOpt,
            ...options,
          })
        })
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.head-menu /deep/ {
  width: 90%;
  margin: 3vw auto 0;
  .title {
    font-size: 3vw;
  }
  a {
    width: calc(100% / 3);
    margin-bottom: 3vw;
    text-decoration: none;
  }
}
.slide-wrapp {
  width: 92%;
  margin: 2vw auto 0;
}
.title {
  font-size: 4.5vw;
  background: #f3f0ef;
  color: #7d7d7d;
  padding: 3vw 3vw;
  .subtitle {
    font-size: inherit;
    background: inherit;
    color: inherit;
  }
  .border {
    width: 32vw;
    flex: 0 0 32vw;
  }
}
.reviews {
  > :nth-child(2n) {
    background: #f3f0ef;
  }
}
.banner-wrapp {
  padding: 0 4vw;
}
@media only screen and (min-width: 600px) {
  .head-menu /deep/ {
    width: 80%;
    a {
      width: calc(100% / 4);
      margin-bottom: 1.3vw;
      .item {
        width: 12vw !important;
        height: 12vw !important;
        font-size: 5vw;
        .icon-cls {
          width: 9vw;
          height: 9vw;
        }
      }
      &:nth-child(3) {
        .item {
          font-size: 4vw;
        }
      }
    }
    .title {
      font-size: 2vw;
    }
  }
  .title {
    font-size: 3.5vw;
    padding: 2vw 5vw;
  }
  /deep/ a.btn-loadmore {
    padding: 1vw 3vw;
    font-size: 2.5vw;
    span {
      width: 3vw;
      height: 3vw;
      i.icon-cls {
        width: 2.5vw;
        height: 2.5vw;
      }
    }
  }
  /deep/ a.product-fio9b .des-review {
    .title,
    .review-content {
      font-size: 2.2vw;
    }
    .date-time {
      font-size: 2vw;
    }
  }
}
</style>
