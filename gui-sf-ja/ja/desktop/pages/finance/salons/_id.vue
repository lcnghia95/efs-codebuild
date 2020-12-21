<template>
  <section>
    <InfoTopBar />
    <div class="w-1000 flex space-between">
      <div class="left-content mt-40">
        <DetailBanner />
        <div class="tabs-wrapp flex mid space-between">
          <ul class="nav nav-tabs">
            <li :class="{'active' : tab == 0}" class="cursor-pointer" @click="changeTab(0)">
              <span class="text-center" v-html="tabList[0]"></span>
            </li>
            <li :class="{'active' : tab == 1}" class="cursor-pointer" @click="changeTab(1)">
              <span class="text-center" v-html="tabList[1]"></span>
            </li>
            <li :class="{'active' : tab == 2}" class="cursor-pointer" @click="changeTab(2)">
              <span class="text-center" v-html="tabList[2]" v-if="data.transaction"></span>
              <span class="text-center" v-else>{{ $t('20') }}</span>
            </li>
          </ul>
          <div class="commu-tab cursor-pointer flex mid pl-15 pr-15 fs-12" @click="changeTab(3)">
            <Comments />
            {{ $t('4') }}&nbsp;({{ parseInt(commuTotal) || 0 }})
          </div>
        </div>
        <div v-if="tab == 0" class="mt-30">
          <div v-html="data.outline" class="outline-IbBKtrbLMt pre-wrap"></div>
          <div class="explain-cooling mt-30" v-if="data.cartInfo.isAdvising">
            <div class="custom-title">{{ $t('5') }}</div>
            <img :src="'/img/assets/pc/salons/Coolingoff.png'" class="w-full mt-20" />
          </div>
          <div class="explain-cooling mt-30" v-if="data.cartInfo.payments">
            <div class="custom-title">{{ $t('6') }}</div>
            <div class="content mt-20" v-html="buildPayment()"></div>
          </div>
          <div class="flex mid center m-30">
            <Payment03 class="p-20 payment-border" :is-hor="true" :get-product-password="getProductPassword" width="600px" />
          </div>
        </div>
        <div v-if="tab == 1" class="flex layout-col samples">
          <div v-for="(item,i) in samples" class="mt-30" :key="'sample-' + i">
            <div class="sample-tit flex mid mb-10">
              <b>{{ $t('7') }}{{ i + 1 }}</b>
            </div>
            <div class="sample-content">
              <div class="fs-12" v-if="item.date">
                {{ $t('19') }}&nbsp;{{ formatTime(item.date, 6) }}
              </div>
              <div class="content-tit">
                <b>{{ item.title }}</b>
              </div>
              <div v-html="item.content" class="sample-des pre-wrap"></div>
            </div>
          </div>
          <template v-if="!samples.length">
            <div v-html="$t('24')" class="co-red mt-30"></div>
          </template>
        </div>
        <div v-if="tab == 2" class="mt-30">
          <div v-if="data.transaction" v-html="data.transaction" class="pre-wrap salon data-transaction"></div>
          <div v-else>
            <div class="user-line flex">
              <div class="title">
                <b>{{ $t('21') }}</b>
              </div>
              <a :href="'/users/' + data.userId">{{ data.nickName }}</a>
            </div>
            <div class="user-line flex">
              <div class="title">
                <b>{{ $t('22') }}</b>
              </div>
              <div class="pre-wrap">{{ data.userIntroduction }}</div>
            </div>
            <div class="user-line flex">
              <div class="title">
                <b>{{ $t('23') }}</b>
              </div>
              <a :href="data.userUrl">{{ data.userUrl }}</a>
            </div>
          </div>
        </div>
        <div v-if="tab == 3" class="pt-30">
          <Community :get-data="getCommunityData" :id="id" @posted="onPosted" @update-total="onUpdateTotal" @delete-reply="onDeleteReply" />
        </div>
      </div>
      <div class="right-content mt-40">
        <div class="flex mid center">
          <Payment03 class="mb-30" :get-product-password="getProductPassword" />
        </div>
        <div class="title flex mid">
          <span class="icon-list-title pos-rel mr-5"></span>
          {{ $t('25') }}
        </div>
        <div class="flex mt-20 mb-20">
          <FacebookButton class="mr-10" :url="$route.fullPath" />
          <TwitterButton
            class="mr-10"
            :url="$route.fullPath"
            :title="data.name + '%0A'"
          />
          <LineButton :url="$route.fullPath" class="mr-10" />
          <HatenaButton class="mr-10" />
          <MailButton />
        </div>
        <div class="title flex mid">
          <span class="icon-list-title pos-rel mr-5"></span>
          {{ $t('13') }}
        </div>
        <a :href="'/users/' + data.userId" class="mt-10 mb-10 nick-name cursor-pointer">{{ data.nickName }}</a>
        <div class="flex space-between mid">
          <Rate :stars="data.reviewsStars" :number="data.reviewsCount" :target="data.id" class="rating" />
          <a :href="'/review/detail/' + data.id">
            <button class="btn-more">{{ $t('14') }}</button>
          </a>
        </div>
        <div class="title flex mid mt-30">
          <span class="icon-list-title pos-rel mr-5"></span>
          {{ $t('15') }}
        </div>
        <ImgWrapper :src="data.profileImg || `/img/users/${data.userId}/large`" alt="" class="user-ava" />
        <div v-html="data.profile || data.userIntroduction" class="fs-12 pre-wrap word-break"></div>
        <template v-if="data.profileImg2">
          <ImgWrapper :src="data.profileImg2" alt="" class="user-ava" />
          <div v-html="data.profile2" class="fs-12 pre-wrap word-break"></div>
        </template>
        <template v-if="threads.length">
          <div class="title flex mid mt-40">
            <span class="icon-list-title pos-rel mr-5"></span>
            {{ $t('16') }}
          </div>
          <div class="flex layout-col">
            <div v-for="thread in threads" :key="'salon-thread-' + thread.id" class="thread">
              <simple-paragraph :lines="3" :content="thread.content" />
              <div class="flex">
                <span>{{ formatTime(thread.date, 6) }}</span>
                <a :href="'/users/' + thread.userId" class="underline ml-10">{{ thread.userName }}</a>
              </div>
            </div>
          </div>
        </template>
        <template v-if="reviews.length">
          <div class="title flex mid mt-40">
            <span class="icon-list-title pos-rel mr-5"></span>
            {{ $t('17') }}
          </div>
          <div class="flex layout-col">
            <div v-for="(review, i) in reviews" :key="'salon-review-' + i" class="thread">
              <div class="wrap-text underline" :title="review.title"><b>{{ review.title }}</b></div>
              <simple-paragraph :lines="3" :content="review.content" />
              <Rate :stars="(review.review || {stars: 0}).stars" :alway-show="true" />
              <div class="flex mid">
                <span>{{ formatTime(review.publishedDate, 6) }}</span>
                <a :href="'/users/' + review.user.id" class="ml-10 underline">{{ review.user.name }}</a>
              </div>
            </div>
            <div class="flex content-end mt-10">
              <a :href="'/review/detail/' + data.id">
                <button class="btn-more">{{ $t('18') }}</button>
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="alsoBought.length" class="mt-25 pb-20 w-1000">
      <div class="custom-title mb-20">{{ $t('26') }}</div>
      <div ref="alsoBought" class="owl-carousel mt-10 mb-20">
        <SystemProductVert class="slide-detail" :size="[80, 80]" v-for="product in alsoBought"
                           :product="product" type="systemtrade" :key="'user-product-' + product.id" :is-lz="true"
        />
      </div>
    </div>
    <div v-if="related.length" class="mt-30 w-1000 ">
      <div class="custom-title mb-20">{{ $t('12') }}</div>
      <div class="flex flex-wrap ml-25">
        <ArticleList class="navi-wrapp" :list="related">
          <template slot-scope="prop">
            <navi-horizontal04 :item="prop.item"
                               :follow-fn="prop.item.onNaviFollow"
                               :favorite-fn="prop.item.onNaviFavorite"
            />
          </template>
        </ArticleList>
      </div>
    </div>
  </section>
