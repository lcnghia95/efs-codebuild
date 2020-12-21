<template>
  <div>
    <div v-for="(item,idx) in prices" class="prices flex space-between" :key="'prices' + idx">
      <span v-if="item.name" class="wrap-text" :title="item.name">{{ item.name }}</span>
      <price :price="item" :is-vertical="isVertical" :currency="currency" :right-curr="rightCurr"
             :class="{'content-end': rightAlign, 'text-right': rightAlign}"
      />
    </div>
  </div>
</template>

<script>
import price from './Price.vue'
export default {
  components: { price },
  props: {
    prices: [Object, Array],
    rightAlign: Boolean,
    isVertical: Boolean,
    currency: String,
    rightCurr: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
.prices:not(:first-child) {
  margin-top: 10px;
}
</style>

<docs>
  ```vue
  <template>
    <Prices :prices="prices" :is-vertical="true"/>
  </template>
  <script>
  export default {
    data() {
      return {
        prices: [{
          price: 10500,
          discountPrice: 111
        }],
      }
    },
  }
  </script>
  ```
  ```vue
  <template>
    <Prices :prices="prices" :right-align="true"/>
  </template>
  <script>
  export default {
    data() {
      return {
        prices: [{
          price: 10500,
          discountPrice: 111
        }],
      }
    },
  }
  </script>
  ```
</docs>
