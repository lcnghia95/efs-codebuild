<template>
  <LazyComp01 class="item" min-height="65px">
    <a :href="'/review/detail/' + item.productId" class="flex space-between item-link">
      <div class="item-img pos-rel">
        <Lzimg :data-src="'/img/products/' + item.productId + '/small'" class="lz-img" :alt="item.name" />
        <div class="rank">
          {{ rank }}
        </div>
      </div>
      <div class="item-content">
        <div :href="'/review/detail/' + item.productId" class="item-content-name wrap-text" :title="item.name">
          {{ item.name }}
        </div>
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
  width: 195px;
  height: 65px;
  padding: 8px 10px 8px 25px;
  .item-link {
    text-decoration: none;
  }
  .item-img {
    height: 47px;
    width: 47px;
    border: 1px solid white;
    .lz-img {
      max-height: 45px;
      max-width: 45px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .rank {
    position: absolute;
    top: -5px;
    left: -25px;
    background: #fff;
    color: #d0d0d0;
    width: 15px;
    height: 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    text-align: center;
  }
  .item-content {
    width: 105px;
    .item-content-name {
      text-decoration: none;
      display: block;
      font-size: 12px;
      height: 17px;
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