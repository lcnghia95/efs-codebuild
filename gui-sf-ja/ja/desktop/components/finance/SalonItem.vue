<template>
  <LazyComp01 class="salon-item br-t-5 br-b-5 col-55" min-height="200px" :always-show="!!(index != undefined && index < 3)">
    <div class="info-user p-20 flex br-t-5">
      <a :href="'/users/' + (item.seller || {}).id" class="col-55">
        <img class="user-image"
             :src="'/img/users/' + (item.seller || {}).id + '/large?defaultImg=1'"
             :title="(item.seller || {}).nickName"
        />
      </a>
      <div class="pl-10 fs-11">
        <a class="salon-name wrap-text"
           :href="'/finance/mailmagazine/' + item.salonId"
           :title="item.name"
        >
          {{ item.name }}
        </a>
        <a :href="'/users/' + (item.seller || {}).id" class="col-55" :title="(item.seller || {}).nickName">
          {{ (item.seller || {}).nickName }}
        </a>
      </div>
    </div>
    <div class="content wrap-text">
      <a :href="'/finance/mailmagazine/' + item.salonId + '/' + item.id" class="mt-10" :title="item.title">
        <span class="font-weight-border col-black fs-20">{{ item.title }}</span>
      </a>
      <br />
      <span style="font-size: 10px;">{{ formatTime( item.publishedAt, 6) }}</span>
      <div class="fs-14" style="margin-top: 18px;" v-wrap-lines="5">
        {{ tagRemoved(item.content) }}
      </div>
      <a :href="'/finance/mailmagazine/' + item.salonId + '/' + item.id" class="link-detail mt-20">
        {{ $t('1') }}
      </a>
    </div>
    <div class="flex space-between salon-item-footer mid br-b-5">
      <div class="flex space-between mid" style="width: 130px;">
        <div @click="socialOnclick(1)" style="width: 30px; height: 30px; margin-left: -5px;">
          <LineIcon class="social-icon line" />
        </div>
        <div @click="socialOnclick(2)" style="width: 30px; height: 30px;">
          <Facebook class="social-icon facebook" />
        </div>
        <div @click="socialOnclick(3)" style="width: 30px; height: 30px;">
          <Twitter class="social-icon twitter" />
        </div>
        <div class="flex favorite-star" 
             style="width: 30px; height: 30px;"
             :class="{ 'icon-col-12': item.isFavorited && $store.state.user.id }"
             @click="socialOnclick(4)"
        >
          <Star class="social-icon" />
          <span class="fs-18 number no-select">{{ item.stars }}</span>
        </div>
      </div>
      <div class="font-weight-border price">
        <template v-if="item.price">{{ '¥' + formatNumber(item.price) + '/' + $t('3') }}</template>
        <template v-else>{{ $t('2') }}</template>
      </div>
    </div>
  </LazyComp01>
</template>
<script>
import Facebook from '@@/../components/icons/FacebookSquare.vue'
import Twitter from '@@/../components/icons/Twitter.vue'
import LineIcon from '@@/../components/icons/Line.vue'
import Star from '@@/../components/icons/Star.vue'
import i18n from '@@/lang/components-desktop/salon-item.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { tagRemoved } from '@/utils/client/common'
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
    index: Number
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
.salon-name {
  width: 370px;
  height: 15px;
  display: block;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #2d2d2d;
}
.salon-item {
  background-color: #fff;
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.7;
    }
  }
}
.price {
  line-height: 30px;
  font-size: 13px;
}
.col-55 {
  color: #2d2d2d;
}
.fs-20 {
  font-size: 20px;
}
.fs-11 {
  font-size: 11px;
}
.fs-14 {
  font-size: 14px;
}
.br-t-5 {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.br-b-5 {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.user-image {
  width: 30px;
  height: 30px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
}
.user-name {
  font-weight: bolder;
}
.content {
  width: 100%;
  padding-top: 18px;
  padding-right: 26px;
  padding-bottom: 31px;
  padding-left: 20px;
  .link-detail {
    font-size: 12px;
    display: block;
    color: #1d2088;
  }
}
.salon-item-footer {
  height: 60px;
  line-height: 30px;
  width: 100%;
  width: calc(100% - 40px);
  margin: 0 auto;
  box-shadow: inset 0 1px 0 0 #d9d9d9;
}
.fit-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background: #e0e0e0;
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
.line {
  /deep/ svg {
    height: 24px;
    width: 24px;
  }
  &:hover {
    color: #00c300;
  }
}
.facebook {
  /deep/ svg {
    height: 24px;
    width: 17px;
  }
  &:hover {
    color: #3578e5;
  }
}
.twitter {
  /deep/ svg {
    height: 24px;
    width: 20px;
  }
  &:hover {
    color: #52abe0;
  }
}
.favorite-star {
  /deep/ svg {
    height: 25px;
    width: 24px;
    margin-top: -2px;
  }
  cursor: pointer;
  .number {
    margin-left: -1px;
    line-height: 33px;
    font-size: 14px;
    color: #d9d9d9;
  }
  &:hover {
    color: #ff8500;
    i {
      color: #ff8500;
    }
    .number {
      color: #ff8500;
    }
  }
}
.icon-col-12 {
  color: #ff8500 !important;
  .number {
    color: #ff8500;
  }
  i {
    color: #ff8500;
  }
}
.col-11 {
  color: #d9d9d9;
}
.font-weight-border {
  font-weight: bolder;
}
.col-black {
  color: black;
}
.no-select {
  user-select: none;
}
.info-user {
  border-bottom: 1px solid #d9d9d9;
  height: 70px;
}
</style>
