<template>
  <LazyComp01 class="flex product-hZNcL pb-5" min-height="130px">
    <div class="chart-wrapper pos-rel">
      <ProductStock
        v-if="product.chart && product.chart.length"
        :chart="product.chart"
        :option="chartOpt"
      />
      <div v-else class="chart-empty"></div>
      <rank-number
        v-if="number"
        :number="number"
        :size="35"
        :type="0"
        class="rank-number pos-abs"
      />
    </div>
    <div class="mt-5 ml-10 grow11 wrap-text">
      <div class="flex mid">
        <product-category :type="product.category" class="mr-5" />
        <span v-if="product.isReal" class="readtrade mr-5">REAL</span>
        <a
          :href="product.detailUrl"
          :title="product.name"
          class="wrap-text title ml-5"
        >
          <b>{{ product.name }}</b>
        </a>
      </div>
      <div class="flex space-between info">
        <div>
          <div>
            <span class="title01">Pips</span>
            :&nbsp;
            {{
              product.pips
                ? formatNumber(product.pips, 0, 1)
                : '-'
            }}
          </div>
        </div>
      </div>
      <div class="flex space-between">
        <div class="flex layout-col price-rate">
          <Prices :prices="product.prices" />
          <Rate
            class="rate"
            :stars="product.review ? product.review.stars : 0"
            :number="product.review ? product.review.count : 0"
            :target="product.id"
            :alway-show="true"
          />
        </div>
        <Lzimg
          :data-src="'/img/products/' + product.id + '/small'"
          width="55"
          height="55"
          :alt="product.name"
        />
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import ProductCategory from '@@/../components/product/ProductCategory'
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-desktop/product-horizontal05.json'
import RankNumber from '@/components/icons/RankNumber.vue'
import lazyLoadComponent from '@@/../common/js/lazy-load-component.js'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    number: {
      type: Number,
      default: 0,
    },
  },
  i18n: {
    messages: i18n,
  },
  components: {
    ProductCategory,
    Rate,
    Prices,
    ProductStock: lazyLoadComponent({
      componentFactory: () =>
        import('@@/../components/charts/ProductStock.vue'),
    }),
    RankNumber,
    Lzimg,
    LazyComp01,
  },
  data() {
    return {
      chartOpt: {
        name: 'Pips',
        currency: '',
        fixedVal: 1,
      }
    }
  },
  created() {
    if (this.product.chart) {
      this.product.chart.sort((a, b) => (a[0] > b[0] ? 1 : -1))
    }
  },
}
</script>

<style lang="scss" scoped>
.product-hZNcL {
  border-bottom: 1px dotted #aaa;
  .chart-wrapper {
    flex: 0 0 212px;
    height: 130px;
    /deep/ .loader {
      height: 120px !important;
    }
  }
  .rank-number {
    top: 10px;
    left: 10px;
  }
}
.title {
  /deep/ a {
    font-size: 16px;
    &:hover {
      text-decoration: none;
    }
  }
  b {
    color: #666;
  }
}
.title01 {
  display: inline-block;
  min-width: 45px;
}
.title02 {
  display: inline-block;
  min-width: 155px;
}
.price-rate {
  justify-content: flex-end;
  /deep/ .old-price {
    color: #666;
  }
}
.info {
  color: #5b5b5b;
  margin-top: 3px;
  height: 35px;
}
.rate /deep/ {
  .rate-num {
    color: #5b5b5b;
  }
}
.chart-empty {
  height: 103px;
  width: 190px;
  font-size: 35px;
  border: 1px solid #e6e6e6;
  margin: 8px auto 0 auto;
  color: #888;
  background-image: url(/img/assets/pc/common/chart_nodata.jpg);
  background-size: 100% 100%;
}
.readtrade {
  background-color: #bf9e6c;
  color: #fff;
  font-size: 1rem;
  display: inline-block;
  min-width: 40px;
  padding: 0 2px;
  height: 17px;
  line-height: 19px;
  border-radius: 5px;
  text-align: center;
  margin-left: 5px;
}
</style>
