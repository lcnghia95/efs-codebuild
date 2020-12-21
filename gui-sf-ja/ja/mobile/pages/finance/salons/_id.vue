<template>
  <div class="w-full mb-30">
    <div class="p-10 salons-title"><strong>{{ $t('36') }}</strong></div>
    <TopPayment :reviews-count="data.reviewsCount" />
    <div class="tabs-wrapp pt-10 mb-20">
      <ul class="flex nav nav-tabs fs-13">
        <li :class="{'active' : currenTab == 0}" class="flex mid text-center center tab pt-10 pb-10 bl-none" @click="changeTab(0)">
          <span class="text-center" v-html="tabList[0]"></span>
        </li>
        <li :class="{'active' : currenTab == 1}" class="flex mid text-center center tab pt-10 pb-10" @click="changeTab(1)">
          <span class="text-center" v-html="tabList[1]"></span>
        </li>
        <li :class="{'active' : currenTab == 2}" class="flex mid text-center center tab pt-10 pb-10" @click="changeTab(2)">
          <span class="text-center" v-html="tabList[2]" v-if="data.transaction"></span>
          <span class="text-center" v-else>{{ $t('20') }}</span>
        </li>
        <li :class="{'active' : currenTab == 3}" class="flex mid text-center center tab pt-10 pb-10 br-none" @click="changeTab(3)">
          <span class="text-center" v-html="tabList[3] + ` <br/>(${parseInt(commuTotal) || 0})`"></span>
        </li>
      </ul>
    </div>
    <div v-if="currenTab == 0" class="flex layout-col">
      <div v-html="data.outline" class="p-10 pre-wrap mt-10 salons-IbBKtrbLMt"></div>
      <LazyComp01 class="owner" min-height="250px">
        <div class="title pt-10 pb-10 pl-30">{{ $t('13') }}</div>
        <div class="owner-info flex layout-row p-15">
          <ImgWrapper
            :src="data.profileImg"
            :href="`/users/${data.userId}`"
            class="owner-ava mr-10"
          />
          <div class="owner-detail">
            <div class="owner-name">{{ data.nickName }}</div>
            <div class="owner-profile" v-html="data.profile"></div>
          </div>
        </div>
        <div class="flex layout-col mid mb-30">
          <a :href="`/review/detail/${data.id}`" class="write-review">
            <button class="w-full btn-review p-15">{{ $t('14') }}</button>
          </a>
          <Rate
            :stars="data.reviewsStars"
            :target="data.id"
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
        <div class="title px-9 pl-30 pr-15 flex mid">
          {{ $t('17') }}
          <span class="review-more pt-5 pb-5 pl-10 pr-10">
            <a class="no-underlying" :href="`/review/detail/${id}`">
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
            
            <a class="no-underlying" :href="`/review/detail/${id}`">
              <Rate :stars="review.review.stars" 
                    :number="review.review.number"
                    :target="id"
                    :alway-show="true"
              />
            </a>
            <div class="wrap-text underline" :title="review.title">
              <b>{{ review.title }}</b>
            </div>
            <a class="no-underlying" :href="`/review/detail/${id}`" style="text-decoration: none;">
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
    <div v-if="currenTab == 1" class="flex layout-col samples">
      <LazyComp01 v-for="(item,i) in samples" class="mt-20 p-10" :key="'sample-' + i" min-height="450px">
        <div class="sample-tit flex mid mb-10" v-html="$t('2') + `${i + 1}`">
        </div>
        <div class="sample-content pre-wrap">
          <div class="fs-12" v-if="item.date">{{ $t('19') }}&nbsp;{{ formatTime(item.date, 6) }}</div>
          <div class="content-tit">
            <b>{{ item.title }}</b>
          </div>
          <div v-html="item.content" class="sample-des pre-wrap"></div>
        </div>
      </LazyComp01>
      <template v-if="!samples.length">
        <div v-html="$t('24')" class="co-red mt-30 mb-50 text-center"></div>
      </template>
    </div>
    <div v-if="currenTab == 2" class="mt-30">
      <div v-if="data.transaction" v-html="data.transaction" class="pre-wrap p-10"></div>
      <div v-else>
        <div class="user-line">
          <div class="title02">
            <b>{{ $t('21') }}</b>
          </div>
          <a :href="'/users/' + data.userId" class="p-10">{{ data.nickName }}</a>
        </div>
        <div class="user-line">
          <div class="title02">
            <b>{{ $t('22') }}</b>
          </div>
          <div class="pre-wrap p-10">{{ data.userIntroduction }}</div>
        </div>
        <div class="user-line">
          <div class="title02">
            <b>{{ $t('23') }}</b>
          </div>
          <a :href="data.userUrl" class="p-10">{{ data.userUrl }}</a>
        </div>
      </div>
    </div>
    <div v-if="currenTab == 3">
      <FinanceCommunity
        :get-data="getCommunityData"
        :id="id"
        :commu-total="parseInt(commuTotal) || 0"
        @posted="onPosted"
        @update-total="onUpdateTotal"
        @delete-reply="onDeleteReply"
      />
    </div>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/salon-id.json'
