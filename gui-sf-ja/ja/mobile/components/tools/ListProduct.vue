<template>
  <LazyComp01 :timeout="9e3"
              class="mt-25 pb-20"
              v-if="products.length"
              min-height="230px"
              @comp-ready="onSliderReady">
    <div ref="slider" class="owl-carousel">
      <ProductVertical01 v-for="(item, index) in products"
                         class="top-product"
                         :product="item"
                         type="tools"
                         :key="'dw82k' + index"
                         :rank="enableRank ? index + 1 : null" />
    </div>
  </LazyComp01>
</template>

<script>
import ProductVertical01 from '@/components/product/ProductVertical01.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  components: { ProductVertical01, LazyComp01 },
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
  methods: {
    onSliderReady() {
      let me = this
      this.$nextTick(() => {
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: (me.products || []).length > 3,
          autoplay: true,
          nav: true,
          dots: false,
          lazyLoad: true,
          smartSpeed: 500,
          margin: 5,
          autoplayHoverPause: true,
          autoWidth: true,
          responsive: {
            0: {
              items: 3,
              slideBy: 3,
            },
            400: {
              items: 3,
              slideBy: 3,
              margin: 10,
            },
            500: {
              items: 5,
              slideBy: 5,
            },
          },
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
div.product-JX0x5 /deep/ {
  padding: 11px;
  .product-name {
    color: #434a54;
  }
  .gg-rating {
    letter-spacing: -1px;
  }
  .rate-num {
    margin-top: 1px;
    margin-left: 1px;
    font-size: 11px;
  }
}
/deep/ div.nav-arrow {
  flex: 0 0 40px;
  width: 40px;
}
// adjust GUI for slider
@media only screen and (max-width: 320px) {
  div.product-JX0x5 /deep/ {
    padding: 2px;
  }
  .owl-carousel /deep/ {
    .owl-nav button {
      &.owl-prev {
        left: -6vw;
      }
      &.owl-next {
        right: -6vw;
      }
    }
  }
}
// adjust GUI for slider
.owl-carousel /deep/ {
  width: calc(100% - 45px);
  .owl-nav button {
    &.owl-prev {
      left: -6vw;
    }
    &.owl-next {
      right: -6vw;
    }
  }
}
</style>

<docs>
  ```vue
<template>
  <RelatedProducts :products="products"/>
</template>
<script>
export default {
  data() {
    return {
      products: [
        {
          id: 10270,
          name: "無料セット20点++",
          prices: [
            {
              price: 0
            }
          ],
          detailUrl: "/tools/ebooks/10270"
        },
        {
          id: 10895,
          name: "無料セット27点",
          prices: [
            {
              price: 0
            }
          ],
          detailUrl: "/tools/ebooks/10895"
        },
        {
          id: 31,
          name: "1000 Onポイント",
          prices: [
            {
              price: 1000
            }
          ],
          detailUrl: "/tools/ebooks/31"
        },
        {
          id: 30,
          name: "10000Onポイント",
          prices: [
            {
              price: 10000
            }
          ],
          detailUrl: "/tools/ebooks/30"
        },
        {
          id: 13875,
          name: "【優待版】上がり３ハロン複利機能付きのプレミアム版",
          prices: [
            {
              price: 24000
            }
          ],
          review: {
            stars: 4,
            count: 2
          },
          detailUrl: "/tools/ebooks/13875"
        },
        {
          id: 760,
          name: "こつこつ稼ぐシステム『JIN』",
          prices: [
            {
              price: 20572
            }
          ],
          detailUrl: "/tools/ebooks/760"
        },
        {
          id: 32,
          name: "2000 Onポイント",
          prices: [
            {
              price: 2000
            }
          ],
          detailUrl: "/tools/ebooks/32"
        },
        {
          id: 3,
          name: "A.I ライブチャート",
          prices: [
            {
              price: 0
            }
          ],
          detailUrl: "/tools/ebooks/3"
        },
        {
          id: 883,
          name: "新銀ちゃんの日経225",
          prices: [
            {
              price: 0
            }
          ],
          detailUrl: "/tools/ebooks/883"
        },
        {
          id: 14776,
          name: "【追加ライセンス版】Beatrice DELTA2",
          prices: [
            {
              price: 13800
            }
          ],
          detailUrl: "/tools/ebooks/14776"
        },
        {
          id: 13734,
          name: "【優待版３】オンリーワン（スタンダート）",
          prices: [
            {
              price: 35000
            }
          ],
          detailUrl: "/tools/ebooks/13734"
        },
        {
          id: 37,
          name: "5000 Onポイント",
          prices: [
            {
              price: 5000
            }
          ],
          detailUrl: "/tools/ebooks/37"
        },
        {
          id: 13883,
          name: "【優待版】一本勝ち",
          prices: [
            {
              price: 50000
            }
          ],
          detailUrl: "/tools/ebooks/13883"
        },
        {
          id: 36,
          name: "3000Onポイント",
          prices: [
            {
              price: 3000
            }
          ],
          detailUrl: "/tools/ebooks/36"
        },
        {
          id: 11055,
          name: "【Revolution × EA_final_max_EDセット品】",
          prices: [
            {
              price: 52800
            }
          ],
          detailUrl: "/tools/ebooks/11055"
        },
        {
          id: 6708,
          name: "keikana Line ゴゴジャン用簡易バージョン基礎資料",
          prices: [
            {
              price: 5000
            }
          ],
          review: {
            stars: 3,
            count: 1
          },
          detailUrl: "/tools/ebooks/6708"
        },
        {
          id: 13885,
          name: "【優待版】一本勝ち（スタンダード）",
          prices: [
            {
              price: 35000
            }
          ],
          detailUrl: "/tools/ebooks/13885"
        },
        {
          id: 13065,
          name: "【Revolution × ED_limited】セット品",
          prices: [
            {
              price: 49800
            }
          ],
          detailUrl: "/tools/ebooks/13065"
        },
        {
          id: 10664,
          name: "Ask_Ultimate_影武者/MAX順張り・逆張り極め7点セット",
          prices: [
            {
              price: 34600,
              discountPrice: 29600
            }
          ],
          review: {
            stars: 5,
            count: 5
          },
          detailUrl: "/tools/ebooks/10664"
        },
        {
          id: 1335,
          name: "夢の途中",
          prices: [
            {
              price: 20572
            }
          ],
          detailUrl: "/tools/ebooks/1335"
        }
      ]
    };
  }
};
</script>
  ```
</docs>
