<template>
  <div>
    <div class="desktop">
      <div class="left-menu flex layout-col">
        <SearchTab class="search-tab flex mid" @onFilterTab="onFilterTab" :tab-selected="Number(params.isPaidContent) || 0" />
        <div class="divider"></div>
        <DropdownDefault :data-source="periodTypeList" :title="$t('14')" :display="'text'" :id-val="'id'" v-model="params.periodType" @input="selectSort" class="search-type" />
        <div class="divider"></div>
      </div>
      <div class="search-content">
        <h1 class="o-tit mt-0">
          <span v-if="params.tags">#({{ $t('tags')[params.tags] || params.tags }})</span>
          <span v-if="params.keyword">{{ params.keyword }}</span>
          <span class="o-tit__meta" v-if="(dataList.data || []).length > 0">
            {{ $t('7') }}/ {{ dataList.total || 0 }} {{ $t('8') }}
          </span>
          <span class="o-tit__meta" v-else>
            {{ $t('11') }}
          </span>
        </h1>
        <paging :cur-page="dataList.currentPage"
                :total="dataList.lastPage"
                :from="dataList.pagingFrom"
                :to="dataList.pagingTo"
                :has-scroll="true"
                theme-class="theme1"
                @pagingclick="onPagingClick" class="w-full mt-10 text-right"
        />
        <section class="mt-15" v-if="(dataList.data || []).length > 0">
          <article-list :force-sub="forceSub" class="sec__h08" :list="dataList.data" :add-to-favorite="$parent.addToFavorite" :add-to-follow="$parent.addToFollow">
            <template slot-scope="prop">
              <NaviNewestList :item="prop.item" :follow-fn="prop.item.onNaviFollow"
                              :favorite-fn="prop.item.onNaviFavorite" :ext-url="extUrl"
                              :customs=" $route.params.type === 'series'
                                ? {
                                  imgUrl: `/img/products/${prop.item.productId}/small`,
                                  showFavFolButtons: false,
                                }
                                : {}"
              />
            </template>
          </article-list>
        </section>
        <section class="o-err mt-30" v-else>
          {{ $t('12') }}
        </section>
        <paging :cur-page="dataList.currentPage"
                :total="dataList.lastPage"
                :from="dataList.pagingFrom"
                :to="dataList.pagingTo"
                :has-scroll="true"
                theme-class="theme1"
                @pagingclick="onPagingClick" class="w-full mt-10 text-center"
        />
      </div>
    </div>
    <div class="mobile articles-list-wrapper">
      <div class="search-box-wrapper">
        <SearchBox :placeholder="$t('24')" v-model="searchKey" @search="gotoSearch" @enter="gotoSearch" />
      </div>
      <div class="articles-list-search">
        <span v-if="params.keyword" class="keyworld">{{ params.keyword }}</span>
        <span class="count-item">
          {{ $t('16') }} 
          /  
          {{ dataList.total || 0 }} {{ $t('15') }}
        </span>
      </div>
      <div class="select-filter mb-15">
        <div class="btn-toggle flex">
          <RadioTag v-model="params.isPaidContent" :theme="'theme-2'" :attrs="{ id: 'isPaidContent'+item.id, value: item.id }" :label="item.text" v-for="item in paidFilter" :key="`isPaidContent-${item.id}`" @input="selectSort" />
        </div>
        <SelectBox class="g-select" :data-source="newFilter" :display="'text'" :id-val="'id'" v-model="params.periodType" @input="selectSort" />
      </div>
      <div v-if="pageType === 'articles' && (dataList.data || []).length > 0" class="articles-list">
        <NaviArticleItem class="al-item" v-for="item in dataList.data" :key="'articles-list' + item.id" :item="item" :follow-fn="onNaviFollowItem" :fav-fn="onNaviFavoriteItem" />
      </div>
      <div v-if="pageType === 'series' && (dataList.data || []).length > 0" class="articles-list">
        <NaviSeriesItem class="al-item" v-for="item in dataList.data" :key="'articles-list' + item.id" :item="item" />
      </div>
      <section v-if="!(dataList.data || []).length || !(dataList.data || []).length" class="o-err mt-30 mb-30">
        {{ $t('12') }}
      </section>
      <PagingMobile :cur-page="dataList.currentPage"
                    :total="dataList.lastPage"
                    :from="dataList.pagingFrom"
                    :to="dataList.pagingTo"
                    :has-scroll="true"
                    theme-class="theme1"
                    @pagingclick="onPagingClick"
                    class="w-full mt-15 pb-25 text-center"
      />
    </div>
  </div>