import Cart from '@@/../components/icons/Cart.vue'
import ArrowCircleRight from '@@/../components/icons/ArrowCircleRight.vue'
import { pushState, convertToFxonHost, editCss, filterInt } from '@/utils/client/common'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import Rate from '@@/../components/product/Rate.vue'
import CircleAlt from '@@/../components/icons/CircleAlt.vue'
import SimpleParagraph from '@@/../components/SimpleParagraph.vue'
import Payment02 from '@/components/finance/payment/Payment02.vue'
import FinanceCommunity from '@/components/finance/FinanceCommunity.vue'
import authorMeta from '@@/../common/pages/author.js'
import titleI18n from '@@/lang/common/salons-title.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Star from '@@/../components/icons/Star.vue'
import TopPayment from '@/components/finance/TopPayment.vue'
import {trackingSalonsView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n
    },
    components: {
      Cart,
      ImgWrapper,
      Rate,
      ArrowCircleRight,
      CircleAlt,
      SimpleParagraph,
      Payment02,
      FinanceCommunity,
      LazyComp01,
      Star,
      TopPayment
    },
    data() {
      return {
        tabList: [this.$t('1'), this.$t('2'), this.$t('3'), this.$t('4')],
        samples: [],
        cartProcesssing: false
      }
    },
    computed: {
      titleChunk() {
        return this.$t('27', {
          description: this.data.description,
          name: this.data.name
        })
      },
      cartInfo() {
        return this.$store.state.cart.info
      },
    },
    methods: {
      descriptionTemplate() {
        return this.$t('28', { name: this.data.name })
      },
      changeTab(_tab) {
        this.currenTab = _tab
        pushState({ t: _tab }, null, '', this.originUrl)
        this.sendPageView()
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
          text += `【<b>${this.$t('pays.' + i)}</b>】`
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
      getDataSamples() {
        this.GoGoHTTP.get(
          `/api/v3/surface/salons/${this.id}/sample?salonId=${
            this.data.salonId
          }`
        ).then(data => {
          this.samples = data
        })
      },
      getCommunityData(cb, needRefresh = false) {
        if (process.server) {
          return
        }
        if (!this.communities || needRefresh) {
          this.GoGoHTTP.get(`/api/v3/surface/communities?productId=${this.id}`)
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
      onUpdateTotal(number) {
        this.commuTotal = number
      },
      onDeleteReply() {
        this.commuTotal = this.commuTotal - 1
      },
      onPosted() {
        this.commuTotal = this.commuTotal + 1
      },
    },
    mounted() {
      this.getDataSamples()
      trackingSalonsView(this.data)
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    async asyncData({ app, params, error, req, store }) {
      let currenTab = params.t || 0,
        originUrl = `/finance/salons/${params.id}`,
        locale = app.i18n.locale,
        title = titleI18n[locale].title,
        description = titleI18n[locale].description,
        [data, commuTotal] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/salons/${params.id}`),
          app.GoGoHTTP.get(
            `/api/v3/surface/products/communities/${params.id}/count`
          )
        ]),
        [reviews, threads] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/salons/${params.id}/reviews`),
          app.GoGoHTTP.get(
            `/api/v3/surface/salons/${params.id}/threads?salonId=${
              data.salonId
            }`
          )
        ]),
        imgUrl,
        currentUrl

      if (!data || !Object.keys(data).length || !data.cartInfo) {
        return error({ statusCode: 404 })
      }
      if (
        data.outline &&
        data.outline.indexOf('<style type="text/css">') !== -1
      ) {
        data.outline = editCss(data.outline, ".outline-IbBKtrbLMt")
      }
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      if (reviews.length > 3) {
        reviews = reviews.slice(0, 3)
      }
      imgUrl = process.env.GOGO_URL + '/img/products/' + params.id
      data.outline = convertToFxonHost(data.outline)
      data.cartInfo.reviewsCount = data.reviewsCount
      data.cartInfo.reviewsStars = data.reviewsStars
      store.commit("cart/setInfo", {
        info: data.cartInfo,
        productStatus: data.status,
        isPassword: data.isPassword
      })
      const {
        cartInfo: { price, status } = {},
        review: { count, stars } = {},
      } = data
      return {
        currenTab,
        originUrl,
        data,
        commuTotal: parseInt(commuTotal) || 0,
        id: params.id,
        reviews,
        threads,
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
            content: `${data.description} : ${data.name} - ${title}`,
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: `${data.name}:${description}`,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:url',
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
            href: `https://www.gogojungle.co.jp/finance/salons/${params.id}`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: data.name,
          id: params.id,
          description: `${data.name}:${description}` || data.name,
          url: `${process.env.GOGO_URL}/finance/salons/${params.id}`,
          image_link: imgUrl,
          product_type: 4,
          status,
          price,
          count,
          rate: stars,
          cate: 'salons'
        }),
      }
    }
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
$favCo: #ff8e02;
.tabs-wrapp {
  border-bottom: 1px solid #e0dedc;
  background-color: #f3f0ef;
  .nav {
    margin-bottom: -1px;
    .bl-none {
      border-left: none !important;
    }
    .br-none {
      border-right: none !important;
    }
  }
  .nav > li {
    display: flex;
  }
}
.nav .tab {
  width: 25%;
  border-bottom: 1px solid #e1dfdd;
  color: #a0a0a0;
  margin-bottom: -1px;
  &.active {
    background-color: #fff;
    border: 1px solid #e1dfdd;
    border-bottom: none;
    color: #2d2d2d;
    margin-bottom: -2px;
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
.review {
  .icon-cls {
    width: 10px;
    height: 10px;
  }
  .review-more {
    font-size: 15px;
    border: 1px solid #e0dedc;
    background-color: #fff;
    margin-left: auto;
    border-radius: 5px;
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
    /deep/ a {
      color: #b3b3b3;
      text-decoration: none;
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
  border: 1px solid #e5e5e5;
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
.border-b-none {
  border-bottom: none;
}
.co-red {
  color: red;
  font-weight: bold;
}
.user-line {
  word-break: break-all;
  .title02 {
    padding: 5px 10px;
    background-color: #f3f0ef;
    color: #7d7d7d;
  }
  a {
    display: block;
    color: #666;
  }
}
.salons-title {
  font-size: 16px;
}
.samples {
  .sample-tit {
    font-weight: bold;
  }
}
</style>