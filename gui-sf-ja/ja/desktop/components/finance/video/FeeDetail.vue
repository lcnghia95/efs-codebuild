<template>
  <div class="pos-rel">
    <div class="vid-d--p pos-abs"></div>
    <div class="vid-d__main w-1000 flex space-between pos-rel">
      <div class="vid-d__i">
        <iframe
          v-if="dataVideo.watchUrl"
          class="w-full"
          :src="youtubeParser(dataVideo.watchUrl)"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <img v-else class="w-full" :src="dataVideo.thumbnailUrl" />
        <h3 class="video-title mt-30 mb-20" v-html="dataVideo.productName"></h3>
        <p
          class="video-dec pb-20"
          v-html="dataVideo.title"
          v-if="dataVideo.title"
        ></p>
        <rate
          class="rating mb-20"
          :alway-show="true"
          :stars="(dataVideo.review || {}).stars"
          :target="dataVideo.productId"
          :number="(dataVideo.review || {}).count"
        />
        <SocialButtons @shareclick="onClickShare" />
        <div class="tabs-wrapp flex mid space-between pt-30">
          <ul class="nav nav-tabs">
            <li :class="{ active: tab == 'outline' }" class="cursor-pointer">
              <a class="tab__a" @click="onChangeTab('outline')">
                {{ $t('3') }}
              </a>
            </li>
            <li
              :class="{ active: tab == 'userIntroduction' }"
              class="cursor-pointer"
            >
              <a class="tab__a" @click="onChangeTab('userIntroduction')">
                {{ $t('4') }}
              </a>
            </li>
          </ul>
          <div
            class="commu-tab cursor-pointer flex mid pr-5 mb-5"
            @click="onChangeTab('community')"
          >
            <Comments />
            <span>{{ $t('5') }}&nbsp;({{ commuTotal }})</span>
          </div>
        </div>
        <div class="vid-d__intro" v-if="tab != 'community'">
          <p
            v-html="dataVideo[tab]"
            class="outline-IbBKtrbLMt pre-wrap p-40"
            v-if="tab == 'outline'"
          ></p>
          <div v-if="tab == 'userIntroduction'" class="user-intro mt-20 mb-30">
            <div class="flex pt-5 pb-5 pl-20 pr-20 border-bottom">
              <div class="title">{{ $t('8') }}</div>
              <div>{{ dataVideo.userName || $t('11') }}</div>
            </div>
            <div class="flex border-bottom pt-5 pb-5 pl-20 pr-20">
              <div class="title">{{ $t('9') }}</div>
              <div class="pre-wrap">{{ dataVideo.userIntroduction }}</div>
            </div>
            <div class="flex pt-5 pb-5 pl-20 pr-20">
              <div class="title">{{ $t('10') }}</div>
              <div>{{ dataVideo.userUrl || '-' }}</div>
            </div>
          </div>
        </div>
        <div v-else class="mb-30 mt-20">
          <Community
            :get-data="getCommunityData"
            :id="dataVideo.productId"
            @posted="onPosted"
            @update-total="onUpdateTotal"
            @delete-reply="onDeleteReply"
          />
        </div>
        <div class="vid-s" v-if="others.length">
          <p class="mb-20">{{ $t('6') }}</p>
          <div class="owl-carousel flex" ref="slider1">
            <VideoHorizontal01
              v-for="(item, index) in others"
              :key="'a' + item.id + index"
              :item="item"
            />
          </div>
        </div>
        <div class="vid-s" v-if="recommend.length">
          <p class="mb-20">{{ $t('7') }}</p>
          <div class="owl-carousel flex" ref="slider2">
            <VideoHorizontal01
              v-for="(item, index) in recommend"
              :key="'b' + item.id + index"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="vid-d__cart">
        <div id="sticky-cart" class="">
          <div class="sticky-container">
            <div class="mr-30 w-670">
              <div
                ref="title"
                class="title-SA46U wrap-text"
                :title="dataVideo.title"
                v-html="dataVideo.title"
              ></div>
            </div>
            <div>
              <Payment03 />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoHorizontal01 from '@/components/video/VideoHorizontal01.vue'
import SocialButtons from '@/components/navi/SocialButtons.vue'
import Comments from '@@/../components/icons/Comments.vue'
import { youtubeParser, gotoLogin } from '@/utils/client/common'
import i18n from '@@/lang/desktop/video-id.json'
import Community from './VideoCommunity.vue'
import Payment03 from '@/components/payment-v1/type03/Payment03.vue'
import Rate from '@@/../components/product/Rate.vue'

