<template>
  <LazyComp01 class="salon-item br-t-5 br-b-5 col-55" min-height="200px">
    <div class="info-user p-10 flex br-t-5">
      <a :href="'/users/' + (item.seller || {}).id" class="col-55">
        <img class="user-image" 
             :src="'/img/users/' + (item.seller || {}).id + '/large?defaultImg=1'" 
             :title="(item.seller || {}).nickName"
        />
      </a>
      <div class="pl-10 fs-11 wrap-text">
        <a class="font-weight-border col-black" :href="'/finance/mailmagazine/' + item.salonId" :title="item.name">{{ item.name }}</a>
        <br />
        <a :href="'/users/' + (item.seller || {}).id" class="col-55" :title="(item.seller || {}).nickName">
          {{ (item.seller || {}).nickName }}
        </a>
      </div>
    </div>
    <div class="content p-10 wrap-text">
      <a :href="'/finance/mailmagazine/' + item.salonId + '/' + item.id" class="mt-10" :title="item.title">
        <span class="font-weight-border col-black fs-20\">{{ item.title }}</span>
      </a>
      <br />
      <span class="fs-11">{{ formatTime( item.publishedAt, 6) }}</span>
      <div class="mt-10" v-wrap-lines="5">
        {{ tagRemoved(item.content) }}
      </div>
      <a :href="'/finance/mailmagazine/' + item.salonId + '/' + item.id" class="link-detail mt-10">
        {{ $t('1') }}
      </a>
    </div>
    <div class="flex space-between salon-item-footer p-10 br-b-5">
      <div class="social-btn flex">
        <div @click="socialOnclick(1)">
          <LineIcon class="social-icon line" />
        </div>
        <div @click="socialOnclick(2)">
          <Facebook class="social-icon facebook" />
        </div>
        <div @click="socialOnclick(3)">
          <Twitter class="social-icon twitter" />
        </div>
        <div class="flex favorite-star" :class="{ 'icon-col-12': item.isFavorited && $store.state.user.id }" @click="socialOnclick(4)">
          <Star class="social-icon" />
          <span class="fs-18 number" style="user-select: none;">{{ item.stars }}</span>
        </div>
      </div>
      <div class="font-weight-border">
        <template v-if="item.price">{{ '¥' + formatNumber(item.price) + '/' + $t('3') }}</template>
        <template v-else>{{ $t('2') }}</template>
      </div>
    </div>
  </LazyComp01>
</template>
<script>
import Facebook from '@@/../components/icons/Facebook.vue'
import Twitter from '@@/../components/icons/Twitter.vue'
import LineIcon from '@@/../components/icons/Line.vue'
import Star from '@@/../components/icons/Star.vue'
import i18n from '@@/lang/components-desktop/salon-item.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { tagRemoved, gotoLogin } from '@/utils/client/common'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Twitter,
    Facebook,
    LineIcon,
    Star,
    LazyComp01,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    tagRemoved,
    onNoImg() {
      let me = this
      me.$set(me.item, 'imageUrl', null)
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
      if (!this.$store.state.user.id && process.browser) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let productId = this.item.productId,
        url =
          `/api/v3/surface/favorite/${productId}` +
          (this.item.isFavorited ? '/remove' : '')
      this.GoGoHTTP.post(url, { pId: productId })
        .then(() => {
          this.$emit('favorite-change', productId)
        })
        .catch(error => {
          console.log(error)
        })
    },
    goToMagazineDetail() {
      location.href =
        '/finance/mailmagazine/' + this.item.salonId + '/' + this.item.id
    },
  },
}
</script>

<style lang="scss" scoped>
.salon-item {
  background: #fff;
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
}
.col-55 {
  color: #2d2d2d;
}
.fs-20 {
  font-size: 20px;
}
.br-t-5 {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.br-b-5 {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.user-image {
  width: 30px;
  height: 30px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
}
.content {
  max-height: 220px;
  width: 100%;
  .link-detail {
    font-size: 15px;
    display: block;
    color: #1d2088;
  }
}
.salon-item-footer {
  height: 50px;
  line-height: 30px;
  border-top: 1px solid #d9d9d9;
  width: 100%;
  width: 96%;
  margin: 0 auto;
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
.line {
  &:hover {
    color: #00c300;
  }
}
.favorite-star {
  cursor: pointer;
  color: #d9d9d9;
  .number {
    margin-left: -3px;
  }
}
.icon-col-12 {
  color: #ff8500 !important;
  i {
    color: #ff8500;
  }
}
.font-weight-border {
  font-weight: bolder;
}
.col-black {
  color: black;
}
</style>
