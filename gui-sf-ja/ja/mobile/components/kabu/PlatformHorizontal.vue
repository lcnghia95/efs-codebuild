<template>
  <div class="flex space-between p-10 w-full" style="height: 154px;">
    <div class="left-content flex layout-col mid">
      <a :href="data.detailUrl || '#'" class="pf-img">
        <img :src="'/img/products/' + data.id" />
      </a>
      <div class="flex center">
        <Rate :stars="data.review ? data.review.stars : 0" :number="data.review ? data.review.count : 0" :alway-show="true" class="mt-5" :target="data.id" />
      </div>
    </div>
    <a :href="data.detailUrl || '#'" class="no-underlying right-content">
      <div class="flex mid space-between">
        <div class="pf-name wrap-text">{{ data.name }}</div>
        <!-- <img src="/img/assets/pc/kabu/logo-kabucom.png" /> -->
      </div>
      <div class="pf-text mt-10" v-wrap-lines="3" :title="data.introduction">{{ data.introduction }}</div>
      <Prices :prices="data.prices" class="pf-price" />
    </a>
  </div>
</template>
<script>
import Prices from './Prices.vue'
import Rate from './Rate.vue'
export default {
  props: {
    data: Object,
    isLarge: Boolean,
  },
  components: {
    Prices,
    Rate,
  },
}
</script>
<style lang="scss" scoped>
.left-content {
  width: 30%;
  flex: 0 0 30%;
  padding: 10px 20px;
  .pf-img {
    display: block;
    img {
      max-width: 100%;
      height: 46px;
    }
  }
}
.right-content {
  display: block;
  width: 70%;
  img {
    width: 26px;
    height: 26px;
  }
  .pf-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    width: 80%;
    flex: 0 0 80%;
    line-height: 26px;
  }
  .pf-text {
    font-weight: 550;
    font-size: 13px;
    line-height: 18px;
    color: #666;
    height: 54px;
    max-height: 54px;
    overflow-y: hidden;
  }
}
</style>