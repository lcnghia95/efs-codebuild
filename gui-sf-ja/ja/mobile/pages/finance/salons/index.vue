<template>
  <div class="w-full mb-60">
    <div ref="slider" class="owl-carousel slider-preload flex" style="width: 100vw; overflow: hidden;">
      <div v-for="(item, index) in topSliders" :key="'w12nwko' + index">
        <div v-if="item.content" v-html="item.content"></div>
        <a v-else-if="item.linkUrl" :href="item.linkUrl" class="co-black">
          <img :src="item.imageUrl" alt="" class="owl-img" />
        </a>
      </div>
    </div>
    <TopMenu />
    <span class="salon-btn bg-img1 mt-30 m-l-r-auto">{{ $t('2') }}</span>
    <div class="w-full flex flex-wrap">
      <SalonHorizontal01
        v-for="obj in dataSalonAd"
        :data="obj"
        class="mt-30"
        :key="'qsteF' + obj.id"
      />
    </div>
    <span class="salon-btn bg-img2 mt-30 m-l-r-auto">{{ $t('3') }}</span>
    <div class="w-full flex flex-wrap">
      <SalonHorizontal01
        v-for="obj in dataSalonNonAd"
        :data="obj"
        class="mt-30"
        :key="'qsteF' + obj.id"
      />
    </div>
    <span class="salon-btn bg-img3 mt-30 m-l-r-auto">{{ $t('4') }}</span>
    <div class="w-full flex flex-wrap">
      <SalonHorizontal01
        v-for="obj in dataSchool"
        :data="obj"
        class="mt-30"
        :key="'qsteF' + obj.id"
        :is-navi="true"
      />
    </div>
  </div>
</template>
<script>
import TopMenu from '@/components/finance/TopMenu.vue'
import SalonHorizontal01 from '@/components/finance/salons/SalonHorizontal01.vue'
import i18n from '@@/lang/mobile/salon-index.json'
import title from '@@/../common/pages'
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const obj = Object.assign(
  {
    i18n: {
      messages: i18n
    },
    components: {
      TopMenu,
      SalonHorizontal01
    },
    methods: {
      descriptionTemplate() {
        return this.$t('5')
      }
    },
    data() {
      return {
        titleChunk: this.$t('6')
      }
    },
    computed: {
      topSliders() {
        return this.$store.state.advertisements.topSliders || []
      },
    },
    mounted() {
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
    async asyncData({ app }) {
      let dataSalonHorizontal02 = await app.GoGoHTTP.get(
          '/api/v3/surface/salons',
          { params: { limit: 0 } }
        ),
        dataSalonAd = [],
        dataSalonNonAd = [],
        dataSchool = []
      dataSalonHorizontal02.map(item =>
        item.categoryId == 2
          ? dataSalonNonAd.push(item)
          : !item.categoryId
          ? dataSchool.push(item)
          : dataSalonAd.push(item)
      )
      dataSchool.map(item => {
        item.company = ''
        item.id == 16211 ? (item.id = 1072) : (item.id = 1065)
      })
      return {
        dataSalonAd,
        dataSalonNonAd,
        dataSchool,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/finance/salons'
          }
        ]
      }
    }
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.slider-preload {
  min-height: 100px;
  height: calc(100vw * 0.34);
  max-height: calc(100vw * 0.34);
}
.salon-btn {
  font-size: 15px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 30px;
  border-radius: 20px;
}
.m-l-r-auto {
  margin-left: auto;
  margin-right: auto;
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
.owl-carousel {
  width: 100%;
  margin: 0;
  /deep/ .owl-nav button {
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
      display: none;
    }
    &.owl-next {
      display: none;
    }
  }
  .owl-img {
    width: 100vw;
  }
}
</style>