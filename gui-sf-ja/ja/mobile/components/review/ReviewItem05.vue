<template>
  <LazyComp01 class="item" min-height="65px">
    <a :href="'/review/detail/' + item.productId" class="flex space-between item-link">
      <div class="item-img pos-rel">
        <Lzimg :data-src="'/img/products/' + item.productId + '/small'" class="lz-img" :alt="item.name" />
        <div class="rank" v-if="rank">
          {{ rank }}
        </div>
      </div>
      <div class="item-content">
        <div :href="'/review/detail/' + item.productId" class="item-content-name wrap-text" :title="item.reviewTitle">
          <b>{{ item.reviewTitle }}</b>
        </div>
        <div class="wrap-text grey-col" :title="item.reviewContent">{{ item.reviewContent }}</div>
        <div class="flex mid">
          <Rate02 :stars="(item.review || {}).stars" />
          <div class="grey-col ml-5">{{ formatTime(item.publishedAt, 6) }}</div>
        </div>
      </div>
    </a>
  </LazyComp01>
</template>

<script>
import Rate02 from './Rate02.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
export default {
  components: {
    Rate02,
    Lzimg,
    LazyComp01,
  },
  props: {
    rank: {
      type: Number,
      default() {
        return 0
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.item {
  min-height: 75px;
  margin: 0 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  .item-link {
    text-decoration: none;
    color: #2d2d2d;
  }
  .item-img {
    height: 60px;
    width: 60px;
    flex: 0 0 60px;
    border: 1px solid white;
    .lz-img {
      max-height: 100%;
      max-width: 100%;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .item-content {
    width: calc(100% - 70px);
    .item-content-name {
      text-decoration: none;
      display: block;
      overflow: hidden;
      color: #2d2d2d;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  /deep/ .gg-rating {
    font-size: 14px;
  }
  &:hover {
    box-shadow: 2px 0 5px rgba(33, 33, 33, 0.2);
  }
  .grey-col {
    color: #a0a0a0;
  }
  &:last-child {
    border-bottom: none;
  }
}
</style>
<docs>
  ```vue
  <template>
    <ReviewHorizontal03 :item='item' rank='1' />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "productId": 11042,
          "typeId": 1,
          "publishedAt": 1515567710,
          "review": {
            "stars": 5,
            "count": 2
          },
          "name": "貯蓄女神",
          "productUrl": "/systemtrade/fx/11042",
          "categoryId": 1
        }
      }
    },
  }
  </script>
  ```
</docs>