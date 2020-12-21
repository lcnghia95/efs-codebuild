<template>
  <div class="mailmagazine-container w-full">
    <a class="back-to-salon" href="/finance/mailmagazine">{{ $t(13) }}</a>
    <div class="user-info">
      <div class="info-user flex">
        <a class="author-name" :href="'/users/' + (item.seller || {}).id">
          <img class="user-image" 
               :src="'/img/users/' + (item.seller || {}).id + '/large?defaultImg=1'" 
               :title="(item.seller || {}).nickName"
          />
        </a>
        <div class="pl-10">
          <a class="author-name bold fs-16" :href="'/finance/mailmagazine/' + salonId">{{ item.name }}</a>
          <br />
          <a class="author-name fs-12" :href="'/users/' + (item.seller || {}).id">{{ (item.seller || {}).nickName }}</a>
        </div>
      </div>
    </div>
    <div class="content mb-40">
      <div class="name mt-25">{{ item.title }}</div>
      <div class="title col-39 mb-20">{{ formatTime( item.publishedAt, 6) }}</div>
      <div class="main" v-html="item.content"></div>
    </div>
    <div class="cart text-center" v-if="(item.cartInfo || {}).price === 0 || (item.cartInfo || {}).price">
      <div class="line"><span class="cart-title">{{ $t('4') }}</span></div>
      <div class="mt-50">
        <button v-if="!$store.state.user.id" class="goto-login mb-35" @click="goToLogin">{{ $t('10') }}</button>
        <div class="cart-txt">
          <Lock /> {{ $t('5') }}
        </div>
        <Payment02 class="margin-center" />
      </div>
    </div>
    <div class="flex space-between salon-item-footer p-10 br-b-5">
      <div class="social-btn flex space-between" style="width: 35%;">
        <div @click="socialOnclick(1)">
          <LineIcon class="social-icon line-icon" />
        </div>
        <div @click="socialOnclick(2)">
          <Facebook class="social-icon facebook" />
        </div>
        <div @click="socialOnclick(3)">
          <Twitter class="social-icon twitter" />
        </div>
      </div>
      <div class="flex col-11 favorite-star" :class="{ 'active': item.isFavorited }" @click="socialOnclick(4)">
        <Star class="social-icon" />
        <span class="fs-18 number no-select">{{ item.stars }}</span>
      </div>
    </div>
    <div class="flex mailmagazine-footer space-between">
      <div class="b-half">
        <div v-if="item.previous" class="flex mid fit-content pr-15 moving-prew" @click="goToMail((item.previous || {}).id)">
          <AngleLeft class="" />
          <div class="moving-btn">
            <span class="moving-btn-txt">{{ $t(11) }}</span>
            <br />
            <span class="moving-btn-title" v-wrap-lines="2">{{ (item.previous || {}).title }}</span>
            <span class="moving-btn-date">{{ formatTime( (item.previous || {}).publishedAt, 8) }}</span>
          </div>  
        </div>
      </div>
      <div v-if="item.next" class="flex mid moving-next pl-15" @click="goToMail((item.next || {}).id)">
        <div class="moving-btn text-right">
          <span class="moving-btn-txt">{{ $t(12) }}</span>
          <br />
          <span class="moving-btn-title" v-wrap-lines="2">{{ (item.next || {}).title }}</span>
          <span class="moving-btn-date">{{ formatTime( (item.next || {}).publishedAt, 8) }}</span>
        </div>
        <AngleRight />
      </div>
    </div>
  </div>
