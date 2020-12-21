<template>
  <LazyComp01 class="flex tools-item" min-height="160px">
    <a :href="item.detailUrl" class="img-ctn">
      <Lzimg :data-src="`/img/products/${item.id}/small`" alt="" />
    </a>
    <div class="w-full content-ctn ml-10 pr-10">
      <a :href="item.detailUrl" class="title" v-wrap-lines="1" :title="item.name">{{ item.name }}</a>
      <p class="content" v-wrap-lines="1">{{ item.description }}</p>
      <div class="discount-info mb-10" v-if="(item.prices || {})[0] && item.prices[0].discountPrice"> 
        {{ 
          $t(
            37, 
            {
              start: formatTime(item.prices[0].specialDiscountStartAt, 0),
              end: formatTime(item.prices[0].specialDiscountEndAt, 0),
            }
          ) 
        }}
      </div>
      <br v-else />
      <Prices :prices="item.prices" :class="{ 'grey-price': ((item.prices || {})[0] || {}).price }" />
      <div class="w-full flex space-between">
        <Rate :stars="(item.review || {}).stars" :number="(item.review || {}).count" :target="item.id" :alway-show="true" />
        <a :href="'/users/' + (item.seller || {}).userId" class="seller-name" :title=" (item.seller || {}).nickName" v-if="item.seller">{{ $t(36, { seller: (item.seller || {}).nickName }) }}</a>
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import i18n from '@@/lang/desktop/tools-index.json'
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Lzimg from '@@/../components/Lzimg.vue'

export default {  
  components: {
    Rate,
    Prices,
    LazyComp01,
    Lzimg,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    rank: {
      type: Number,
      default() {
        return 0
      },
    },
    alwayShowReview: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      rankColor: {
        1: '#ffcc00', // rank 1
        2: '#6e766a', // rank 2
        3: '#e2594e' // rank 3
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.grey-price /deep/ .price-cls strong {
  color: #696969 !important;
}
.tools-item {
  height: 160px;
  width: 100%;
  padding: 25px 10px 20px 10px;
  transition: all 0.2s;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #fff;
  border-left: 1px solid #fff;
  border-top: 1px solid #fff;
  &:hover {
    border-color: #adccff;
  }
  .img-ctn {
    height: 100px;
    width: 100px;
    text-align: center;
    background: #fff;
    flex-shrink: 0;
    position: relative;
    img {
      max-height: 100%;
      max-width: 100%;
      margin: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .content-ctn {
    .title {
      color: #3a3a3a;
      font-size: 18px;
      font-weight: bold;
      line-height: 18px;
      margin: 0 0 8px 0;
      height: 18px;
      overflow: hidden;
      text-decoration: none;
      &:hover {
        opacity: 0.8;
      }
    }
    .content {
      color: #7e7e7e;
      font-size: 13px;
      height: 18px;
      overflow: hidden;
    }
    .discount-info {
      color: red;
      font-weight: bold;
    }
    .seller-name {
      color: #7e7e7e;
      margin-left: auto;
    }
  }
}
</style>