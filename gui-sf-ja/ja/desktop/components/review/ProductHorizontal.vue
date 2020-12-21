<template>
  <div class="product-horizontal flex p-10">
    <a :href="product.detailUrl" class="box-hover pos-rel flex mid" :title="product.name">
      <img class="shadow size-60" :src="product.id ? 'img/products/' + product.id + '/small' : ($IMG_URL.NO_IMAGE)" alt="">
      <span v-if="rank" :class="'rank' + (rank < 4 ? rank : 4)">{{ rank }}</span>
    </a>
    <div class="product-details ml-10 wrap-text next-box-hover w-full">
      <b :title="product.name">
        <a class="link-box-hover co-black fs-13" :href="product.detailUrl">{{ product.name }}</a>
      </b>
      <prices :prices="product.prices"/>
      <span class="fs-13" :title="product.description" v-wrap-lines="2">{{ product.description }}</span>
      <rate :stars="(product.review && product.review.stars) ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
            :target="product.id" class="h-20 fs-13"/>
    </div>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
export default {
  components: {
    Rate,
    Prices,
  },
  props: ['product', 'rank'],
}
</script>

<style scoped lang="scss">
$color7: #f1f1f1;
.size-60 {
  width: 60px;
  height: 60px;
}
.product-horizontal {
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: $color7;
  }
}
.product-hover {
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
  &:last-child {
    > .product-horizontal {
      border-bottom: none;
    }
  }
}
.rank1 {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: block;
  border-radius: 3px;
  margin-left: -1px;
  background: #fc0;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.rank2 {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: block;
  border-radius: 3px;
  margin-left: -1px;
  background: #6e766a;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.rank3 {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: block;
  border-radius: 3px;
  margin-left: -1px;
  background: #e2594e;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.rank4 {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: block;
  border-radius: 3px;
  margin-left: -1px;
  background: #e1dede;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
}
</style>
