<template>
  <div>
    <ProductHorizontal03 v-for="(product,index) in productList" :key="'Ii0DW'+index" :product="product" class="mb-20"/>
  </div>
</template>

<script>
import ProductHorizontal03 from '@/components/product/ProductHorizontal03.vue'
export default {
  components: {
    ProductHorizontal03,
  },
  props: {
    productList: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>