</template>
<script>
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import Lock from '@@/../components/icons/Lock.vue'
import Payment02 from '@/components/payment/Payment02.vue'
import Facebook from '@@/../components/icons/Facebook.vue'
import Twitter from '@@/../components/icons/Twitter.vue'
import LineIcon from '@@/../components/icons/Line.vue'
import Star from '@@/../components/icons/Star.vue'
import i18n from '@@/lang/mobile/finance-mailmagazine-detail.json'
import title from '@@/../common/pages'
import { filterInt, tagRemoved, gotoLogin } from '@/utils/client/common'
import {trackingMagazineSalonDetailView} from '@@/../common/js/ga/ecom-enhance'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id)) && !isNaN(filterInt(params.salon))
    },
    i18n: {
      messages: i18n,
    },
    components: {
      Facebook,
      Twitter,
      LineIcon,
      Star,
      AngleLeft,
      AngleRight,
      Lock,
      Payment02,
    },
    data() {
      return {}
    },
    mounted() {
      trackingMagazineSalonDetailView(this.item)
    },
    methods: {
      goToMail(id) {
        if (!id) {
          return
        }
        location.href = '/finance/mailmagazine/' + this.salonId + '/' + id
      },
      descriptionTemplate() {
        return this.descriptionMeta
      },
      goToLogin() {
        gotoLogin(`u=${location.pathname}`)
      },
      socialOnclick(type) {
        let sharingLinks = {
          1: this.shareLine,
          2: this.shareFacebook,
          3: this.shareTwitter,
          4: this.onFavorite,
        }
        sharingLinks[type] && sharingLinks[type]()
      },
      createUrlWithQuery(url, params) {
        let rs = url + '?'
        Object.keys(params).forEach(s2 => {
          rs = rs + s2 + '=' + params[s2] + '&'
        })
        return rs
      },
      shareFacebook() {
        let height = 600,
          width = 600,
          top = 100,
          left = 100,
          inputParams = {
            u:
              'https%3A%2F%2Fwww.gogojungle.co.jp/finance/mailmagazine/' +
              this.item.salonId +
              '/' +
              this.item.id,
            display: 'popup',
            ref: 'plugin',
            src: 'like',
            kid_directed_site: 0,
            size: 'smail',
          },
          fbUrl = `https://www.facebook.com/sharer/sharer.php`

        window.open(
          this.createUrlWithQuery(fbUrl, inputParams),
          'Sharing to facebook',
          `width=${width},height=${height},top=${top},left=${left}`
        )
      },
      shareLine() {
        window.open(
          'http://line.naver.jp/R/msg/text/?https://www.gogojungle.co.jp/finance/mailmagazine/' +
            this.item.salonId +
            '/' +
            this.item.id
        )
      },
      shareTwitter() {
        let height = 600,
          width = 600,
          top = 100,
          left = 100,
          inputParams = {
            original_referer: location.href,
            ref_src: 'twsrc%5Etfw',
            text: this.item.title,
            url:
              'https%3A%2F%2Fwww.gogojungle.co.jp/finance/mailmagazine/' +
              this.item.salonId +
              '/' +
              this.item.id,
            via: 'www.gogojungle.co.jp',
          },
          twitterUrl = 'https://twitter.com/intent/tweet'
        window.open(
          this.createUrlWithQuery(twitterUrl, inputParams),
          'Sharing to facebook',
          `width=${width},height=${height},top=${top},left=${left}`
        )
      },
      onFavorite() {
        let productId = this.item.productId,
          url =
            `/api/v3/surface/favorite/${productId}` +
            (this.item.isFavorited ? '/remove' : '')
        this.GoGoHTTP.post(url, { pId: productId })
          .then(() => {
            this.$set(this.item, 'isFavorited', !this.item.isFavorited)
          })
          .catch(error => {
            console.log(error)
          })
      },
    },
    async asyncData({ app, store, params, error, req }) {
      let id = params.id,
        salon = params.salon,
        item = await app.GoGoHTTP.get('/api/v3/surface/mailmagazine/' + id, {
          params: {
            salonId: salon,
          },
        }),
        titleChunk,
        descriptionMeta,
        currentUrl,
        imgUrl,
        locale = app.i18n.locale
      if (!Object.keys(item || {}).length) {
        return error({ statusCode: 404 })
      }
      store.commit('cart/setInfo', {
        info: item.cartInfo,
      })
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      titleChunk = `${item.title} - ${item.name} :${i18n[locale][1]}`
      ;(descriptionMeta = tagRemoved(item.content || '').substr(0, 300)),
        (imgUrl = process.env.GOGO_URL + item.imageUrl)
      return {
        salonId: salon,
        item,
        titleChunk,
        descriptionMeta,
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
            content: titleChunk,
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: descriptionMeta,
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
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/mailmagazine/${salon}/${
              item.id
            }`,
          },
        ],
      }
    },
  },
  title
)

export default obj
</script>
<style lang="scss" scoped>
.goto-login {
  height: 40px;
  width: 270px;
  background: #f60;
  border: none;
  outline: none;
  color: white;
  border-radius: 5px;
  &:hover {
    opacity: 0.7;
  }
}
.info-user {
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
}
.title {
  text-decoration: none;
  &:hover {
    opacity: 0.7;
  }
}
.margin-center {
  margin: 0 auto;
}
.icon-cls /deep/ {
  width: 15px;
  height: 12px;
}
.mailmagazine-container {
  margin: 0 auto;
  padding: 10px;
}
.back-to-salon {
  height: 40px;
  color: #707070;
  border-bottom: 1px solid rgba(4, 0, 0, 0.1);
  margin-bottom: 20px;
  line-height: 40px;
  display: block;
  text-decoration: none;
  &:active {
    opacity: 0.8;
    color: #000;
    background: #ededed;
    border: none;
  }
}
.bold {
  font-weight: bold;
}
.fit-content {
  width: fit-content;
}
.moving-prew {
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
}
.moving-next {
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
}
.moving-next, .moving-prew {
  .icon-cls /deep/ {
    width: 28px;
    height: 28px;
  }
}
.text-right {
  text-align: right;
}
.line {
  border-bottom: 1px solid #d9d9d9;
  text-align: center;
  line-height: 0.1em;
  font-size: 18px;
  font-weight: bold;
}
.cart-title {
  background: white;
  padding: 0 20px;
}
.content {
  .name {
    font-weight: bold;
    font-size: 25px;
  }
  .title {
    font-size: 15px;
  }
  .main {
    font-size: 17px;
    white-space: pre-line;
    word-break: break-all;
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
}
.cart-txt {
  color: #b2b2b2;
  /deep/ .icon-cls {
    color: #b2b2b2;
  }
}
.user-info {
  a {
    color: unset;
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
}
.fs-16 {
  font-size: 16px;
}
.fs-30 {
  font-size: 30px;
}
.b-half {
  width: 50%;
  border-right: 1px solid #d9d9d9;
}
.user-image {
  height: 42px;
  width: 42px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
}
.mailmagazine-footer {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 -10px;
  padding: 10px 0;
}
.col-black {
  color: black;
}
.moving-btn {
  width: 115px;
  .moving-btn-txt {
    font-size: 12px;
    color: #1d2088;
  }
  .moving-btn-title {
    font-size: 13px;
  }
  .moving-btn-date {
    font-size: 13px;
  }
}
.social-icon /deep/ {
  width: 30px;
  height: 30px;
  color: #d9d9d9;
  padding: 4px 0;
  line-height: 40px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    margin: 0 auto;
  }
}
.facebook {
  &:hover {
    color: #3578e5;
  }
}
.twitter {
  &:hover {
    color: #52abe0;
  }
}
.line-icon {
  &:hover {
    color: #00c300;
  }
}
.favorite-star {
  cursor: pointer;
  .number {
    margin-left: -3px;
    line-height: 32px;
    color: #d9d9d9;
  }
  &.active {
    color: #ff8500;
    i, .number {
      color: #ff8500;
    }
  }
}
</style>
