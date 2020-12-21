<template>
  <div>
    <div style="background: #ff8400;">
      <div class="condition-header">{{ $t(6) }}</div>
    </div>
    <div class="area-header">{{ largeName }}<template v-if="mediumName"> > {{ $t(8, {medium: mediumName}) }}</template></div>
    <div class="num-box">{{ $t(7, {n: total || 0 }) }}</div>
    <div class="p-10">
      <EvenItem class="mt-15" v-for="(item, index) in data" :key="index" :item="item" />
      <Loading v-if="isLoading" />
      <div v-else @click="handleShowMore">
        <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" v-if="!isEndOfPaging" />
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/event-area.json'
import { filterInt } from '@/utils/client/common'
import EvenItem from '@/components/event/EvenItem.vue'
import Loading from '@@/../components/icons/Loading.vue'
import LoadMore from "@/components/common/LoadMore.vue"

const obj = Object.assign(
  {
    validate({ params }) {
      return (
        !isNaN(filterInt(params.large)) &&
        (!params.medium || !isNaN(filterInt(params.medium)))
      )
    },
    components: {
      EvenItem,
      Loading,
      LoadMore,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return { 
        isLoading: false,
      }
    },
    computed: {
      titleChunk() {
        return this.$t('5', { area: this.largeName })
      },
    },
    async asyncData({ app, params, error }) {
      let locale = app.i18n.locale,
        limit = 10,
        data = await app.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            lAreaId: params.large || null,
            mAreaId: params.medium || null,
            page: params.p || 1,
            limit,
          },
        }),
        path = `/event/area/${params.large}/${params.medium || ''}`,
        largeName = i18n[locale]['large-areas'][params.large],
        mediumName = params.medium ? i18n[locale]['medium-areas'][params.medium] : '',
        total = data.total || 0,
        isEndOfPaging = false

      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      data = data.data || []
      if (data.length < limit) {
        isEndOfPaging = true
      }
      return {
        data,
        isEndOfPaging,
        params,
        total,
        limit,
        page: params.p || 1,
        mediumName,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${path}`,
          },
        ],
        largeName,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('4', { area: this.areaName })
      },
      async handleShowMore() {
        if (this.isEndOfPaging || this.isLoading) {
          return
        }
        this.isLoading = true
        let data = await this.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            page: this.page + 1,
            lAreaId: this.params.large || null,
            mAreaId: this.params.medium || null,
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
<style lang="scss" scoped>
.condition-header {
  height: 100px;
  background-image: url(/img/assets/mobile/event/UI_02.png);
  background-size: 100% 100px;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 100px;
  font-size: 25px;
  color: #fff;
  font-weight: bold;
}
.area-header {
  height: 50px;
  padding: 10px;
  background: #d9d9d9;
  color: #000;
  font-weight: bold;
  font-size: 16px;
  line-height: 32px;
}
.num-box {
  line-height: 50px;
  text-align: right;
  padding-right: 10px;
  font-weight: bold;
  font-size: 19px;
  height: 50px;
  margin-bottom: -20px;
}
/deep/ .btn-loadmore .icon-cls {
  width: 15px !important;
  height: 15px !important;
}
</style>