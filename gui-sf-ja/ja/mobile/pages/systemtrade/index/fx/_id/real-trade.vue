<template>
  <div>
    <div class="review-title pt-10 pb-10 pl-15">
      <strong>{{ devWidgetUrls.length > 0 || buyerWidgetUrls.length > 0 ? productInfo.name : $t('1') }}</strong>
    </div>
    <div class="product flex layout-col">
      <div class="product-info p-15">
        <div class="flex layout-row">
          <a :href="productInfo.detailUrl">
            <ImgWrapper class="s-65 mr-5" :src="`/img/products/${productInfo.id}/small`" />
          </a>
          <div class="info">
            <Rate
              :stars="productInfo.reviewStars"
              :number="productInfo.reviewCount"
            />
            <div class="name" ref="productInfo">
              <a :href="productInfo.detailUrl" class="no-underlying">{{ productInfo.name }}</a>
            </div>
            <span class="product-updated">{{ formatTime(productInfo.updatedAt, 6) }}</span>
          </div>
        </div>
      </div>
      <div class="dev-widget p-15" v-if="devWidgetUrls.length > 0">
        <iframe scrolling="no" :src="devWidgetUrls[0].widgetUrl" frameborder="0" width="100%" height="390" class="gg-hide"></iframe>
      </div>
      <div class="flex mid fixed-cart layout-row w-full" ref="cartFixed" v-show="false">
        <ImgWrapper class="s-40 mr-5" :src="`/img/products/${productInfo.id}/small`" />
        <div class="product-name-price">
          <div class="wrap-text">{{ productInfo.name }}</div>
          <span style="color: red;">
            <span v-html="$t('14', {price: formatNumber(productInfo.cartInfo.price)})"></span>
            <div style="display: inline-block;">{{ $t('16') }}</div>
          </span>
        </div>
        <button class="btn-orange" @click="addToCart">
          <div class="flex mid center w-full">
            <Cart class="mr-10" />
            <span class="ver-mid">{{ $t('13') }}</span>
          </div>
        </button>
      </div>
    </div>
    <div class="review-title pt-10 pb-10 pl-15" id="#buyer-widgets" v-if="buyerTotalWidget > 0">
      <strong>{{ $t('17') }}</strong>
    </div>
    <section class="flex layout-col p-15" v-if="buyerTotalWidget > 0">
      <div :key="index" v-for="(widget, index) in buyerWidgetUrls" class="buyer-widget-item">
        <iframe scrolling="no" :src="widget.widgetUrl" frameborder="0" width="100%" height="390" class="gg-hide"></iframe>
      </div>
      <div class="text-center mt-30 widget-paging" v-if="buyerTotalWidget > 3">
        <paging :cur-page="currentPage"
                :total="buyerTotalWidget"
                :from="1"
                :to="toPage || 1"
                :has-scroll="true"
                :scroll-offset="0"
                theme-class="theme1"
                @pagingclick="onPagingClick"
        />
      </div>
    </section>
    <div class="p-10 bg-white">
      <SocialLinks />
    </div>
  </div>
