<template>
  <div class="w-1000 info-8XNKw">
    <div class="info-filter mt-25 mb-25">
      <input
        type="checkbox"
        value="1"
        v-model.number="filter"
        :id="uid + 'magazine'"
      />
      <label class="ml-10" :for="uid + 'magazine'">
        <Check class="s-18" v-if="filter.includes(1)" />
        <p class="col2 text-center">{{ $t('1') }}</p>
      </label>
      <input
        type="checkbox"
        value="2"
        v-model.number="filter"
        :id="uid + 'notice'"
      />
      <label class="ml-10" :for="uid + 'notice'">
        <Check class="s-18" v-if="filter.includes(2)" />
        <p class="col1 text-center">{{ $t('2') }}</p>
      </label>
    </div>
    <Info
      v-for="(product, index) in productList.data"
      :year="year"
      :type="type"
      :product="product"
      :key="index + 't1SpX'"
    />
    <div class="text-center mt-40">
      <paging
        :has-scroll="true"
        :is-add-url-param01="true"
        :cur-page="productList.currentPage"
        :total="productList.lastPage"
        :from="productList.pagingFrom"
        :to="productList.pagingTo"
        :url-param="'/info'"
        @pagingclick="getDataPaging"
      />
    </div>
  </div>
</template>

<script>
import Check from '@@/../components/icons/Check.vue'
import Paging from '@@/../components/paging/Paging.vue'
import HeaderBrownLine from '@/components/common/HeaderBrownLine.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/info.json'
import { filterInt } from '@/utils/client/common'
import Info from '@/components/info/Info.vue'
const typeList = {
  normal: { 1: [1, 3], 2: [2, 4] },
  seller: { 1: [1, 5], 2: [2, 6] },
  partner: { 1: [1, 7], 2: [2, 8] },
}
const obj = Object.assign(
  {
    components: {
      Paging,
      HeaderBrownLine,
      Check,
      Info,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        uid: '7xlS1',
      }
    },
    watch: {
      filter() {
        this.page = 1
        this.changeRoute()
      },
    },
    methods: {
      getDataPaging(page) {
        this.page = page
        this.changeRoute()
      },
      changeRoute() {
        let _url = `/info${this.type ? '/' + this.type : ''}${
          this.year ? '/y/' + this.year : ''
        }${this.page ? '/p/' + this.page : ''}${
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
    },
    async asyncData({ app, params }) {
      let page = filterInt(params.p) || 1,
        year = filterInt(params.y) || new Date().getFullYear(),
        t = params.t || null,
        type = params.type || null,
        filterVal = typeList[params.type || 'normal'],
        filter = t ? t.split(',').map(i => filterInt(i)) : [],
        len = filter.length,
        productList = [],
        filterArray = [],
        alternateList = []
      if (len === 2 || len === 0) {
        filterArray = filterVal[1].concat(filterVal[2])
      } else {
        filterArray = filterVal[filter[0]]
      }
      productList = await app.GoGoHTTP.get(
        `/api/v3/surface/info?page=${page}&year=${year}&type=${filterArray}`
      )
      if(!type) {
        alternateList = [
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/info`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/info`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/info`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/info`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/info`,
          }
        ]
      }
      return {
        productList,
        filter,
        page,
        year,
        type,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/info${type ? '/' + type : ''}`,
          }
        ].concat(alternateList),
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
}
.col1 {
  background-color: #99cdff;
}
.col2 {
  background-color: #aaefcd;
}
.col1,
.col2 {
  padding: 3px 0 2px;
  border-radius: 5px;
}
.info-filter {
  font-size: 14px;
  padding: 18px 50px;
  background: #f5f6f5;
  align-items: center;
  [type='checkbox']:not(:checked),
  [type='checkbox']:checked {
    position: absolute;
    left: -9999px;
  }
  [type='checkbox']:not(:checked) + label,
  [type='checkbox']:checked + label {
    position: relative;
    padding-left: 30px;
    cursor: pointer;
  }
  [type='checkbox']:not(:checked) + label::before,
  [type='checkbox']:checked + label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 3px;
    width: 19px;
    height: 19px;
    border: 1px solid #666;
    background: #fff;
    border-radius: 3px;
  }
  [type='checkbox']:not(:checked) + label::after {
    opacity: 0;
    transform: scale(0);
  }
  [type='checkbox']:checked + label::after {
    opacity: 1;
    transform: scale(1);
  }
  label {
    margin: 0;
    font-weight: normal;
    margin-right: 40px;
    p {
      width: 82px;
      margin: 0;
    }
  }
}
.s-18 {
  position: absolute;
  left: 1px;
  top: 4px;
  width: 18px;
  height: 18px;
  color: #b2b2b2;
}
</style>
