<template>
  <div class="product-vertical flex layout-col">
    <a :href="product.detailUrl" class="co-black" :title="product.name">
      <div class="product-img s-82">
        <!-- <div v-if="rank" :class="['lg', 'rank' + rank > 3 ? 4 : rank]">
          <b>{{ rank }}</b>
        </div>         -->
        <img
          class="s-82 owl-lazy"
          :alt="product.name + ' ' + category"
          :src="'/img/articles/' + product.articlesId + '/small'"
          v-if="product.typeId == 3 && product.articlesId"
        />
        <img
          class="s-82 owl-lazy"
          :alt="product.name + ' ' + category"
          :src="'/img/products/' + product.id + '/small'"
          v-else
        />
      </div>
      <div class="product-name">{{ product.name }}</div>
    </a>
    <div v-if="product.description" v-wrap-lines="2" :title="product.description">
      {{ product.description }}
    </div>
    <Prices class="mt-auto" :prices="product.prices" :right-align="rightAlign" :is-vertical="true" />
    <!-- <Rate  v-if="isShowRate" :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
          :target="product.id"
    /> -->
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'

export default {
  components: { Prices },
  props: ['product', 'rightAlign', 'rank', 'category'],
}
</script>

<style lang="scss" scoped>
.product-vertical {
  width: 25vw;
  margin: 0 auto;
  box-sizing: content-box;
  > * {
    width: 100%;
  }
  /deep/ .gogo-link {
    width: 100%;
  }
  .product-name {
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6em;
    max-height: 3.2em;
  }
  .s-82 {
    width: 100%;
    height: 25vw;
  }
  .mt-auto {
    margin-top: auto;
  }
}
</style>

<docs>
  ```vue
  <template>
    <ProductVertical :product="item" />
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