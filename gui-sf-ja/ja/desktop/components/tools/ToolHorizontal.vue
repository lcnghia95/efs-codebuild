<template>
  <div class="tool-item flex">
    <a :href="item.detailUrl" class="tool-item-image">
      <img class="s-82 mb-10" :src="`/img/products/${item.id}/small`" alt="" />
      <div class="sale" v-if="item.prices && item.prices[0].discountPrice">
        <span class="flex mid center"></span>
        <span class="flex mid center"><b>SALE</b></span>
      </div>
      <div class="rank"
           v-if="rank"
           :style="{
             background: rankColor[rank] || '#e1dede',
             color: rankColor[rank] ? 'white' : '#505050'
           }"
      >
        {{ rank }}
      </div>
    </a>
    <div class="flex layout-col pl-10 tool-item-content">
      <a :href="item.detailUrl" :title="item.name" class="tool-item-title wrap-text" v-wrap-lines="2">{{ item.name }}</a>
      <Prices :prices="item.prices" :is-vertical="true" />
      <Rate :stars="(item.review || {}).stars" :number="(item.review || {}).count" :target="item.id" />
    </div>
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'

export default {  
  components: {
    Rate,
    Prices,
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

<style lang="scss" scoped>
.tool-item {
  border-bottom: 1px solid #e1e1e1;
  padding: 8px;
  user-select: none;
  text-decoration: none;
  transition: all 0.4s;
  height: 90px;
  .tool-item-content {
    width: 70%;
    line-height: 14px;
    font-size: 12px;
  }
  .tool-item-title {
    font-weight: 800;
    color: #000;
    height: 28px;
    text-decoration: none;
  }
  /deep/ .gg-rating {
    font-size: 12px;
  }
  &:hover {
    background: #f5f5f5;
  }
}
.tool-item-image {
  position: relative;
  height: 70px;
  width: 70px;
  background: #fff;
  img {
    max-height: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
  .rank {
    position: absolute;
    top: -10px;
    left: 0;
    background: purple;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
  }
  .sale {
    z-index: 2;
    top: -4px;
    right: -7px;
    position: absolute;
    span {
      text-transform: uppercase;
      position: absolute;
      background: red;
      font-size: 7px;
      color: white;
      height: 17px;
      width: 17px;
      top: 5px;
      right: 7px;
      z-index: 3;
      &::before,
      &::after {
        content: '';
        position: absolute;
        background: inherit;
        height: inherit;
        width: inherit;
        top: 0;
        right: 0;
        z-index: -1;
        transform: rotate(30deg);
      }
      &::after {
        transform: rotate(60deg);
      }
      &:nth-child(1) {
        transform: rotate(15deg);
      }
    }
  }
}
</style>


<docs>
  ```vue
  <template>
    <ToolHorizontal :product="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          detailUrl: '/systemtrade/fx/10833',
          id: '1',
          name: 'TORURIPI-R666BZ-R_USDJPY',
          prices: [{ price: 49900 }],
          review: { count: 3, stars: 1 },
        },
      }
    },
  }
  </script>
  ```
</docs>
