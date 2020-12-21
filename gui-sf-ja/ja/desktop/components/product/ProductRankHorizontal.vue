<template>
  <a :href="product.detailUrl" class="ranking-wrapp mt-5 mb-5 ml-15 mr-15">
    <div class="rank-index flex mid" :class="{'co-red' : imgIndex < 4, 'co-black': imgIndex > 3}">
      {{ imgIndex }}
    </div>
    <div class="product-title pr-10">
      <div :title="product.name" class="fs-13" style="max-height: 38px;" :class="'co-rank-' + colorIndex"
           v-wrap-lines="2"
      >
        {{ product.name }}
      </div>
      <span class="product-description fs-12" :title="product.description"
            v-wrap-lines="2"
      >
        {{ product.description }}
      </span>
      <span v-if="displayPips && product.pips" class="product-pips">
        {{ formatNumber(product.pips) }} pips
      </span>
    </div>
    <GoogleLineChart
      v-if="product.typeId === 1"
      class="img-chart shadow"
      :size="[45, 45]"
      :data="product.chart"
    />
    <Lzimg
      v-else
      class="product-img shadow"
      :data-src="'/img/products/' + product.id + '/small'"
      :alt="product.name + ' ' + (category || '')"
    />
  </a>
</template>

<script>
import Lzimg from '@@/../components/Lzimg.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'

export default {
  components: { Lzimg, GoogleLineChart },
  props: ['product', 'imgIndex', 'colorIndex', 'category', 'displayPips'],
  methods: {
    numberWithCommas(x) {
      const fixedNumber =  x.toFixed(1)
      return fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
</script>

<style scoped lang="scss">
.ranking-wrapp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  border-bottom: 1px #b4b5b6 solid;
  &:hover {
    background: #f5f5f5;
    text-decoration: none;
    color: #337ab7;
  }
  &:last-child {
    border-bottom: 0;
  }
}
.rank-index {
  font-size: 30px;
  font-style: italic;
  flex: 0 0 45px;
  letter-spacing: -5px;
  font-weight: bold;
  &.co-red {
    color: red;
  }
  &.co-black {
    color: #666;
  }
}
.product-title {
  flex: 1 1 auto;
  div:first-child {
    font-weight: bold;
    max-height: 38px;
    overflow-y: hidden;
    line-height: 19px;
  }
  .co-rank {
    &-all {
      color: #b4b36f;
    }
    &-ea {
      color: #6cb6fc;
    }
    &-etc {
      color: orange;
    }
    &-rt {
      color: #16a085;
    }
  }
  span {
    display: block;
    color: #079ee3;
    max-height: 34px;
    overflow-y: hidden;
    line-height: 17px;
  }
}
.product-pips {
  font-weight: bold;
}
.product-img {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
}
.img-chart {
  flex: 0 0 45px;
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 320px; ">
      <ProductRankHorizontal :imgIndex="1" :product="product" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        product: {
          description: '【在庫なくなり次第27,800円に値上げ】FXトレード日本一...',
          detailUrl: '/systemtrade/fx/12391',
          id: 12391,
          name: 'Flashes for EURUSD',
          typeId: 1,
        },
      }
    },
  }
  </script>
  ```
</docs>
