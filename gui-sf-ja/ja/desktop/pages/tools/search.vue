<template>
  <div class="w-1000">
    <div class="flex space-between mt-20">
      <div class="left-sidebar">
        <div class="w-full search-header">
          {{ $t(22) }}
        </div>
        <div class="content-list">
          <div class="sub-title">
            <b>{{ $t('23') }}</b>
          </div>
          <div class="flex layout-col flex-wrap" style="height: 290px; border-bottom: #d9d9d9 1px solid; margin: 10px;">
            <label class="label-hover flex mid cursor-pointer" v-for="(item, index) in $t('categories')" :key="'cate-' + index">
              <input type="checkbox" name="selectedCategories" :value="index" v-model="selectedCategories" />
              <span></span>
              <div class="item-lbl">{{ item }}</div>
            </label>
          </div>
          <div class="sub-title">
            <b>{{ $t('24') }}</b>
          </div>
          <div class="flex flex-wrap" style="height: 740px; border-bottom: #d9d9d9 1px solid; margin: 10px;">
            <label class="label-hover hover2 flex mid cursor-pointer" v-for="(item, index) in $t('keywords')" :key="'keyword-' + index">
              <div class="flex mid">
                <input type="checkbox" name="selectedKeywords" :value="index" v-model="selectedKeywords" />
                <span></span>
                <div class="item-lbl">{{ item }}</div>
              </div>
            </label>
          </div>
          <div class="flex flex-wrap" style="margin: 10px;">
            <button class="btn-seach" @click="onSearch">
              {{ $t('31') }}
            </button>
          </div>
        </div>
      </div>
      <!--  -->
      <section class="w-740">
        <div class="search-wrapp w-full">
          <div class="search-input">
            <div class="w-full flex mid space-between">
              <input
                type="text"
                name="condition"
                v-model="textSearch"
                :placeholder="$t('24')"
                class="input-text w-full fs-13"
                @keyup.enter="onSearch"
              />
              <Search class="search-icon" @click.native="onSearch" />
            </div>
          </div>
        </div>
        <div class="mt-20">
          <b class="title-selected">{{ $t('25') }}</b>
        </div>
        <div class="search-wrapp w-full flex flex-wrap" style="min-height: 40px;">
          <template v-if="displayCategories.length">
            <div
              v-for="(item, i) in displayCategories"
              :key="'cate-' + i"
              class="mr-10 mb-5 selected-item flex mid space-between"
            >
              <div>{{ $t('categories.' + item) }}</div>
              <div class="item-rm" @click="onRmCate(item)">×</div>
            </div>
          </template>
          <template v-if="displayKeywords.length">
            <div
              v-for="(item, i) in displayKeywords"
              :key="'key-' + i"
              class="mr-10 mb-5 selected-item flex mid space-between"
            >
              <span>{{ $t('keywords.' + item) }}</span>
              <div class="item-rm" @click="onRmKeyword(item)">×</div>
            </div>
          </template>
          <template v-if="!displayKeywords.length && !displayCategories.length">
            <div class="mr-10 mb-5  selected-item flex space-between">
              <span>{{ $t('4') }}</span>
            </div>
          </template>
        </div>
        <div class="search-result flex mid space-between mt-30">
          <div class="left-result">
            <span>{{ $t('18') }}</span>
            <span style="margin-left: 20px;">{{ dataSearch.length }}{{ $t('19') }}</span>
          </div>
          <SelectBox class="list-sort" :selected="sortType" @input="onSort" :data-source="sortList" :id-val="'id'" :display="'text'" />
        </div>
        <div v-if="dataShow.length">
          <div class="flex flex-wrap product-wrapper">
            <LazyComp01
              v-for="(list, index) in dataShow"
              :key="'FHJEo' + list.id"
              :always-show="index < 16"
              min-height="216px"
            >
              <ProductVertical02
                class="cursor-pointer mt-10"
                :key="'list' + list.id"
                :product="list"
                type="tools"
              />
            </LazyComp01>
          </div>
          <div class="text-center mt-25">
            <paging
              :cur-page="paging.currentPage"
              :total="paging.lastPage"
              :from="paging.pagingFrom"
              :to="paging.pagingTo"
              :has-scroll="true"
              theme-class="theme4"
              @pagingclick="onGetDataPage"
            />
          </div>
        </div>
        <div v-else-if="data.length" class="text-center mt-20 co-red">
          {{ $t('17') }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import i18n from '@@/lang/desktop/tools-index-search.json'
import ProductVertical02 from '@/components/product/ProductVertical02.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Search from '@@/../components/icons/Search.vue'
import { calPaging, pushState, encodeURL,setCookie } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import title from '@@/../common/pages'
import SelectBox from '@@/../components/form/SelectBox.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'

function buildTitle(val) {
  let totalLength = val.categories.length + val.keywords.length
  if (!totalLength) {
    return ''
  } else {
    let arr = [...val.categories, ...val.keywords],
      str = '',
      i,
      l
    for (i = 1, l = arr.length - 1; i < l; i++) {
      str += `- ${arr[i]} `
    }
    str = arr[0] + str
    if (arr.length > 1) {
      str += '- ' + arr[arr.length - 1]
    }
    return str
  }
}

let searchFn = function(
  dataSearch,
  selectedKeywords = [],
  selectedCategories = [],
  textSearch,
  sortType = 0
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
  switch (sortType) {
    case 4:
      dataSearch = dataSearch.sort((a, b) => (a.prices[0].price || 0) - (b.prices[0].price || 0) || b.id - a.id)
      break
    case  3:
      dataSearch = dataSearch.sort((a, b) => (b.prices[0].price || 0) - (a.prices[0].price || 0) || b.id - a.id)
      break
    case  2:
      dataSearch = dataSearch.sort((a, b) => (b.forwardAt || 0) - (a.forwardAt || 0) || b.id - a.id)
      break
    case  1:
      dataSearch = dataSearch.sort((a, b) => (b.count || 0) - (a.count || 0) || b.id - a.id)
      break
    default:
      dataSearch = dataSearch.sort((a, b) => b.id - a.id)
  }
  return dataSearch
}
const obj = Object.assign(
  {
    components: {
      ProductVertical02,
      Paging,
      Search,
      LazyComp01,
      SelectBox,
      Checkbox,
    },
    data() {
      return {
        data: [],
        dataSearch: [],
        dataShow: [],
        textSearch: null,
        paging: {
          currentPage: 1,
          lastPage: 1,
          pagingFrom: 1,
          pagingTo: 1,
        },
        timer: null,
        titleChunk: this.$t('21'),
        descriptionChunk: null,
        keywordsChunk: null,
        sortList: [
          {
            id: 0,
            text: this.$t('26')
          },{
            id: 1,
            text: this.$t('27')
          },{
            id: 2,
            text: this.$t('30')
          },{
            id: 3,
            text: this.$t('28')
          },{
            id: 4,
            text: this.$t('29')
          },
        ],        
      }
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      setCookie('toolsCategories', this.selectedCategories, 5, '/tools')
      setCookie('toolsKeywords', this.selectedKeywords, 5, '/tools')
    },
    methods: {
      keywordsTemplate() {
        if (this.selectedCategories.length || this.selectedKeywords.length) {
          return `${this.keywordsChunk},${this.$t('30')}`
        }
      },
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
            this.textSearch,
            this.sortType
          )
          this.calcDataShow()
          setCookie('toolsCategories', this.selectedCategories, 5, '/tools')
          setCookie('toolsKeywords', this.selectedKeywords, 5, '/tools')
          this.applyDataSearch()
          this.$nextTick(() => {
            $('html, body').animate({ scrollTop: $('.search-input').offset().top - 20 }, 'slow')
          })
        }, 500)
      },
      calcDataShow() {
        let dataPaging = calPaging(
            this.dataSearch,
            this.paging.currentPage,
            56,
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
        pushState(
          `tools/search?cat=${cat}&key=${key}&p=${p}&t=${encodeURL(this.textSearch)}&s=${this.sortType}`,
          null,
          '',
          location.protocol + '//' + location.host
        )
      },
      applyDataSearch() {
        let cat = this.selectedCategories.map(e => this.$t('categories')[e]),
          key = this.selectedKeywords.map(e => this.$t('keywords')[e]),
          str = buildTitle.call(this, { categories: cat, keywords: key })
        this.titleChunk = str || this.$t('1')
        this.descriptionChunk = str
        this.keywordsChunk = [...cat, ...key].join()
        this.$store.commit('tools/setToolsCategories', this.selectedCategories)
        this.$store.commit('tools/setToolsKeywords', this.selectedKeywords)
        this.displayCategories = this.selectedCategories
        this.displayKeywords = this.selectedKeywords
      },
      onGetDataPage(_page) {
        this.paging.currentPage = _page
        this.dataShow = []
        this.calcDataShow()
      },
      descriptionTemplate() {
        return this.$t('20')
      },
      onRmCate(item) {
        this.selectedCategories = this.selectedCategories.filter(e => e != item)
        this.onSearch()
      },
      onRmKeyword(item) {
        this.selectedKeywords = this.selectedKeywords.filter(e => e != item)
        this.onSearch()
      },
      onSort(idx) {
        this.sortType = idx
        this.onSearch()
      }
    },
    async asyncData({ app, req, store }) {
      let data = await app.GoGoHTTP.get('/api/v3/surface/tools/search/all'),
        { cat, key, p = 1, t = '', s = 0 } = req.query,
        sortType = parseInt(s)
      cat && (cat = cat.split(','))
      key && (key = key.split(','))
      store.commit('tools/setToolsCategories', cat || [])
      store.commit('tools/setToolsKeywords', key || [])
      let dataSearch = searchFn(data, key, cat, t, sortType),
        dataPaging = calPaging(dataSearch, parseInt(p), 56, 4),
        paging = {
          currentPage: dataPaging.currentPage,
          lastPage: dataPaging.lastPage,
          pagingFrom: dataPaging.pagingFrom,
          pagingTo: dataPaging.pagingTo,
        }
      return {
        data,
        selectedCategories: cat || [],
        selectedKeywords: key || [],
        displayCategories: cat || [],
        displayKeywords: key || [],
        dataSearch,
        dataShow: dataPaging.data,
        paging,
        sortType,
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
  background: #f0f0f0;
  border-radius: 5px;
  padding: 10px 30px;
  .search-input {
    border-radius: 5px;
    border: 1px solid #cecdce;
    .input-text {
      height: 35px;
      border: none;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      padding: 5px 10px;
      &::placeholder {
        color: #9c9c9c;
      }
    }
    .search-icon {
      background: #a0a0a0;
      color: white;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 6px;
      cursor: pointer;
      i {
        width: 30px;
        height: 30px;
      }
      &:hover {
        background: #888;
      }
    }
  }
  .selected-item {
    border-radius: 10px;
    background: #a0a0a0;
    color: white;
    font-size: 11px;
    padding: 3px 10px;
    .item-rm {
      cursor: pointer;
      padding-left: 10px;
    }
    &:hover {
      text-decoration: line-through;
    }
  }
}
.search-result {
  border-bottom: #d9d9d9 1px solid;
  .left-result {
    font-size: 20px;
    color: #7d7d7d;
    letter-spacing: 2px;
  }
  .list-sort {
    height: 30px;
    margin-bottom: 10px;
    /deep/ .sl-area {
      text-align: center !important;
      min-width: 150px !important;
      padding: 2px 15px !important;
      border-radius: 5px !important;
    }
    /deep/ .dropdown-menu {
      max-height: 400px;
      overflow-y: auto;
      border-radius: 5px !important;
      .dd-item {
        font-size: 12px;
      }
    }
  }
}
.product-wrapper div.product-vertical {
  width: 85px;
  /deep/ .prices {
    margin-top: 2px;
    margin-bottom: 3px;
    strong {
      font-weight: normal;
    }
  }
}
.left-sidebar {
  width: 240px;
  height: 100%;
  .content-list {
    border: #d9d9d9 1px solid;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding-bottom: 5px;
  }
  .label-hover {
    width: 100px;
    margin-bottom: 5px;
    height: 28px;
    input {
      display: none;
    }
    span {
      border: 1px solid #d9d9d9;
      float: right;
      height: 16px;
      width: 16px;
      flex: 0 0 16px;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input:checked + span {
      border: 8px solid #9c3;
    }
    input:checked + span::before {
      content: '✔️';
      color: #fff;
      font-size: 12px;
    }
    &.hover2 {
      &:nth-child(2n) {
        margin-left: 10px;
      }
    }
    .item-lbl {
      font-weight: normal;
      font-size: 13px;
      margin-left: 5px;
    }
  }
  .sub-title {
    color: #2d2d2d;
    font-size: 16px;
    padding: 10px;
  }
  .btn-seach {
    width: 210px;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    outline: none;
    border-radius: 5px;
    background: #9c3;
    box-shadow: 0 3px 0 #73a21b;
    padding-top: 4px;
    &:hover {
      opacity: 0.85;
      background: #82ad24;
    }
    &:active {
      transform: translate(0, 5px);
      -webkit-transform: translate(0, 5px);
      box-shadow: 0 1px 0 0;
    }
  }
}
.search-header {
  background-color: #a0a0a0;
  height: 45px;
  font-size: 16px;
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 12px 14px;
}
.w-740 {
  width: 740px;
}
.angle-right {
  width: 16px;
  height: 16px;
  color: #656d78;
}
</style>
