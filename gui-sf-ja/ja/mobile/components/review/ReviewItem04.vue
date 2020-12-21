<template>
  <LazyComp01 class="item" min-height="65px">
    <a :href="'/review/detail/' + item.productId" class="flex space-between item-link">
      <div class="item-img pos-rel">
        <Lzimg :data-src="'/img/products/' + item.productId + '/small'" class="lz-img" :alt="item.name" />
        <div class="rank" 
             :style="{
               background: rankColor[rank] || '#e1dede',
               color: '#fff'
             }"
             v-if="rank"
        >
          {{ rank }}
        </div>
      </div>
      <div class="item-content">
        <div :href="'/review/detail/' + item.productId" class="item-content-name wrap-text" :title="item.reviewTitle">
          {{ item.reviewTitle || item.name }}
        </div>
        <Rate02 :stars="(item.review || {}).stars" v-if="(item.review || {}).stars" />
        <div class="flex content-end">
          <Prices :prices="item.prices" />
        </div>
      </div>
    </a>
  </LazyComp01>
</template>

<script>
import Rate02 from './Rate02.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Prices from '@@/../components/prices/Prices.vue'
export default {
  components: {
    Rate02,
    Lzimg,
    LazyComp01,
    Prices,
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

<style lang='scss' scoped>
.item {
  min-height: 75px;
  padding: 18px 0;
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
  .rank {
    position: absolute;
    top: -8px;
    left: 0;
    background: #fff;
    color: #a1a1a1;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    font-size: 15px;
    font-weight: bold;
    line-height: 25px;
    text-align: center;
  }
  .item-content {
    width: calc(100% - 80px);
    .item-content-name {
      text-decoration: none;
      display: block;
      height: 20px;
      overflow: hidden;
      color: #2d2d2d;
      font-weight: bold;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  /deep/ .gg-rating {
    font-size: 14px;
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