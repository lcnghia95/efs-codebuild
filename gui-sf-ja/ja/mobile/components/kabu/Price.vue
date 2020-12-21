<template>
  <div class="price-cls flex grow1" :class="{'layout-col': isVertical}" :style="isMobile ? 'flex-direction:column-reverse' :null ">
    <template v-if="typeof price === 'number'">
      <strong class="co-red">
        {{ !rightCurr ? priCurrency + formatNumber(iPrice, $t('1')) : formatNumber(iPrice, $t('1')) + priCurrency }}
      </strong>
      <strong v-if="iDiscountPrice">
        <span class="old-price co-black">
          {{ !rightCurr ? priCurrency + formatNumber(iDiscountPrice) : formatNumber(iDiscountPrice) + priCurrency }}
        </span>
        <span v-if="iDiscountFree && (iDiscountPrice - iPrice > 0)">({{ ((iDiscountPrice - iPrice) / iDiscountPrice * 100).toFixed(1) }}% OFF)</span>
      </strong>
    </template>
    <template v-else>
      <strong class="co-red" v-if="!iDiscountFree && !iDiscountPrice && maxPrice === null">
        {{ !rightCurr ? priCurrency + formatNumber(iPrice, $t('1')) : formatNumber(iPrice, $t('1')) + priCurrency }}
      </strong>
      <strong class="co-red" v-else-if="maxPrice !== null">
        {{ rangePrice.minPart + ' &#12316; ' + rangePrice.maxPart }}
      </strong>
      <template v-else-if="iDiscountPrice">
        <span class="co-red">
          <b>{{ !rightCurr ? priCurrency + formatNumber(iDiscountPrice) : formatNumber(iDiscountPrice) + priCurrency }}</b>
        </span>
        <span class="old-price co-black">
          <b>{{ !rightCurr ? priCurrency + formatNumber(iPrice) : formatNumber(iPrice) + priCurrency }}</b>
        </span>
      </template>
      <template v-else-if="iDiscountFree">
        <strong><span class="co-red">{{ $t('1') }}</span></strong>
        <span class="old-price co-black">
          <b>{{ !rightCurr ? priCurrency + formatNumber(iPrice) : formatNumber(iPrice) + priCurrency }}</b>
        </span>
      </template>
    </template>
  </div>
</template>
<script>
import i18n from '@@/lang/components/price.json'
export default {
  props: {
    oldPrice: Number,
    price: [Number, Object],
    isVertical: Boolean,
    currency: String,
    hasOff: Boolean,
    /**
     * The position of currency: true: right, false: left
     */
    rightCurr: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  i18n: {
    messages: i18n,
  },
  created() {
    this.processData()
  },
  watch: {
    price() {
      this.processData()
    },
    oldPrice() {
      this.processData()
    },
  },
  methods: {
    processData() {
      if (typeof this.price === 'object') {
        // preprocess data for new API
        let p = this.price
        this.iPrice = p.price
        this.iDiscountPrice = p.discountPrice
        // Display price range for the product support multiple external product
        // Detail in https://gogojungle.backlog.jp/view/OAM-27924
        this.maxPrice = p.maxPrice
        this.minPrice = p.minPrice
      } else if (typeof this.price === 'number') {
        // preprocess data for old API
        this.iPrice = this.price
        this.iDiscountPrice = this.oldPrice
        this.iDiscountFree = this.hasOff
      }
    },
  },
  data: () => ({
    iPrice: null,
    iDiscountPrice: null,
    iDiscountFree: null,
  }),
  computed: {
    priCurrency() {
      let c = this.iPrice && (this.currency || '￥')
      return c || ''
    },
    rangePrice () {
      let minPart = '', maxPart= ''
      if (!this.rightCurr) {
        minPart = this.minPrice ? this.priCurrency + this.formatNumber(this.minPrice, this.$t('1')) : ''
        maxPart = this.maxPrice? this.priCurrency + this.formatNumber(this.maxPrice, this.$t('1')) : ''
      }else {
        minPart = this.minPrice ? this.formatNumber(this.minPrice, this.$t('1')) + this.priCurrency: ''
        maxPart = this.maxPrice ? this.formatNumber(this.maxPrice , this.$t('1')) +  this.priCurrency : ''
      }
      return  {minPart, maxPart}
    },
  },
}
</script>

<style scoped lang="scss">
.price-cls:not(.layout-col) .co-red {
  margin-right: 5px;
}
.old-price {
  text-decoration: line-through;
  color: #434343;
  font-size: 14px;
  margin-top: 3px;
}
.co-red {
  color: red;
  font-size: 18px;
}
</style>

<docs>
  ```vue
  <template>
    <Price :price="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
  ```vue
  <template>
    <Price :price="item" :is-vertical="true" currency="$" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
  ```vue
  <template>
    <Price :price="item" :is-vertical="true" currency="$" :right-curr="true" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
</docs>
