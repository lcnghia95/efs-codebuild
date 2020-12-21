<template>
  <div class="user-review flex mb-0">
    <a class="block w-40 no-underlying" :href="data.productDetailUrl">
      <Lzimg width="40" height="40" :data-src="'/img/products/'+data.productId+'/small'" alt />
    </a>
    <rate :stars="data.stars? data.stars : -1 " class="star-box" />
    
    <p class="mt-10 mb-10 break-word text-overflow wrap-text">
      <a :href="'/review/detail/'+data.productId" class="no-underlying">{{ data.title }}</a>
    </p>
    
    <a :href="'/review/detail/'+data.productId">
      <ChevronRight class="custom-chevron" />
    </a>
  </div>
</template>

<script>
import Rate from "@@/../components/product/Rate.vue"
import Lzimg from "@@/../components/Lzimg.vue"
import ChevronRight from "@@/../components/icons/ChevronRight.vue"

export default {
  components: {
    Rate,
    Lzimg,
    ChevronRight
  },
  props: {
    data: Object
  }
}
</script>


<style lang="scss" scoped>
.user-review {
  border-bottom: 1px solid #b4b5b6;
  flex-direction: row;
  padding: 5px 10px;
  align-items: center;
}
.text-overflow {
  width: calc(100% - 125px);
}
.star-box {
  margin: 0 5px;
}
.break-word {
  word-wrap: break-word;
}
.custom-chevron {
  color: #b2b2b2;
  width: 24px;
  align-items: center;
  display: flex;
}
</style>