</template>
<script>
import Comments from '@@/../components/icons/Comments.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/salon-id.json'
import {
  editCss,
  convertToFxonHost,
  pushState,
  filterInt,
} from '@/utils/client/common'
import Community from '@/components/finance/salons/SalonsCommunity.vue'
import titleI18n from '@@/lang/common/salons-title.json'
import authorMeta from '@@/../common/pages/author.js'
import Payment03 from '@/components/payment-v1/type03/Payment03.vue'
import Rate from '@@/../components/product/Rate.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import SimpleParagraph from '@@/../components/SimpleParagraph.vue'
import DetailBanner from '@/components/common/DetailBanner.vue'
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import LineButton from '@@/../components/social/LineButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import HatenaButton from '@@/../components/social/HatenaButton.vue'
import MailButton from '@@/../components/social/MailButton.vue'
import NaviHorizontal04 from '@/components/product/navi/NaviHorizontal04.vue'
import InfoTopBar from '@/components/finance/salons/InfoTopBar.vue'
import ArticleList from '@/components/product/navi/ArticleList.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import { setStoreData } from '@@/../common/js/finance/utils'
import {trackingSalonsView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const obj = Object.assign(
  {
    components: {
      Comments,
      Community,
      Payment03,
      Rate,
      ImgWrapper,
      SimpleParagraph,
      DetailBanner,
      FacebookButton,
      LineButton,
      TwitterButton,
      HatenaButton,
      MailButton,
      InfoTopBar,
      NaviHorizontal04,
      ArticleList,
      SystemProductVert,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        tabList: [this.$t('1'), this.$t('2'), this.$t('3')],
        threads: [],
        reviews: [],
        samples: [],
        related: [],
        alsoBought: [],
      }
    },
    mounted() {
      this.getDataThreads()
      this.getDataReviews()
      this.getDataSamples()
      this.getDataRelated()
      this.getDataAlsoBought()

      if (
        filterInt(this.$route.params.id) === 14359 ||
        filterInt(this.$route.params.id) === 14150
      ) {
        if (!$('script[id=sc-twitter-widget]').length) {
          let el = document.createElement('script')
          el.setAttribute('id', 'sc-twitter-widget')
          el.setAttribute('src', 'https://platform.twitter.com/widgets.js')
          document.getElementsByTagName('head')[0].appendChild(el)
        }
      }

      trackingSalonsView(this.data)
    },
    methods: {
      setStoreData,
      getDataThreads() {
        this.GoGoHTTP.get(
          `/api/v3/surface/salons/${this.id}/threads?salonId=${
            this.data.salonId
          }`
        ).then(data => {
          this.threads = data
        })
      },
      getDataReviews() {
        this.GoGoHTTP.get(`/api/v3/surface/salons/${this.id}/reviews`).then(
          data => {
            this.reviews = data
          }
        )
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
      getDataRelated() {
        this.GoGoHTTP.get(`/api/v3/surface/salons/${this.id}/related/articles`).then(
          data => {
            this.related = data
            this.setStoreData(data)
          }
        )
        .catch(() => {
          this.related = []
        })
      },
      getDataAlsoBought() {
        this.GoGoHTTP.get(`/api/v3/surface/salons/${this.id}/also-bought`).then(
          data => {
            this.alsoBought = data || []
            this.onSliderReady()
          }
        )
        .catch(() => {
          this.alsoBought = []
        })
      },
      changeTab(_tab) {
        this.tab = _tab
        pushState({ t: _tab }, null, '', this.originUrl)
        this.sendPageView()
      },
      getCommunityData(cb) {
        if (process.server) {
          return
        }
        if (!this.communities) {
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
      onSliderReady() {
        this.$nextTick(() => {
          $(this.$refs.alsoBought).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            autoplay: true,
            items: 8,
            nav: true,
            dots: false,
            margin: 5,
            center: false,
            lazyLoad: true,
            slideBy: 7,
            smartSpeed: 500,
            autoplayHoverPause: true,
          })
        })
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
      getProductPassword(password) {
        return this.GoGoHTTP.post(
          `/api/v3/surface/salons/${this.$route.params.id}`,
          { pagePassword: password }
        ).then(data => {
          if (Object.keys(data).length === 0) {
            data = {}
          }
          if (this.isPassword === 2) {
            this.$store.commit('cart/productStatus', data.status)
          }
          if (this.isPassword === 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
          }
          if (this.isPassword === 1 && data.status == 1) {
            this.data = data
            this.$store.commit('cart/setCart', data.cartInfo)
            this.$store.commit('cart/productStatus', 1)
            this.communityTotal = data.communityTotal || 0
          }
        })
      },
      descriptionTemplate() {
        return `${this.descriptionChunk}:${this.localeHead.description}`
      },
      keywordsTemplate() {
        return `${this.keywordsChunk}:${this.localeHead.keywords}`
      },
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    async asyncData({ app, params, error, req, store }) {
      let locale = app.i18n.locale,
        title = titleI18n[locale].title,
        description = titleI18n[locale].description,
        [data, commuTotal] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/salons/${params.id}`),
          app.GoGoHTTP.get(
            `/api/v3/surface/products/communities/${params.id}/count`
          ),
        ]),
        descriptionChunk,
        titleChunk,
        imgUrl,
        currentUrl,
        tab = params.t || 0,
        originUrl = `/finance/salons/${params.id}`

      if (!data || !Object.keys(data).length || !data.cartInfo) {
        return error({ statusCode: 404 })
      }
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
      imgUrl = process.env.GOGO_URL + '/img/products/' + params.id
      store.commit('cart/setInfo', {
        info: data.cartInfo,
        productStatus: data.status,
        isPassword: data.isPassword,
      })
      store.commit('pushBC', {
        name: data.name,
        target: { name: 'finance-salons-id', params: params },
      })
      const {
        cartInfo: { price, status } = {},
        review: { count, stars } = {},
      } = data
      return {
        id: params.id,
        data,
        commuTotal: parseInt(commuTotal) || 0,
        titleChunk,
        descriptionChunk,
        keywordsChunk: data.name,
        localeHead: titleI18n[locale],
        tab,
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
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: `${descriptionChunk}:${description}`,
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
          description: `${descriptionChunk}:${description}` || name,
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
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.pre-wrap {
  white-space: pre-line;
}
.word-break {
  word-break: break-all;
}
.custom-title {
  color: #666;
  font-size: 20px;
  border-left: 3px solid #cacaca;
  padding: 5px 10px;
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
.left-content {
  width: 670px;
  .tabs-wrapp {
    border-bottom: 1px solid #ddd;
    .nav {
      margin-bottom: -1px;
    }
  }
  .nav > li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 155px;
    height: 55px;
    border-radius: 0;
    font-size: 14px;
    color: #666;
    padding: 0;
    margin-right: -1px;
    border: 1px solid #ddd;
    &:hover {
      background: #f5f5f5;
    }
    &.active {
      font-weight: bold;
      border-bottom: 1px solid white;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: url('/img/assets/pc/salons/title-bg.jpg') repeat;
      }
      &:hover {
        background: #fff;
      }
    }
  }
  .commu-tab {
    background: #003567;
    border-radius: 18px;
    box-shadow: 2px 3px 0 #fff, 4px 5px 0 #e0e0e0;
    color: white;
    height: 30px;
    &:hover {
      opacity: 0.85;
    }
    .icon-cls {
      width: 20px;
      height: 20px;
    }
  }
  .outline-IbBKtrbLMt {
    /deep/ * {
      max-width: 100% !important;
    }
  }
  .icon-cmt {
    width: 22px;
    height: auto;
    color: #b2b2b2;
  }
  .samples {
    color: #2d2d2d;
    .sample-tit {
      font-size: 15px;
    }
    .sample-content {
      padding: 30px 0;
      border: 1px solid #e5e5e5;
      > div {
        width: 90%;
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
    .co-red {
      color: red;
      font-weight: bold;
    }
  }
  .explain-cooling {
    .content {
      color: #666;
    }
  }
  .related {
    width: 120px;
    min-height: 200px;
    color: #666;
    line-height: 16px;
    margin-right: 17px;
    &:last-child {
      margin-right: 0;
    }
    .img-wrapp {
      width: 120px;
      height: 92px;
    }
    &:hover .img-wrapp {
      opacity: 0.85;
    }
  }
  .payment-border {
    border: 1px solid #d9d9d8;
  }
  .payment-yZtzqpG /deep/ {
    background: transparent;
    .title01 ~ b {
      font-weight: normal;
    }
    .group-2 ~ div {
      font-size: 16px;
      justify-content: flex-start;
    }
  }
  .user-line {
    border-bottom: 1px solid #cacaca;
    padding: 10px 5px;
    word-break: break-all;
    .title {
      flex: 0 0 150px;
      width: 150px;
    }
    a {
      color: #666;
    }
  }
}
.right-content {
  width: 300px;
  color: #666;
  .payment-yZtzqpG /deep/ {
    background: transparent;
    .main-info {
      padding: 30px 25px 35px;
    }
    .title01 ~ b {
      font-weight: normal;
    }
    .group-2 ~ div {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .dvd {
      display: none;
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
    }
  }
  .user-ava {
    width: 150px;
    height: 150px;
    margin: 20px auto 10px;
  }
  .title {
    border-bottom: 1px solid #d9d9d9;
    padding: 5px 0;
    font-size: 16px;
    .icon-list-title {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #cbcbcb;
      &::before {
        content: '';
        position: absolute;
        top: 4px;
        left: 6px;
        border-style: solid;
        border-width: 4px 0 4px 7px;
        border-color: transparent transparent transparent #fff;
      }
    }
  }
  .nick-name {
    display: block;
    font-size: 18px;
    color: #666;
  }
  .btn-more {
    background: #9c3;
    border: none;
    color: white;
    border-radius: 2px;
    padding: 5px 10px;
    &:hover {
      opacity: 0.85;
    }
  }
  .thread {
    border-bottom: 1px dotted #777;
    padding: 10px 0;
    color: #666;
    a {
      font-size: 11px;
      color: #666;
      &:hover {
        text-decoration: underline;
      }
    }
    .ddd-truncated ~ div {
      font-size: 11px;
    }
    /deep/ .rate-num {
      display: none;
    }
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
.salon.data-transaction table {
  word-break: break-word !important;
  tbody > tr > th {
    min-width: 100px;
    padding: 5px;
  }
}
/* stylelint-enable */
</style>