<template>
  <div class="product-vertical p-5">
    <gogo-link :target="product.detailUrl" class="co-black" :title="product.name">
      <div class="product-img s-82">
        <div v-if="rank" :class="['lg', 'rank' + rank > 3 ? 4 : rank]">
          <b>{{ rank }}</b>
        </div>
        <ImgWrapper class="s-82 mb-10" :src="'/img/products/' + product.id + '/small'"
                    :alt="product.name + ' ' + category"/>
                    <!-- <img class="pos-abs shadow" :src="'/img/products/' + product.id + '/small'" alt=""> -->
      </div>
      <div class="product-name mt-10" v-wrap-lines="2">
        <b>{{ product.name }}</b>
      </div>
    </gogo-link>
    <div>
      <!-- <div v-if="product.description" v-wrap-lines="2" :title="product.description">
        <span>{{ product.description }}</span>
      </div> -->
      <Prices :prices="product.prices" :right-align="rightAlign" :is-vertical="true" />
      <!-- <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
            :target="product.id" /> -->
    </div>
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
export default {
  components: { Prices, Rate, GogoLink, ImgWrapper },
  props: ['product', 'rightAlign', 'rank', 'category'],
}
</script>

<style lang="scss" scoped>
.product-vertical {
  width: 95px;
  box-sizing: content-box;
  > * {
    width: 100%;
  }
  /deep/ .gogo-link {
    width: 100%;
  }
  .product-name {
    height: 42px;
    overflow: hidden;
  }
  .s-82 {
    width: 82px;
    height: 82px;
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
