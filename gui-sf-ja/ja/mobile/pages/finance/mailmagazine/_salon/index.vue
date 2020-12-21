<template>
  <div class="w-full mb-30">
    <div class="salon-header">{{ $t(39) }}</div>
    <TopPayment />
    <div class="tabs-wrapp pt-5">
      <div class="flex nav w-full">
        <div :class="{'active' : !currenTab}" 
             @click="changeTab('')" 
             class="flex mid text-center center tab"
             v-html="$t(1)"
        >
        </div>
        <div :class="{'active' : currenTab == 'law'}" 
             @click="changeTab('law')" 
             class="flex mid text-center center tab" 
             v-html="data.transaction ? $t(37) : $t(20)"
        >
        </div>
        <div :class="{'active' : currenTab == 'community'}" 
             @click="changeTab('community')" 
             class="flex mid text-center center tab" 
             v-html=" $t(38, { number: parseInt(commuTotal) || 0 })"
        >
        </div>
      </div>
    </div>
    <div v-if="!currenTab" class="flex layout-col">
      <div v-html="data.outline" class="p-10 pre-wrap mt-10 salons-IbBKtrbLMt"></div>
      <LazyComp01 class="owner" min-height="250px">
        <div class="title pt-10 pb-10 pl-30">{{ $t('13') }}</div>
        <div class="owner-info flex layout-row p-15">
          <ImgWrapper
            :src="data.profileImg || `/img/users/${data.userId}/large`"
            :href="`/users/${data.userId}`"
            alt=""
            class="owner-ava mr-10"
          />
          <div class="owner-detail">
            <div class="owner-name">{{ data.nickName }}</div>
            <div class="owner-profile" 
                 v-html="data.profile || data.userIntroduction"
            >
            </div>
          </div>
        </div>
        <div class="flex layout-col mid mb-30 review-btn">
          <a :href="`/review/detail/${(data.cartInfo || {}).productId}`" class="write-review">
            <button class="w-full btn-review p-15">{{ $t('14') }}</button>
          </a>
          <Rate
            :stars="data.reviewsStars"
            :number="data.reviewsCount"
            :target="(data.cartInfo || {}).productId"
            :alway-show="true"
            class="mt-5"
          />
        </div>
        <div class="mr-10 ml-10 mb-30" v-if="threads.length">
          <div class="subtitle pb-10 pl-20 pr-20 pt-10 border-b-none">
            <CircleAlt />
            {{ $t('16') }}
          </div>
          <div class="flex layout-col">
            <div
              v-for="thread in threads"
              :key="'salon-thread-' + thread.id"
              class="thread pt-20 pb-20"
            >
              <div class="flex detail fs-12">
                <span>{{ formatTime(thread.date, 6) }}</span>
                <a :href="'/users/' + thread.userId" class="underline ml-10">{{ thread.userName }}</a>
              </div>
              <simple-paragraph :lines="3" :content="thread.content" />
            </div>
          </div>
        </div>
      </LazyComp01>
      <div class="review" v-if="reviews.length">
        <div class="title px-9 pl-30 pr-15 flex mid space-between">
          {{ $t('17') }}
          <span class="review-more pt-5 pb-5 pl-10 pr-10">
            <a class="no-underlying" :href="`/review/detail/${(data.cartInfo || {}).productId}`">
              {{ $t('18') }}
              <ArrowCircleRight />
            </a>
          </span>
        </div>
        <LazyComp01
          v-for="(review, i) in reviews"
          :key="'salon-review-' + i"
          :class="'flex pt-20 pl-15 pb-20 pr-15 bg-review-'+ i"
          min-height="150px"
        >
          <ImgWrapper
            :src="'/img/users/' + review.user.id + '/small'"
            :href="`/users/${review.user.id}`"
            class="review-ava mr-10"
          />
          <div class="review-info">
            <div class="flex mid text">
              <span>{{ $t('25') }} {{ formatTime(review.publishedDate, 6) }}</span>
              <a :href="'/users/' + review.user.id" class="ml-10 underline">{{ review.user.name }}</a>
            </div>
            <a class="no-underlying" :href="`/review/detail/${(data.cartInfo || {}).productId}`">
              <Rate :stars="review.review.stars" 
                    :number="review.review.number"
                    :target="(data.cartInfo || {}).productId"
                    :alway-show="true"
              />
            </a>
            <div class="wrap-text underline" :title="review.title">
              <b>{{ review.title }}</b>
            </div>
            <a class="no-underlying" :href="`/review/detail/${(data.cartInfo || {}).productId}`" style="text-decoration: none;">
              <simple-paragraph :lines="3" :content="review.content" />
            </a>
          </div>
        </LazyComp01>
      </div>
      <LazyComp01 class="payment" min-height="250px">
        <div class="title px-9 pl-30 pr-15 mb-25 flex mid">{{ $t('31') }}</div>
        <div class="mr-10 ml-10">
          <div class="subtitle pb-10 pl-20 pr-20 pt-10">
            <CircleAlt />
            {{ $t('6') }}
          </div>
          <Payment02 class="mb-30" :is-hor="true" />
          <template v-if="data.cartInfo.payments">
            <div class="subtitle pb-10 pl-20 pr-20 pt-10 mt-10">
              <CircleAlt />
              {{ $t('32') }}
            </div>
            <div class="content mt-20" style="text-align: justify;" v-html="buildPayment()"></div>
          </template>
          <template v-if="data.cartInfo.isAdvising">
            <div class="subtitle pb-10 pl-20 pr-20 pt-10 mt-10">
              <CircleAlt />
              {{ $t('5') }}
            </div>
            <img :src="'/img/assets/pc/salons/Coolingoff.png'" class="w-full mt-20 mb-50" />
          </template>
        </div>
      </LazyComp01>
    </div>
    <div v-if="currenTab == 'law'" class="flex layout-col sample-content">
      <div
        v-if="data.transaction"
        v-html="data.transaction"
        class="pre-wrap"
      ></div>
      <div v-else>
        <div class="user-line flex">
          <div class="user-title">
            <b>{{ $t('21') }}</b>
          </div>
          <a :href="'/users/' + data.userId">{{ data.nickName }}</a>
        </div>
        <div class="user-line flex">
          <div class="user-title">
            <b>{{ $t('22') }}</b>
          </div>
          <div :style="{ 'overflow-wrap': 'break-word', 'white-space': 'pre-line'}" v-html="(data.userIntroduction || '')"></div>
        </div>
        <div class="user-line flex">
          <div class="user-title">
            <b>{{ $t('23') }}</b>
          </div>
          <a :href="data.userUrl">{{ data.userUrl }}</a>
        </div>
      </div>
    </div>
    <div v-if="currenTab == 'community'">
      <FinanceCommunity
        :get-data="getCommunityData"
        :id="(data.cartInfo || {}).productId"
        :commu-total="parseInt(commuTotal) || 0"
        @posted="onPosted"
        @update-total="onUpdateTotal"
        @delete-reply="onDeleteReply"
      />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/salon-id.json'
