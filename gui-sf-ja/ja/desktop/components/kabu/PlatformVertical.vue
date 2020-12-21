<template>
  <div class="pf-box mr-10 pos-rel">
    <a :href="data.detailUrl || '#'" class="no-underlying ">
      <div class="coming-soon" v-if="data.isSoon">Coming soon...</div>
      <div class="logo-api" style="text-align: right;">
        <!-- <img src="/img/assets/pc/kabu/logo-kabucom.png" class="top-img" /> -->
      </div>
      <div class="pf-name wrap-text" :title="data.name">{{ data.name }}</div>
      <div class="pf-img">
        <img :src="'/img/products/' + data.id" height="100%" />
      </div>
      <div class="pf-text mb-10" style="overflow-y: hidden;" :style="{height: isLarge ? '66px' : '54px', minHeight: isLarge ? '66px' : '54px'}" v-wrap-lines="3" :title="data.introduction">{{ data.introduction }}</div>
      <div class="flex center">
        <Prices :prices="data.prices" class="pf-price" :is-vertical="isLarge" />
      </div>
    </a>
    <div class="flex center">
      <Rate :stars="data.review ? data.review.stars : 0" :number="data.review ? data.review.count : 0" :alway-show="true" class="mt-5" :target="data.id" />
    </div>
  </div>
</template>
<script>
import Prices from './Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
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
.logo-api {
  height: 32px;
  margin-bottom: 6px;
}
.pf-name {
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}
.pf-img {
  height: 80px;
  overflow: hidden;
  margin-bottom: 6px;
}
.pf-text {
  font-size: 12px;
}
.pf-price {
  font-size: 15px;
}
.pf-box {
  box-shadow: 0 0 5px #c6c6c6;
  text-align: center;
  padding: 7px 10px;
  color: #333;
  margin-bottom: 10px;
  height: 275px;
  width: 170px;
  display: block;
}
.top-img {
  width: 27px;
  height: 27px;
}
/deep/ .gg-rating {
  font-size: 14px;
}
/deep/ .rate-num {
  font-size: 12px;
}
.coming-soon {
  background: #0024a9;
  width: 161px;
  height: 264px;
  position: absolute;
  opacity: 0.95;
  top: 5px;
  left: 5px;
  text-align: center;
  line-height: 259px;
  color: #ebf0ff;
  border-radius: 4px;
  box-shadow: 0 0 5px #0035f7;
  font-size: 14px;
}
</style>