<template>
  <div class="o-item">
    <a class="cursor-pointer" :href="`/finance/navi/series/${data.id}`">
      <ImgWrapper class="w-full" :src="`/img/products/${data.productId}/small`"/>
      <p class="o-item__tit" v-wrap-lines="2">{{ data.title }}</p>
      <prices :prices="data.prices" currency="￥"/>
    </a>
    <rate :stars="data.stars || 0" :number="data.number || 0" :alway-show="true"/>
  </div>
</template>
<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
/**
 * The Product Item.
 */
export default {
  components: {
    Prices,
    Rate,
    ImgWrapper,
  },
  props: ['data'],
}
</script>
<docs>
  ```vue
  <template>
    <div>
      <product-item :data="item"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "id": 1248,
          "title": "2880【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
          "prices": [
            {
              "price": 4457,
              "discountPrice": 2605
            }
          ],
          "rate": {
            "stars": 2,
            "number": 2747
          }
        },
      }
    },
  }
  </script>
  ```
</docs>
