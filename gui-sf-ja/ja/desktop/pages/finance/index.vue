<template>
  <div>
    <div class="w-full h-340">
      <no-ssr>
        <div ref="slider" class="owl-carousel" :class="{ 'w-1000': isHaveBanners}">
          <div v-for="(item, index) in topSliders" :key="'w12nwko' + index">
            <div v-if="item.content" v-html="item.content"></div>
            <a v-else-if="item.linkUrl" :href="item.linkUrl" class="co-black">
              <img :src="item.imageUrl" alt="" width="1000" height="340" />
            </a>
          </div>
        </div>
      </no-ssr>
    </div>
    <top-menu />
    <section class="w-1000 flex layout-col ">
      <span class="salon-btn bg-img1 mt-40 mb-30">{{ $t('15') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="obj in dataSalonAd" :data="obj" class="mb-30 mr-20" :key="'qsteF'+obj.id" />
      </div>
      <span class="salon-btn bg-img2 mt-20 mb-30">{{ $t('16') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="obj in dataSalonNonAd" :data="obj" class="mb-30 mr-20" :key="'qsteF'+obj.id" />
      </div>
      <span class="salon-btn bg-img3 mt-20 mb-30">{{ $t('17') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="obj in dataSchool" :data="obj" class="mb-30 mr-20" :is-navi="true" :key="'qsteF'+obj.id" />
      </div>
    </section>
    <section class="sec--full pos-rel">
      <div class="w-1000 flex layout-col mid">
        <div class="sec__tit--fi flex mid pl-20 pr-20 sec__tit--navi">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 100 100" class="i-calendar">
            <defs>
              <filter id="filter" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
                <feImage preserveAspectRatio="none" x="0" y="0" width="100" height="100" result="image" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB4MT0iNTAiIHkxPSIxMDAiIHgyPSI1MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZTQ5MTkiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYWU4YjJmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIi8+Cjwvc3ZnPgo=" />
                <feComposite result="composite" operator="in" in2="SourceGraphic" />
                <feBlend result="blend" in2="SourceGraphic" />
              </filter>
            </defs>
            <path id="NEWS.svg" class="cls-1" d="M90.937-.009H9.059A9.223,9.223,0,0,0,0,9.363V90.645A9.21,9.21,0,0,0,9.059,100H90.937A9.209,9.209,0,0,0,100,90.645V9.363A9.222,9.222,0,0,0,90.937-.009ZM63.967,10.152a4.1,4.1,0,1,1,8.2,0A4.1,4.1,0,1,1,63.967,10.152Zm13.672,0a4.1,4.1,0,1,1,8.2,0A4.1,4.1,0,1,1,77.639,10.152ZM90.624,90.139v0.184H9.372V19.348H90.624V90.139ZM20.48,44.942v0.031h3.093V40.285L23.6,36.45l5.414,8.524h2.629V30.024H28.55v4.665l-0.027,3.839-5.415-8.5H20.48V44.942h0Zm26.04-2.854H39.96V38.882h5.586V35.995H39.96V32.909H46.52V30.024H36.868V44.974H46.52V42.088Zm6.932,2.885h2.556l1.36-4.626L58.5,36.575l2.468,8.4h2.555L66.609,33.1l0.8-3.046H67.4l0.008-.031H64.182l-1.123,4.69-0.981,3.981-2.43-8.67H57.33l-1.309,4.669-1.15,4-2.056-8.668H50.276l-0.659-.01,0,0.01H49.588Zm21.281-2.763a6.218,6.218,0,0,1-1.8-.258,3.462,3.462,0,0,1-1.483-.923l-0.094-.1h0l-0.022-.023L69.31,43l0.116,0.12a5.788,5.788,0,0,0,2.363,1.551,9.227,9.227,0,0,0,2.922.429,7.154,7.154,0,0,0,2.124-.306,5.176,5.176,0,0,0,1.726-.888,4.179,4.179,0,0,0,1.149-1.446,4.5,4.5,0,0,0,.412-1.963,5.834,5.834,0,0,0-.265-1.821,3.226,3.226,0,0,0-.874-1.379,3.454,3.454,0,0,0-1.148-.775,7.029,7.029,0,0,0-1.65-.422L74.5,35.831a2.465,2.465,0,0,1-.718-0.19,1.878,1.878,0,0,1-.48-0.316,1.138,1.138,0,0,1-.267-0.427,1.538,1.538,0,0,1-.083-0.5,1.628,1.628,0,0,1,.479-1.183,2.056,2.056,0,0,1,1.524-.493,6.585,6.585,0,0,1,1.435.169,2.786,2.786,0,0,1,1.353.787L77.854,33.8l1.935-1.976,0.027-.028h0l0.022-.023-0.12-.12A5.529,5.529,0,0,0,77.648,30.3a7.821,7.821,0,0,0-2.617-.4,6.267,6.267,0,0,0-2.123.34,4.642,4.642,0,0,0-1.6.947,4.122,4.122,0,0,0-1.017,1.454,4.851,4.851,0,0,0-.349,1.864,3.73,3.73,0,0,0,2.245,3.8,6.31,6.31,0,0,0,1.65.452l1.69,0.269a3.971,3.971,0,0,1,.76.174,1.319,1.319,0,0,1,.42.27,1.486,1.486,0,0,1,.389,1.09,1.413,1.413,0,0,1-.568,1.215A3.022,3.022,0,0,1,74.733,42.211Zm4.674,11.156H53.569v2.959H79.408V53.4h0V53.367Zm0,7.681H53.569V64H79.408V61.079h0V61.047ZM53.6,68.725H53.569v2.957H75.436V68.727H53.6ZM20.588,53.366V78.292H47.046V53.366H20.588ZM42.964,71.746L27.132,57.56H42.985v8.61ZM40.79,74.1H24.65V59.6l9.174,8.22Z" />
          </svg>
          <span class="ml-5 mt-5">{{ $t('4') }}</span>
        </div>
        <div class="tit__line--fi w-full"></div>
        <p class="sec__desc--fi text-center mt-40 mb-30" v-html="$t('5')"></p>
        <div class="navi-h01__l--fi w-full flex">
          <navi-horizontal01 v-for="(obj, i) in dataNaviHorizontal01" :item="obj" class="mb-30 mr-20" :key="'qsteF'+i" :img-width="320" :img-height="240" />
        </div>
        <div class="navi-h02__l--fi w-full flex flex-wrap">
          <navi-horizontal02 v-for="(obj, i) in dataNaviHorizontal02" :item="obj" :key="'qsteF'+i" :img-width="117" :img-height="90" class="mb-15 mr-20" />
        </div>
        <a href="/finance/navi" class="mt-25 mb-80">
          <!--<a :href="fxonUrl('/navi')" class="mt-25 mb-80">-->
          <button class="btn-more--fi">{{ $t('13') }}</button>
        </a>
      </div>
    </section>
    <section class="w-1000 flex layout-col mid">
      <div class="sec__tit--fi flex mid pl-20 pr-20">
        <youtube />
        <span class="ml-5 mt-5">{{ $t('6') }}</span>
      </div>
      <div class="tit__line--fi w-full"></div>
      <p class="sec__desc--fi text-center mt-40 mb-30" v-html="$t('7')"></p>
      <div class="vids__l--fi flex" v-if="dataVideos.length">
        <div class="vids__h--fi mr-20">
          <div class="vids-h__i--featured flex pb-20">
            <iframe :src="youtubeParser(dataVideos[0].watchUrl)" frameborder="0" allowfullscreen></iframe>
            <a class="vids-h__info--featured ml-20 mr-20 no-underlying" :href="'/finance/videos/' + dataVideos[0].id">
              <div class="vids-h__tit mb-20">
                <strong>{{ dataVideos[0].title }}</strong>
              </div>
              <div class="vids-h__desc fs-12" v-html="dataVideos[0].content" v-wrap-lines="10"></div>
            </a>
          </div>
          <div class="vids-h__i-wrapper flex space-between pt-20">
            <a v-for="(item, idx) in dataVideos" :key="idx" v-if="idx > 0" :href="'/finance/videos/' + item.id" class="color-grey vids-h__i--normal">
              <img class="vids-h__img" :src="item.thumbnailUrl || getThumbnailYoutube(item.watchUrl)" alt="" />
              <div class="vids-h__info pt-5">
                <span>{{ $t('8', {date: formatTime(item.publishedDate, 8)}) }}</span>
              </div>
              <div v-wrap-lines="2">
                {{ item.title }}
              </div>
            </a>
          </div>
        </div>
        <div class="vids-v--fi pl-20">
          <p class="mb-0">{{ $t('9') }}</p>
          <a v-for="(item, idx) in dataNewVideos" :key="idx" :href="'/finance/videos/' + item.id" class="vids-v__i">
            <img :src="item.thumbnailUrl || getThumbnailYoutube(item.watchUrl)" alt="" />
            <span class="color-grey">{{ $t('12', {date: formatTime(item.publishedDate, 5)}) }}</span>
          </a>
        </div>
      </div>
      <a href="/finance/videos" class="mt-40 mb-80">
        <button class="btn-more--fi">{{ $t('10') }}</button>
      </a>
    </section>
    <svg width="0" height="0">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color="#ae8b2e" offset="0" />
          <stop stop-color="#5e4919" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import GraduationCap from '@@/../components/icons/GraduationCap.vue'
import Youtube from '@@/../components/icons/Youtube.vue'
import SalonHorizontal01 from '@/components/product/navi/SalonHorizontal01.vue'
import NaviHorizontal01 from '@/components/product/navi/NaviHorizontal01.vue'
import NaviHorizontal02 from '@/components/product/navi/NaviHorizontal02.vue'
import i18n from '@@/lang/desktop/finance-index.json'
import { youtubeParser, getThumbnailYoutube } from '@/utils/client/common'
import title from '@@/../common/pages'
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const obj = Object.assign(
  {
    components: {
      TopMenu,
      GraduationCap,
      Youtube,
      SalonHorizontal01,
      NaviHorizontal01,
      NaviHorizontal02,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      let sliderLeft
      if (process.browser) {
        sliderLeft = ($(window).width() - 1000) / 2
      }
      return {
        sliderLeft,
        titleChunk: this.$t('11'),
        isHaveBanners:
          (this.$store.state.advertisements.banners || {})[1] ||
          (this.$store.state.advertisements.banners || {})[2],
      }
    },
    computed: {
      topSliders() {
        return this.$store.state.advertisements.topSliders || []
      },
    },
    async asyncData({ app }) {
      let [
        dataSalonHorizontal01,
        dataNaviHorizontal01,
        dataNaviHorizontal02,
        dataVideos,
        dataNewVideos,
      ] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/salons', { params: { limit: 0 } }),
        app.GoGoHTTP.get(`/api/v3/surface/navi/pr`, {
          params: { limit: 3 },
        }),
        app.GoGoHTTP.get(`/api/v3/surface/navi/rank/new?isGetContent=1`, {
          params: { limit: 9 },
        }),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv', { params: { limit: 5 } }),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/new'),
      ]),
        dataSalonAd = [],
        dataSalonNonAd = [],
        dataSchool = []

      dataSalonHorizontal01.map( item => item.categoryId == 2 ? dataSalonNonAd.push(item) : !item.categoryId ? dataSchool.push(item) : dataSalonAd.push(item) )

      dataSchool.map(item => {
        item.company = ''
        item.id == 16211 ? item.id = 1072 : item.id = 1065
      })
      return {
        dataNaviHorizontal01,
        dataNaviHorizontal02,
        dataNewVideos,
        dataVideos,
        dataSalonAd,
        dataSalonNonAd,
        dataSchool,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance`,
          },
        ],
      }
    },
    mounted() {
      if (process.browser) {
        $(window).on('resize', this.scaleSlider)
      }
      this.$nextTick(() => {
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 4e3,
          autoplay: true,
          loop: true,
          nav: true,
          navigation: true,
          center: true,
          dots: false,
          smartSpeed: 500,
          autoplayHoverPause: true,
          autoWidth: true,
          items: 1,
        })
      })
    },
    methods: {
      getThumbnailYoutube,
      youtubeParser,
      scaleSlider() {
        this.sliderLeft = ($(window).width() - 1000) / 2
      },
      descriptionTemplate() {
        return this.$t('14')
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.h-340 {
  height: 340px;
}
.w-1000.owl-carousel {
  width: 1000px !important;
}
.owl-carousel /deep/ {
  width: 100%;
  .owl-nav button {
    background: #000 !important;
    opacity: 0.6;
    width: 43px;
    &:hover {
      opacity: 0.9;
    }
    &.owl-prev,
    &.owl-next {
      span {
        color: #d9d9da;
      }
    }
    &.owl-prev {
      left: 0;
      border-radius: 0 5px 5px 0;
    }
    &.owl-next {
      right: 0;
      border-radius: 5px 0 0 5px;
    }
  }
}
.i-calendar {
  width: 20px;
  height: auto;
}
.mb-80 {
  margin-bottom: 80px;
}
.color-grey {
  color: #2d2d2d;
}
.sec__tit--fi {
  margin-top: 80px;
  background: #fff;
  &.sec__tit--navi {
    background: #f3f0ee;
  }
  i.icon-cls {
    width: 32px;
    height: 32px;
    /deep/ svg path {
      fill: url(#rg);
    }
  }
  span {
    font-size: 20px;
    color: #a6937c;
  }
}
.tit__line--fi {
  z-index: -1;
  height: 1px;
  background: #a6937c;
  margin-top: -15px;
  color: #666;
}
.sec__desc--fi {
  font-size: 17px;
  line-height: 28px;
  color: #666;
}
.sal-h01__l--fi {
  > a:nth-child(3n) {
    margin-right: 0;
  }
}
.btn-more--fi {
  width: 320px;
  height: 40px;
  line-height: 36px;
  background: transparent;
  border: 2px solid #b2b2b2;
  color: #666;
  outline: none;
  &:hover {
    background: #b2b2b2;
    color: #fff;
  }
  &:focus {
    outline: none;
  }
}
.sec--full {
  background: #f3f0ee;
  z-index: 0;
}
.navi-h01__l--fi,
.navi-h02__l--fi {
  > div:nth-child(3n) {
    margin-right: 0;
  }
}
.vids__h--fi {
  width: 790px;
  .vids-h__i--featured {
    border-bottom: 1px solid #b2b2b2;
    iframe {
      width: 490px;
      height: 275px;
    }
    .vids-h__info--featured {
      width: 246px;
      color: #2d2d2d;
      .vids-h__tit {
        font-size: 14px;
      }
      .vids-h__desc {
        line-height: 20px;
      }
    }
  }
  .vids-h__i--normal {
    width: 190px;
    img {
      width: 190px;
      height: 107px;
      border: 1px solid #d9d9d9;
    }
    .vids-h__info {
      font-size: 11px;
      padding-bottom: 2px;
    }
  }
}
.vids-v--fi {
  width: 190px;
  border-left: 1px solid #b2b2b2;
  > p {
    font-size: 15px;
  }
  .vids-v__i {
    display: block;
    width: 170px;
    margin-top: 1px;
    img {
      width: 170px;
      height: 96px;
    }
    span {
      font-size: 11px;
    }
  }
}
/deep/ .slider__nav-arrow--prev {
  z-index: 999;
  position: absolute;
  left: 0;
  height: 80px;
  background-color: #000;
  opacity: 0.6;
  border-radius: 0 5px 5px 0;
}
/deep/ .slider__nav-arrow--next {
  z-index: 999;
  position: absolute;
  right: 0;
  height: 80px;
  background-color: #000;
  opacity: 0.6;
  border-radius: 5px 0 0 5px;
}
.cls-1 {
  fill: #666;
  fill-rule: evenodd;
  filter: url(#filter);
}
.salon-btn {
  font-size: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 320px;
  height: 40px;
  border-radius: 20px;
}
.bg-img1 {
  background-image: linear-gradient(-90deg, #c29964, #9b7543, #c29964);
}
.bg-img2 {
  background-image: linear-gradient(-90deg, #be0537, #7d0022, #be0538);
}
.bg-img3 {
  background-image: linear-gradient(-90deg, #2c99ec, #0068b7, #2c99ec);
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
