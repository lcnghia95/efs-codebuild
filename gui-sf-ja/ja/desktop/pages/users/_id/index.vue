<template>
  <div>
    <ProductPanel v-if="products.length" :show-more="products.length > 5"
                  :products="products" :id="$route.params.id"
                  :title="$t(productTitle)" :profit-title="$t(34)"
    />
    <div v-if="traders.length" class="panel p-40 mb-20">
      <Title04 :title="$t(39)" class="mb-30" style="text-transform: uppercase;" />
      <TradeInfo
        v-for="(item, index) in traders"
        :key="index"
        :data="item"
        :num="index + 1"
        class="trade-info"
      />
      <LoadMore :href="`${$route.params.id}/realtrade`" class="mt-20" :text="$t(14)" />
    </div>
    <div class="panel p-40 mb-20" v-if="$parent.blog.length">
      <Title04 :title="($parent.profile.nickName || '')+$t(29)" class="mb-30" />
      <UserBlog class="mt-40 mb-40" :data="item" v-for="(item, index) in $parent.blog" :key="'userBlog'+index" />
      <LoadMore :href="`${$route.params.id}/blog`" class="mt-20" :text="$t(14)" />
    </div>
  </div>
</template>

<script>
import { getPrProduct } from '@/js/users'
import ProductPanel from '@/components/user/ProductPanel.vue'
import TradeInfo from '@/components/user/TradeInfo.vue'
import UserBlog from '@/components/user/UserBlog.vue'
import i18n from '@@/lang/desktop/users-id.json'
import Title04 from '@/components/review/Title04.vue'
import LoadMore from '@/components/user/LoadMore.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ProductPanel,
    Title04,
    UserBlog,
    LoadMore,
    TradeInfo
  },
  async asyncData({ app, params }) {
    let products = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${params.id}/product`
      ),
      obj = { products: [] }
    if (!Object.keys(products).length || !(products.onSales || []).length) {
      obj.products = await getPrProduct(app)
      obj.productTitle = 28
    } else {
      obj.products = products.onSales || []
      obj.productTitle = 25
    }
    obj.products = (obj.products || []).slice(0, 6)

    // realtrade 120001 192016 params.id
    const result = await app.GoGoHTTP.get(`/api/v3/surface/profile/${params.id}/realtrade?limit=3`)

    if (!Object.keys(result).length || !(result.data || []).length) {
      obj.traders = []
    } else {
      obj.traders = (result.data || [])
    }

    return obj
  },
}
</script>