</template>

<script>
import Paging from '@@/../components/paging/Paging.vue'
import authorMeta from '@@/../common/pages/author.js'
import DropdownDefault from '@@/../components/form/DropdownDefault.vue'
import i18n from '@@/lang/desktop/navi-search.json'
import ArticleList from '@@/../common/components/navi/search/article-list.vue'
import NaviNewestList from '@@/../common/components/navi/search/navi-newest-list.vue'
import SearchTab from '@@/../common/components/navi/search-tab'
import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'

import RadioTag from '@@/../components/form/RadioTag.vue'
import SelectBox from '@@/../components/form/SelectBox2.vue'
import NaviSeriesItem from '@@/../components/common/navi-series-item.vue'
import NaviArticleItem from '@@/../components/common/navi-article-item.vue'
import PagingMobile from '@@/../components/common/paging-mobile.vue'
import SearchBox from '@@/../common/components/navi/search-box'

export default {
  name: "search-result",
  components: {
    SearchBox,
    Paging,
    DropdownDefault,
    ArticleList,
    NaviNewestList,
    NaviArticleItem,
    SearchTab,
    NaviSeriesItem,
    SelectBox,
    RadioTag,
    PagingMobile
  },
  i18n: {
    messages: i18n,
  },
  props: [
    'dataList',
    'params',
    'naviSearchUrl',
    'extUrl',
    'isPaidContentList',
    'periodTypeList',
    'titleChunk',
    'localeHead',
    'forceSub',
    'pageType',
    'keyword'
  ],
  data() {
    return {
      meta: [authorMeta],
      paidFilter: [
        {
          text: this.$t('17'),
          id: 0,
        },
        {
          text: this.$t('18'),
          id: 1,
        },
        {
          text: this.$t('19'),
          id: 2,
        },
      ],
      newFilter: [
        {
          text: this.$t('20'),
          id: 3,
        },
        {
          text: this.$t('21'),
          id: 1,
        },
        {
          text: this.$t('22'),
          id: 2,
        },
        {
          text: this.$t('23'),
          id: 0,
        },
      ],
      searchKey: ''
    }
  },
  mounted() {
    this.searchKey = this.keyword
  },
  methods: {
    onNaviFollowItem,
    onNaviFavoriteItem,
    gotoSearch(keyword) {
      this.$emit('gotoSearch', keyword)
    },
    onFilterTab(index) {
      if(index === undefined) return
      this.$emit('onFilterTab',index)
    },
    onPagingClick(_page) {
      this.$emit('onPagingClick',_page)
    },
    selectSort() {
      this.$emit('selectSort')
    },
    selectSortPrice(index) {
      this.$emit('selectSortPrice', index)
    },
    searchByPrice(index) {
      this.$emit('searchByPrice', index)
    },
    // head fucntions:
    descriptionTemplate() {
      return this.descriptionChunk
        ? `${this.localeHead.prefix} ${this.descriptionChunk}${
            this.localeHead.description
          }`
        : `${this.localeHead.prefix}`
    },
    keywordsTemplate() {
      return this.keywordsChunk
        ? `${this.localeHead.keywords},${this.keywordsChunk}`
        : `${this.localeHead.keywords}`
    },
  },
}
</script>

