<template>
  <div class="w-1000 bg">
    <div class="head-title mt-20 mb-10">{{ $t('19') }}</div>
    <div class="flex mb-40 space-between">
      <div class="left mr-30">
        <div class="product mb-10 flex layout-col">
          <div class="flex product-layout layout-row">
            <a :href="productInfo.detailUrl">
              <ImgWrapper class="s-90 mt-10 mb-10 mr-20" :src="`/img/products/${productInfo.id}/small`" />
            </a>
            <div class="product-detail">
              <div class="flex ">
                <Rate 
                  class="rating" 
                  :stars="productInfo.reviewStars"
                  :number="productInfo.reviewCount"
                />
                <span class="product-updated fs-12">{{ formatTime(productInfo.updatedAt, 6) }}</span>
              </div>
              <div>
                <div class="types mb-10 mt-5">{{ getCateName() }}</div>
                <div class="fs-13 name wrap-text">{{ productInfo.name }}</div>
                <a class="fs-12 nickname mt-5 flex mid" :href="'/users/' + productInfo.userId + '/products'">
                  <User2 /><span>{{ productInfo.nickname || $t('20') }}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="flex loadmore p-20 center">
            <a class="flex center rr-loadmore p-10 no-underlying" :href="`/review/input/` + productInfo.id">{{ myReview.id ? $t('23') : $t('18') }} <ChevronRight class="arrow-right" /></a>
          </div>
        </div>
        <LazyComp01 v-for="(review,index) in (reviewData.data || [])" :key="'a4hAd'+index" class="everyone-review pt-30 pb-30 pl-40 pr-40 mt-20" min-height="105px">
          <ProductReview01
            :user-id="review.reviewUserId" 
            :img-src="'/img/users/'+review.reviewUserId+'/small'" 
            :size="50" :review-title="review.reviewTitle"
          >
            <p class="review-content">
              {{ review.reviewContent }}
            </p>
            <div class="flex mid">
              <ReviewRate 
                class="rating" 
                :alway-show="true" 
                :stars="review.reviewStars" :target="review.id" 
                :stars-only="true"
              />
              <a class="review-nickname mr-10 no-underlying" :href="'/users/'+ review.reviewUserId +'/review'" v-if="review.reviewNickName">
                <Pencil /> 
                {{ review.reviewNickName }}
              </a>
              <span class="review-published mr-15"> {{ formatTime(review.reviewPublishedDate, 6) }} </span>
              <div class="types">{{ getCateName() }}</div>
            </div>
          </ProductReview01>
        </LazyComp01>
        <div class="text-center mt-20 mb-10">
          <paging :cur-page="reviewData.currentPage"
                  :total="reviewData.lastPage"
                  :from="reviewData.pagingFrom"
                  :to="reviewData.pagingTo"
                  :has-scroll="true"
                  :is-add-url-param="true"
                  :origin-url="originUrl"
                  @pagingclick="onChangePage"
          />
        </div>
      </div>
      <div class="right">
        <Payment02 />
        <div class="ranking-ea mt-40">
          <div class="title pb-10" v-html="$t('8')"></div>
          <template v-for="(item, index) in rankingEA">
            <ReviewHorizontal01 :item="item" :key="item.id" :rank="index + 1" />
          </template>
          <LoadMore class="ranking-loadmore" :href="`/review/highpost/systemtrade/3`" />
        </div>
        <SocialLinks class="mt-40" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/review-index-new.json'