import title from '@@/../common/pages'
import {
  editCss,
  convertToFxonHost,
  pushState,
  filterInt,
} from '@/utils/client/common'
import titleI18n from '@@/lang/common/salons-title.json'
import authorMeta from '@@/../common/pages/author.js'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import CircleAlt from '@@/../components/icons/CircleAlt.vue'
import Payment02 from '@/components/finance/payment/Payment02.vue'
import TopPayment from '@/components/finance/TopPayment.vue'
import ArrowCircleRight from '@@/../components/icons/ArrowCircleRight.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import Cart from '@@/../components/icons/Cart.vue'
import FinanceCommunity from '@/components/finance/FinanceCommunity.vue'
import SimpleParagraph from '@@/../components/SimpleParagraph.vue'
import Rate from '@@/../components/product/Rate.vue'
import {trackingMagazineSalonView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'
import typeI18n from '@@/lang/common/types.json'

const obj = Object.assign(
  {
    components: {
      CircleAlt,
      LazyComp01,
      FinanceCommunity,
      Payment02,
      TopPayment,
      ArrowCircleRight,
      Cart,
      ImgWrapper,
      SimpleParagraph,
      Rate,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        threads: [],
        reviews: [],
        related: [],
      }
    },
    mounted() {
      this.getDataThreads()
      this.getDataReviews()
      this.getDataRelated()
      trackingMagazineSalonView(this.data)
    },
    methods: {
      getDataThreads() {
        this.GoGoHTTP.get(
          `/api/v3/surface/mailmagazine/salon/${this.id}/threads?salonId=${this.data.salonId}`
        ).then(data => {
          this.threads = data
        })
      },
      getDataReviews() {
        this.GoGoHTTP.get(
          `/api/v3/surface/mailmagazine/salon/${this.id}/reviews`
        ).then(data => {
          this.reviews = data
        })
      },
      getCommunityData(cb, needRefresh = false) {
        if (process.server) {
          return
        }
        let productId = (this.data.cartInfo || {}).productId
        if (!this.communities && productId || needRefresh) {
          this.GoGoHTTP.get(
            `/api/v3/surface/communities?productId=${productId}`
          )
            .then(data => {
              if (!data.comments) {
                data.comments = []
              }
              this.communities = data
              cb(data)
            })
            .catch(() => {
              cb({ comments: [] })
            })
        } else {
          cb(this.communities)
        }
      },
      getDataRelated() {
        this.GoGoHTTP.get(
          `/api/v3/surface/mailmagazine/salon/${this.id}/related`
        ).then(data => {
          this.related = data
        })
      },
      changeTab(_tab) {
        this.tab = _tab
        this.currenTab = _tab
        pushState(
          `finance/mailmagazine/${this.id}/${_tab}`,
          null,
          '',
          location.protocol + '//' + location.host
        )
      },
      onUpdateTotal(number) {
        this.commuTotal = number
      },
      onDeleteReply() {
        this.commuTotal = this.commuTotal - 1
      },
      onPosted() {
        this.commuTotal = this.commuTotal + 1
      },
      buildPayment() {
        let payments = Object.keys(this.data.cartInfo.payments),
          text = this.$t('8'),
          tmp = [],
          list = {},
          price3mAndFree = this.formatNumber(
            this.data.cartInfo.price * 3 + 1000
          )
        for (let i in payments) {
          tmp.push(this.$t('pays.' + payments[i].toString()))
          if (payments[i] !== 'tran') {
            list[payments[i]] =
              this.formatNumber(this.data.cartInfo.price) +
              '円' +
              this.$t(payments[i])
          }
        }
        text += tmp.join('、')
        if (payments.length === 1) {
          text += this.$t('9')
        } else if (payments.length >= 2) {
          text += this.$t('10')
        }
        if (this.data.cartInfo.payments.tran) {
          text += '<br>'
          text += this.$t('11').replace('%s', this.$t('pays.tran'))
          list.tran = this.$t('tran').replace(
            '%s',
            this.formatNumber(this.data.cartInfo.price * 3)
          )
          list.tran = list.tran.replace(
            '%s',
            this.formatNumber(this.data.cartInfo.price)
          )
        }
        for (let i in list) {
          text += '<br><br>'
          text += `【<span>${this.$t('pays.' + i)}</span>】`
          text += `<br>${list[i]}`
        }
        if (this.data.cartInfo.payments.tran) {
          text += '<br><br>'
          if (this.data.cartInfo.isAdvising) {
            text += this.$t('isAdvising').replace('%s', price3mAndFree)
          } else {
            text += this.$t('nonAdvising').replace('%s', price3mAndFree)
          }
        }
        return text
      },
      descriptionTemplate() {
        return `${this.descriptionChunk}:${this.localeHead.description}`
      },
      keywordsTemplate() {
        return `${this.keywordsChunk}:${this.localeHead.keywords}`
      },
    },
    validate({ params }) {
      return !isNaN(filterInt(params.salon))
    },
    async asyncData({ app, params, error, req, store }) {
      let locale = app.i18n.locale,
        currenTab = params.t || 0,
        title = titleI18n[locale].title,
        description = titleI18n[locale].description,
        salon = params.salon,
        commuTotal,
        data = await app.GoGoHTTP.get(
          `/api/v3/surface/mailmagazine/salon/${salon}`
        ),
        descriptionChunk,
        titleChunk,
        imgUrl,
        currentUrl,
        originUrl = `/finance/mailmagazine/${salon}`

      if (!data || !Object.keys(data).length || !data.cartInfo) {
        return error({ statusCode: 404 })
      }
      commuTotal = await app.GoGoHTTP.get(
        `/api/v3/surface/products/communities/${data.cartInfo.productId}/count`
      )
      data.outline = convertToFxonHost(data.outline)
      if (
        data.outline &&
        data.outline.indexOf('<style type="text/css">') !== -1
      ) {
        data.outline = editCss(data.outline, '.outline-IbBKtrbLMt')
      }
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      descriptionChunk = data.name
      titleChunk = `${data.description} : ${data.name}`
      imgUrl = process.env.GOGO_URL + '/img/products/' + salon
      data.cartInfo.reviewsCount = data.reviewsCount || 0
      data.cartInfo.reviewsStars = data.reviewsStars || 0

      store.commit('cart/setInfo', {
        info: data.cartInfo,
        productStatus: data.status,
        isPassword: data.isPassword,
      })
      const { 
        cartInfo: { price, type, status } = {} ,
        review: { count, stars } = {},
      } = data
      return {
        id: salon,
        data: data || {},
        currenTab,
        commuTotal: parseInt(commuTotal) || 0,
        titleChunk,
        descriptionChunk,
        keywordsChunk: data.name,
        localeHead: titleI18n[locale],
        originUrl,
        meta: [
          {
            name: 'og:site_name',
            content: 'GogoJungle',
            hid: 'og:site_name',
          },
          {
            name: 'og:type',
            content: 'website',
            hid: 'og:type',
          },
          {
            name: 'og:title',
            content: `${titleChunk} - ${title}`,
          },
          {
            name: 'og:description',
            content: `${descriptionChunk}:${description}`,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:site_name',
          },
          {
            name: 'og:image',
            content: imgUrl,
            hid: 'og:image',
          },
          authorMeta,
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/mailmagazine/${salon}`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: data.name,
          id: salon,
          description: `${descriptionChunk}:${description}` || data.name,
          url: currentUrl,
          image_link: imgUrl,
          product_type: typeI18n[app.i18n.locale][type],
          status,
          price,
          count,
          rate: stars,
        }),
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.salon-header {
  padding: 12px 10px;
  font-weight: 800;
  font-size: 16px;
}
.review-btn /deep/ .rate-num {
  display: none;
}
.tabs-wrapp {
  border-bottom: 1px solid #ddd;
  background: #f3f0ef;
  .nav {
    margin-bottom: -1px;
    .last-tab {
      border-right: 1px solid #ddd;
    }
  }
}
.nav .tab {
  width: 100%;
  padding: 4px 0;
  border-bottom: 1px solid #d0d0d0;
  border-right: none;
  color: #707070;
  margin-bottom: -1px;
  height: 60px;
  font-size: 15px;
  background: #f3f0ef;
  &.active {
    border-top: 1px solid #d0d0d0;
    border-left: 1px solid #d0d0d0;
    border-right: 1px solid #d0d0d0;
    border-bottom: 1px solid white;
    color: #707070;
    background: #fff;
  }
  &:last-child {
    border-right: 1px solid #ddd;
  }
}
.title {
  background-color: #f3f0ef;
  font-size: 16px;
  color: #7d7d7d;
}
.owner {
  .owner-info {
    .owner-ava {
      width: 80px;
      height: 80px;
    }
    .owner-detail {
      width: calc(100% - 90px);
      .owner-name {
        font-weight: bold;
      }
    }
  }
  .gg-rating /deep/ {
    span.star {
      font-size: 16px;
      letter-spacing: -1px;
    }
    .rate-num {
      font-size: 14px;
      color: #666;
      margin-top: 1px;
      margin-left: 7px;
    }
  }
  .thread {
    border-top: 1px solid #a0a0a0;
    a {
      color: #b3b3b3;
      &:hover {
        text-decoration: underline;
      }
    }
    .detail {
      color: #b3b3b3;
    }
  }
  .write-review {
    width: calc(100% - 40px);
    color: #fff;
    .btn-review {
      background-color: #9c3;
      border: none;
      border-radius: 5px;
    }
  }
}
.user-line {
  border-bottom: 1px solid #cacaca;
  padding: 10px 5px;
  word-break: break-all;
  .user-title {
    flex: 0 0 100px;
    width: 100px;
  }
  a {
    color: #666;
  }
}
.review {
  .icon-cls {
    width: 10px;
    height: 10px;
  }
  .review-more {
    font-size: 15px;
    border: 1px solid #e0dedc;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    display: block;
    text-decoration: none;
    color: #7d7d7d;
  }
  .review-ava {
    width: 50px;
    height: 50px;
  }
  .review-info {
    width: calc(100% - 60px);
    .text {
      color: #b3b3b3;
    }
    a {
      color: #b3b3b3;
      &:hover {
        text-decoration: underline;
      }
    }
    /deep/ .gg-rating .rate-num {
      display: none;
    }
  }
  .bg-review-1 {
    background-color: #f3f0f0;
  }
}
.px-9 {
  padding-top: 9px;
  padding-bottom: 9px;
}
.subtitle {
  border-bottom: 1px solid #a0a0a0;
  border-top: 1px solid #a0a0a0;
  .icon-cls {
    width: 15px;
    height: 15px;
  }
}
.pre-wrap {
  white-space: pre-line;
  word-break: break-all;
  padding: 30px 10px;
}
.salons-IbBKtrbLMt {
  /deep/ > * {
    overflow-x: auto;
  }
  /deep/ * {
    max-width: 100% !important;
    img {
      height: auto;
      &.ext-content {
        height: 0 !important;
      }
    }
  }
}
.sample-content {
  padding: 10px 0;
  > div {
    width: 95%;
    margin: 0 auto;
    /deep/ img {
      max-width: 100%;
    }
  }
  .content-tit {
    margin-top: 20px;
    font-size: 22px;
  }
  .sample-des {
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
#search-bar-header {
  display: none;
}
</style>