<template>
  <section>
    <div v-if="data.statusType === 9 || (data.cartInfo && data.cartInfo.status === 9)"
         class="alert-not-selling mt-20 p-20 text-center" v-html="$t('35')"
    ></div>
    <div v-if="checkShowPass" class="lock-product text-center">
      <div class="password-title">{{ $t('27') }}</div>
      <p class="hint">{{ $t('28') }}</p>
      <input class="input-field w-full" v-model="password" :placeholder="$t('29')" type="password" />
      <button class="flex mid center btn w-full" @click="getProductData" :class="{'disabled': loading}">
        <span>{{ $t('30') }}</span>
      </button>
    </div>
    <div v-else>
      <CampaignBox :cart-info="data.cartInfo" v-if="data.cartInfo && data.cartInfo.discountStart" />
      <SystemDetailHeader :detail="data" :go-community="goCommunity" :category="category"
                          :is-stock="isStock"
      />
      <LazyComp01 v-if="(video || {}).liveUrl" min-height="62vw" class="p-10">
        <iframe class="w-full h-video mt-10" :src="youtubeParser(video.liveUrl)" frameborder="0" allowfullscreen></iframe>
      </LazyComp01>
      <LazyComp01 min-height="530px">
        <Payment03 class="mt-20" :get-product-password="getProductPassword" />
      </LazyComp01>
      <LazyComp01 min-height="100px" class="banner-wrapp w-full flex center mt-20"
                  v-if="(banner[0] || []).length"
      >
        <a class="w-full" :href="banner[0][1]"><img class="w-full" :src="banner[0][0]" alt="" /></a>
      </LazyComp01>
      <LazyComp01 min-height="50px">
        <div class="detail-tab-wrapp mt-30 flex" id="detail-tab">
          <div class="detail-tab flex mid center" :class="{'detail-tab-active': detailTab == 1}"
               @click="clickDetailTab(1)" :style="{'width': isStock ? '50%' : '33%'}"
          >
            <ChartArea />
            <span>{{ $t('1') }}</span>
          </div>
          <div class="detail-tab flex mid center text-center" :class="{'detail-tab-active': detailTab == 2}"
               @click="clickDetailTab(2)" :style="{'width': isStock ? '50%' : '33%'}"
          >
            <CommentSolid />
            <span>{{ $t('2') }}</span>
          </div>
          <template v-if="!isStock">
            <div class="detail-tab flex mid center" @click="onGoToBacktest" style="width: 34%;">
              <InfoCircle />
              <span>{{ $t('32') }}</span>
            </div>
          </template>
        </div>
      </LazyComp01>
      <div class="detail-tab-des" v-if="detailTab == 2">
        <Community :get-data="getCommunityData" :id="data.id" :commu-total="commuTotal" />
      </div>
      <div class="detail-tab-des" v-if="detailTab == 1">
        <LazyComp01 style="margin-top: 20px;" min-height="450px">
          <BubbleChart02 :chart="rankingActive" :option="bubbleOption" />
        </LazyComp01>
        <div class="mb-20 flex content-end mt-10">
          <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 12px; margin-right: 20px;">{{ $t('53') }}</a>
        </div>
        <LazyComp01 min-height="300px" v-if="!isStock">
          <Panel :title="$t('3')" :is-important="true">
            <no-ssr>
              <div class="flex center">
                <SpiderWeb class="spider" :chart="[data.spider]" :option="spiderOpt" />
              </div>
            </no-ssr>
          </Panel>
        </LazyComp01>
        <LazyComp01 v-if="Object.keys(data.criterial).length" min-height="400px">
          <stocksCriterial :data="data.criterial" v-if="isStock" />
          <fxCriterial :data="data.criterialAll" v-else />
        </LazyComp01>
        <LazyComp01 v-if="brokerShow" min-height="100px">
          <Panel :title="$t('9')" :is-important="true">
            <div class="brokers">
              {{ brokerShow }}
            </div>
          </Panel>
        </LazyComp01>
        <LazyComp01 v-if="!isStock" min-height="300px">
          <Panel :title="$t('10')" :is-important="true" id="year-select">
            <div v-for="year in years" class="flex mid space-between year-select" :key="year"
                 @click="selectYear(year)"
            >
              <span>{{ $t('11', {year: year}) }}</span>
              <AngleRight class="icon" />
            </div>
          </Panel>
        </LazyComp01>
        <div id="chart-group" v-if="yearSelected">
          <div class="title mt-20 flex mid space-between">
            <div @click="selectYear(0)"><b>{{ $t('11', {year: yearSelected}) }}&nbsp;{{ $t('22') }}</b></div>
            <div class="month-select p-5 flex mid space-around" @click="showMonth">
              <span>{{ $t('23') }}</span>
              <AngleDown class="icon" />
            </div>
          </div>
          <div class="flex center pt-20" v-if="dateProcessing">
            <Loading class="ml-10" style="width: 50px; height: 50px;" />
          </div>
          <div v-else>
            <div class="w-full text-center mt-20" v-if="!Object.keys(charts[yearSelected]).length">
              {{ $t('24') }}
            </div>
            <ChartGroup :charts="charts[yearSelected] || {}" :year-selected="yearSelected"
                        :month-selected="monthSelected" v-else
            />
          </div>
        </div>
        <LazyComp01 min-height="100px" class="banner-wrapp w-full flex center mt-20"
                    v-if="(banner[1] || []).length"
        >
          <a class="w-full" :href="banner[1][1]"><img class="w-full" :src="banner[1][0]" alt="" /></a>
        </LazyComp01>
        <LazyComp01 min-height="400px">
          <FullCalendar01 class="mt-20" :type="category" :id="detail.displayProductId || id" />
        </LazyComp01>
        <LazyComp01 min-height="100px" class="w-full flex center mt-20 p-5">
          <a :href="(advertiseBanners[2] || {}).landingPageUrl"><img class="w-full" :src="(advertiseBanners[2] || {}).bannerUrl" alt="" /></a>
        </LazyComp01>
        <LazyComp01 min-height="300px" id="lz-forward" v-if="data.platform != 9">
          <div class="title mid mt-20">
            <b>{{ isStock ? $t('33') : $t('13') }}</b>
          </div>
          <div class="p-10" v-if="data.demoBrokerId" v-html="(!data.isDomesticBroker ? $t('brokers.' + data.demoBrokerId) : '') + $t('34')"></div>
          <div class="main-chart flex mid center" v-if="!forwardDataLoaded">
            <Loading style="width: 50px; height: 50px;" />
          </div>
          <template v-else>
            <stocksForwardTest :forward="forward" :on-get-data-page="getDataForward" :platform="data.platform"
                               v-if="isStock"
            />
            <fxForwardTest :forward="forward" :on-get-data-page="getDataForward" v-else />
          </template>
        </LazyComp01>
        <LazyComp01 min-height="300px">
          <div class="title mid mt-20">
            <b>{{ $t('14') }}</b>
          </div>
          <Outline :data="data.outline" :list-outline="listOutline" class="mb-30" :category="category" />
        </LazyComp01>
      </div>
      <LazyComp01 min-height="530px">
        <Payment03 class="mb-30 mt-20" :get-product-password="getProductPassword" />
      </LazyComp01>
      <LazyComp01 min-height="200px">
        <div v-if="reviews.length">
          <div class="title mt-20 flex mid space-between">
            <h2 class="m-0"><b>{{ $t('12') }}</b></h2>
            <ShowMore class="border" :target="'/review/detail/' + $route.params.id" />
          </div>
          <Reviews :reviews="reviews" />
        </div>
      </LazyComp01>
      <LazyComp01 min-height="200px" v-if="$i18n.locale === 'ja' && (relatedProductWidgets.previewData || []).length > 0">
        <div class="title flex mid mt-20 space-between">
          <h2 class="m-0"><b>REAL TRADE</b></h2>
          <ShowMore v-if="(relatedProductWidgets.totalWidget || 0) > 3" class="border" :target="`/systemtrade/fx/${$route.params.id}/real-trade`" />
        </div>
        <div class="real-trade-widget">
          <div class="real-trade-widget-banner">
            <a href="/post/46/15407" rel="nofollow">
              <img src="/img/assets/pc/realtrade/widget_banner.png" alt="Real Trade Widget Banner" />
            </a>
          </div>
          <div class="real-trade-widget-content flex layout-col" v-for="item in relatedProductWidgets.previewData" :key="item.accountId">
            <div class="account-info flex mb-10">
              <div class="account-avatar">
                <img width="48" height="48" :src="`/img/users/${item.userId}/small`" :class="item.userId ? '' : 'border-all'" />
              </div>
              <div class="flex ml-10 space-between layout-col w-full">
                <div v-wrap-lines="2">{{ item.accountName }}</div>
                <div class="inline-flex account-type-container">
                  <div class="account-type" :style="{backgroundColor: `#${item.color}`}">
                    {{ item.isBuyer ? $t('38') : $t('39') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="real-trade-widget-chart">
              <iframe scrolling="no" :src="item.widgetUrl" frameborder="0" width="300" height="390" class="gg-hide"></iframe>
            </div>
          </div>
        </div>
      </LazyComp01>
      <LazyComp01 @comp-ready="onSliderReady('.slider1')" v-if="(others.userProducts || []).length"
                  class="pos-rel" min-height="220px"
      >
        <div class="title mid mt-20">
          <b>{{ $t('15', {name: (data.user || { name: '' }).name}) }}</b>
        </div>
        <div class="owl-carousel owl-theme slider1">
          <ProductVertical07 :product="i" v-for="i in others.userProducts" :key="'userProducts' + i.id" />
        </div>
      </LazyComp01>
      <LazyComp01 v-if="(others.popular || []).length" @comp-ready="onSliderReady('.slider2')"
                  min-height="220px"
      >
        <div class="title mid mt-20">
          <h2 class="m-0"><b>{{ $t('16') }}</b></h2>
        </div>
        <div class="owl-carousel owl-theme slider2">
          <ProductVertical07 :product="i" v-for="i in others.popular" :key="'popular' + i.id" />
        </div>
      </LazyComp01>
      <LazyComp01 min-height="150px" v-if="others.ranking">
        <div class="title mt-20 flex mid space-between">
          <h2 class="m-0"><b>{{ $t('17') }}</b></h2>
          <select v-model="rankSelect" class="rank-select flex space-between mid">
            <option v-for="(item, type) in rankList" :value="type" :key="'select-' + type">{{ item }}</option>
          </select>
        </div>
        <RankingList :ranking="others.ranking[rankSelect]" />
      </LazyComp01>
      <LazyComp01 min-height="150px" v-if="relatedArticles.length">
        <div class="title mid mt-20">
          <h2 class="m-0"><b>{{ $t('37') }}</b></h2>
        </div>
        <NaviRankHorizontal01 class="al-item" v-for="item in relatedArticles" :key="'articles-list' + item.id" :item="item" :follow-fn="onNaviFollowItem" :fav-fn="onNaviFavoriteItem" />
      </LazyComp01>
      <LazyComp01 min-height="200px">
        <div v-if="reviews.length">
          <div class="title flex mid space-between">
            <h2 class="m-0"><b>{{ $t('12') }}</b></h2>
            <ShowMore class="border" :target="'/review/detail/' + $route.params.id" />
          </div>
          <Reviews :reviews="reviews" />
        </div>
      </LazyComp01>
      <LazyComp01 min-height="150px">
        <div class="title mid mt-20">
          <h2 class="m-0"><b>{{ $t('21') }}</b></h2>
        </div>
        <div v-if="data && data.user" class="pre-wrap terms"
             v-html="data.user.transaction || data.user.selfIntroduction"
        ></div>
      </LazyComp01>
      <div class="show-modal modal fade" role="dialog" tabindex="-1">
        <div class="modal-dialog" role="document">
          <div class="flex flex-wrap">
            <div v-for="i in 12" class="btn-select flex mid center" @click="selectMonth(i)" :key="'month-' + i">
              <span>{{ $t('short-months.' + i) }}</span>
            </div>
          </div>
        </div>
      </div>
      <GogoModal class="c-modal"
                 :show="isShowModal"
                 @close="isShowModal = false"
                 @ok="onGoToRegister"
                 width="90vw"
                 height="30vh"
      >
        <div slot="modal-body" class="custom-body">
          {{ $t('51') }}
        </div>
      </GogoModal>
    </div>
  </section>
</template>
<script>
import detail from '@/js/systemtrade/detail'
export default detail
</script>
<style type="text/css">
/* stylelint-disable */
.search-box {
  display: none;
}
</style>
<style lang="scss" scoped>
/* stylelint-enable */
.detail-tab-wrapp {
  border-bottom: 1px solid #ff8400;
  .detail-tab {
    user-select: none;
    padding: 0 2vw;
    height: 13vw;
    color: #666;
    background: #f5f5f5;
    margin-bottom: -1px;
    border-bottom: 1px solid #ff8400;
    i.icon-cls {
      flex: 0 0 22px;
      width: 22px;
      height: 22px;
      ~ span {
        letter-spacing: -1px;
      }
    }
    &-active {
      border-left: 1px solid #ff8400;
      border-top: 1px solid #ff8400;
      border-right: 1px solid #ff8400;
      border-bottom: 1px solid #fff;
      color: #ff8400;
      background: white;
    }
  }
  > div:nth-child(2) {
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    &.detail-tab-active {
      border-left: 1px solid #ff8400;
      border-right: 1px solid #ff8400;
    }
  }
}
.detail-tab-des {
  .panel {
    margin: 4vw;
  }
}
.brokers {
  color: #434343;
}
.year-select {
  color: #434343;
  background: #f2f2f3;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  padding: 4vw;
  margin-bottom: 3vw;
  &:last-child {
    margin-bottom: 0;
  }
}
.icon {
  width: 18px;
  height: 18px;
}
.title {
  background: #f3f0ef;
  padding: 3vw 5vw;
  h2 {
    color: #666;
    font-size: 4vw;
    line-height: 1.4;
  }
}
.rank-select {
  border: none;
  border-radius: 5px;
  width: 25vw;
  background: white;
  padding: 0.5vw 2vw;
  &:focus {
    outline: none;
  }
}
.pre-wrap {
  white-space: pre-line;
  color: #666;
  line-height: 22px;
}
.month-select {
  border: none;
  border-radius: 5px;
  background: white;
  .icon {
    width: 18px;
    height: 18px;
  }
}
.show-modal .modal-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%) !important;
  .btn-select {
    border: 1px solid white;
    color: white;
    flex: 0 0 16vw;
    width: 16vw;
    height: 16vw;
    max-width: 60px;
    max-height: 60px;
    margin: 2vw;
    span {
      font-size: 16px;
    }
  }
}
/deep/ .modal-backdrop.in {
  opacity: 0.85 !important;
}
.h-video {
  height: 60vw;
}
.banner-wrapp {
  padding: 0 4vw;
}
.lock-product {
  min-height: 400px;
  padding: 8vw 4vw;
  background: #f0f0f0;
  background-image: linear-gradient(90deg, #e6e6e6 0%, #fff 76%, #eeefee 100%);
  .password-title {
    font-size: 6.5vw;
    padding-bottom: 2vw;
    border-bottom: 1px solid #d9d9d9;
  }
  .hint {
    font-size: 3.3vw;
    color: #2d2d2d;
    margin: 5vw 0 2vw;
  }
  .input-field {
    height: 12vw;
    padding: 0 5vw;
    margin-bottom: 5vw;
    font-size: 3.3vw;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    -webkit-appearance: none;
    &::placeholder {
      color: #d0d0d0;
    }
  }
  .btn {
    background: #00a0e9;
    height: 15vw;
    font-size: 4.5vw;
    color: white;
  }
  .disabled {
    opacity: 0.5;
  }
}
div.product-JX0x5 {
  width: 90px;
  padding: 5px;
}
.product-sets {
  border-radius: 10px;
  color: #434343;
  .set-title {
    font-size: 18px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #f3f0ef;
  }
  .set-content {
    margin-top: 2px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #f3f0ef;
  }
}
.back-test {
  width: 100%;
  max-height: 50vh;
  height: 50vh;
  padding: 4vw;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  iframe {
    max-width: 100%;
    height: 100%;
  }
}
.terms {
  padding: 4vw;
  word-break: break-all;
}
.main-chart {
  height: 300px;
}
@media only screen and (min-width: 600px) {
  .lock-product {
    padding: 5vw 15vw;
    .password-title {
      font-size: 4vw;
      padding-bottom: 1vw;
    }
    .hint {
      font-size: 2vw;
      margin: 3vw 0 1vw;
    }
    .input-field {
      height: 8vw;
      margin-bottom: 2vw;
      font-size: 2.5vw;
    }
    .btn {
      height: 10vw;
      font-size: 3vw;
    }
  }
}
.alert-not-selling {
  background: #7d7d7d;
  color: white;
  font-size: 20px;
  font-weight: bold;
}
.real-trade-widget {
  display: flex;
  flex-direction: column;
  .real-trade-widget-content {
    padding: 10px;
    margin: auto;
    .account-type-container {
      display: flex;
      justify-content: flex-end;
    }
    .account-type {
      color: white;
      height: 36px;
      border-radius: 8px;
      padding: 8px;
      margin-right: 10px;
      width: 100px;
      text-align: center;
    }
    .account-info {
      height: 65px;
    }
  }
  .real-trade-widget-banner {
    img {
      width: 100%;
    }
  }
}
.custom-body {
  height: calc(100% - 100px);
  padding: 30px 0;
  text-align: center;
  color: #434343;
}
</style>
