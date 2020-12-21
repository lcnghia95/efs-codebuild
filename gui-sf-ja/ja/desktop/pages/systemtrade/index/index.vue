<template>
  <div class="w-1000 flex space-between">
    <div class="left-content mb-30">
      <SearchArea />
      <LazyComp01
        v-if="rtRanking.length"
        min-height="350px"
        class="mt-20 list-product pt-20"
        :timeout="3e4"
        @comp-ready="onSliderReady('slider3')"
      >
        <div class="flex mid ml-20 mb-20">
          <span class="icon-other no-circle mr-5 icon-trade">R</span>
          <h2 class="title-icon mb-0">
            <b>{{ $t('39') }}</b>
          </h2>
        </div>
        <div ref="slider3" class="owl-carousel flex flex-wrap ">
          <SystemProductVert
            v-for="(item, idx) in rtRanking"
            :rank="idx + 1"
            :key="'real-' + item.id"
            :product="item"
          />
        </div>
        <ShowMore
          class="bg-dot mt-10"
          :text="$t('40')"
          :target="'/systemtrade/realasset'"
        />
      </LazyComp01>
      <div style="min-height: 450px; margin-top: 20px;">
        <BubbleChart02 :chart="rankingActive" />
      </div>
      <LazyComp01 class="mt-15 flex content-end" min-height="40px">
        <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 14px;">{{ $t('37') }}</a>
      </LazyComp01>
      <div class="top-content mt-20 mb-20 flex space-between">
        <a
          :href="item.link"
          class="st-slider-wrapp no-underlying"
          v-for="(item, i) in topContent"
          :key="i"
        >
          <img :src="item.img" class="w-full" />
          <div class="st-slider-detal flex layout-col layout-col-mid">
            <p class="st-slider-title">{{ item.h3 }}</p>
            <p class="fs-12">{{ item.p }} &#187;</p>
          </div>
        </a>
      </div>
      <div
        ref="top_slider1"
        class="mt-20 slider-container owl-carousel owl-theme flex layout-row"
        style="max-height: 134px; overflow: hidden;"
      >
        <div v-for="(context, i) in banners1" :key="'context-' + i" class="item grow1">
          <a
            class="banner w-full mt-20"
            :href="context.landingPageUrl"
            rel="nofollow"
          >
            <img class="w-full" :src="context.bannerUrl" alt="" />
          </a>
        </div>
      </div>
      <LazyComp01 class="mt-30" min-height="377px">
        <div class="list-product pt-20">
          <div class="flex mid ml-20">
            <div class="icon-other mr-5 flex mid center">
              %
            </div>
            <h2 class="title-icon mb-0">
              <b>{{ $t('2') }}</b>
            </h2>
          </div>
          <div class="flex space-between m-20">
            <SystemProductVert
              v-for="(product, idx) in rate"
              :product="product"
              :rank="idx + 1"
              :key="'rate-' + idx"
              class="ml-5 mr-5"
              :show-criterial="true"
            />
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('3')"
            :target="'/systemtrade/profitrate'"
          />
        </div>
      </LazyComp01>
      <LazyComp01 class="mt-20" min-height="377px">
        <div class="list-product pt-20">
          <div class="flex mid ml-20">
            <div class="icon-other icon-yen mr-5 flex mid center">
              ¥
            </div>
            <h2 class="title-icon mb-0">
              <b>{{ $t('4') }}</b>
            </h2>
          </div>
          <div class="flex space-between m-20">
            <SystemProductVert
              v-for="(product, idx) in amount"
              :product="product"
              :rank="idx + 1"
              :key="'amount-' + idx"
              class="ml-5 mr-5"
              :show-criterial="true"
            />
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('5')"
            :target="'/systemtrade/profit'"
          />
        </div>
      </LazyComp01>
      <div
        ref="top_slider2"
        class="mt-20 slider-container owl-carousel owl-theme"
      >
        <div v-for="(context, i) in banners2" :key="'context-' + i" class="item">
          <a
            class="banner w-full mt-20"
            :href="context.landingPageUrl"
            rel="nofollow"
          >
            <img class="w-full" :src="context.bannerUrl" alt="" />
          </a>
        </div>
      </div>
      <LazyComp01 class="mt-20" min-height="377px">
        <div class="list-product pt-20">
          <div class="flex mid ml-20">
            <BalanceScale class="icon-other no-circle mr-5" />
            <h2 class="title-icon mb-0">
              <b>{{ $t('6') }}</b>
            </h2>
          </div>
          <div class="flex space-between m-20 h-245">
            <SystemProductVert
              v-for="(product, idx) in pf"
              :product="product"
              :rank="idx + 1"
              :key="'pf-' + idx"
              class="ml-5 mr-5"
              :show-criterial="true"
            />
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('7')"
            :target="'/systemtrade/profitfactor'"
          />
        </div>
      </LazyComp01>
      <LazyComp01 class="mt-20" min-height="377px">
        <div class="list-product pt-20">
          <div class="flex mid ml-20">
            <Sync class="icon-other no-circle mr-5" />
            <h2 class="title-icon mb-0">
              <b>{{ $t('8') }}</b>
            </h2>
          </div>
          <div class="flex space-between m-20 h-245">
            <SystemProductVert
              v-for="(product, idx) in risk"
              :product="product"
              :rank="idx + 1"
              :key="'risk-' + idx"
              class="ml-5 mr-5"
              :show-criterial="true"
            />
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('9')"
            :target="'/systemtrade/riskreturn'"
          />
        </div>
      </LazyComp01>
      <LazyComp01 class="mt-20" min-height="287px">
        <div class="list-product pt-20">
          <div class="flex mid ml-20">
            <User2 class="icon-other no-circle mr-5" />
            <h2 class="title-icon mb-0">
              <b>{{ $t('10') }}</b>
            </h2>
          </div>
          <div class="flex space-between m-20 pl-10 pr-10 h-155">
            <UserVertical
              v-for="(user, idx) in developers"
              :user="user"
              :key="'user-' + idx"
            />
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('11')"
            :target="'/systemtrade/developers'"
          />
        </div>
      </LazyComp01>
      <LazyComp01
        v-if="newSell.length"
        min-height="310px"
        class="mt-20"
        :timeout="3e4"
        @comp-ready="onSliderReady('slider1')"
      >
        <div class="list-product pt-20 pb-35">
          <div class="flex mid ml-20 mb-20">
            <Cart class="icon-other no-circle mr-5" />
            <h2 class="title-icon mb-0">
              <b>{{ $t('19') }}</b>
            </h2>
          </div>
          <div ref="slider1" class="owl-carousel flex flex-wrap ">
            <SystemProductVert
              v-for="item in newSell"
              :key="item.id"
              :product="item"
            />
          </div>
        </div>
      </LazyComp01>
      <LazyComp01
        v-if="review.length"
        min-height="365px"
        class="mt-20"
        :timeout="4e4"
        @comp-ready="onSliderReady('slider2')"
      >
        <div class="list-product pt-20">
          <div class="flex mid ml-20 mb-20">
            <Pencil02 class="icon-other no-circle mr-5" />
            <h2 class="title-icon mb-0">
              <b>{{ $t('20') }}</b>
            </h2>
          </div>
          <div ref="slider2" class="owl-carousel slide-wrapp flex flex-wrap ">
            <ProductReview02
              class="product-review"
              v-for="item in review"
              :key="item.id"
              :data="item"
            />
          </div>
          <ShowMore class="bg-dot mt-10" :text="$t('21')" :target="'/review'" />
        </div>
      </LazyComp01>
    </div>
    <div class="right-content">
      <h2 class="title-right m-0 flex mid pl-10">
        <b>{{ $t('12') }}</b>
      </h2>
      <div class="flex layout-col">
        <div v-for="(product, idx) in bestsell" :key="'bestsell-' + idx">
          <LazyComp01
            class="border-bottom-dotted"
            min-height="80px"
            :always-show="idx < 3"
          >
            <SystemProductHor :product="product" :rank="idx + 1" />
          </LazyComp01>
        </div>
      </div>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('13')"
        :target="'/systemtrade/sell'"
      />
      <h2 class="title-right m-0 flex mid pl-10 mt-30">
        <b>{{ $t('14') }}</b>
      </h2>
      <LazyComp01 min-height="648px">
        <div class="flex layout-col">
          <div
            v-for="(product, idx) in newProduct"
            class="border-bottom-dotted"
            :key="'new-product-' + idx"
          >
            <SystemProductHor :product="product" />
          </div>
        </div>
      </LazyComp01>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('13')"
        :target="'/systemtrade/newproduct'"
      />
      <h2 class="title-right m-0 flex mid pl-10 mt-30">
        <b>{{ $t('39') }}</b>
      </h2>
      <LazyComp01 min-height="648px">
        <div class="flex layout-col">
          <div
            v-for="(product) in rtRanking"
            class="border-bottom-dotted"
            :key="product.id"
          >
            <SystemProductHor :product="product" :display-pips="true" />
          </div>
        </div>
        <ShowMore
          class="fs-12 mt-5"
          :text="$t('13')"
          :target="'/systemtrade/realasset'"
        />
      </LazyComp01>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-index.json'
