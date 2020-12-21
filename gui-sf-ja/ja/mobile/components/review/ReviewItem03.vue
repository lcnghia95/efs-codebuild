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
          {{ item.reviewTitle || item.name }}
        </div>
        <div class="wrap-text">{{ item.reviewContent }}</div>
        <Rate02 :stars="(item.review || {}).stars" />
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
  padding: 8px 10px 8px 25px;
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
  .rank {
    position: absolute;
    top: 2px;
    left: -25px;
    background: #fff;
    color: #a1a1a1;
    width: 15px;
    height: 20px;
    border-radius: 4px;
    font-size: 22px;
    font-weight: bold;
    line-height: 20px;
    text-align: center;
  }
  .item-content {
    width: calc(100% - 80px);
    .item-content-name {
      text-decoration: none;
      display: block;
      height: 17px;
      overflow: hidden;
      color: #2d2d2d;
      font-size: 15px;
      font-weight: bold;
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