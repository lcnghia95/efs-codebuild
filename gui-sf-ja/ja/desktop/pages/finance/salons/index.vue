<template>
  <div>
    <div style="min-height: 340px;">
      <no-ssr>
        <div ref="slider" class="owl-carousel slider-preload">
          <div v-for="(item, index) in topSliders" :key="'w12nwko' + index">
            <div v-if="item.content" v-html="item.content"></div>
            <a v-else-if="item.imageUrl" :href="item.linkUrl" class="co-black">
              <img :src="item.imageUrl" alt="" width="1000" height="340" />
            </a>
          </div>
        </div>
      </no-ssr>
    </div>
    <TopMenu />
    <div class="w-1000 flex layout-col ">
      <span class="salon-btn bg-img1 mt-40 mb-30">{{ $t('3') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="(obj, i) in dataSalonAd" :data="obj" class="mb-30 mr-20" :key="'qsteF'+i" />
      </div>
      <span class="salon-btn bg-img2 mt-20 mb-30">{{ $t('4') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="(obj, i) in dataSalonNonAd" :data="obj" class="mb-30 mr-20" :key="'qsteF'+i" />
      </div>
      <span class="salon-btn bg-img3 mt-20 mb-30">{{ $t('5') }}</span>
      <div class="sal-h01__l--fi w-full flex flex-wrap">
        <SalonHorizontal01 v-for="(obj, i) in dataSchool" :data="obj" :is-navi="true" class="mb-30 mr-20" :key="'qsteF'+i" />
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import GraduationCap from '@@/../components/icons/GraduationCap.vue'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Youtube from '@@/../components/icons/Youtube.vue'
import SalonHorizontal01 from '@/components/product/navi/SalonHorizontal01.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/salon-index.json'
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
      CalendarAlt,
      Youtube,
      SalonHorizontal01,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
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
    methods: {
      descriptionTemplate() {
        return this.$t('2')
      },
    },
    async asyncData({ app }) {
      let dataSalonHorizontal02 = await app.GoGoHTTP.get(
            '/api/v3/surface/salons',
            { params: { limit: 0 } }
            ),
            dataSalonAd = [],
            dataSalonNonAd = [],
            dataSchool = []
      dataSalonHorizontal02.map( item => item.categoryId==2 ? dataSalonNonAd.push(item) : !item.categoryId ? dataSchool.push(item) : dataSalonAd.push(item) )
      dataSchool.map(item => {
        item.company = ''
        item.id == 16211 ? item.id = 1072 : item.id = 1065
      })
      return {
        dataSalonAd,
        dataSalonNonAd,
        dataSchool,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/salons`,
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
.slider-preload {
  height: 340px;
}
.sal-h01__l--fs {
  > a:nth-child(3n) {
    margin-right: 0;
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
.sal-h01__l--fi {
  > a:nth-child(3n) {
    margin-right: 0;
  }
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
/deep/ .co-9b7543 {
  display: none;
}
/deep/ .co-7d0022 {
  display: none;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>