<template>
  <div class="strategy_li flex layout-col space-between pos-rel">
    <div class="coming-soon" v-if="item.isSoon">Coming soon...</div>
    <div class="strategy_item">
      <div class="percent">{{ $t('1') }}<span>{{ item.profit_rate }}</span>%</div>
      <div class="graph"><img :src="item.image" width="100%" height="auto" /></div>
      <div class="item_name wrap-text"><a :href="item.detailUrl || '#'"><span :title="item.name">{{ item.name }}</span></a></div>
      <div class="flex space-between mt-5" style="min-height: 38px;">
        <Prices :prices="item.prices" class="price-cls" :is-vertical="true" />
        <Rate :stars="item.review ? item.review.stars : 0" :number="item.review ? item.review.count : 0" />
      </div>
    </div>
    <div class="strategy_footer clearfix">
      <!-- <div class="pf-name">{{ $t('platforms.' + item.platformId) }}</div> -->
      <div class="api-name">{{ item.author }}</div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/kabu-strategy-item.json'
import Prices from './Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Prices,
    Rate,
  },
  i18n: {
    messages: i18n
  }
}
</script>
<style lang="scss" scoped>
.strategy_li {
  width: 46vw;
  background: #f2f2f2;
}
.strategy_item {
  padding: 7px 10px;
}
.strategy_item .percent {
  background: #fff;
  height: 33px;
  font-size: 10px;
  padding: 0 5px;
}
.strategy_item .percent span {
  color: #b50f1b;
  font-size: 18px;
  font-weight: bold;
}
.strategy_item .graph {
  background: #fff;
  height: 82px;
  img {
    height: 82px;
  }
}
@media only screen and (min-width: 600px) {
  .strategy_item .graph {
    height: 20vw;
    img {
      height: 20vw;
    }
  }
}
.strategy_item .item_name {
  color: #333;
  padding: 8px 2px 0;
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  height: 24px;
}
.strategy_item .item_name a {
  color: #666;
  text-decoration: none;
  transition: 0.1s;
}
.price-cls /deep/ {
  .co-red {
    font-size: 14px;
  }
  .old-price {
    font-size: 11px;
  }
}
.strategy_item /deep/ .gg-rating {
  color: #ccc;
  font-size: 3vw;
  letter-spacing: -0.1em;
  margin-top: 1.5vh;
}
.strategy_footer {
  height: 17px;
  font-size: 10px;
  color: #fff;
  padding: 2px 0;
}
.strategy_footer .pf-name {
  float: left;
  background: #666;
  width: 50%;
  text-align: center;
}
.strategy_footer .api-name {
  /* float: left; */
  background: #939393;

  /* width: 50%; */
  text-align: center;
}
.coming-soon {
  background: #0024a9;
  width: 98%;
  height: 88%;
  position: absolute;
  opacity: 0.95;
  top: 5px;
  left: 5px;
  text-align: center;
  line-height: 200px;
  color: #ebf0ff;
  border-radius: 4px;
  box-shadow: 0 0 5px #0035f7;
  font-size: 14px;
}
</style>