import title from '@@/../common/pages'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import LoadMore from '@/components/review/LoadMore.vue'
import Rate from '@/components/review/Rate.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import Payment02 from '@/components/payment-v1/type02/Payment02.vue'
import User2 from '@@/../components/icons/User2.vue'
import ProductReview01 from '@/components/review/ProductReview01.vue'
import Pencil from '@@/../components/icons/Pencil02.vue'
import Paging from '@@/../components/paging/Paging.vue'
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import ReviewRate from '@/components/user/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign({
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  i18n: {
    messages: i18n,
  },
  components: { 
    ImgWrapper,
    LoadMore,
    Payment02,
    Rate,
    User2,
    SocialLinks,
    ProductReview01,
    Pencil,
    Paging,
    ReviewHorizontal01,
    ChevronRight,
    ReviewRate,
    LazyComp01,
  },
  computed: {
    titleChunk() {
      return this.$t('10',{productName: this.productInfo.name})
    },
  },
  async asyncData({ app, params, error, store }) {
    let [myReview, productInfo, reviewData, rankingEA] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/review/myreview/${params.id}`),
        app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}/info`),
        app.GoGoHTTP.get(
          `/api/v3/surface/review/product/${params.id}?page=${params.p || 1}`
        ),
        app.GoGoHTTP.get(`/api/v3/surface/review/ranking/ea`)
      ]),
      originUrl = `/review/detail/${params.id}`
    if (!productInfo || !Object.keys(productInfo).length) {
      return error({ statusCode: 404 })
    }
    store.commit('cart/setInfo', {
      info: productInfo.cartInfo,
      productStatus: productInfo.status,
      isPassword: 0,
    })
    store.commit('pushBC', {
      name: i18n[app.i18n.locale]['19'],
      path: `/review/detail/${params.id}`
    })
    return {
      myReview,
      productInfo,
      reviewData,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/detail/${params.id}`,
        },
      ],
      originUrl,
      rankingEA,
    }
  },
  methods: {
    descriptionTemplate() {
      return (this.productInfo.description || '').slice(0, 300)
    },
    onChangePage() {
      location.reload()
    },
    getCateName() {
      //  This function is related with OAM-25511 (TYPEID)
      if(!this.productInfo) {
        return ''
      }
      let item = this.productInfo
      if(item.typeId == 1) { // systemtrade
        if (item.categories == 1) { // fx
          return this.$t('cate-1')
        } else if (item.categoryId == 3) { // stock (kabu)
          return this.$t('cate-2')
        }
      }
      if([2, 6, 9, 10].includes(item.typeId)) { // tools
        return this.$t('cate-3')
      }
      if(item.typeId == 3) {  // navi
        return this.$t('cate-4')
      }
      if(item.typeId == 4) {  // salon & emagazine
        if([7650, 8812, 9154, 8592, 10520, 8697, 10340, 8955, 14150, 14359, 16211, 21105].includes(item.productId)) { // only these products is salon 
          return this.$t('cate-5')
        } else {
          return this.$t('cate-6') // mail magazine
        }
      }
      return this.$t('cate-7') // others
    },
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
.head-title {
  font-size: 26px;
  color: #2d2d2d;
}
.left {
  width: 670px;
}
.right {
  width: 300px;
}
.product {
  background: #f7faf9;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
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
    background-color: #fff;
    padding: 20px 40px 26px 40px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
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
.rr-loadmore {
  width: fit-content;
  min-width: 200px;
  border-radius: 20px;
  border: solid 1px #2d2d2d;
  background-color: #fff;
  &:hover {
    color: #fff;
    background-color: #2d2d2d;
  }
  &:active {
    color: #2d2d2d;
    background-color: #fff;
  }
  .icon-cls {
    width: 13px;
    height: 13px;
    margin-left: 10px;
    margin-top: 2px;
  }
}
.product-review01 img:hover {
  opacity: 0.7;
}
.loadmore {
  /deep/ .load-more {
    background: #fff;
    border-radius: 20px;
    border: solid 1px #2d2d2d;
    color: #2d2d2d;
    height: 40px;
  }
}
.everyone-review {
  background-color: #fff;
  border-radius: 6px;
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
  }
  .review-content {
    white-space: pre-line;
    word-break: break-word;
    color: #2d2d2d;
  }
  /deep/ .gg-rating {
    font-size: 16px;
    margin-right: 17px;
  }
  .review-nickname {
    .icon-cls {
      width: 14px;
      height: 14px;
      padding-top: 2px;
    }
  }
}
.ranking-ea {
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
</style>
<style lang='scss'>
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
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>