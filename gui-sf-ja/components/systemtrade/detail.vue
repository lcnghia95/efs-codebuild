<template>
  <div v-if="checkShowPass" class="w-1000 lock-product text-center">
    <div v-if="data.statusType === 9" class="alert-not-selling">{{ $t('23') }}</div>
    <div class="password-title mt-50"><b>{{ $t('12') }}</b></div>
    <p class="mt-40 fs-12 hint">{{ $t('13') }}</p>
    <input class="input-field pl-20 pr-20" :class="(isError) ? 'is-error' : ''" v-model="password"
           :placeholder="(isError) ? $t('22') : $t('14')" type="password"
    />
    <div class="flex mid center mb-50">
      <button class="btn-lock flex mid center btn mt-10" @click="getProductData" :class="{'disabled': loading}">
        <span>{{ $t('15') }}</span>
      </button>
    </div>
  </div>
  <div class="w-1000" v-else>
    <div class="img-stt9 flex mid center mb-50" v-if="data.cartInfo && data.cartInfo.status === 9">
      <svg class="svg-line">
        <line x1="0" y1="0" x2="100%" y2="100%" />
      </svg>
      <div class="text-in">{{ $t('23') }}</div>
    </div>
    <div class="tool-detail-menu w-full" v-if="!langSupported().includes($i18n.locale)">
      <div class="w-1000 flex mid h-full">
        <a class="detail-menu no-underlying flex mid" @click="scrollTop">{{ $t('26') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-strategy')">{{ $t('6') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('lz-forward')">{{ isStock ? $t('33'): $t('27') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="onGoToBacktest" v-if="!isStock">{{ $t('18') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="goCommunity">{{ $t('28') }}</a>
        <a class="detail-menu no-underlying flex mid" :href="`/review/detail/${id}`" v-if="reviews && reviews.length > 0">{{ $t('7') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-trending-product')">{{ $t('9') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-related-article')" v-if="relatedArticles.length">{{ $t('29') }}</a>
      </div>
    </div>
    <div class="flex space-between">
      <div class="left-content">
        <DetailBanner />
        <SystemDetailHeader :detail="data" :go-community="goCommunity" :category="category"
                            :commu-total="commuTotal" :main-chart="mainChart.mainChart" :pip-chart="mainChart.pipChart || []" :is-stock="isStock"
                            :is-operation-stop="!!mainChart.isOperationStop"
        />
        <LazyComp01 v-if="(video || {}).liveUrl" min-height="400px" class="mt-30 mb-50">
          <iframe class="w-full h-400 mt-10" :src="youtubeParser(video.liveUrl)" frameborder="0" allowfullscreen></iframe>
        </LazyComp01>
        <LazyComp01 class="mt-30 flex" id="detail-tab" min-height="50px">
          <div class="detail-tab flex mid center" :class="{'detail-tab-active': detailTab == 1}"
               @click="clickDetailTab(1)"
          >
            <ChartArea />
            <span>{{ $t('1') }}</span>
          </div>
          <div class="detail-tab flex mid center" :class="{'detail-tab-active': detailTab == 2}"
               @click="clickDetailTab(2)"
          >
            <CommentSolid />
            <span>{{ $t('2') }}</span>
          </div>
        </LazyComp01>
        <div v-if="detailTab == 2" class="mt-30 mb-30">
          <Community :get-data="getCommunityData" :id="data.id" @posted="onPosted" @update-total="onUpdateTotal"
                     @delete-reply="onDeleteReply"
          />
        </div>
        <div class="mt-35" v-if="detailTab == 1">
          <template v-if="!isStock">
            <template v-if="!langSupported().includes($i18n.locale)">
              <LazyComp01 class="mt-20" min-height="450px">
                <BubbleChart02 :chart="rankingActive" />
              </LazyComp01>
              <div class="mt-15 flex content-end mb-10">
                <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 14px;">{{ $t('51') }}</a>
              </div>
            </template>
            <LazyComp01 min-height="791px">
              <div class="flex mid space-between">
                <LeftTitle :text="$t('3')" />
                <div class="flex mid space-around">
                  <div v-for="year in years" class="year text-center ml-10" :key="'year-' + year"
                       :class="{'year-active': yearSelect == year}" @click="clickYear(year)"
                  >
                    <b>{{ year }}</b>
                  </div>
                </div>
              </div>
              <ul class="mt-20 w-full flex space-between p-0">
                <li v-for="(text, m) in shortMonths" class="month text-center"
                    :class="{'month-tab-active': monthSelect == m, 'no-data': !monthList.includes(m)}"
                    :key="'month-' + m" @click="clickMonth(m)"
                >
                  <b>{{ text }}</b>
                </li>
              </ul>
              <div class="flex mid center chart-loading mt-40 mb-40" v-if="dateProcessing">
                <Loading style="width: 50px; height: 50px;" />
              </div>
              <no-ssr v-else>
                <div class="w-full text-center mt-20" v-if="!Object.keys(myChart[yearSelect] || {}).length">
                  {{ $t('16') }}
                </div>
                <ChartGroup :charts="myChart[yearSelect]" :month-selected="monthSelect" :currency="data.currencyType"
                            v-else
                />
              </no-ssr>
            </LazyComp01>
          </template>
          <LazyComp01 class="mt-50" min-height="455px">
            <LeftTitle :text="$t('5')" />
            <FullCalendar :type="category" :id="detail.displayProductId || id" />
          </LazyComp01>

          <LeftTitle :text="$t('6')" class="mt-50" id="st-strategy" />
          <LazyComp01 min-height="425px">
            <Outline :data="data.outline" :list-outline="listOutline" :category="category" />
          </LazyComp01>
        </div>
      </div>
      <div class="right-content">
        <Payment02 class="mb-30" :get-product-password="getProductPassword" />
        <div class="banner mt-10 w-full" v-for="(ad, idx) in data.ads" :key="'ad-' + idx">
          <a :href="ad[1]"><img :src="ad[0]" class="w-full" alt="" /></a>
          <a :href="(advertiseBanners[1] || {}).landingPageUrl" class="w-full">
            <img :src="(advertiseBanners[1] || {}).bannerUrl" alt="" class="mt-20" />
          </a>
          <a :href="(advertiseBanners[2] || {}).landingPageUrl" class="w-full">
            <img :src="(advertiseBanners[2] || {}).bannerUrl" alt="" class="mt-20" />
          </a>
        </div>
        <div class="banner mt-10 w-full" v-if="$i18n.locale == 'ja'">
          <a href="/finance/navi/articles/22537" rel="nofollow">
            <img src="/img/affiliates/949/4/4" alt="【まずは先着10名様限定】期間中にEAご購入で　4GVPS 月額2,950円　1ヶ月無料プレゼントキャンペーン" style="border: 0;" class="w-full" />
          </a>
        </div>
        <LazyComp01 v-if="(lastestCommu || []).length" min-height="150px" class="mt-30">
          <h2 class="title-right flex mid pl-10 m-0">
            <b>{{ $t('19') }}</b>
          </h2>
          <Communicates :communicates="lastestCommu" :go-community="goCommunity" />
        </LazyComp01>
        <LazyComp01 v-if="(reviews || []).length" min-height="100px">
          <h2 class="title-right flex mid pl-10 mt-30 mb-0">
            <b>{{ $t('7') }}</b>
          </h2>
          <div class="flex layout-col mt-10 review-wrapp">
            <div v-for="(rv,i) in reviews" :key="'review-' + i" class="pt-10 pb-10">
              <ProductReview :data="rv" :product-id="$route.params.id" />
            </div>
          </div>
          <ShowMore class="fs-12 mt-5" :target="'/review/detail/' + $route.params.id" />
        </LazyComp01>
        <LazyComp01 v-if="$i18n.locale == 'ja' && (video || {}).url" min-height="300px" class="mt-30">
          <h2 class="title-right flex mid pl-10 m-0">
            <b>{{ $t('25') }}</b>
          </h2>
          <iframe class="w-full h-200 mt-10" :src="youtubeParser(video.url)" frameborder="0" allowfullscreen></iframe>
        </LazyComp01>
        <LazyComp01 min-height="200" v-if="$i18n.locale === 'ja' ">
          <h2 class="title-right flex mid pl-10 m-0 mt-30">
            <b>REAL TRADE</b>
          </h2>
          <div class="mt-10 real-trade-widget-banner">
            <a href="/post/46/15407" rel="nofollow">
              <img src="/img/assets/pc/realtrade/widget_banner.png" alt="Real Trade Widget Banner" />
            </a>
          </div>
          <template v-if="(relatedProductWidgets.previewData || []).length > 0">
            <div class="real-trade-widget flex mt-10 layout-col" v-for="(item,index) in relatedProductWidgets.previewData" :key="index">
              <div class="account-info flex mb-10">
                <div class="flex ml-10 space-between layout-col w-full">
                  <div class="inline-flex account-type-container">
                    <div class="account-type" :style="{backgroundColor: `#${item.color}`}">
                      {{ item.isBuyer && item.modeId !== 2 ? $t('35') : $t('36') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="real-trade-widget-chart">
                <!-- <a :href="`/systemtrade/fx/${$route.params.id}/real-trade`" rel="nofollow" target="_blank">
                <img :src="`https://blog.fx-on.com/?pt=2&t=4&l=1&p=${item.accountId}&c=0&u=${item.userId}&m=${item.modeId}&mi=0&mn=${item.magicNumber}`"
                     alt="1 | GogoJungle" width="300" height="150">
              </a> -->
                <iframe scrolling="no" :src="item.widgetUrl" frameborder="0" width="300" height="390" class="gg-hide"></iframe>
              </div>
            </div>
          </template>
          <div class="pt-10">
            <ShowMore :target="`/systemtrade/fx/${$route.params.id}/real-trade`" :text="$t('34')" />
          </div>
        </LazyComp01>
      </div>
    </div>
    <LazyComp01 class="mt-50" v-if="detailTab == 1 && data.platform != 9" min-height="800px" id="lz-forward">
      <LazyComp01 class="mt-30 flex" id="detail-tab" min-height="50px">
        <div class="detail-tab flex mid center detail-tab-active">
          <ChartArea />
          <span>{{ isStock ? $t('33'): $t('27') }}</span>
        </div>
        <div class="detail-tab flex mid center" :class="{'detail-tab-active': detailTab == 2}"
             @click="onGoToBacktest()"
        >
          <CommentSolid />
          <span>{{ $t('18') }}</span>
        </div>
      </LazyComp01>
      <div class="flex mid center chart-loading mb-40" v-if="!forwardDataLoaded">
        <Loading style="width: 50px; height: 50px;" />
      </div>
      <template v-else>
        <stocksForwardTest :forward="forward" :platform="data.platform" :on-get-data-page="getDataForward" v-if="isStock" />
        <fxForwardTest :forward="forward" :domestic-broker="data.isDomesticBroker" :demo-broker-id="data.demoBrokerId" :on-get-data-page="getDataForward" v-else />
      </template>
    </LazyComp01>
    <LazyComp01 min-height="375px">
      <Payment02
        :get-product-password="getProductPassword"
        theme="theme-hor"
        :type="1"
      />
    </LazyComp01>
    <LazyComp01 class="mt-25 border-bottom pb-20" @comp-ready="onSliderReady('.slider1')"
                v-if="(others.userProducts || []).length" min-height="310px"
    >
      <LeftTitle :text="$t('11', {name: (data.user || { name: '' }).name})" class="mt-50 mb-20" />
      <div class="owl-carousel product-slider slider1 mt-10 mb-20">
        <SystemProductVert class="slide-detail" :size="[80, 80]" v-for="product in (others.userProducts || [])"
                           :product="product" type="systemtrade" :key="'user-product-' + product.id" :is-lz="true"
        />
      </div>
    </LazyComp01>
    <LeftTitle :text="$t('9')" class="mb-20 mt-30" id="st-trending-product" />
    <LazyComp01 class="mt-20 border-bottom pb-20" @comp-ready="onSliderReady('.slider2')"
                v-if="(others.popular || []).length" min-height="254px"
    >
      <div class="owl-carousel product-slider slider2 mt-10 mb-20">
        <SystemProductVert class="slide-detail" :size="[80, 80]" v-for="product in (others.popular || [])"
                           :product="product" type="systemtrade" :key="'user-product-' + product.id" :is-lz="true"
        />
      </div>
    </LazyComp01>
    <LazyComp01 class="mt-25 border-bottom pb-20" @comp-ready="onSliderReady('.slider2')"
                v-if="(others.alsoBought || []).length" min-height="310px"
    >
      <LeftTitle :text="$t('30')" class="mt-30 mb-20" />
      <div class="owl-carousel product-slider slider2 mt-10 mb-20">
        <SystemProductVert class="slide-detail" :size="[80, 80]" v-for="product in (others.alsoBought || [])"
                           :product="product" type="systemtrade" :key="'user-product-' + product.id" :is-lz="true"
        />
      </div>
    </LazyComp01>
    <LazyComp01 min-height="300px" v-if="others.ranking" :class="{'mb-50': langSupported().includes($i18n.locale)}">
      <RankingList class="ranking-tabs" :ranking-list="others.ranking" />
    </LazyComp01>

    <LeftTitle :text="$t('29')" class="mt-25 mb-20" v-if="!langSupported().includes($i18n.locale) && relatedArticles.length" id="st-related-article" />
    <LazyComp01 class="border-bottom pb-20" v-if="!langSupported().includes($i18n.locale) && relatedArticles.length" min-height="200px">
      <ArticleList class="navi-wrapp ml-25" :list="relatedArticles">
        <template slot-scope="prop">
          <NaviHorizontal04 :item="prop.item" :follow-fn="prop.item.onNaviFollow" :favorite-fn="prop.item.onNaviFavorite" />
        </template>
      </ArticleList>
    </LazyComp01>
    <LazyComp01 class="mt-30" min-height="200px" v-if="!langSupported().includes($i18n.locale)">
      <LeftTitle :text="$t('10')" class="mb-20" />
      <div v-if="data && data.user" v-html="data.user.transaction || data.user.selfIntroduction"
           class="pre-wrap terms"
      ></div>
    </LazyComp01>
    <div class="flex center btn-top" v-if="!checkShowPass && $i18n.locale == 'ja'">
      <button class="flex mid center bottom-btn p-5" @click="scrollTop">
        <div class="up-circle mr-10">
          <AngleUp />
        </div>
        {{ $t('32') }}
      </button>
    </div>
    <GogoModal :show="isShowModal" :cancel-text="$t('49')" @close="onClose" @ok="onGoToRegister" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{ $t('48') }}
      </div>
    </GogoModal>
  </div>
</template>
<script>
import detail from '@/js/systemtrade/detail.js'

export default detail
</script>

<style lang="scss" scoped>
.alert-not-selling {
  background: red;
  color: white;
  height: 40px;
  padding: 11px 0;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
}
.img-stt9 {
  position: relative;
  border: 1px solid #d9d9d9;
  height: 250px;
  background: #eee;
  .text-in {
    border: 1px solid #d9d9d9;
    padding: 10px 20px;
    font-size: 16px;
    background: white;
    z-index: 2;
  }
  .svg-line {
    width: 100%;
    height: 100%;
    position: absolute;
    line {
      stroke: #d9d9d9;
      stroke-width: 1;
    }
  }
}
.left-content {
  width: 670px;
  .h-400 {
    height: 400px;
  }
}
.lock-product {
  height: 1000px;
  background: #eee;
  border-radius: 10px;
  .password-title {
    display: inline-block;
    font-size: 26px;
    border-bottom: 1px solid #d9d9d9;
  }
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    width: 310px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    width: 310px;
    background: #00a0e9;
    height: 50px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.year {
  width: 80px;
  height: 30px;
  line-height: 25px;
  border: 4px solid #ebebeb;
  border-radius: 15px;
  font-size: 18px;
  color: #ebebeb;
  cursor: pointer;
  &-active {
    background: #ff8400;
    border: 4px solid #ff8400;
    color: white;
  }
}
.chart-loading {
  height: 600px;
}
.cart-area {
  width: 60%;
  height: 300px;
  border-radius: 10px;
  border: 4px solid #d9d9d9;
}
.cart-area-right {
  width: 100%;
  height: 500px;
  border-radius: 10px;
  border: 4px solid #d9d9d9;
}
.right-content {
  width: 300px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
    line-height: 1.4;
  }
  .review-wrapp > div:not(:last-child) {
    border-bottom: dotted 1px #ccc;
  }
  .h-200 {
    height: 200px;
  }
}
ul {
  border-bottom: 5px solid #bdb3b3;
  align-items: flex-end;
  padding: 0 3px;
  li {
    list-style: none;
    background-color: #bdb3b3;
    color: #fff;
    cursor: pointer;
    &.month {
      width: 50px;
      height: 25px;
      line-height: 25px;
      margin: 0 2px -5px 2px;
      &-tab-active {
        height: 31px;
        background-color: #fff;
        color: #bdb3b3;
        border: 5px solid #bdb3b3;
        border-bottom: none;
      }
    }
  }
}
.pre-wrap {
  white-space: pre-line;
  color: #666;
  line-height: 22px;
}
.terms {
  color: #666;
  font-size: 12px;
}
.payment-aMqcC {
  margin: 0 auto;
}
div.slide-detail /deep/ {
  width: 102px;
  min-height: 220px;
  .product-name .gogo-link {
    font-size: 12px;
    color: #0344cc;
  }
  .gg-rating {
    letter-spacing: -1px;
    .rate-num {
      font-size: 11px;
    }
  }
}
.ranking-tabs /deep/ {
  ul .ranking {
    padding: 6px 30px;
  }
  .table-striped {
    thead {
      background: transparent;
      color: #666;
    }
  }
}
.navi-wrapp /deep/ {
  .article-XMkTj {
    margin-right: 26px;
    &:last-child {
      margin-right: 0;
    }
    .navi-h04 {
      width: 210px;
    }
  }
}
.set-product {
  border: 4px solid #d9d9d9;
  .set-title {
    color: #666;
    background: #f0f0f0;
    font-size: 18px;
  }
}
.banner:hover {
  opacity: 0.85;
}
.no-data {
  color: #9e9898;
}
.download-backtest {
  display: block;
  background: #2eaf56;
  padding: 10px 20px;
  color: white;
  border-radius: 0;
}

.tool-detail-menu {
  display: none;
  position: fixed;
  height: 60px;
  top: 0;
  left: 0;
  background: white;
  box-shadow: 0 3px 4px #ededed;
  z-index: 9;
}
.detail-menu {
  cursor: pointer;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  &:hover {
    color: #f60;
    border-bottom: 2px solid #f60;
  }
}
.up-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: white;
  i {
    color: #434a54;
    width: 20px;
    height: 18px;
  }
}
.box-shadow {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.6);
}
.btn-top {
  margin-top: 60px;
  .bottom-btn {
    border: none;
    border-radius: 5px;
    background: #434a54;
    color: white;
    width: 400px;
    height: 70px;
    font-size: 19px;
    &:hover {
      opacity: 0.9;
    }
  }
}
.real-trade-widget {
  .account-type {
    color: white;
    background-color: orange;
    height: 32px;
    border-radius: 8px;
    padding: 8px;
    margin-right: 10px;
  }
}
.detail-tab {
  border-bottom: 2px solid #ff8400;
  width: 50%;
  height: 50px;
  color: #666;
  cursor: pointer;
  i.icon-cls {
    width: 30px;
    height: 30px;
    margin-right: 3px;
    ~ span {
      font-size: 18px;
    }
  }
}
.detail-tab-active {
  border-left: 2px solid #ff8400;
  border-top: 2px solid #ff8400;
  border-right: 2px solid #ff8400;
  border-bottom: 0;
  color: #ff8400;
  background: url("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MEY1NzY2RjlEM0YxMUU4QTIzOUQ3QzcxMTY0Q0U0MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MEY1NzY3MDlEM0YxMUU4QTIzOUQ3QzcxMTY0Q0U0MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYwRjU3NjZEOUQzRjExRThBMjM5RDdDNzExNjRDRTQyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYwRjU3NjZFOUQzRjExRThBMjM5RDdDNzExNjRDRTQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABQAFAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A3rv9y/8AF9b/APH6/wCfggn+2/u3/dv7bzVeMxlXN/uS/g38S8FNX19NB/Ff4r9pU1NJ/DftKT37rfX/2Q==");
}
</style>
