<template>
  <section>
    <div class="m-top-slider" v-if="Object.keys(topSliders[0]).length">
      <a :href="topSliders[0].linkUrl" class="item-link">
        <picture>
          <source type="image/webp" :srcset="topSliders[0].webpUrl" sizes="100%" />
          <source type="image/jpeg" :srcset="topSliders[0].imageUrl" sizes="100%" />
          <img :src="topSliders[0].imageUrl" alt="top banner" sizes="100%" />
        </picture>
      </a>
    </div>
    <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.rt-ranking')" style="border: 3px solid #f3f0ef; margin: 0 5px;">
      <h4 class="top-heading__sub" style="margin-left: 5px;"><strong class="inline-flex mid center rt-icon mr-5">R</strong><span>{{ $t(33) }}</span></h4>
      <div class="owl-carousel product-slider rt-ranking mt-15">
        <RealtradeRankingProduct
          class="top-product"
          :product="product"
          :key="'rtProduct-' + product.id"
          v-for="(product, index) in rtRanking"
          :rank="index + 1"
        />
      </div>
    </LazyComp01>
    <LazyComp01 min-height="450px" style="margin-top: 20px; margin-bottom: 10px;">
      <BubbleChart02 :chart="rankingActive" />
    </LazyComp01>
    <div class="mb-20 flex content-end">
      <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 12px; margin-right: 20px;">{{ $t('32') }}</a>
    </div>
    <div class="flex space-between">
      <div class="top-content w-full">
        <LazyComp01 class="top-chart flex space-between shadow" v-if="currentChart" min-height="150px">
          <b v-html="$t('18')"></b>
          <a :href="currentChart.id ? '/markets/charts/' + (currentChart.id || 1) + '/7' : 'javascript:void(0)'">
            <img class="top-chart__img" :src="chartImg" alt="" />
          </a>
        </LazyComp01>
        <div class="newest-articles wrap-text"><a :href="`/finance/navi/${articles.data[0].seriesId}/${articles.data[0].id}`"><b>{{ articles.data[0].title }}</b></a></div>
        <a
          class="banner mt-10"
          :href="banner && banner.landingPageUrl"
          style="display: block; width: 100%; height: auto;"
        >
          <img
            :src="banner && banner.bannerUrl"
            style="width: 100%; max-width: 100%;"
          />
        </a>
        <div class="mt-10">
          <div class="top-heading">
            <LineChart class="icon-title mr-5" /><span class="span-recent">{{ $t('2') }}</span>
          </div>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot" @comp-ready="onSliderReady('.slider1')">
            <h4 class="top-heading__sub">{{ $t('5') }}</h4>
            <div class="owl-carousel product-slider slider1 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.nsystemtrade"
                :key="'slider1' + key"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot" @comp-ready="onSliderReady('.slider2')">
            <h4 class="top-heading__sub">{{ $t('6') }}</h4>
            <div class="owl-carousel product-slider slider2 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.nnavi"
                :key="'slider2' + key"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20" @comp-ready="onSliderReady('.slider3')">
            <h4 class="top-heading__sub">{{ $t('17') }}</h4>
            <div class="owl-carousel product-slider slider3 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.nindicator"
                :key="'slider3' + key"
              />
            </div>
          </LazyComp01>
          <div class="top-heading">
            <LineChart class="icon-title mr-5" /><span class="span-recent">{{ $t('19') }}</span>
          </div>
          <LazyComp01 min-height="220px" class="pt-10 pb-20" @comp-ready="onSliderReady('.slider4')">
            <div class="owl-carousel c-bestsell product-slider slider4 mt-15">
              <SystemProductVert
                v-for="(product,i) in bestsell"
                :key="'slider4' + i"
                class="price-hor"
                :product="product"
                :rank="i+1"
                :is-lz="true"
                :is-show-rate="false"
              />  
            </div>
            <a href="/systemtrade/sell/fx"><div class="btn-loadmore">{{ $t('21') }}</div></a>
          </LazyComp01>
          <div class="top-heading flex">
            <LineChart class="icon-title mr-5" /><span class="span-recent" v-html="$t('20')"></span>
          </div>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 " @comp-ready="onSliderReady('.slider5')">
            <div class="owl-carousel c-bestsell product-slider slider5 mt-15">
              <SystemProductVert
                v-for="(product,i) in tools"
                :key="'slider4' + i"
                :one-line="1"
                class="price-hor"
                :product="product"
                :rank="i+1"
                :is-lz="true"
                :is-show-rate="false"
              />  
            </div>
            <a href="/tools/popular/price"><div class="btn-loadmore">{{ $t('21') }}</div></a>
          </LazyComp01>
          <div class="top-heading ">
            <LineChart class="icon-title mr-5" /><span class="span-recent">{{ $t('9') }}</span>
          </div>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.slider6')">
            <h4 class="top-heading__sub">{{ $t('10') }}</h4>
            <div class="owl-carousel product-slider slider6 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.osystemtrade"
                :key="'slider6' + key"
                :is-show-rate="false"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.slider7')">
            <h4 class="top-heading__sub">{{ $t('11') }}</h4>
            <div class="owl-carousel product-slider slider7 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.oindicator"
                :key="'slider7' + key"
                :is-show-rate="false"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.slider8')">
            <h4 class="top-heading__sub">{{ $t('12') }}</h4>
            <div class="owl-carousel product-slider slider8 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.oadvisor"
                :key="'slider8' + key"
                :is-show-rate="false"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.slider9')">
            <h4 class="top-heading__sub">{{ $t('13') }}</h4>
            <div class="owl-carousel product-slider slider9 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.oall"
                :key="'slider9' + key"
                :is-show-rate="false"
              />
            </div>
          </LazyComp01>
          <LazyComp01 min-height="220px" class="pt-10 pb-20 border-bot " @comp-ready="onSliderReady('.slider10')">
            <h4 class="top-heading__sub">{{ $t('3') }}</h4>
            <div class="owl-carousel product-slider slider10 mt-15">
              <ProductVertical02
                :product="i" v-for="(i, key) in topProductsData.pr"
                :key="'slider10' + key"
                :is-show-rate="false"
              />
            </div>
          </LazyComp01>
          <div class="top-banner" v-if="banners[10]">
            <a :href="banners[10].landingPageUrl" target="_blank" rel="nofollow">
              <img :src="banners[10].bannerUrl" alt="" />
            </a>
          </div>
          <div class="m-top-slider" v-if="Object.keys(topSliders[1]).length">
            <a :href="topSliders[1].linkUrl" class="item-link">
              <picture>
                <source type="image/webp" :srcset="topSliders[1].webpUrl" sizes="100%" />
                <source type="image/jpeg" :srcset="topSliders[1].imageUrl" sizes="100%" />
                <img :src="topSliders[1].imageUrl" alt="top banner" sizes="100%" />
              </picture>
            </a>
          </div>
          <div class="top-heading">
            <LineChart class="icon-title mr-5" /><span class="span-recent">{{ $t('14') }}</span>
          </div>
          <LazyComp01 class="pt-20 pb-40 articles-list" min-height="100px">
            <NaviArticleItem class="al-item" v-for="item in articles.data" :key="'articles-list' + item.id" :item="item" :follow-fn="onNaviFollowItem" :fav-fn="onNaviFavoriteItem" />
            <a href="/finance/navi"><div class="btn-loadmore mt-20">{{ $t('21') }}</div></a>
          </LazyComp01>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Home from '@/js/index.js'
