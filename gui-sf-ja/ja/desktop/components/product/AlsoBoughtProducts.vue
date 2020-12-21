<template>
  <LazyComp01 v-if="(products || []).length" :timeout="12e3" class="mt-25 pb-20" min-height="230px"
              @comp-ready="onSliderReady"
  >
    <div ref="slider" class="owl-carousel product-slider">
      <template v-for="(product, index) in products">
        <ProductVertical02
          v-if="product.typeId !== 1"
          :product="product"
          :key="'de3n45wd'+product.id"
          type="tools"
          :rank="enableRank ? index + 1 : null"
        >
          <img class="pos-abs owl-lazy" :data-src="'/img/products/' + product.id + '/small'" />
        </ProductVertical02>
        <SystemProductVert class="slide-detail" :size="[80, 80]"
                           :product="product" type="systemtrade" :key="'user-product-' + product.id"
                           :is-lz="true"
                           v-else
        />
      </template>
    </div>
  </LazyComp01>
</template>

<script>
import ProductVertical02 from '@/components/product/ProductVertical02.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  name: 'AlsoBoughtProducts',
  props: {
    products: {
      type: Array,
      default() {
        return []
      },
    },
    enableRank: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LazyComp01,
    ProductVertical02,
    SystemProductVert
  },
  methods: {
    onSliderReady() {
      let me = this,
        items = 7,
        isOver = (this.products || []).length > items
      me.$nextTick(() => {
        $(me.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: isOver,
          autoplay: true,
          items,
          nav: true,
          dots: false,
          margin: 29,
          lazyLoad: true,
          slideBy: items - 1,
          smartSpeed: 500,
          autoplayHoverPause: true,
          autoWidth: true,
        })
        if (!isOver) {
          // remove nav when products less than items
          me.enableNav()
          $('.owl-carousel').on('changed.owl.carousel', me.enableNav)
        }
      })
    },
    enableNav() {
      $(this.$refs.slider)
        .find('.owl-nav')
        .removeClass('disabled')
    },
  }
}
</script>

<style lang="scss" scoped>
div.slide-detail /deep/ {
  width: 102px;
  min-height: 220px;
  .product-name .gogo-link {
    font-size: 12px;
    color: #0344cc;
  }
  .gg-rating {
    letter-spacing: -1px;
    .rate-num {
      font-size: 11px;
    }
  }
}
</style>