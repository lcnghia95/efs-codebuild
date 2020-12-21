<template>
  <div class="w-1000 flex layout-col">
    <div class="product-name" v-if="devWidgetUrls.length > 0 || buyerWidgetUrls.length > 0">
      {{ productInfo.name }} - REAL TRADE
    </div>
    <div v-else class="product-name fs-30">
      {{ $t('19') }} 
    </div>
    <div class="main flex">
      <div class="left-content flex layout-col">
        <section class="flex layout-col">
          <div class="product mb-10 flex layout-col">
            <div class="flex product-layout layout-row">
              <a :href="productInfo.detailUrl">
                <ImgWrapper :src="`/img/products/${productInfo.id}/small`"
                            class="s-90 mt-10 mb-10 mr-20"
                />
              </a>
              <div class="product-detail">
                <div class="flex ">
                  <Rate
                    :number="productInfo.reviewCount"
                    :stars="productInfo.reviewStars"
                    class="rating"
                  />
                  <span class="product-updated fs-12">{{ formatTime(productInfo.updatedAt, 6) }}</span>
                </div>
                <div>
                  <div class="types mb-10 mt-5">{{ $t('cate-1') }}</div>
                  <div class="fs-13 name wrap-text">{{ productInfo.name }}</div>
                  <a :href="'/users/' + productInfo.userId + '/products'"
                     class="fs-12 nickname mt-5 flex mid"
                  >
                    <User2 />
                    <span>{{ productInfo.nickname || $t('20') }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="dev-widget" v-if="devWidgetUrls.length > 0">
            <iframe scrolling="no" :src="devWidgetUrls[0].widgetUrl" frameborder="0" width="100%" height="390" class="gg-hide"></iframe>
          </div>
        </section>
        <div id="buyer-widgets" class="title" v-if="buyerTotalWidget > 0">{{ $t('26') }}</div>
        <section class="flex layout-col" v-if="buyerTotalWidget > 0">
          <div :key="index" v-for="(widget, index) in buyerWidgetUrls" class="buyer-widget-item">
            <iframe scrolling="no" :src="widget.widgetUrl" frameborder="0" width="100%" height="390" class="gg-hide"></iframe>
          </div>
          <div class="text-center mt-30" v-if="buyerTotalWidget > 3">
            <paging :cur-page="currentPage"
                    :total="buyerTotalWidget"
                    :from="1"
                    :to="toPage || 1"
                    :has-scroll="true"
                    :scroll-offset="0"
                    theme-class="theme4"
                    scroll-offset-el="#buyer-widgets"
                    @pagingclick="onPagingClick"
            />
          </div>
        </section>
      </div>
      <div class="right-content">
        <div class="ea-ranking">
          <div class="title pb-10" v-html="$t('8')"></div>
          <template v-for="(item, index) in eaRanking">
            <ReviewHorizontal01 :item="item" :key="item.id" :rank="index + 1" />
          </template>
          <LoadMore :href="`/review/highpost/systemtrade/3`" class="ranking-loadmore" />
        </div>
        <SocialLinks class="mt-40" />
      </div>
    </div>
  </div>
</template>

<script>
    import i18n from '@@/lang/desktop/review-index-new.json'
    import { filterInt } from '@/utils/client/common'
    import ImgWrapper from '@@/../components/ImgWrapper.vue'
    import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
    import Rate from '@/components/review/Rate.vue'
    import User2 from '@@/../components/icons/User2.vue'
    import LoadMore from '@/components/review/LoadMore.vue'
    import SocialLinks from '@/components/review/SocialLinks.vue'
    import Paging from '@@/../components/paging/Paging.vue'
    import title from '@@/../common/pages'

    export default Object.assign({
        validate({ params }) {
            return !isNaN(filterInt(params.id))
        },
        i18n: {
            messages: i18n
        },
        components: {
            Paging,
            ReviewHorizontal01,
            ImgWrapper,
            Rate,
            User2,
            LoadMore,
            SocialLinks
        },
        data() {
            return {
                currentPage: 1,
            }
        },
        async asyncData({ app, params, store, error }) {
            const [productInfo, eaRanking, widgets] = await Promise.all(
                [
                    app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}/info`),
                    app.GoGoHTTP.get(`/api/v3/surface/review/ranking/ea`),
                    app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${params.id}/realtrade/widgets?page=0`)
                ]
            ),
            titleChunk = `#${productInfo.name}# のREAL TRADE` 
            if (!productInfo || !Object.keys(productInfo).length) {
                return error({ statusCode: 404 })
            }
            store.commit('cart/setInfo', {
                info: productInfo.cartInfo,
                productStatus: productInfo.status,
                isPassword: 0
            })
            store.commit('pushBC', {
                name: productInfo.name,
                path: `/systemtrade/fx/${productInfo.id}`
            })
            store.commit('pushBC', {
                name: `${productInfo.name} - REAL TRADE`,
                path: `/systemtrade/fx/${productInfo.id}/real-trade`
            })
            return {
                ...widgets,
                productInfo,
                eaRanking,
                titleChunk,
                // keywordsChunk,
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
                linkMeta: [
                    {
                      rel: 'canonical',
                      href: `https://www.gogojungle.co.jp/systemtrade/fx/${params.id}/real-trade`
                    }
                ],
            }
        },
        computed: {
            toPage() {
                const totalPage = Math.ceil(this.buyerTotalWidget / 3)
                return totalPage >= 5 ? 5 : totalPage > 1 ? totalPage : 1
            }
        },
        methods: {
            async onPagingClick(page) {
                if ((page - 1 ) * 3 > this.buyerTotalWidget) {
                    return
                }
                const widgets = await this.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${this.productInfo.id}/realtrade/widgets?page=${page - 1}`)
                this.currentPage = page
                this.devWidgetUrls = widgets.devWidgetUrls
                this.buyerWidgetUrls = widgets.buyerWidgetUrls
            },
            descriptionTemplate() {
              return this.productInfo.description || this.productInfo.name
            }
        }
    },title)
</script>

<style lang="scss" scoped>
.left-content {
  width: 670px;
  .title {
    font-size: 22px;
    margin-top: 32px;
    margin-bottom: 16px;
  }
  section {
    border-radius: 4px;
    border: 1px solid #d4d4d4;
    padding: 20px;
    background-color: white;
    .buyer-widget-item:first-child {
      margin-top: 24px;
    }
    .buyer-widget-item + .buyer-widget-item {
      margin-top: 40px;
    }
  }
  .product {
    img {
      flex: 0 0 90px;
      height: 90px;
    }
    .s-90 {
      width: 80px;
      height: 80px;
    }
    .product-layout {
      width: 100%;
      min-height: 150px;
      .product-detail {
        width: calc(100% - 100px);
        .name {
          color: #2d2d2d;
        }
        .nickname {
          color: #707070;
          /deep/ .icon-cls {
            width: 15px;
            height: 17px;
          }
        }
      }
      .product-updated {
        color: #707070;
        padding-top: 17px;
        margin-left: auto;
      }
    }
    .types {
      font-size: 10px;
      color: #2d2d2d;
      border-radius: 3px;
      border: solid 1px #d9d9d9;
      width: fit-content;
      padding: 1px 5px;
      display: inline-block;
    }
  }
}
.product-name {
  color: black;
  cursor: pointer;
  padding: 14px 0;
  font-size: 30px;
}
.right-content {
  width: 300px;
  padding-left: 30px;
  /deep/ .btn-social > i {
    margin-left: 24px;
  }
  .ea-ranking {
    .title {
      font-size: 18px;
      color: #2d2d2d;
      line-height: 18px;
      box-shadow: inset 0 -1px 0 0 #d9d9d9;
    }
    /deep/ .rv-hori-item {
      width: 100%;
      box-shadow: inset 0 -1px 0 0 #d9d9d9;
      padding-left: 0;
      .item-content {
        width: calc(100% - 80px);
      }
      &:hover {
        box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
      }
    }
    /deep/ .load-more {
      background-color: inherit;
      width: fit-content;
      margin-left: auto;
      color: #2d2d2d;
      padding: 10px 0 10px 10px;
    }
    .ranking-loadmore {
      justify-content: flex-end;
      /deep/ .arrow-right {
        border-left: 8px solid #2d2d2d;
      }
    }
  }
}
</style>

<style lang="scss">
body {
  background: #f7faf9;
}
#menu {
  background: #fff;
}
#header-01 {
  background: #fff;
}
</style>