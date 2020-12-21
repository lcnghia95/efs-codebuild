<template>
  <div class="user-review flex">
    <div class="left mr-10">
      <a class="block w-90 no-underlying" :href="data.productDetailUrl">
        <Lzimg width="90" height="90" :data-src="'/img/products/'+data.productId+'/small'" alt=""/>
        <p class="mt-10 mb-10 break-word">{{ data.productName }}</p>
        <rate :stars="data.stars"/>
      </a>
    </div>
    <div class="right">
      <a :href="'/review/detail/'+data.productId" class="no-underlying">
        <b class="mb-10">{{ data.title }}</b><br>
        {{ data.content }}
      </a>
    </div>
  </div>
</template>

<script>
import Rate from '@/components/user/Rate.vue'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  components: {
    Rate,
    Lzimg,
  },
  props: {
    data: Object,
  },
}
</script>


<style lang="scss" scoped>
.user-review {
  .left {
    flex: 0 0 90px;
  }
  border-bottom: 1px solid #b4b5b6;
}
.break-word {
  word-wrap: break-word;
}
.right {
  font-size: 13px;
}
</style>
