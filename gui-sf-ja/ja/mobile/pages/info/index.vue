<template>
  <div class="info-8XNKw">
    <div class="top-title mt-20 p-10">
      <b>{{ $t('1') }}</b>
    </div>
    <YearSliders @year="onSelectYear" :year="year" />
    <div class="select-filter flex space-around ml-10 mr-10">
      <div class="btn-filter" :class="{'btn-active': !filter.length || (filter.includes(1) && filter.includes(2))}" @click="onSelectFilter(0)">
        {{ $t('5') }}
      </div>
      <div class="btn-filter" :class="{'btn-active': filter.length == 1 && filter.includes(1)}" @click="onSelectFilter(1)">
        {{ $t('1') }}
      </div>
      <div class="btn-filter" :class="{'btn-active': filter.length == 1 && filter.includes(2)}" @click="onSelectFilter(2)">
        {{ $t('2') }}
      </div>
    </div>
    <div class="flex layout-col mt-10 p-10">
      <LazyComp01 class="info-item pt-10 pb-10" min-height="100px" v-for="(product, index) in dataShow" :key="'item-' + index + product.id">
        <div class="flex mid space-between">
          <span class="time-color">{{ formatTime(product.date, 8) }}</span>
          <div class="grow80 text-center" :class="'col' + product.type">
            {{ $t(product.type) }}
          </div>
        </div>
        <a class="content mt-10" :href="`/info/${product.id}`">
          {{ product.title }}
        </a>
      </LazyComp01>
      <div class="text-center mt-30 mb-50" v-if="!dataShow.length">
        {{ $t('4') }}
      </div>
    </div>
    <div class="load-more flex center mt-25 mb-25" v-if="page < lastPage" @click="onLoadMore">
      <LoadMore v-if="!loading" />
      <Loading v-else style="width: 60px; height: 60px;" />
    </div>
  </div>
</template>

<script>
import Check from '@@/../components/icons/Check.vue'
import Paging from '@@/../components/paging/Paging.vue'
import YearSliders from '@/components/info/YearSliders.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/info.json'
import { filterInt } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import LoadMore from '@/components/common/LoadMore.vue'
import Loading from '@@/../components/icons/Loading.vue'

const typeList = {
  normal: { 1: [1, 3], 2: [2, 4] },
  seller: { 1: [1, 5], 2: [2, 6] },
  partner: { 1: [1, 7], 2: [2, 8] },
}
const types = ['seller', 'partner']
const obj = Object.assign(
  {
    components: {
      Paging,
      Check,
      YearSliders,
      LazyComp01,
      LoadMore,
      Loading,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        uid: '7xlS1',
        typeList,
        loading: false
      }
    },
    methods: {
      onSelectYear(year) {
        if (this.year != year) {
          location.href = `/info/${types.includes(this.type) ? this.type + '/' : ''}y/${year}`
        }
      },
      changeRoute() {
        let _url = `/info${this.type ? '/' + this.type : ''}${
          this.year ? '/y/' + this.year : ''
        }${
          this.filter.length ? '/t/' + this.filter.join(',') : ''
        }`
        location.href = _url
      },
      descriptionTemplate() {
        return this.$t(`${this.type || ''}Des`)
      },
      titleTemplate(titleL) {
        let chunk = this.type
          ? `「${this.$t(this.type)}」 ${this.$t('2')}`
          : this.$t('2')
        return `${chunk} - ${titleL.title}`
      },
      onSelectFilter(idx) {
        this.filter = idx ? [idx] : []
        this.changeRoute()
      },
      onLoadMore() {
        this.loading = true
        let page = this.page + 1,
          filterVal = typeList[this.type || 'normal'],
          filter = this.t ? this.t.split(',').map(i => filterInt(i)) : [],
          len = filter.length,
          filterArray = []
        if (len === 2 || len === 0) {
          filterArray = filterVal[1].concat(filterVal[2])
        } else {
          filterArray = filterVal[filter[0]]
        }
        this.GoGoHTTP.get(`/api/v3/surface/info?page=${page}&year=${this.year}&type=${filterArray}&limit=20`)
          .then(data => {
            this.dataShow = this.dataShow.concat(data.data || [])
            this.lastPage = data.lastPage
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    async asyncData({ app, params }) {
      let page = 1,
        year = filterInt(params.y) || (new Date()).getFullYear(),
        t = params.t || null,
        type = params.type || null,
        filterVal = typeList[params.type || 'normal'],
        filter = t ? t.split(',').map(i => filterInt(i)) : [],
        len = filter.length,
        productList = [],
        filterArray = []
      if (len === 2 || len === 0) {
        filterArray = filterVal[1].concat(filterVal[2])
      } else {
        filterArray = filterVal[filter[0]]
      }
      productList = await app.GoGoHTTP.get(
        `/api/v3/surface/info?page=${page}&year=${year}&type=${filterArray}&limit=20`
      )
      return {
        dataShow: (productList.data || []),
        filter,
        page,
        lastPage: productList.lastPage,
        year,
        type,
        t,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/info${type ? '/' + type : ''}`,
          }
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.info-8XNKw {
  margin: 0 auto;
  .top-title {
    color: #434343;
    font-size: 16px;
    background-color: #f3f0ef;
  }
  .select-filter {
    border-radius: 5px;
    background: #e0e0e0;
    padding: 4px 3px;
    .btn-filter {
      border-radius: 5px;
      width: 33%;
      color: #707070;
      text-align: center;
      font-size: 15px;
      line-height: 25px;
      height: 25px;
      font-weight: 700;
    }
    .btn-active {
      background: white;
      color: #2d2d2d;
    }
  }
  .info-item {
    border-bottom: 1px solid #e0e0e0;
    .time-color {
      color: #a0a0a0;
    }
    .col1 {
      background-color: #aaefcd;
    }
    .col2 {
      background-color: #99cdff;
    }
    .col1,
    .col2 {
      padding: 2px 10px;
      border-radius: 18px;
    }
    .content {
      color: #2d2d2d;
      display: block;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .load-more {
    border-top: 1px solid #e0dedc;
    border-bottom: 1px solid #e0dedc;
  }
}
</style>
