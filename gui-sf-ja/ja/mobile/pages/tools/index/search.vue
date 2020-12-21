<template>
  <section>
    <div class="search-wrapp w-full pt-20 pb-20 pl-25 pr-25" v-if="selectedCategories.length || selectedKeywords.length">
      <div v-if="selectedCategories.length" class="flex fs-12">
        <b class="title-selected">{{ $t('15') }}</b>
        <div class="flex flex-wrap">
          <div v-for="(item, i) in selectedCategories" :key="'cate-' + i" class="ml-15">
            {{ $t('categories.' + item) }}
          </div>
        </div>
      </div>
      <div v-if="selectedKeywords.length" class="flex mt-10 fs-12">
        <b class="title-selected">{{ $t('14') }}</b>
        <div class="flex flex-wrap">
          <div v-for="(item, i) in selectedKeywords" :key="'key-' + i" class="ml-15">
            {{ $t('keywords.' + item) }}
          </div>
        </div>
      </div>
    </div>
    <div class="search-result flex mid mt-30 pl-15 pr-15">
      <Search class="mr-5" />
      <b>{{ $t('18') }}({{ dataSearch.length }}{{ $t('19') }})</b>
    </div>
    <div v-if="dataShow.length">
      <div class="text-center mt-10 mb-10">
        <paging :cur-page="paging.currentPage"
                :total="paging.lastPage"
                :from="paging.pagingFrom"
                :to="paging.pagingTo"
                :has-scroll="true"
                :scroll-offset="250"
                @pagingclick="onGetDataPage"
        />
      </div>
      <div class="flex flex-wrap p-5 center">
        <ProductVertical01 class="cursor-pointer mt-10" v-for="list in dataShow"
                           :key="'list' + list.id" :product="list" type="tools"
        />
      </div>
      <div class="text-center mt-15 mb-50">
        <paging :cur-page="paging.currentPage"
                :total="paging.lastPage"
                :from="paging.pagingFrom"
                :to="paging.pagingTo"
                :has-scroll="true"
                :scroll-offset="250"
                @pagingclick="onGetDataPage"
        />
      </div>
    </div>
    <div v-else-if="data.length" class="text-center mt-20 co-red">{{ $t('17') }}</div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@@/lang/desktop/tools-index-search.json'
import ProductVertical01 from '@/components/product/ProductVertical01.vue'
import Paging from '@/components/paging/Paging.vue'
import Search from '@@/../components/icons/Search.vue'
import { calPaging, pushState, encodeURL } from '@/utils/client/common'
import SortUp from '@@/../components/icons/SortUp.vue'
import SortDown from '@@/../components/icons/SortDown.vue'
import title from '@@/../common/pages'

let searchFn = function(
  dataSearch,
  selectedKeywords = [],
  selectedCategories = [],
  textSearch
) {
  if (selectedKeywords.length) {
    dataSearch = dataSearch.filter(obj =>
      (obj.keywords || []).some(item => {
        return selectedKeywords.includes(item)
      })
    )
  }
  if (selectedCategories.length) {
    dataSearch = dataSearch.filter(obj =>
      (obj.categories || []).some(item => {
        return selectedCategories.includes(item)
      })
    )
  }
  if (textSearch) {
    let tmp = textSearch.split(' ')
    for (let i = tmp.length - 1; i >= 0; i--) {
      dataSearch = dataSearch.filter(obj => obj.name.indexOf(tmp[i]) !== -1)
    }
  }
  return dataSearch
}
const obj = Object.assign(
  {
    components: {
      ProductVertical01,
      Paging,
      SortUp,
      SortDown,
      Search,
    },
    data() {
      return {
        data: [],
        dataSearch: [],
        dataShow: [],
        textSearch: null,
        isShowModal: false,
        tabs: [this.$t('5'), this.$t('6'), this.$t('7'), this.$t('8')],
        sortType: 0,
        selectedTab: 0,
        paging: {
          currentPage: 1,
          lastPage: 1,
          pagingFrom: 1,
          pagingTo: 1,
        },
        timer: null,
        titleChunk: this.$t('21'),
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      ...mapGetters({
        selectedCategories: 'tools/getToolsCategories',
        selectedKeywords: 'tools/getToolsKeywords',
      }),
    },
    watch: {
      selectedCategories() {
        this.onSearch()
      },
      selectedKeywords() {
        this.onSearch()
      },
    },
    methods: {
      onSearch() {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.dataShow = []
          this.paging.currentPage = 1
          this.dataSearch = searchFn(
            this.data,
            this.selectedKeywords,
            this.selectedCategories,
            this.textSearch
          )
          this.calcDataShow()
        }, 500)
      },
      calcDataShow() {
        let dataPaging = calPaging(
            this.dataSearch,
            this.paging.currentPage,
            30,
            4
          ),
          cat = this.selectedCategories.toString(),
          key = this.selectedKeywords.toString(),
          p = dataPaging.currentPage
        this.paging = {
          currentPage: p,
          lastPage: dataPaging.lastPage,
          pagingFrom: dataPaging.pagingFrom,
          pagingTo: dataPaging.pagingTo,
        }
        this.dataShow = dataPaging.data
        pushState({ cat, key, p, t: encodeURL(this.textSearch) }, null, '?')
      },
      onGetDataPage(_page) {
        this.paging.currentPage = _page
        this.calcDataShow()
      },
      descriptionTemplate() {
        return this.$t('20')
      },
    },
    async asyncData({ app, req, store }) {
      let data = await app.GoGoHTTP.get('/api/v3/surface/tools/search/all'),
        { cat, key, p = 1, t = '' } = req.query
      cat && (cat = cat.split(','))
      key && (key = key.split(','))

      if (cat != undefined) {
        store.commit('tools/setToolsCategories', cat)
      }

      if (key != undefined) {
        store.commit('tools/setToolsKeywords', key)
      }

      let dataSearch = searchFn(data, key, cat, t),
        dataPaging = calPaging(dataSearch, parseInt(p), 30, 4),
        paging = {
          currentPage: dataPaging.currentPage,
          lastPage: dataPaging.lastPage,
          pagingFrom: dataPaging.pagingFrom,
          pagingTo: dataPaging.pagingTo,
        }

      return {
        data: data,
        dataSearch,
        dataShow: dataPaging.data,
        paging,
        textSearch: t,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/search`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.co-red {
  color: red;
}
.search-wrapp {
  background: #ccd1d9;
  .search-input {
    b {
      flex: 0 0 130px;
      color: #434a54;
    }
    .input-text {
      height: 30px;
      border: 1px solid #434a54;
      padding: 0 115px 0 15px;
      &::placeholder {
        color: #9c9c9c;
      }
    }
    .btn-search {
      top: 0;
      right: 0;
      width: 100px;
      height: 30px;
      background: #434a54;
      color: white;
      outline: none;
      border: none;
      &:hover {
        opacity: 0.9;
      }
    }
  }
  .title-selected {
    color: #434a54;
    flex: 0 0 130px;
  }
}
.search-result {
  font-size: 18px;
  color: #337ab7;
  letter-spacing: 2px;
  i {
    width: 30px;
    height: 31px;
  }
}
</style>