export default Home
</script>

<style lang="scss" scoped>
.m-top-slider {
  width: 100%;
  margin: 15px auto;
  .item-link {
    display: block;
    img {
      width: 100%;
      height: auto;
    }
  }
}
.rt-icon {
  width: 25px;
  height: 25px;
  background: #f19149;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 3px 0 0 0;
  border-radius: 50%;
}
.product-slider /deep/ {
  width: 100%;
  .owl-nav button {
    position: absolute;
    top: calc((100% - 85px) / 2);
    font-size: 60px;
    color: #d9d9da;
    outline: none;
    &.owl-prev {
      left: -7vw;
      font-size: 40px;
    }
    &.owl-next {
      right: -7vw;
      font-size: 40px;
    }
  }
}
div.ProductVertical02 /deep/ {
  width: 18vw;
  .s-82 {
    width: 80px;
    height: 80px;
  }
  .product-name {
    height: 38px;
    b {
      font-weight: normal;
      color: #434343;
    }
  }
}
.c-bestsell {
  /deep/ .product-BjNGX {
    width: 25vw;
    .product-name {
      margin: 7px 0 3px;
      height: 30px;
    }
    .rate-num {
      color: #666;
    }
  }
}
.co-bg {
  background: #f2f2f2;
}
.top-banner {
  padding: 15px;
  img {
    width: 100%;
    height: auto;
  }
}
.top-heading {
  padding: 5px 15px;
  background: #f3f0ef;
}
.top-heading__sub {
  margin-left: 15px;
  margin-bottom: 20px;
  color: #7d7d7d;
  font-weight: bold;
  font-size: 16px;
}
.span-recent {
  font-size: 16px;
  color: #434343;
  font-weight: bold;
}
.top-chart {
  height: 40vw;
  width: 90vw;
  padding: 15px 20px;
  display: flex;
  margin: 0 auto 20px;
}
.top-chart__img {
  width: 60vw;
  height: auto;
}
.icon-title {
  width: 24px;
  height: 24px;
  color: #f19149;
  margin-bottom: -6px;
}
/deep/ .slider-wrapper {
  width: 100vw;
}
.newest-articles {
  margin: 0 5px;
  padding: 10px 20px;
  background: #fffac8;
  color: #337ab7;
}
.border-bot {
  border-bottom: 1px solid #c9c9c9;
}
.btn-loadmore {
  color: white;
  text-align: center;
  background: #007bd8;
  height: 38px;
  width: 60vw;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 3px;
  font-size: 16px;
  line-height: 38px;
}
</style>

<style lang="scss">
/* stylelint-disable */
#__layout {
  overflow: hidden;
}
.scroll-btn {
  display: none !important;
}
/* stylelint-enable */
</style>