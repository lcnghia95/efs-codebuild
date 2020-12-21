<template>
  <div class="rank-wrapper flex layout-col">
    <div class="top-content w-full flex space-between">
      <div class="rank-left">
        <ImgWrapper :href="`/finance/navi/series/${item.id}`" :src="`/img/products/${item.productId}/small`" />
      </div>
      <div class="rank-right">
        <a :href="`/finance/navi/series/${item.id}`" :title="item.title" class="rank-title" v-wrap-lines="2">
          <b>{{ item.title }}</b>
        </a>
        <a :href="`/finance/navi/series/${item.id}`">
          <div class="rank-des" v-wrap-lines="2" v-html="item.content"></div>
        </a>
        <a class="rank-user flex mid" :href="`/finance/navi/authors/${(item.user || {}).id}`">
          <Edit />
          <span :title="(item.user || {}).name" class="wrap-text user-id">{{ (item.user || {}).name }}</span>
        </a>
        <div class="flex content-end series-price">
          <Price
            v-if="item.price"
            :price="item.discountPrice || item.price"
            :old-price="item.discountPrice ? item.price : null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-rank-horiz.json'
import Edit from '@@/../components/icons/Edit.vue'
// import Star from '@@/../components/icons/Star.vue'
// import Check from '@@/../components/icons/Check.vue'
import Price from '@@/../components/prices/Price.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    Edit,
    // Star,
    // Check,
    Price,
    ImgWrapper,
  },
  data() {
    return {
      loadingFollow: false,
      loadingFavorite: false,
    }
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    getNaviImg,
  },
}
</script>

<style lang="scss" scoped>
.rank-wrapper {
  min-height: 34vw;
  padding: 7vw 4vw 4vw 4vw;
  border-bottom: 1px solid rgb(217, 217, 217);
  background: #fff;
  a {
    font-size: 3vw;
    color: #8e8e8e;
    &:hover,
    &:active,
    &:visited,
    &:focus {
      text-decoration: none;
    }
  }
  .rank-right {
    flex: 0 0 70%;
    margin-top: -11px;
    .rank-title {
      font-size: 4vw;
      color: rgb(45, 45, 45);
      max-height: 11vw;
      overflow: hidden;
    }
    .rank-des {
      margin-top: 3px;
      font-size: 3.2vw;
      line-height: 4.5vw;
      max-height: 8.5vw;
      overflow: hidden;
    }
    .rank-user {
      margin-top: 3px;
      .icon-cls {
        width: 4vw;
        height: 4.5vw;
        margin-right: 2px;
      }
    }
  }
  .rank-left {
    flex: 0 0 25%;
    .img-wrapp {
      width: 100%;
      padding-bottom: 100%;
    }
  }
}
.series-price {
  font-size: 12px !important;
  .price-cls { flex: 0 !important; }
}
</style>
<docs>
  ```vue
  <template>
      <NaviRankHorizontal01 :item="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          content: "現在子供たちが貯金箱に保存しているお金を置き換える...",
          id: 6559,
          isCampaign:0,
          isPaidContent:1,
          publishedDate:1535796360,
          title: "2億人をターゲットにする新規公開コインICO 10月31日まで",
          user: {
            id: 120662,
            name: "EDGE"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
