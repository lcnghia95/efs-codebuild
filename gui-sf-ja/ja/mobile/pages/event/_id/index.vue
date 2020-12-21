<template>
  <div style="background: #f0f0f0;" class="pb-10">
    <div class="stop-sell-header flex mid center" v-if="event.status == 9" v-html="$t(15)"></div>
    <div class="stop-sell-header flex mid center" v-else-if="event.status == 2" v-html="$t(5)"></div>
    <div style="background: #ff8400;" v-else>
      <div class="condition-header">{{ $t(1) }}</div>
    </div>
    <div class="p-10 mt-10 mb-10 detail-header">
      <div>{{ event.title }}</div>
      <div class="flex row-reverse"
           @click="onClickFav" 
           :style="{ 'color': event.like ? '#f6cb00' : '' }"
      >
        <div :is="event.like ? 'Star' : 'StarO'" />
      </div>
    </div>
    <div class="detail-table">
      <div class="detail-row flex" v-for="(item, index) in rows" :key="item.icon + index">
        <div class="flex mid row-label wrap-text">
          <div :is="item.icon" v-if="item.icon" />
          <div class="text-icon mr-5" v-else>{{ item.textIcon }}</div>
          <div class="wrap-text">{{ item.label }}</div>
        </div>
        <div class="row-content" v-if="item.isHtml" v-html="item.content"></div>
        <div class="row-content" v-else>{{ item.content }}</div>
      </div>
    </div>
    <div class="detail-outline flex mid mt-10">
      <Search class="mr-5" />
      <div style="height: 32px;">{{ $t(3) }}</div>
    </div>
    <div class="p-10 main" v-html="event.content">
    </div>
    <div class="cart-default flex mid" ref="cartDefault" v-if="event.status === 1">
      <div class="cart-btn flex mid center" @click="addToCart"><Cart />{{ $t(4) }}</div>
    </div>
    <div class="cart-fixed flex mid" ref="cartFixed" v-if="event.status === 1">
      <div class="cart-btn flex mid center" @click="addToCart"><Cart />{{ $t(4) }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/event-detail.json'
import title from '@@/../common/pages'
import { gotoLogin, filterInt } from '@/utils/client/common'
import StarO from '@@/../components/icons/StarO.vue'
import Star from '@@/../components/icons/Star.vue'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Tags from '@@/../components/icons/Tags.vue'
import MapMarker from '@@/../components/icons/MapMarker.vue'
import HourGlass from '@@/../components/icons/HourGlass.vue'
import Groups from '@@/../components/icons/Groups.vue'
import File from '@@/../components/icons/File.vue'
import Search from '@@/../components/icons/Search.vue'
import Cart from '@@/../components/icons/Cart.vue'
import {trackingEventView} from '@@/../common/js/ga/ecom-enhance'

let replaceLinkUrl = function(content = '') {
  /* eslint-disable */
  let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm,
    imgEtx = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|svg)/g
  /* eslint-enable */
  content = content.slice().replace(regex, function(match) {
    if (imgEtx.test(match) || match.includes('img.gogojungle.co.jp')) {
      return match
    }
    return `<a href="${match}" target="_blank" class="cursor-pointer">${match}</a>`
  })
  return content
}
const obj = Object.assign(
  {
    components: {
      StarO,
      Star,
      CalendarAlt,
      Tags,
      MapMarker,
      HourGlass,
      Groups,
      File,
      Search,
      Cart,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        event: {},
        cartProcesssing: false,
      }
    },
    computed: {
      rows() {
        let event = this.event
        return [
          {
            icon: 'CalendarAlt',
            label: this.$t(7),
            content: event.date,
            isHtml: true,
          },
          {
            icon: 'Tags',
            label: this.$t(8),
            content: event.categories 
                      ? event.categories
                              .map(item => this.$t(`categories.${item}`))
                              .join('&nbsp;&nbsp;')
                              .replace('&nbsp;&nbsp;', '') 
                      : '',
            isHtml: true,
          },
          {
            icon: 'MapMarker',
            label: this.$t(9),
            content: event.location,
            isHtml: true,
          },
          {
            textIcon: '￥',
            label: this.$t(10),
            content: event.price ? this.formatNumber(event.price) : this.$t(2),
          },
          {
            icon: 'HourGlass',
            label: this.$t(11),
            content: this.$t(14, {n: event.times}),
          },
          {
            icon: 'Groups',
            label: this.$t(12),
            content: event.limit,
          },
          {
            icon: 'File',
            label: this.$t(13),
            content: event.outline,
          },
        ]
      }
    },
    mounted() {
      let me = this
      if($(me.$refs.cartDefault).offset()) {
        let $cartDefault = $(me.$refs.cartDefault),
          offset =  $cartDefault.offset().top + $cartDefault.outerHeight() - $(window).height()// offset top + height - screen height

        if(this.event.status === 1) {
          $(window).on('load scroll', function() {
            if ($(window).scrollTop() < offset) {
              $(me.$refs.cartFixed).fadeIn(300)
            } else {
              $(me.$refs.cartFixed).fadeOut(300)
            }
          })
        }
      }
      trackingEventView(this.event)
    },
    async asyncData({ app, params, error, store }) {
      let event = await app.GoGoHTTP.get(`/api/v3/surface/event/${params.id}`)
      if (!event || !Object.keys(event).length) {
        return error({ statusCode: 404 })
      }
      event.location = replaceLinkUrl(event.location)
      event.outline = replaceLinkUrl(event.outline)
      const category = (event.categories || []).sort((a, b) => {
        return a - b
      })[0] || undefined
      store.commit('cart/setInfo', {
        info: {
          price: event.price,
          productId: event.pId,
          isFavorite: event.like,
          name: event.title,
          devId: event.devId,
          category,
          type: 19,
        },
      })
      return {
        event,
        titleChunk: event.title,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/event/${params.id}`,
          },
        ],
      }
    },
    methods: {
      onClickFav() {
        if (!this.$store.state.user.id) {
          gotoLogin(`u=${location.pathname}`)
          return
        }
        let url =
          `/api/v3/surface/favorite/${this.event.pId}` +
          (this.event.like ? '/remove' : '')
        this.GoGoHTTP.post(url)
          .then(this.$set(this.event, 'like', this.event.like ? 0 : 1))
          .catch(error => {
            console.log(error)
          })
      },
      addToCart() {
        if (this.cartProcesssing) {
          return
        }
        this.cartProcesssing = true
        this.$store.dispatch('cart/addToCart', {
          productId: this.event.pId,
        })
      },
      descriptionTemplate() {
        return this.event.outline ? this.event.outline.substr(0, 300) : ''
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.condition-header {
  min-height: 100px;
  background-image: url(/img/assets/mobile/event/UI_02.png);
  background-size: 100% 100px;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 100px;
  font-size: 25px;
  color: #fff;
  font-weight: bold;
}
.detail-header {
  font-weight: bold;
  background: #fff;
}
.detail-table {
  background: #fff;
  .detail-row {
    min-height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #d9d9d9;
    .row-label {
      font-weight: bold;
      flex: 0 0 35%;
      height: 50px;
      padding: 0 10px;
      .icon-cls {
        width: 23px;
        height: 26px;
        flex: 0 0 23px;
        color: #ff8400;
        margin-right: 5px;
      }
      .text-icon {
        height: 51px;
        width: 23px;
        text-align: center;
        font-size: 22px;
        color: #ff8400;
      }
    }
    .row-content {
      line-height: 25px;
      padding: 13px 10px;
      word-break: break-word;
    }
  }
}
.detail-outline {
  height: 50px;
  line-height: 35px;
  padding: 0 10px;
  font-weight: bold;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
  .icon-cls {
    width: 24px;
    height: 22px;
    color: #ff8400;
  }
}
.main {
  background: #fff;
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
.cart-default {
  background: #ffff;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  text-align: center;
  color: #000;
  transition: 0.8s;
}
.cart-fixed {
  background: #fff;
  position: fixed;
  display: none;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  text-align: center;
  color: #000;
  transition: 0.8s;
  box-shadow: 0 0 5px grey;
}
.cart-default, .cart-fixed {
  .cart-btn {
    width: calc(100% - 30px);
    background: #ff8400;
    margin: 15px auto;
    height: 50px;
    border-radius: 7px;
    line-height: 50px;
    color: #fff;
    font-size: 19px;
    transition: all 0.8s;
    box-shadow: 0 0 2px #c94b00;
    &.grey {
      background: #5f5f5f;
    }
    .icon-cls {
      width: 34px;
      height: 43px;
    }
    &:active {
      box-shadow: inset 0 0 15px 4px #c04800;
    }
  }
}
.stop-sell-header {
  background: #7d7d7d;
  text-align: center;
  color: #fff;
  padding: 13px;
  font-size: 22px;
  line-height: 27px;
  margin-bottom: -10px;
  min-height: 80px;
}
</style>
<style lang="scss">
.scroll-btn {
  bottom: 120px !important;
}
</style>