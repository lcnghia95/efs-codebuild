<template>
  <div class="article-also-bought flex layout-col">
    <span class="title mb-20 mt-30 "
      >{{t(11)}}</span>
    <div class="bought-list flex flex-wrap layout-col">
      <div
        class="bought-list-item flex layout-col"
        v-for="product in products"
        :key="product.id"
      >
        <div class="inline-flex" style="width: 100%">
          <img v-if="product.typeId && product.typeId !== 1"
            :src="`/img/products/${product.id}/small`"
            alt=""
          />
          <google-line-chart :size="[52,52]" :data="product.chart || []" v-else />
          <div class="flex layout-col ml-10 item-detail">
            <a :href="product.detailUrl" class="flex"><span style="color: #B7B7B7" v-wrap-lines="1" :title="product.name">{{product.name}}</span></a>
            <span style="color: #2A2A2A" v-wrap-lines="1" class="mt-5">{{product.description}}</span>
            <span style="color: #FF8500; text-align: right" class="mt-5" v-if="product.prices && product.prices.length">
              ¥ {{formatNumber(product.prices[0].discountPrice || product.prices[0].price)}}
              <span v-if="product.prices[0].isDiscount" style="color: #666666; text-decoration: line-through">¥ {{formatNumber(product.prices[0].price)}}</span>
            </span>
          </div>
        </div>
        <div class="category-list mt-10">
          <span class="category-item" v-if="product.id">#{{ $t('c' + (product.category || 1)) }}</span>
          <span class="category-item" v-if="product.isReal">#REAL</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import i18n from '@@/lang/components-desktop/product-productvert.json'
import { t } from "@@/../common/assets/js/helper";
export default {
  i18n: { messages: i18n },
  name: "navi-article-also-bought",
  props: ['products'],
  components: {
    GoogleLineChart
  },
  methods: {t}
};
</script>
<style scoped lang="scss">
.title {
  color: #333333;
  font-weight: bold;
}
.article-also-bought {
  border-top: 1px solid #d3d3d3;
  margin-top: 40px !important;
  max-width: 620px;
}
.bought-list {
  height: 288px;
  flex-wrap: wrap;
  overflow: auto hidden;
  /* Firefox-only */
  scrollbar-width: thin !important;
  scrollbar-color: lightgray transparent !important;
  /* Works on Chrome/Edge/Safari */
  &::-webkit-scrollbar {
    width: 4px !important;
    height: 8px !important;
    display: inline-block !important;
  }
  &::-webkit-scrollbar-track {
    display: none !important;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    background-color: #dedede !important;
  }
  .bought-list-item {
    width: 288px;
    background-color: #f9f9f9;
    padding: 10px;
    margin: 10px;
    display: block;
    height: 110px;
    img {
      width: 52px;
      height: 52px;
    }
    .item-detail {
      width: 100%;
    }
    .category-list {
      .category-item {
        padding: 2px 4px;
        margin: 0 5px;
        font-size: 12px;
        border-radius: 3px;
        background-color: #cccccc;
      }
    }
  }
}
</style>
