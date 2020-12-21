<template>
  <LazyComp01 v-if="(products || []).length" :timeout="12e3" class="mt-25 pb-20" min-height="230px" @comp-ready="onSliderReady">
    <div ref="slider" class="owl-carousel product-slider">
      <ProductVertical v-for="(item, index) in products"
                       :product="item"
                       :key="'de3n45wd'+item.id"
                       type="tools"
                       :rank="enableRank ? index + 1 : null">
        <img class="pos-abs owl-lazy" :data-src="'/img/products/' + item.id + '/small'">
      </ProductVertical>
    </div>
  </LazyComp01>
</template>

<script>
import ProductVertical from '@/components/product/ProductVertical02.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  components: { ProductVertical, LazyComp01 },
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
  },
}
</script>

<style lang="scss" scoped>
/deep/ div.nav-arrow {
  flex: 0 0 40px;
  width: 40px;
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