</template>
<script>
    import i18n from '@@/lang/mobile/review-index.json'
    import ImgWrapper from '@@/../components/ImgWrapper.vue'
    import title from '@@/../common/pages'
    import Rate from '@/components/review/Rate.vue'
    import SocialLinks from '@/components/review/SocialLinks.vue'
    import Cart from '@@/../components/icons/Cart.vue'
    import Paging from '@@/../components/paging/Paging.vue'

    export default {
        i18n: {
            messages: i18n
        },
        components: {
            ImgWrapper,
            Rate,
            SocialLinks,
            Cart,
            Paging
        },
        computed: {
            titleChunk() {
                return this.$t('15',{productName: this.productInfo.name})
            },
            toPage() {
                const totalPage = Math.ceil(this.buyerTotalWidget / 3)
                return totalPage >= 5 ? 5 : totalPage > 1 ? totalPage : 1
            }
        },
        data() {
            return {
                cartProcessing: false,
                currentPage: 1
            }
        },
        methods: {
            onSeeMore(url) {
                location.href = url
            },
            addToCart() {
                if (this.cartProcessing) {
                    return
                }
                this.cartProcessing = true
                this.$store.dispatch('cart/addToCart', {
                  productId: this.productInfo.cartInfo.productId,
                })
            },
            descriptionTemplate() {
                return (this.productInfo.description || '').slice(0, 300)
            },
            async onPagingClick(page) {
                if ((page-1) * 3 > this.buyerTotalWidget) {
                    return
                }
                const widgets = await this.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${this.productInfo.id}/realtrade/widgets?page=${page - 1}`)
                this.currentPage = page
                this.devWidgetUrls = widgets.devWidgetUrls
                this.buyerWidgetUrls = widgets.buyerWidgetUrls
            },
        },
        mounted() {
            let me = this,
                $cart_container = $(me.$refs.productInfo),
                offset =  $cart_container.offset().top + $cart_container.outerHeight() // offset top + height
            $(window).on('load scroll', function() {
                if ($(window).scrollTop() > offset) {
                    $(me.$refs.cartFixed).fadeIn(300)
                } else {
                    $(me.$refs.cartFixed).fadeOut(300)
                }
            })
        },
        async asyncData({ app, params, error }) {
            let [productInfo, widgets] = await Promise.all([
                app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}/info`),
                // app.GoGoHTTP.get(`/api/v3/surface/review/ranking/ea`),
                app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${params.id}/realtrade/widgets?page=0`)
            ])

            if (!productInfo || !Object.keys(productInfo).length) {
                return error({ statusCode: 404 })
            }

            return {
                ...widgets,
                productInfo,
                linkMeta: [
                    {
                        rel: 'canonical',
                        href: `https://www.gogojungle.co.jp/systemtrade/fx/${params.id}/real-trade`
                    }
                ],
                meta: [
                    {
                        name: 'og:title',
                        content: `#${productInfo.name}# のREAL TRADE - 自動売買・相場分析・投資戦略の販売プラットフォーム - GogoJungle`,
                        hid: 'og:title'
                    },
                    {
                        name: 'og:description',
                        content: productInfo.description,
                        hid: 'og:description'
                    }
                ],
            }
        },
        ...title
    }
</script>

<style lang="scss" scoped>
  .review-title {
    background-color: #f3f0ef;
    color: #434343;
    font-size: 16px;
  }
  .product {
    .product-info {
      /* box-shadow: 0 0 5px rgba(4, 0, 0, 0.15); */

      /* border-bottom: 1px solid #e0e0e0; */
      .s-65 {
        width: 65px;
        height: 65px;
      }
      .info {
        width: calc(100% - 70px);
        /deep/ .gg-rating {
          font-size: 18px;
          .rate-num {
            padding-top: 6px;
          }
          .star-num {
            font-weight: bold;
          }
        }
        .name {
          font-weight: bold;
          margin-top: 3px;
          word-break: break-all;
          line-height: 1.1em;
        }
        .product-updated {
          color: #a0a0a0;
        }
      }
      .my-review {
        border-radius: 20px;
        border: solid 1px #aaa;
        min-width: 175px;
      }
    }
    .fixed-cart {
      box-shadow: 0 8px 10px -6px rgba(4, 0, 0, 0.4);
      background-color: #fff;
      padding: 5px 3%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      .s-40 {
        width: 40px;
        height: 40px;
      }
      .product-name-price {
        width: calc(100% - 205px);
      }
      .btn-orange {
        background-color: #ff8500;
        border-radius: 5px;
        border: none;
        color: #fff;
        flex: 0 0 160px;
        height: 35px;
        .icon-cls {
          width: 24px;
          height: 24px;
          margin-right: 0;
        }
      }
    }
  }
  .load-more /deep/ {
    .icon-cls {
      width: 16px !important;
      height: 16px !important;
    }
  }
  .buyer-widget-item + .buyer-widget-item {
    margin-top: 32px;
  }
  .widget-paging {
    .paging-wrap.theme1 /deep/ {
      ul {
        display: inline-flex;
        li {
          width: 9.5vw;
          height: 12vw;
          border: none;
          border-radius: 0;
          a {
            color: #434343;
            background-color: white;
            height: 100%;
            width: 100%;
            text-align: center;
            border: 1px solid #b2b2b2;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          a.active {
            background-color: #434343;
            color: white;
          }
        }
      }
    }
  }
</style>

<style>
  .is-fixed {
    display: none;
  }
</style>