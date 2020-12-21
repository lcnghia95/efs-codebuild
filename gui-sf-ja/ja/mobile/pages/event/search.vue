<template>
  <div>
    <!-- header -->
    <SearchContainer :mode="'condition'"
                     @onConditionSearch="onConditionSearch"
                     @onAreaSearch="onAreaSearch"
                     :selected-condition="params"
    />
    <!-- list item of result -->
    <div class="p-10" v-if="data.length">
      <div style="text-align: right; font-size: 20px; font-weight: bold; margin-bottom: -5px;">{{ $t(3, {n: total}) }}</div>
      <EvenItem class="mt-15" v-for="item in data" :key="item.id" :item="item" />
      <Loading v-if="isLoading" />
      <div v-else @click="handleShowMore">
        <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" v-if="!isEndOfPaging" />
      </div>
    </div>
    <div v-if="Object.keys(params).length && !data.length" 
         style="height: 100px; line-height: 100px; text-align: center; font-size: 16px;"
    >
      {{ $t(4) }}
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/event-search.json'
import EvenItem from '@/components/event/EvenItem.vue'
import SearchContainer from '@/components/event/SearchContainer.vue'
import Loading from '@@/../components/icons/Loading.vue'
import LoadMore from "@/components/common/LoadMore.vue"

const obj = Object.assign(
  {
    components: {
      EvenItem,
      SearchContainer,
      Loading,
      LoadMore
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t(1),
        isLoading: false,
      }
    },
    async asyncData({ app, params, query }) {
      let limit = 10,
        data = Object.keys(params).length || query.w ? await app.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            from: params.from ? Date.parse(params.from) / 1000 : null,
            to: params.to ? Date.parse(params.to) / 1000 : null,
            keywords: query.w || '',
            categories: params.categories || null,
            page: params.p || 1,
            limit,
          },
        }) : [],
        total = data.total || 0,
        isEndOfPaging = false
      params = Object.assign(params, {keywords: query.w})
      data = data.data || []
      if (data.length < limit) {
        isEndOfPaging = true
      }
      return {
        data,
        total,
        isEndOfPaging,
        page: params.p || 1,
        params,
        limit,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/event/search',
          },
        ],
      }
    },
    methods: {
      onConditionSearch(obj) {
        location.href = `/event/search${
          obj.dateFrom ? `/from/${obj.dateFrom}` : ''
        }${obj.dateTo ? `/to/${obj.dateTo}` : ''}${
          obj.cat.length ? `/cat/${obj.cat.toString()
        }` : ''}${
          obj.w ? `?w=${encodeURIComponent(obj.w)}` : ''
        }`
      },
      onAreaSearch(obj) {
        location.href = `/event/area/${obj.large}/${obj.small}`
      },
      descriptionTemplate() {
        return this.$t(2)
      },
      async handleShowMore() {
        if (this.isEndOfPaging || this.isLoading) {
          return
        }
        this.isLoading = true
        let data = await this.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            from: this.params.from ? Date.parse(this.params.from) / 1000 : null,
            to: this.params.to ? Date.parse(this.params.to) / 1000 : null,
            keywords: this.params.keywords || null,
            categories: this.params.categories || null,
            page: this.page + 1,
            limit: this.limit,
          }
        })
        data = data.data || []
        if (data && data.length) {
          this.data = (this.data || []).concat(data)
          this.page = this.page + 1
        }
        if (data && !data.length || data.length < this.limit) {
          this.isEndOfPaging = true
        }
        this.isLoading = false
      },
    },
  },
  title
)
export default obj
</script>
