<template>
  <div class="product-PsW62 p-10 flex cursor-pointer" @click="gotoDetail">
    <div class="product-img-box pos-rel">
      <img-wrapper class="shadow" :href="product.detailUrl" :src="'/img/products/'+ product.id +'/small'"/>
      <rank-number v-if="rank" :size="24" :number="rank" class="pos-abs rank"/>
    </div>
    <div class="ml-10 grow01 wrap-text">
      <b class="name wrap-text block">{{ product.name }}</b>
      <Prices :prices="product.prices" :is-vertical="true"/>
      <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
            :target="product.id"/>
    </div>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import RankNumber from '@/components/icons/RankNumber.vue'
import Prices from '@@/../components/prices/Prices.vue'
export default {
  components: {
    Rate,
    ImgWrapper,
    GogoLink,
    RankNumber,
    Prices,
  },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    gotoDetail() {
      location.href = this.product.detailUrl
    },
  },
}
</script>

<style lang="scss" scoped>
$imgW: 60px;
.product-PsW62 {
  width: 300px;
  &:hover {
    background-color: #f1f1f1;
  }
}
.rank {
  top: 0;
  left: 0;
}
.name {
  color: black;
}
.block {
  display: block;
}
.product-img-box {
  width: $imgW;
  height: $imgW;
  flex: 0 0 $imgW;
  display: block;
  .img-wrapp {
    width: $imgW;
    height: $imgW;
  }
}
.grow01 {
  flex: 0 1 auto;
}
</style>
