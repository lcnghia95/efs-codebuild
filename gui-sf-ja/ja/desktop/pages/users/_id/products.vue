<template>
  <div>
    <ProductPanel v-if="onSalesSlice.length" :show-more="onSalesShowMore" :profit-title="$t(34)"
                  :products="onSalesSlice" :id="$route.params.id"
                  :title="$t(25)" :on-load-more="onSalesShowMore ? () => onLoadMore('onSales') : undefined" />
    <ProductPanel v-if="postSalesSlice.length" :show-more="postSalesShowMore" :profit-title="$t(34)"
                  :products="postSalesSlice" :id="$route.params.id"
                  :title="$t(27)" :on-load-more="() => onLoadMore('postSales')" />
    <ProductPanel v-if="preSalesSlice.length" :show-more="preSalesShowMore" :profit-title="$t(34)"
                  :products="preSalesSlice" :id="$route.params.id"
                  :title="$t(38)" :on-load-more="() => onLoadMore('preSales')" />
    <ProductPanel v-if="prProductsSlice.length" :show-more="prProductsShowMore" :profit-title="$t(34)"
                  :products="prProductsSlice" :id="$route.params.id"
                  :title="$t(28)" :on-load-more="() => onLoadMore('prProducts')" />
  </div>
</template>

<script>
import { getPrProduct } from '@/js/users'
import ProductPanel from '@/components/user/ProductPanel.vue'
import i18n from '@@/lang/desktop/users-id.json'
import Title04 from '@/components/review/Title04.vue'
import LoadMore from '@/components/user/LoadMore.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Title04,
    LoadMore,
    ProductPanel,
  },
  created() {
    if (process.browser) {
      history.replaceState({}, '', location.pathname)
    }
  },
  async asyncData({ app, params, query }) {
    let products = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${params.id}/product`
      ),
      obj = {
        prProducts: [],
        prProductsSlice: [],
        prProductsShowMore: false,
        onSales: [],
        onSalesSlice: [],
        onSalesShowMore: false,
        postSales: [],
        preSales: [],
        postSalesSlice: [],
        preSalesSlice: [],
        postSalesShowMore: false,
      }
    if (
      !(products.onSales || []).length &&
      !(products.postSales || []).length &&
      !(products.preSales || []).length
    ) {
      obj.prProducts = await getPrProduct(app)
      obj.prProductsSlice = obj.prProducts.slice(0, 6)
      obj.prProductsShowMore = obj.prProductsSlice.length > 5
    } else {
      obj.onSales = products.onSales || []
      obj.onSalesShowMore = !('notShowMore' in query || obj.onSales.length < 6)
      if (obj.onSalesShowMore) {
        // slice the redundant sale products for sale
        obj.onSalesSlice = obj.onSales.slice(0, 6)
      } else {
        obj.onSalesSlice = obj.onSales.slice(0)
      }

      obj.postSales = products.postSales || []
      obj.postSalesSlice = obj.postSales.slice(0, 6)
      obj.postSalesShowMore = obj.postSalesSlice.length > 5

      obj.preSales = products.preSales || []
      obj.preSalesSlice = obj.preSales.slice(0, 6)
      obj.preSalesShowMore = obj.preSalesSlice.length > 5
    }
    return obj
  },
  methods: {
    onLoadMore(prop) {
      this[`${prop}Slice`] = this[prop]
      this[`${prop}ShowMore`] = false
    },
  },
}
</script>
