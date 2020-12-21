<template>
  <div class="bg-color pb-60">
    <TopMenu />
    <div class="mailmagazine-container w-1000">
      <div class="user-info">
        <div class="user-img flex">
          <a :href="'/users/' + (item.seller || {}).id">
            <img class="user-image"
                 :src="'/img/users/' + (item.seller || {}).id + '/large?defaultImg=1'"
                 :title="(item.seller || {}).nickName"
            />
          </a>
          <div class="pl-10">
            <a class="author-name bold fs-16" :href="'/finance/mailmagazine/' + salonId">{{ item.name }}</a>
            <br />
            <a class="author-name" style="font-size: 15px;" :href="'/users/' + (item.seller || {}).id">{{ (item.seller || {}).nickName }}</a>
          </div>
        </div>
      </div>
      <div class="pt-40 pl-60 pr-60 pb-10 content">
        <div class="mb-30">
          <div class="mailmagazine-name">{{ item.title || '' }}</div>
          <div class="published-date">{{ formatTime( item.publishedAt, 6) }}</div>
        </div>
        <div class="content-mail" style="" v-html="item.content"></div>
        <div class="flex space-between mid mt-20 mb-10 pt-40">
          <div class="flex">
            <LineButton class="mr-4" :url="$route.fullPath" />
            <FacebookShareButton class="mr-4" :url="$route.fullPath" />
            <button @click="shareTwitter" class="tweet-btn flex mid center">
              <Twitter />
              <span style="margin-left: 1px;">{{ $t(11) }}</span>
            </button>
          </div>
          <div class="flex col-11 favorite-star" :class="{ 'icon-col-12': item.isFavorited }" @click="onFavorite()">
            <StarO class="star-icon" />
            <span class="fs-18 no-select" style="width: 30px; display: block;">{{ item.stars }}</span>
          </div>
        </div>
      </div>
      <div class="cart pt-30 pb-30 pl-60 pr-60 text-center" v-if="(item.cartInfo || {}).price === 0 || (item.cartInfo || {}).price">
        <div class="line"><span class="cart-title">{{ $t('4') }}</span></div>
        <div class="mt-40">
          <button v-if="!$store.state.user.id" class="goto-login mb-40" @click="goToLogin">{{ $t('10') }}</button>
          <div style="font-size: 13px;">
            <Lock /> {{ $t('5') }}
          </div>
          <Payment class="margin-center" />
        </div>
      </div>
      <div class="flex mailmagazine-footer mid space-between">
        <div class="b-half">
          <div v-if="item.previous" class="flex mid fit-content pr-20 ml-5 moving-btn moving-prew" style="margin-top: -10px;" @click="goToMail((item.previous || {}).id)">
            <p class="arrow" style="margin-right: 12px; margin-left: 5px;">＜</p>
            <div class="wrap-text w-250">
              <span class="bold fs-14">{{ (item.previous || {}).title }}</span>
              <br />
              <span class="fs-12" style="color: #2d2d2d;">{{ formatTime( (item.previous || {}).publishedAt, 6) }}</span>
            </div>
          </div>
        </div>
        <div v-if="item.next" class="flex mid mr-5 moving-btn moving-next pl-20" @click="goToMail((item.next || {}).id)">
          <div class="wrap-text w-250 text-right">
            <span class="bold fs-14">{{ (item.next || {}).title }}</span>
            <br />
            <span class="fs-12" style="color: #2d2d2d;">{{ formatTime( (item.next || {}).publishedAt, 6) }}</span>
          </div>
          <p class="arrow" style="margin-left: 12px; margin-right: 5px;">＞</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import Lock from '@@/../components/icons/Lock.vue'
