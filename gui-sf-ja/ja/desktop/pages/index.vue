<template>
  <section class="w-1000">
    <ListSlider />
    <div class="top-banner flex space-between mt-20" v-if="banners[7] && banners[8]">
      <a class="cursor-pointer" :href="banners[7].landingPageUrl" target="_blank" rel="nofollow">
        <Lzimg :data-src="banners[7].bannerUrl" alt="" />
      </a>
      <a class="cursor-pointer" :href="banners[8].landingPageUrl" target="_blank" rel="nofollow">
        <Lzimg :data-src="banners[8].bannerUrl" alt="" />
      </a>
    </div>
    <div class="flex space-between mt-30">
      <div class="sf-left-content pr-10">
        <LazyComp01 style="margin-top: 20px; margin-bottom: 20px;" min-height="450px">
          <BubbleChart02 :chart="rankingActive" />
        </LazyComp01>
        <div class="mt-15 mb-15 flex content-end" style="font-size: 14px;">
          <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false">{{ $t('41') }}</a>
        </div>
        <LazyComp01 class="w-full m-t-20" min-height="433px">
          <HeaderBlueZ :left-text="$t('13')" />
          <div class="w-full h-400" v-if="scatterChartData">
            <Scatter3d :chart="scatterChartData" />
          </div>
        </LazyComp01>
        <HeaderBlueZ class="mb-20" :left-text="$t('1')" right-url="/markets/charts" :right-text="$t('2')" />
        <div class="flex text-center ml-20 mr-20" :style="{height: '30px'}">
          <button v-for="(item,index) in chartData" class="p-5 pairs bg-co-59 fs-13" :key="item.pair+index"
                  :class="{'pair-active' : selectedPair == index}" @click="onSelectPair(index)"
                  :disabled="selectedPair == index"
          >
            {{ index }}
          </button>
        </div>
        <LazyComp01 class="mt-20 flex space-between" v-if="Object.keys(currentChart).length" min-height="181px">
          <div class="pl-20 pair-table">
            <button class="pair-label"><b>{{ currentChart.pair }}</b></button>
            <table class="mt-10 border-all w-full table-bordered fs-12">
              <thead>
                <tr class="row-middle-all bg-co-65 text-center p-5">
                  <td class="border-right">S3</td>
                  <td class="border-right">S2</td>
                  <td class="border-right">S1</td>
                  <td class="border-right">R1</td>
                  <td class="border-right">R2</td>
                  <td>R3</td>
                </tr>
              </thead>
              <tbody>
                <tr class="row-middle-all text-center p-5">
                  <td class="border-right p-5">{{ currentChart.s3 }}</td>
                  <td class="border-right p-5">{{ currentChart.s2 }}</td>
                  <td class="border-right p-5">{{ currentChart.s1 }}</td>
                  <td class="border-right p-5">{{ currentChart.r1 }}</td>
                  <td class="border-right p-5">{{ currentChart.r2 }}</td>
                  <td class="p-5">{{ currentChart.r3 }}</td>
                </tr>
              </tbody>
            </table>
            <table class="mt-10 border-all w-full table-bordered fs-12">
              <thead>
                <tr class="row-middle-all bg-co-65">
                  <td class="w-200 border-right p-5 text-center"><b>{{ $t('3') }}</b></td>
                  <td class="w-100 p-5 text-center"><b>{{ $t('4') }}</b></td>
                </tr>
              </thead>
              <tbody>
                <tr class="row-middle-all">
                  <td class="border-right p-5">
                    <template v-if="currentChart.trend != '-'">
                      <svg class="arrow-up" width="19px" height="12px" v-if="currentChart.trend > 0">
                        <path d="M6.8 5.4V12H3.1V5.4H.4L4.9 0l4.5 5.4H6.8zm11.7 0L14.1 0 9.6 5.4h2.7V12h3.6V5.4h2.6z"
                              :fill="trendColor"
                        />
                      </svg>
                      <svg class="arrow-down" width="19px" height="12px" v-else-if="currentChart.trend < 0">
                        <path d="M12.2 6.6V0h3.6v6.6h2.7L14.1 12 9.6 6.6h2.6zM.4 6.6L4.9 12l4.5-5.4H6.8V0H3.1v6.6H.4z"
                              :fill="trendColor"
                        />
                      </svg>
                      <svg v-else class="arrow-left" width="14px" height="12px">
                        <path d="M8.1 8H0V4h8.1V1L14 6l-5.9 5V8z" :fill="trendColor" />
                      </svg>
                    </template>
                    <template v-else>
                      <span>-</span>
                    </template>
                  </td>
                  <td class="p-5">
                    <template v-if="currentChart.oscillator != '-'">
                      <svg class="arrow-up-2" width="19px" height="12px" v-if="currentChart.oscillator > 0">
                        <path d="M9.1 7.3l-.7-7-6.7 2 2.2 1.5L.2 9.3l3 2 3.7-5.5 2.2 1.5zm9.5.7l-.7-7-6.7 2 2.2 1.5-3.7 5.4 3 2 3.7-5.5L18.6 8z" :fill="oscillatorColor" />
                      </svg>
                      <svg class="arrow-down-2" width="19px" height="12px" v-else-if="currentChart.oscillator < 0">
                        <path d="M7 6.2L3.3.7l-3 2L4 8.2 1.7 9.7l6.7 2 .7-7L7 6.2zm9.5-.4L12.8.3l-3 2 3.7 5.5-2.2 1.5 6.7 2 .7-7-2.2 1.5z"
                              :fill="oscillatorColor"
                        />
                      </svg>
                      <svg class="arrow-left" width="14px" height="12px" v-else>
                        <path d="M8.1 8H0V4h8.1V1L14 6l-5.9 5V8z" :fill="oscillatorColor" />
                      </svg>
                    </template>
                    <template v-else>
                      <span>-</span>
                    </template>
                  </td>
                </tr>
                <tr class="row-middle-all">
                  <td class="bg-co-59 pl-10" colspan="2">
                    {{ $t('5') }} 
                    {{ currentChart.updatedDate ? formatTime(currentChart.updatedDate, 3) : ' -' }}
                    {{ currentChart.updatedDate ? $t('6') : '' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full text-right pl-10 mr-20">
            <div class="flex ml-20 bg-co-65">
              <!-- <button v-for="(item,index) in TRENDS" class="w-40 h-25 no-border bg-co-65 fs-12 outline-none"
                      :class="{'trend-active' : selectedTrend == index}" @click="onSelectTrend(index)"
                      :disabled="selectedTrend == index" :key="index"
              >
                {{ item }}
              </button> -->
              <button class="w-40 h-25 no-border bg-co-65 fs-12 outline-none trend-active" disabled>
                1D
              </button>
            </div>
            <a :href="currentChart.id ? '/markets/charts/' + (currentChart.id || 1) + '/7' : 'javascript:void(0)'">
              <img class="mt-30 w-250 h-120" :src="chartImg" alt="" />
            </a>
          </div>
        </LazyComp01>
        <div class="text-center no-data" v-else>
          {{ $t('21') }}
        </div>
        <div class="flex space-between mt-50">
          <LazyComp01 class="bg-blue world-market" min-height="357px">
            <HeaderBlueLine :title="$t('7')" :img-index="3" class="mb-10" />
            <MapWorldMarket :data="mapData" />
          </LazyComp01>
          <LazyComp01 class="special-features" min-height="357px">
            <HeaderBlueLine :title="$t('8')" :img-index="4" class="mb-10" />
            <div v-for="(item, index) in topContent" class="mt-10 pos-rel" :key="'special-features-' + index">
              <a :href="item.linkUrl" :title="item.title">
                <img class="w-full h-150" :src="item.imageUrl" :alt="item.title" />
              </a>
            </div>
          </LazyComp01>
        </div>
        <div class="w-full mt-40">
          <HeaderBlueZ :left-text="$t('9')" />
          <LazyComp01 :timeout="9e3" class="mt-25 border-bottom pb-20" min-height="250px"
                      @comp-ready="onSliderReady('.slider1')"
          >
            <div class="flex mid">
              <LineChart class="icon-title mr-5" /><h3 class="span-recent">{{ $t('10') }}</h3>
            </div>
            <div class="owl-carousel product-slider slider1 mt-10 mb-20">
              <ProductVertical :product="i" v-for="(i, key) in topProductsData.systemtrade"
                               :key="'slider1' + key"
                               :show-chart="true"
              />
            </div>
          </LazyComp01>
          <LazyComp01 :timeout="9e3" class="mt-25 border-bottom pb-20" min-height="250px" @comp-ready="onSliderReady('.slider2')">
            <div class="flex mid">
              <Tool class="icon-title mr-5" /><h3 class="span-recent">{{ $t('11') }}</h3>
            </div>
            <div class="owl-carousel product-slider slider2 mt-10 mb-20">
              <ProductVertical :product="i" v-for="(i, key) in topProductsData.indicator"
                               :key="'slider2' + key"
              />
            </div>
          </LazyComp01>
          <LazyComp01 :timeout="11e3" class="mt-25 border-bottom pb-20" min-height="250px" @comp-ready="onSliderReady('.slider3')">
            <div class="flex mid">
              <Salon class="icon-title mr-5" /><h3 class="span-recent">{{ $t('12') }}</h3>
            </div>
            <div class="owl-carousel product-slider slider3 mt-10 mb-20">
              <ProductVertical :product="i" v-for="(i, key) in topProductsData.advisor"
                               :key="'slider3' + key"
              />
            </div>
          </LazyComp01>
          <LazyComp01 :timeout="11e3" class="mt-25 pb-20" min-height="250px" @comp-ready="onSliderReady('.slider4')">
            <div class="flex mid">
              <Other class="icon-title mr-5" /><h3 class="span-recent">{{ $t('28') }}</h3>
            </div>
            <div class="owl-carousel product-slider slider4 mt-10 mb-20">
              <ProductVertical :product="i" v-for="(i, key) in topProductsData.all"
                               :key="'slider4' + key"
              />
            </div>
          </LazyComp01>
        </div>        
      </div>
      <div class="sf-right-content mt-5">
        <div class="fs-12 rank-tabs">
          <!-- <button class="no-border rank-logo p-0" disabled>
            {{ $t('15') }}
          </button> -->
          <button class="co-rank-all rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'all'}"
                  @click="onselectRank('all')" :disabled="selectedRank == 'all'"
          >
            {{ $t('16') }}
          </button>
          <button class="co-rank-ea rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'ea'}"
                  @click="onselectRank('ea')" :disabled="selectedRank == 'ea'"
          >
            {{ $t('17') }}
          </button>
          <button class="co-rank-ebook rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'etc'}"
                  @click="onselectRank('etc')" :disabled="selectedRank == 'etc'"
          >
            {{ $t('18') }}
          </button>
          <button class="co-rank-rt rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'rt'}"
                  @click="onselectRank('rt')" :disabled="selectedRank == 'rt'"
          >
            {{ $t('42') }}
          </button>
        </div>
        <div class="product-list ranking-list">
          <ProductRankHorizontal v-for="(item,index) in rankData[selectedRank]"
                                 :key="selectedRank+item.id" :img-index="index + 1"
                                 :product="item"
                                 :color-index="selectedRank"
                                 :display-pips="true"
          />
        </div>
        <LazyComp01 :timeout="8e3" class="mt-30" min-height="440px">
          <h2 class="title-product pl-10">{{ $t('19') }}</h2>
          <div class="w-full product-list pr-list">
            <ProductHorizontal class="pr-product" v-for="item in topProductsData.pr" :key="'pr-product-' + item.id"
                               :product="item" :disable-rate="true"
            />
          </div>
        </LazyComp01>
        <LazyComp01 :timeout="10e3" class="mt-30" min-height="450px">
          <h2 class="title-product pl-10">{{ $t('20') }}</h2>
          <div class="w-full product-list new-list">
            <ProductHorizontal v-for="item in topProductsData.new" :key="'new-' + item.id"
                               :product="item" class="new-commodity"
                               :disable-rate="true"
                               :disable-description="true"
            />
          </div>
        </LazyComp01>
        <ShowMore
          class="fs-12 mt-5"
          :text="$t('30')"
          target="/products"
        />
        <LazyComp01 class="mt-30" min-height="405px" v-if="!$store.state.isBot">
          <h2 class="title-product mb-10 pl-10 pt-0">{{ $t('27') }}</h2>
          <div class="videos" v-for="(item, index) in topVideos" v-html="item.Url" :key="index"></div>
          <a href="https://fx-koryaku.com/" :style="{display: 'inline-block', width: '280px'}">
            <Lzimg data-src="/img/assets/pc/common/fxkoryaku_s.png" alt="image" :style="{width: '280px'}" />
          </a>
        </LazyComp01>
      </div>
    </div>
    <LazyComp01 :timeout="15e3" class="w-full mt-20 mb-50" min-height="215px" @comp-ready="onSliderVideoReady('.slider5')">
      <HeaderBlueLine class="mb-30" :title="$t('14')" :img-index="2" />
      <div class="owl-carousel owl-theme video-slider slider5 mt-10 mb-20">
        <a v-for="(video, key) in topVideoData" :key="'slider5' + key" :href="video.linkUrl"
           :title="video.title" target="_blank"
        >
          <img class="img owl-lazy" :data-src="video.thumbnailUrl || getThumbnailYoutube(video.imageUrl || '') || '/img/assets/pc/common/default/no-photo.png'"
               :alt="video.title" style="width: 228px; height: 128px;"
          />
        </a>
      </div>
    </LazyComp01>
  </section>
</template>

<script>
import Home from '@/js/index.js'
export default Home
</script>

<style lang="scss" scoped>
.sf {
  &-left-content {
    width: 70%;
    align-content: left;
  }
  &-right-content {
    width: 30%;
    align-content: right;
  }
}
.h-400 {
  height: 400px;
}
.pairs {
  width: calc(660px / 8);
  background: #f9f7f7;
  border: 1px solid #b4b5b6;
  font-weight: bold;
  &:not(:last-child) {
    border-right-width: 0;
  }
  &:focus {
    outline: none;
  }
}
.pair-label {
  width: 96px;
  height: 42px;
  line-height: 42px;
  background: #079ee3;
  font-size: 16px;
  border: none;
  border-radius: 3px;
  color: white;
}
.pair-active {
  border-width: 2px 0 0 !important;
  border-color: #079ee3 !important;
  border-left: 1px solid #b4b5b6 !important;
  background: white !important;
  color: #079ee3;
}
.pair-table {
  flex: 0 0 340px;
}
.w-250 {
  width: 250px;
}
.h-120 {
  height: 120px;
}
.border-right {
  border-right: 1px #b4b5b6 solid;
}
.bg-co-65 {
  background-color: #e0edf7;
}
.bg-co-59 {
  background-color: #f9f7f7;
}
.outline-none {
  &:focus {
    outline: none;
  }
}
.w-40 {
  width: 40px;
}
.trend-active {
  background: white;
  border-left: 1px solid #b4b5b6;
  border-top: 1px solid #b4b5b6;
  border-right: 1px solid #b4b5b6;
  border-bottom: none;
  height: 30px;
  margin-top: -5px;
  color: red;
}
.world-market {
  flex: 0 0 430px;
}
.special-features {
  flex: 0 0 230px;
}
.h-150 {
  height: 150px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
$rank-border-color: #d9d9d9;
.rank-tab-psuedo {
  content: '';
  position: absolute;
  height: 1px;
  background-color: $rank-border-color;
}
.rank-tabs {
  display: inline-flex;
  button {
    font-weight: bold;
    background: transparent;
    position: relative;
    height: 22px;
    line-height: 22px;
    border-bottom: 1px solid $rank-border-color;
    text-align: center;
    border-right: 1px solid $rank-border-color;
    padding-left: 10px;
    &.rank-active {
      border-bottom: none;
      z-index: 1;
    }
    &:first-child, &:nth-child(2) {
      width: 50px;
    }
    &:nth-child(3), &:last-child {
      width: 100px;
    }
    &::before {
      @extend .rank-tab-psuedo;
      left: -5px;
      transform: rotate(-48deg);
      top: 10px;
      width: 30px;
    }
    &::after {
      @extend .rank-tab-psuedo;
      left: 20px;
      top: -1px;
    }
    &:first-child::after, &:nth-child(2)::after {
      width: 30px;
    }
    &:nth-child(3)::after, &:last-child::after {
      width: 80px;
    }
  }
}
.disabled-select {
  pointer-events: none;
  opacity: 0.5;
}
.product-list {
  min-height: 400px;
}
.title-product {
  background: #f0f0f0;
  height: 30px;
  line-height: 34px;
  color: #7d7d7d;
  font-size: 16px;
  border-left: 5px #dbdbdb solid;
}
.ranking-list {
  border: 1px solid #d9d9d9;
  border-top: none;
  padding-top: 1px;
  margin-top: -1px;
}
.co-rank {
  &-all {
    color: #b4b36f;
  }
  &-ea {
    color: #6cb6fc;
  }
  &-ebook {
    color: orange;
  }
  &-rt {
    color: #16a085;
  }
}
.new-list /deep/ {
  .gogo-link {
    align-items: flex-start;
    &:hover {
      div.product-title {
        color: #5094a5;
      }
    }
    div.product-title {
      color: #67b8c0;
    }
  }
}
.videos /deep/ iframe {
  width: 280px !important;
}
.span-recent {
  font-size: 17px;
  color: #666;
  font-weight: bold;
  line-height: inherit;
  margin: inherit;
}
.icon-title {
  width: 24px;
  height: 24px;
  color: #666;
}
/deep/ div.product-vertical {
  width: 85px;
  .product-name {
    height: 38px;
  }
  .rate-num {
    font-size: 12px;
    padding-top: 1px;
  }
}
/deep/ div.product-horizontal:hover {
  .product-title {
    text-decoration: none;
  }
  .gogo-link {
    text-decoration: none;
  }
}
.pr-product /deep/ {
  .product-details {
    .product-title {
      color: #000 !important;
      text-decoration: none;
    }
  }
}
.new-commodity:hover {
  text-decoration: none;
}
.video-slider /deep/ {
  .owl-dot {
    margin-top: 20px;
    outline: none;
    &.active span,
    &:hover span {
      background: #7ecef4;
    }
    span {
      width: 13px;
      height: 13px;
    }
  }
}
@media only screen and (min-width: 1370px) {
  .top-banner {
    display: none;
  }
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
