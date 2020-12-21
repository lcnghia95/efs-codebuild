<template>
  <div class="mb-50">
    <div class="page-title col-gray flex space-between">
      <b>{{ $t(20) }}</b>
      <SelectBox class="select-box" :data-source="productsList" v-model="selectedProduct" :display="'text'" />
    </div>
    <ProductPanel v-if="onSalesSlice.length && selectedProduct===0" :show-more="onSalesShowMore" :profit-title="$t(34)"
                  :products="onSalesSlice"
                  :title="$t(25)" :on-load-more="onSalesShowMore ? () => onLoadMore('onSales') : undefined"
    />      
    <ProductPanel v-if="postSalesSlice.length && selectedProduct===1" :show-more="postSalesShowMore" :profit-title="$t(34)"
                  :products="postSalesSlice"
                  :title="$t(27)" :on-load-more="() => onLoadMore('postSales')"
    />
    <ProductPanel v-if="preSalesSlice.length && selectedProduct===2" :show-more="preSalesShowMore" :profit-title="$t(34)"
                  :products="preSalesSlice"
                  :title="$t(38)" :on-load-more="() => onLoadMore('preSales')"
    />
    <div class="no-data pt-20 pb-20" v-if="isNoData"> {{ $t(40) }} </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/users-id.json'
import ProductPanel from '@/components/user/ProductPanel.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'

export default {
  i18n: {
    messages: i18n,
  },
  data() {
      return {
        productsList: [{ 'text' :this.$t(41), 'id' : 1 },{ 'text' : this.$t(42) , 'id' : 2 },{ 'text' : this.$t(43) , 'id' : 3 }],
      }
  },
  components: {
    ProductPanel,
    SelectBox
  },
  methods: {
    onLoadMore(prop) {
      this[`${prop}Slice`] = this[`${prop}Slice`].concat(this[prop].slice(this[`total${prop}`],this[`total${prop}`]+18))
      this[`total${prop}`] = this[`${prop}Slice`].length
      this[`${prop}ShowMore`] = this[`${prop}Slice`].length < this[`${prop}`].length 
    },
  },
  computed: {
    isNoData(){
      switch (this.selectedProduct) {
        case 0:
          if (this.onSalesSlice.length===0) return true
          else return false
        case 1:
          if (this.postSalesSlice.length===0) return true
          else return false
        case 2:
          if (this.preSalesSlice.length===0) return true
          else return false  
      }
      return false
    },
  },
  async asyncData({app, params}) {
    let { id } = params,
      products = await app.GoGoHTTP.get(`/api/v3/surface/profile/${params.id}/product`),

    onSales = products.onSales || [],
    onSalesSlice = onSales.slice(0, 18),
    onSalesShowMore = onSalesSlice.length > 17,
    totalonSales = onSalesSlice.length,

    postSales = products.postSales || [],
    postSalesSlice = postSales.slice(0, 18),
    postSalesShowMore = postSalesSlice.length > 17,
    totalpostSales = postSalesSlice.length,

    preSales = products.preSales || [],
    preSalesSlice = preSales.slice(0, 18),
    preSalesShowMore = preSalesSlice.length > 17,
    totalpreSalesSale = preSalesSlice.length

    return {
      id,
      products,
      onSales,
      onSalesSlice,
      onSalesShowMore,
      totalonSales,
      postSales,
      postSalesSlice,
      postSalesShowMore,
      totalpostSales,
      preSales,
      preSalesSlice,
      preSalesShowMore,
      totalpreSalesSale,
      selectedProduct: 0,
    }
  }
}
</script>
<style lang="scss" scoped>
.page-title {
  font-size: 16px;
  padding: 12px 5px 5px 10px;
  border-bottom: 1px solid #b4b5b6;
}
.no-data {
  text-align: center;
  background-color: #fff;
}
.select-box /deep/ {
  margin-right: 5px;
  .display-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>