import title from '@@/../common/pages'
import SearchArea from '@@/../components/systemtrade/SearchArea.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import Cart from '@@/../components/icons/Cart.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import Sync from '@@/../components/icons/Sync.vue'
import User2 from '@@/../components/icons/User2.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import ProductReview02 from '@/components/product/ProductReview02.vue'
import SystemProductHor from '@/components/product/SystemProductHor.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import UserVertical from '@/components/user/UserVertical.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const left = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #d9d9da;" xml:space="preserve"><g><g id="keyboard-arrow-left"><polygon points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306"/></g></g></svg>`,
  right = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #d9d9da;" xml:space="preserve"><g><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/></g></g></svg>`

const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      SearchArea,
      BalanceScale,
      Cart,
      Pencil02,
      Sync,
      User2,
      SystemProductVert,
      ProductReview02,
      SystemProductHor,
      ShowMore,
      UserVertical,
      LazyComp01,
      BubbleChart02,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('titlePrefix'),
        topContent: {
          1: {
            link: '/systemtrade/fx',
            img: '/img/assets/pc/systemtrade/top-fx_new.jpg',
            h3: this.$t('22'),
            p: this.$t('23'),
          },
          2: {
            link: '/systemtrade/stocks',
            img: '/img/assets/pc/systemtrade/top-stock_new.jpg',
            h3: this.$t('24'),
            p: this.$t('25'),
          },
        },
      }
    },
    mounted() {
      let opt = {
        slideTransition: 'ease',
        autoplayTimeout: 8e3,
        loop: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        items: 1,
        dotClass: 'custom-dot',
      }
      this.$nextTick(() => {
        $(this.$refs.top_slider1).owlCarousel(opt),
        $(this.$refs.top_slider2).owlCarousel(opt),
        $(this.$refs.top_slider3).owlCarousel(opt)
      })
    },
    async asyncData({ app, store }) {
      let data = await app.GoGoHTTP.get('/api/v3/surface/systemtrade/all', { params: { rtRankingLimit: 30 } }),
        banner = store.state.advertisements.advertiseBanners || {},
        banners1 = banner[0] || [],
        banners2 = banner[1] || []

      data.developers = (data.developers || []).sort(() =>
        Math.random() > 0.5 ? 1 : -1
      )
      data.developers = data.developers.slice(0, 5)

      return {
        banners1,
        banners2,
        rate: data.rate || [],
        amount: data.amount || [],
        bestsell: data.bestsell || [],
        pf: data.profitFactor || [],
        risk: data.risk || [],
        developers: data.developers || [],
        newSell: data.newSell || [],
        review: data.review || [],
        newProduct: data.newProduct || [],
        rankingActive: data.rankingActive || [],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade`,
          },
        ],
        rtRanking: data.rtRanking || []
      }
    },
    methods: {
      onSliderReady(ref) {
        this.$nextTick(() => {
          $(this.$refs[ref]).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 4e3,
            autoplay: true,
            loop: true,
            nav: true,
            navigation: true,
            center: true,
            dots: false,
            smartSpeed: 500,
            autoplayHoverPause: true,
            autoWidth: true,
            items: 5,
            margin: 8,
            navText: [left, right],
          })
        })
      },
      descriptionTemplate() {
        return this.$t('26')
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
@import '@/assets/systemtrade/common.scss';
/deep/ .owl-stage-outer .item {
  display: unset;
}
/deep/ .custom-dot {
  width: 32px;
  height: 7px;
  border: none;
  background: #e6e9ed;
  margin: 0 5px;
  outline: none;
  transition: all 0.1s;
  &:hover,
  &.active {
    background: #858585;
  }
}
.left-content {
  width: 670px;
  .banner {
    display: block;
    &:hover {
      opacity: 0.85;
    }
  }
  .top-content {
    .st-slider-wrapp {
      width: 325px;
      &:hover img {
        opacity: 0.85;
      }
      &:hover h3,
      &:hover p {
        text-decoration: none;
      }
    }
    .st-slider-wrapp:nth-child(2) {
      width: 325px;
    }
    .st-slider-detal {
      height: 80px;
      border: 1px solid #dcdcdc;
      background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wgARCAAEAAQDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAHuP/8QAHRAAAgIBBQAAAAAAAAAAAAAAAQIDBBEABRMhMv/aAAgBAQABPwDZrTyzXqB8UbKQQsWZmZeGJ8szEljlz3r/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==')
        repeat;
      h3,
      p {
        margin: 0;
        color: #2d2d2d;
      }
      .st-slider-title {
        font-weight: bold;
        font-size: 22px;
        color: #2d2d2d;
        margin: 0;
      }
      p {
        margin-top: 5px;
      }
    }
  }
  .list-product {
    border: 1px solid #dbdbdb;
    .bg-dot {
      border-top: 1px solid #dbdbdb;
    }
    .title-icon {
      font-size: 20px;
      font-weight: bold;
      color: #7d7d7d;
      margin-top: 2px;
    }
    .product-review /deep/ .o-com__tit {
      min-height: 36px;
      color: #666;
    }
    .product-review /deep/ .o-com__cont {
      height: 65px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .h-155 {
    height: 155px;
  }
  .h-245 {
    height: 245px;
  }
}
.list-product /deep/ {
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      font-size: 15px !important;
      top: 40%;
    }
    &.owl-prev {
      left: -45px;
    }
    &.owl-next {
      right: -45px;
    }
  }
  .owl-carousel {
    width: calc(100% - 100px);
  }
}
.slide-wrapp .product-BjNGX {
  min-height: 223px;
}
.slide-wrapp .o-com {
  min-height: 233px;
}
.right-content {
  width: 300px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
}
.border-bottom-dotted {
  border-bottom: dotted #e0e0e0 1px;
}
.icon-trade {
  font-size: 20px;
  text-align: center;
}
</style>
