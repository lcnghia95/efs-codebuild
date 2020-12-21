<template>
  <section>
    <InfoTopBar />
    <div class="w-1000 flex space-between">
      <div class="left-content mt-40">
        <DetailBanner />
        <div class="tabs-wrapp flex mid space-between">
          <ul class="nav nav-tabs">
            <li
              :class="{ active: !tab }"
              class="cursor-pointer"
              @click="changeTab('')"
            >
              <span class="text-center" v-html="tabList[0]"></span>
            </li>
            <li
              :class="{ active: tab == 'law' }"
              class="cursor-pointer"
              @click="changeTab('law')"
            >
              <span
                class="text-center"
                v-html="tabList[1]"
                v-if="data.transaction"
              ></span>
              <span class="text-center" v-else>{{ $t('20') }}</span>
            </li>
          </ul>
          <div
            class="commu-tab cursor-pointer flex mid pl-15 pr-15 fs-12"
            @click="changeTab('community')"
          >
            <Comments />
            {{ $t('4') }}&nbsp;({{ parseInt(commuTotal) || 0 }})
          </div>
        </div>
        <div v-if="!tab" class="mt-30">
          <div v-html="data.outline" class="outline-IbBKtrbLMt pre-wrap"></div>
          <div class="explain-cooling mt-30" v-if="data.cartInfo.isAdvising">
            <div class="custom-title">
              {{ $t('5') }}
            </div>
            <img
              :src="'/img/assets/pc/salons/Coolingoff.png'"
              class="w-full mt-20"
            />
          </div>
          <div class="explain-cooling mt-30" v-if="data.cartInfo.payments">
            <div class="custom-title">
              {{ $t('6') }}
            </div>
            <div class="content mt-20" v-html="buildPayment()"></div>
          </div>
          <div class="flex mid center m-30">
            <Payment03
              class="p-20 payment-border"
              :is-hor="true"
              :get-product-password="getProductPassword"
              width="600px"
            />
          </div>
          <div v-if="related.length" class="mt-30">
            <div class="custom-title mb-20">
              {{ $t('12') }}
            </div>
            <div class="flex flex-wrap">
              <a
                :href="item.url"
                class="related"
                v-for="(item, i) in related"
                :key="'related-' + i"
              >
                <ImgWrapper :src="item.img" />
                <div class="mt-10 fs-12" v-wrap-lines="6" :title="item.title">
                  {{ item.title }}
                </div>
              </a>
            </div>
          </div>
        </div>
        <div v-if="tab == 'law'" class="mt-30">
          <div
            v-if="data.transaction"
            v-html="data.transaction"
            class="pre-wrap"
          ></div>
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
              <div class="pre-wrap">
                {{ data.userIntroduction }}
              </div>
            </div>
            <div class="user-line flex">
              <div class="title">
                <b>{{ $t('23') }}</b>
              </div>
              <a :href="data.userUrl">{{ data.userUrl }}</a>
            </div>
          </div>
        </div>
        <div v-if="tab == 'community'" class="pt-30">
          <Community
            :get-data="getCommunityData"
            :id="(data.cartInfo || {}).productId"
            @posted="onPosted"
            @update-total="onUpdateTotal"
            @delete-reply="onDeleteReply"
          />
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
        <a
          :href="'/users/' + data.userId"
          class="mt-10 mb-10 nick-name cursor-pointer"
        >
          {{ data.nickName }}
        </a>
        <div class="flex space-between mid">
          <Rate
            :stars="data.reviewsStars"
            :number="data.reviewsCount"
            :target="data.id"
            class="rating"
          />
          <a :href="'/review/detail/' + data.id">
            <button class="btn-more">{{ $t('14') }}</button>
          </a>
        </div>
        <div class="title flex mid mt-30">
          <span class="icon-list-title pos-rel mr-5"></span>
          {{ $t('15') }}
        </div>
        <ImgWrapper
          :src="data.profileImg || `/img/users/${data.userId}/large`"
          alt=""
          class="user-ava"
        />
        <div
          v-html="data.profile || data.userIntroduction"
          class="fs-12 pre-wrap word-break"
        ></div>
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
            <div
              v-for="thread in threads"
              :key="'salon-thread-' + thread.id"
              class="thread"
            >
              <simple-paragraph :lines="3" :content="thread.content" />
              <div class="flex">
                <span>{{ formatTime(thread.date, 6) }}</span>
                <a :href="'/users/' + thread.userId" class="underline ml-10">
                  {{ thread.userName }}
                </a>
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
            <div
              v-for="(review, i) in reviews"
              :key="'salon-review-' + i"
              class="thread"
            >
              <div class="wrap-text underline" :title="review.title">
                <b>{{ review.title }}</b>
              </div>
              <simple-paragraph :lines="3" :content="review.content" />
              <Rate
                :stars="(review.review || { stars: 0 }).stars"
                :alway-show="true"
              />
              <div class="flex mid">
                <span>{{ formatTime(review.publishedDate, 6) }}</span>
                <a :href="'/users/' + review.user.id" class="ml-10 underline">
                  {{ review.user.name }}
                </a>
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
  </section>
</template>
<script>
import Comments from '@@/../components/icons/Comments.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/mailmagazine-salon-id.json'
import {
  editCss,
  convertToFxonHost,
  pushState,
  filterInt,
} from '@/utils/client/common'
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
import authorMeta from '@@/../common/pages/author.js'
import InfoTopBar from '@/components/finance/mailmagazine/InfoTopBar.vue'
import Community from '@/components/finance/mailmagazine/SalonsCommunity.vue'
import titleI18n from '@@/lang/common/salons-title.json'
import {trackingMagazineSalonView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'
import typeI18n from '@@/lang/common/types.json'

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
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        tabList: [this.$t('1'), this.$t('3')],
        threads: [],
        reviews: [],
        related: [],
      }
    },
    mounted() {
      this.getDataThreads()
      this.getDataReviews()
      this.getDataRelated()
      window.productId = this.data.cartInfo.productId
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
      getCommunityData(cb) {
        if (process.server) {
          return
        }
        let productId = (this.data.cartInfo || {}).productId
        if (!this.communities && productId) {
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
      getProductPassword(password) {
        return this.GoGoHTTP.post(
          `/api/v3/surface/mailmagazine/salon/${this.$route.params.salon}`,
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
      changeTab(_tab) {
        this.tab = _tab
        pushState(
          `finance/mailmagazine/${this.id}/${_tab}`,
          null,
          '',
          location.protocol + '//' + location.host
        )
        this.sendPageView()
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
        tab = params.t || 0,
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
      store.commit('cart/setInfo', {
        info: data.cartInfo,
        productStatus: data.status,
        isPassword: data.isPassword,
      })
      store.commit('pushBC', {
        name: data.name,
        target: { name: 'finance-mailmagazine-salon', params: params },
      })
      const {
        cartInfo: { price, type, status } = {},
        review: { count, stars } = {},
      } = data
      return {
        id: salon,
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
.pre-wrap {
  white-space: pre-line;
}
.word-break {
  word-break: break-all;
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
  .explain-cooling {
    .content {
      color: #666;
    }
  }
  .custom-title {
    color: #666;
    font-size: 20px;
    border-left: 3px solid #cacaca;
    padding: 5px 10px;
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
/* stylelint-enable */
</style>