<template>
  <div class="w-full">
    <div class="banner-ctn">
      <img src="/img/assets/mobile/finance/top.jpg" alt="" />
    </div>
    <TopMenu />
    <div class="p-10">
      <!-- salons -->
      <div class="text-center w-full mb-20 finance-tt-line">
        <span class="finance-title inline-flex bg-white">
          <GraduationCap class="salon-icon" />
          {{ $t(1) }}
        </span>
      </div>
      <div class="text-center w-full mt-30 mb-20" style="font-size: 0.9em;" v-html="$t(5)"></div>
      <div ref="salons" class="owl-carousel owl-theme" style="height: 310px; overflow: hidden;">
        <SalonHorizontal01 v-for="obj in salons"
                           :data="obj"
                           :key="'salons'+obj.id"
        >
          <img class="owl-lazy" :data-src="obj.img" alt="" />
        </SalonHorizontal01>
      </div>
      <a class="show-more" href="/finance/salons">{{ $t(3) }}</a>
      <!-- navi -->
      <div class="text-center w-full mb-20 finance-tt-line">
        <span class="finance-title inline-flex bg-white">
          <NaviIcon class="navi-icon" />
          {{ $t(4) }}
        </span>
      </div>
      <div class="text-center w-full mt-30 mb-20" style="font-size: 0.9em;" v-html="$t(5)"></div>
      <div ref="navi" class="owl-carousel owl-theme">
        <NaviHorizontal01 v-for="obj in navi"
                          :item="obj"
                          :key="'navi'+obj.id"
        >
          <img class="owl-lazy" :data-src="'/img/articles/' + obj.id" alt="" />
        </NaviHorizontal01>
      </div>
      <a class="show-more" href="/finance/navi">{{ $t(3) }}</a>
      <!-- emagazine -->
      <div class="text-center w-full mb-20 finance-tt-line">
        <span class="finance-title inline-flex bg-white">
          <File class="emzine-icon" />
          {{ $t(13) }}
        </span>
      </div>
      <div class="text-center w-full mt-30 mb-20" style="font-size: 0.9em;" v-html="$t(12)"></div>
      <div ref="emagazine" class="owl-carousel owl-theme">
        <EmagazineHorizontal01 v-for="obj in emagazine"
                               :data="obj"
                               :key="'emagazine'+obj.id"
        />
      </div>
      <a class="show-more" href="/finance/mailmagazine">{{ $t(3) }}</a>
      <!-- ggtv -->
      <div class="text-center w-full mb-20 finance-tt-line">
        <span class="finance-title inline-flex bg-white">
          <Youtube class="youtube-icon" />
          {{ $t(10) }}
        </span>
      </div>
      <div class="text-center w-full mt-30 mb-20" style="font-size: 0.9em;" v-html="$t(7)"></div>
      <div ref="ggtv" class="owl-carousel owl-theme">
        <VideoHorizontal01 v-for="obj in ggtv"
                           :data="obj"
                           :key="'ggtv'+obj.id"
        >
          <img class="owl-lazy" :data-src="obj.thumbnailUrl" alt="" />
        </VideoHorizontal01>
      </div>
      <a class="show-more" href="/finance/videos">{{ $t(3) }}</a>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import TopMenu from '@/components/finance/TopMenu.vue'
import GraduationCap from '@@/../components/icons/GraduationCap.vue'
import NaviIcon from '@@/../components/icons/NaviIcon.vue'
import File from '@@/../components/icons/File.vue'
import Youtube from '@@/../components/icons/Youtube.vue'
import i18n from '@@/lang/mobile/finance-index.json'
import SalonHorizontal01 from '@/components/finance/index/SalonHorizontal01.vue'
import EmagazineHorizontal01 from '@/components/finance/index/EmagazineHorizontal01.vue'
import NaviHorizontal01 from '@/components/finance/index/NaviHorizontal01.vue'
import VideoHorizontal01 from '@/components/finance/index/VideoHorizontal01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const obj = Object.assign({
  components: {
    TopMenu,
    SalonHorizontal01,
    EmagazineHorizontal01,
    NaviHorizontal01,
    VideoHorizontal01,
    GraduationCap,
    NaviIcon,
    File,
    Youtube,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      titleChunk: this.$t('title'),
    }
  },
  mounted() {
    if (process.browser) {
      $(window).on('resize', this.scaleSlider)
    }
    this.$nextTick(() => {
      ['salons', 'navi', 'emagazine', 'ggtv'].forEach(item => {
        $(this.$refs[item]).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          autoplay: true,
          loop: true,
          navigation: true,
          lazyLoad: true,
          center: true,
          dots: true,
          smartSpeed: 500,
          items: 1,
        })
      })
    })
  },
  async asyncData({app}) {
    let [
          salons, 
          navi,
          emagazine,
          ggtv,
        ] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/salons', { params: { limit: 0 } }),
          app.GoGoHTTP.get('/api/v3/surface/navi/rank/new', {params: { limit: 5 } }),
          app.GoGoHTTP.get('/api/v3/surface/mailmagazine', {params: { limit: 5 } }),
          app.GoGoHTTP.get('/api/v3/surface/ggjtv', {params: { limit: 5 } }),
        ])
    return  {
      salons, 
      navi,
      emagazine,
      ggtv,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('des')
    },
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
.banner-ctn {
  min-height: 65px;
  width: 100%;
  img {
    width: 100%;
    height: auto;
  }
}
.finance-tt-line {
  border-bottom: 1px solid #b28a57;
  height: 50px;
}
.finance-title {
  line-height: 100px;
  font-size: 24px;
  color: #b28a57;
  border-color: #b28a57;
  padding: 0 15px;
  /deep/ .icon-cls {
    height: 73px;
    width: 55px;
    svg {
      height: 94px;
    }
    &.salon-icon {
      width: 43px;
      svg {
        height: 95px;
      }
    }
    &.navi-icon {
      width: 30px;
      margin-right: 3px;
      svg {
        height: 95px;
      }
    }
    &.emzine-icon {
      width: 33px;
      margin-right: 3px;
      svg {
        height: 95px;
      }
    }
    &.youtube-icon {
      width: 43px;
      margin-right: 3px;
      svg {
        height: 95px;
      }
    }
  }
}
.salon-item {
  .img-ctn {
    width: 100%;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.show-more {
  height: 30px;
  width: 20vw;
  min-width: 140px;
  border: 1px solid #b28a57;
  border-radius: 15px;
  margin: 20px auto 40px auto;
  line-height: 30px;
  color: #b28a57;
  text-align: center;
  transition: all 0.3s;
  display: block;
  text-decoration: none;
  &:active {
    background: #b28a57;
    color: #fff;
  }
}
/deep/ .owl-carousel {
  width: 100%;
  min-height: 150px;
  .owl-item {
    height: 100%;
  }
  .owl-dot {
    outline: none;
    &:hover span {
      background: #d6d6d6;
    }
  }
  .owl-dot.active {
    outline: none;
    &:hover span {
      background: #869791;
    }
  }
}
</style>