import Payment from '@/components/payment-v1/type05/Payment05.vue'
import i18n from '@@/lang/desktop/salon-mailmagazine.json'
import title from '@@/../common/pages'
import LineButton from '@@/../components/social/LineButton.vue'
import FacebookShareButton from '@@/../components/social/FacebookShareButton.vue'
import StarO from '@@/../components/icons/StarO.vue'
import { filterInt, tagRemoved, gotoLogin } from '@/utils/client/common'
import Twitter from '@@/../components/icons/Twitter.vue'
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
      TopMenu,
      Lock,
      Payment,
      FacebookShareButton,
      LineButton,
      StarO,
      Twitter,
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
      shareTwitter() {
        let height = 600,
          width = 600,
          top = 100,
          left = 100,
          inputParams = {
            original_referer: location.href,
            ref_src: 'twsrc%5Etfw',
            text: this.item.title,
            url:`www.gogojungle.co.jp/finance/mailmagazine/${this.item.salonId}/${this.item.id}`,
            via: 'www.gogojungle.co.jp',
          },
          twitterUrl = 'https://twitter.com/intent/tweet'
        window.open(
          this.createUrlWithQuery(twitterUrl, inputParams),
          'Sharing to twitter',
          `width=${width},height=${height},top=${top},left=${left}`
        )
      },
      createUrlWithQuery(url, params) {
        let rs = url + '?'
        Object.keys(params).forEach(s2 => {
          rs = rs + s2 + '=' + params[s2] + '&'
        })
        return rs
      },
      onFavorite() {
        if(!this.$store.getters['getUser'].id) {
          return
        }

        let productId = this.item.productId,
          url =
            `/api/v3/surface/favorite/${productId}` +
            (this.item.isFavorited ? '/remove' : ''),
          isFav = this.item.isFavorited,
          stars = this.item.stars

        this.GoGoHTTP.post(url, { pId: productId })
          .then(() => {
            this.item.stars = isFav ? stars - 1 : stars + 1
            this.item.isFavorited = !isFav
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
      store.commit('pushBC', {
        name: item.name,
        target: { path: `/finance/mailmagazine/${salon}` },
      })
      store.commit('pushBC', {
        name: item.title,
        target: { path: `/finance/mailmagazine/${salon}/${id}` },
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
.w-250 {
  width: 250px;
}
.tweet-btn {
  height: 20px;
  width: 60px;
  line-height: 18px;
  background: #1b95e0;
  border: none;
  color: #fff;
  border-radius: 3px;
  font-size: 9px;
  outline: none;
  &:hover, &:focus {
    background: #0c7abf;
  }
  &:active {
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.1);
  }
  .icon-cls {
    width: 15px;
    min-width: 15px;
    height: 12px;
    /deep/ svg {
      height: 12px;
    }
  }
}
.mailmagazine-name {
  font-size: 30px;
  font-weight: bold;
  text-align: justify;
  color: #2d2d2d;
}
.published-date {
  color: #707070;
  font-size: 14px;
}
.content-mail {
  line-height: 36px;
  font-size: 16px;
  text-align: justify;
  color: #2d2d2d;
}
.goto-login {
  height: 40px;
  width: 280px;
  font-size: 14px;
  background: #f60;
  border: none;
  outline: none;
  color: white;
  border-radius: 5px;
  &:hover {
    opacity: 0.7;
  }
}
.user-img {
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
  .author-name {
    font-size: 16px;
    line-height: 21px;
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
  background-color: #fff;
  width: 790px;
  margin: 45px auto 0 auto;
}
.bold {
  font-weight: bold;
}
.fit-content {
  width: fit-content;
}
.text-right {
  text-align: right;
}
.w-270 {
  width: 270px;
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
  font-size: 16px;
}
.cart {
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
}
.content {
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  padding: 41px 58px 12px 60px;
}
.user-info {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 20px;
  height: 80px;
  a {
    color: #2d2d2d;
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
}
.fs-14 {
  font-size: 14px;
}
.fs-16 {
  font-size: 16px;
}
.fs-18 {
  font-size: 18px;
}
.b-half {
  width: 50%;
  border-right: 1px solid #d9d9d9;
  height: 40px;
}
.user-image {
  height: 42px;
  width: 42px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
}
.mailmagazine-footer {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid #d9d9d9;
  height: 80px;
}
.col-black {
  color: black;
}
.bg-color {
  background-color: #fafafa;
}
.favorite-star {
  cursor: pointer;
  &:hover {
    color: #ff8500;
    i {
      color: #ff8500;
    }
  }
}
.star-icon {
  width: 30px;
  height: 30px;
  color: #d9d9d9;
  margin-top: -5px;
}
.icon-col-12 {
  color: #ff8500 !important;
  i {
    color: #ff8500;
  }
}
.col-11 {
  color: #d9d9d9;
}
.no-select {
  user-select: none;
}
.pb-60 {
  padding-bottom: 60px;
}
.mr-4 {
  margin-right: 4px;
}
.arrow {
  font-size: 30px;
  line-height: 0.53;
  color: #d9d9d9;
  margin: 0;
}
.moving-btn {
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 5px;
  height: 60px;
  width: 250px;
  &:hover {
    background: #f6f6f6;
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