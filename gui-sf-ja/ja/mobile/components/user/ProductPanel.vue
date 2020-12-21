<template>
  <div class="page-custom mb-20 bg-white">
    <div class="user-warpper">
      <div class="user-product flex layout-col" v-for="data in products" :key="'sale-product-' + data.id">
        <a :href="data.detailUrl" class="img-url text-center">
          <img :src="`/img/products/${data.id}/small`" alt="" />
        </a>
        <a :href="data.detailUrl" :title="data.name" class="wrap-text detail no-underlying">
          <span class="col-greyish"> {{ data.typeId ? $t('types.'+ data.typeId) : null }} </span>
          <span class="col-warmgrey name">
            <div v-wrap-lines="2" class="wrap-text custom-name"> {{ data.name }} </div>
          </span>
          <span v-if="data.profit" class="no-underlying" style=""><b>{{ profitTitle }}: <br /> {{ formatProfit(data.profit) }}円</b></span>
        </a>
        <Price :is-vertical="true" :class="{ 'reverse-price': (data.price && data.price.oldPrice) }"
               :price="(data.price || {}).price" :old-price="(data.price || {}).oldPrice" :is-mobile="true"
        />
      </div>
    </div>
    <LoadMore v-if="showMore" @click.native="handleLoadMore" />
  </div>
</template>

<script>
import Price from '@@/../components/prices/Price.vue'
import LoadMore from "@/components/common/LoadMore.vue"
import i18n from '@@/lang/components-mobile/cart-product-list.json'

export default {
  components: {
    Price,
    LoadMore,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    id: [Number, String],
    profitTitle: String,
    showMore: Boolean,
    products: {
      type: Array,
    },
    onLoadMore: Function,
  },
  methods: {
    handleLoadMore(e) {
      if (!this.onLoadMore) {
        return
      }
      e.preventDefault()
      this.onLoadMore()
    },
    formatProfit(num){
      return Math.floor(num).toLocaleString('en-GB', {
          minimumFractionDigits: 0,
        })
    }
  },
}
</script>
<style lang="scss" scoped>
:root {
  --border: 0.25px solid rgb(243, 240, 239);
}
.user-warpper {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
}
.user-product {
  border-top: var(--border);
  border-left: var(--border);
  border-right: var(--border);
  border-bottom: var(--border);
  .img-url {
    display: block;
    width: 100%;
    height: 28vw;
    margin: 10px auto;
    img {
      width: 28vw;
      max-width: 28vw;
      max-height: 100%;
      background-color: #e6e9ec;
    }
  }
  > .detail {
    margin: 0 auto;
    width: 28vw;
    max-height: 7.5em;
    min-height: 6em;
    line-height: 1.5em;
  }
  > div {
    margin: 0 auto;
    width: 28vw;
    margin-bottom: 5px;
    > a {
      display: block;
    }
    > b {
      width: 130px;
    }
  }
}
.page-custom /deep/ .btn-loadmore {
  color: #333;
  padding: 15px 0;
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
.custom-name {
  min-height: 3em;
}
</style>