const left = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #333;" xml:space="preserve"><g><g id="keyboard-arrow-left"><polygon points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306"/></g></g></svg>`,
  right = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #333;" xml:space="preserve"><g><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/></g></g></svg>`

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  props: {
    dataVideo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    others: {
      type: Array,
      default: () => {
        return []
      },
    },
    recommend: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  components: {
    VideoHorizontal01,
    SocialButtons,
    Comments,
    Community,
    Payment03,
    Rate,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      tab: 'outline',
      commuTotal: this.dataVideo.commuTotal || 0,
      communities: null,
    }
  },
  created() {
    this.dataTab = this.dataVideo.outline
  },
  mounted() {
    document.addEventListener('scroll', this.onScroll)
    this.$nextTick(() => {
      let config = {
        slideTransition: 'ease',
        autoplayTimeout: 8e3,
        loop: true,
        autoplay: true,
        nav: true,
        dots: false,
        center: true,
        lazyLoad: true,
        smartSpeed: 500,
        margin: 15,
        autoplayHoverPause: true,
        autoWidth: true,
        item: 3,
        navText: [left, right],
      }
      $(this.$refs.slider1).owlCarousel(config)
      $(this.$refs.slider2).owlCarousel(config)
    })
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    checkOffScreen(rect, offset = 0) {
      return (
        rect.x + rect.width < 0 ||
        rect.y + rect.height < offset ||
        (rect.x > window.innerWidth || rect.y > window.innerHeight + offset)
      )
    },
    onScroll() {
      let el = document.getElementsByClassName('infobar-t')[0],
        title = document.getElementsByClassName('video-title')[0],
        videoCon = document.getElementsByClassName('vid-d__main')[0],
        rect = el.getBoundingClientRect(),
        rect1 = title.getBoundingClientRect(),
        rect2 = videoCon.getBoundingClientRect(),
        offScreen = this.checkOffScreen(rect),
        titleOffScreen = this.checkOffScreen(rect1, 70),
        mainOffscreen = this.checkOffScreen(rect2, 400)
      $(this.$refs.title).css('display', titleOffScreen ? 'block' : 'none')
      if (offScreen) {
        document
          .getElementById('sticky-cart')
          .classList[mainOffscreen ? 'remove' : 'add']('sticky')
      } else {
        document.getElementById('sticky-cart').classList.remove('sticky')
      }
    },
    youtubeParser,
    onChangeTab(_tab) {
      this.tab = _tab
    },
    getCommunityData(cb) {
      if (!this.communities) {
        this.GoGoHTTP.get(
          `/api/v3/surface/communities?productId=${this.dataVideo.productId}`
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
    onUpdateTotal(number) {
      this.commuTotal = number
    },
    onDeleteReply() {
      this.commuTotal = this.commuTotal - 1
    },
    onPosted() {
      this.commuTotal = this.commuTotal + 1
    },
    onClickShare() {
      let url = `/mypage/affiliate/tag/product/${this.dataVideo.productId}`
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${url}`)
        return
      }
      location.href = url
    },
  },
}
</script>

<style lang="scss" scoped>
.vid-d--p {
  background: #323232;
  width: 100%;
  height: 360px;
  top: 0;
  left: 0;
  z-index: 0;
}
.vid-d__main {
  padding: 30px 0 50px;
  .vid-d__i {
    width: 670px;
    iframe {
      height: 375px;
    }
    img {
      height: 375px;
    }
    .rating /deep/ {
      align-items: center;
      margin-top: -8px;
      .star {
        font-size: 25px;
      }
      .rate-num {
        font-size: 18px;
      }
    }
  }
  .video-title {
    font-size: 30px;
    line-height: 40px;
    font-weight: bold;
  }
  .video-dec {
    font-size: 14px;
    line-height: 21px;
    word-break: break-word;
  }
  .tabs-wrapp {
    margin-top: 30px;
    border-top: 1px solid #d9d9d8;
    border-bottom: 1px solid #ddd;
    .nav {
      margin-bottom: -1px;
    }
  }
  .nav > li {
    > a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 170px;
      height: 50px;
      border-radius: 0;
      font-size: 14px;
      color: #666;
      padding: 0;
      margin-right: -1px;
      border: 1px solid #ddd;
      &:hover {
        background: #fff;
      }
    }
    &.active > a {
      font-weight: bold;
      border-bottom: 1px solid white;
    }
    &.active > a,
    a:hover {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: url('/img/assets/pc/salons/title-bg.jpg') repeat;
      }
    }
  }
  .commu-tab {
    color: #666;
    align-self: flex-end;
    .icon-cls {
      color: #b3b3b3;
      width: 20px;
      height: 20px;
    }
    &:hover > span {
      text-decoration: underline;
    }
  }
}
.vid-s {
  padding: 24px 39px 0 39px;
  background: #f2f0ed;
  margin-bottom: 20px;
  height: 360px;
  > p {
    color: #4c4237;
    font-size: 22px;
  }
}
.payment-yZtzqpG /deep/ {
  color: #666;
  border-top: 3px solid #f60;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  .main-info {
    padding: 20px 15px 35px;
    .btn.orange {
      margin-top: 5px;
    }
  }
  .title01 ~ b {
    font-weight: normal;
  }
  .title ~ img {
    height: 30px;
  }
}
.vid-s /deep/ {
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      position: absolute;
      top: -40px;
      font-size: 15px !important;
      span {
        color: #333;
      }
    }
    &.owl-prev {
      left: inherit;
      right: 35px;
    }
    &.owl-next {
      right: 0;
    }
  }
  .owl-carousel {
    width: inherit;
  }
}
.vid-d__cmt {
  right: 0;
  bottom: 2px;
}
.vid-d__intro {
  .user-intro {
    color: #333;
    .title {
      font-weight: bold;
      width: 120px;
      flex: 0 0 120px;
    }
    .border-bottom {
      border-bottom: 1px solid #ddd;
    }
  }
}
/deep/.vid-i {
  height: 240px;
}
.sec__h01 {
  margin-top: 34px;
}
.vid-d {
  background: #f2f0ed;
}
.vid-d__cart {
  width: 300px;
  background: #fff;
  height: 100%;
  border: none;
}
.pre-wrap {
  white-space: pre-line;
  word-break: break-word;
}
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #292929;
  width: 100%;
  height: 60px;
  padding-top: 25px;
  .sticky-container {
    display: flex;
    width: 1000px;
    margin: 0 auto;
    height: 0;
  }
  .title-SA46U {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
}
.w-670 {
  width: 670px;
}
#sticky-cart {
  .title-SA46U {
    display: none;
  }
}
</style>