<style lang="scss" scoped>
.o-err {
  color: red;
  text-align: center;
  min-height: 400px;
}
.tab__a {
  border-radius: 0;
  margin-right: 0;
  padding: 7px 12px 3px;
  color: #2d2d2d;
}
.o-tit {
  font-size: 24px;
  max-width: 740px;
  word-break: break-all;
  color: #2d2d2d;
}
.o-tit__meta {
  font-size: 14px;
}
.sec__h08 /deep/ {
  > .article-XMkTj {
    margin-right: 17px;
    margin-bottom: 25px;
  }
  > .article-XMkTj:nth-child(4n) {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
.search-content {
  width: 1000px;
  background: #fff;
  margin: auto;
}
.search-options {
  position: absolute;
}
@media only screen and (max-width: 1590px) {
  .search-content {
    padding-left: 296px;
  }
  .search-options {
    display: flex;
  }
  .fi-tab {
    height: auto !important;
  }
  .navi-h04 {
    width: 219px !important;
  }
  .sec__h08[data-v-239b3463]>.article-XMkTj {
    margin-right: 15px !important;
  }
  .sec__h08>.article-XMkTj:nth-child(4n) {
    margin-right: 11px !important;
  }
}
.mobile {
  display: none;
}
.desktop {
  padding-top: 40px;
}
@media only screen and (max-width: 768px),
only screen
and (max-width : 896px) 
and (max-height : 414px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
  .o-err {
    color: red;
    text-align: center;
  }
  .select-filter {
    padding: 15px;
    border-bottom: 1px solid #dfdedc;
    background: #f8f8f8;
    .btn-toggle {
      border: 1px solid rgb(178, 178, 178);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 15px;
      max-width: 158px;
    }
    .g-select {
      /deep/ button {
        background: #fff;
      }
    }
  }
  /deep/ .btn-loadmore {
    border-bottom: 1px solid #dfdedc;
  }
  .articles-list-search {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .articles-list-wrapper {
    .keyworld {
      font-size: 20px;
      font-weight: bold;
      margin-right: 10px;
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count-item {
      font-size: 15px;
      font-weight: bold;
    }
  }
  .menu-cls,
  .search-box,
  .nav-wrapper--fi {
    display: none;
  }
}
.search-box-wrapper {
  padding: 15px 20px 0 20px;
}

.left-menu {
  width: 300px;
  font-size: 15px;
  padding-left: 50px;
  position: absolute;
  .category div[class="dropdown"] {
    display: none;
  }

  .divider {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background-color: #F5F5F5;
    max-width: 213px;
  }

  * {
    color: #777777;
    &.selected {
      color: #2C2C2C;
      font-weight: bold;
    }
  }

  .series-period, .category {
    button {
      border: none;
      outline: none;
      color: #777777;
      font-weight: bold;
    }

    li {
      cursor: pointer;

      &:hover {
        background-color: #e6e6e6;
      }
    }

    .caret:last-child {
      padding-left: 0;
      height: 4px;
    }
  }

  .status-list {
    span {
      margin-right: 10px;
      height: 36px;
      cursor: pointer;
      width: 52px;
      text-align: center;

      &:hover {
        color: #2C2C2C;
      }
    }
  }

  .category {
    span {
      padding-left: 10px;
      cursor: pointer;
      height: 2em;

      &:hover {
        color: #2C2C2C;
      }
    }
  }

  .series-search {
    display: inline-flex;
    border: 1px solid;
    border-radius: 21px;
    padding: 5px;
    height: 36px;
    width: 100%;
    margin-top: 15px;
    align-items: center;

    input {
      border: none;
      padding: 0 10px;
      color: #2c2c2c;
      width: 100%;
    }

    i {
      margin-top: 6px;
    }

    /deep/ svg:hover {
      circle, line {
        stroke: #2c2c2c;
      }
    }
  }
}
@media screen and (max-width: 1023px) {
  .filters {
    .divider {
      display: none;
    }
  }
}
</style>