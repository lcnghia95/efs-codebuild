<template>
  <div>
    <product-rank-list
      :data="productRank"
      :left-title="mainLeftTitle"
      :right-economics-title="economics"
      revenue="economics"
      :on-go-page="onGoPage"
      :origin-url="originUrl"
      category="fx"
    >
      <template slot-scope="prop">
        <ProductRankHorizontal05
          class="mb-10"
          :product="prop.product"
          :number="prop.number"
          :key="prop.product.id"
        />
      </template>
    </product-rank-list>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import ProductRankList from '@/components/systemtrade/ProductRankList.vue'
import ProductRankHorizontal05 from '@@/../components/product/ProductRankHorizontal05.vue'
import i18n from '@@/lang/desktop/system-economics.json'

const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return ~['1', '2'].indexOf(params.type)
    },
    i18n: {
      messages: i18n,
    },
    components: { ProductRankList, ProductRankHorizontal05 },
    data() {
      return {
        category: null,
      }
    },
    computed: {
      mainLeftTitle() {
        if (this.economics && this.economics[this.type - 1]) {
          return this.economics[this.type - 1].title
        }
        return ''
      },
    },
    async asyncData({ app, params, store, error }) {
      let type = params.type,
        page = params.p || 1,
        [productRank, economics] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/v3/surface/systemtrade/fx/rank/economics/${type}`,
            {
              params: {
                type: 1,
                page,
                limit: 20
              },
            }
          ),
          app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/rank/economics`),
        ]),
        originUrl = `/systemtrade/economics/fx/${type}`,
        titleChunk
      if (
        (!productRank || !(productRank.data).length) &&
        (!economics || !economics.length)
      ) {
        return error({ statusCode: 404 })
      }
      titleChunk = (economics[type - 1] || {}).title || ''
      store.commit('pushBC', {
        name: titleChunk,
        target: {
          name: 'systemtrade-index-economics-fx-type',
          params: params,
        },
      })
      return {
        productRank,
        economics,
        type,
        originUrl,
        page,
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/economics/fx/${type}`,
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('d' + this.type)
      },
      onGoPage(_page) {
        location.href = `${this.originUrl}/p/${_page}`
      },
    },
  },
  title
)
export default obj
</script>
