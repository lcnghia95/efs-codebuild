<template>
  <div>
    <banner-top :img="'/img/assets/pc/navi/navitv.png'" :par="$t('9')" />
    <top-menu />
    <SearchBox v-model="params.keyword" @enter="onSearch" @search="onSearch" :placeholder="$t('7')" class="search_box flex mid w-1000" />
    <section class="sec__h01 w-1000">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t(1) }}</h5>
          <h5 v-if="(dataVideoSearch.data || []).length > 0">{{ $t(2, [(((dataVideoSearch.currentPage-1) * params.limit) + 1), (dataVideoSearch.currentPage == dataVideoSearch.lastPage ? dataVideoSearch.total : ((dataVideoSearch.currentPage) * params.limit))]) + $t(3, [dataVideoSearch.currentPage]) + $t(4, [dataVideoSearch.total]) }}</h5>
          <h5 v-else>{{ $t('11') }}</h5>
        </div>
      </div>
      <div class="vid-l w-1000 flex mt-15 flex-wrap" v-if="(dataVideoSearch.data || []).length > 0">
        <video-horizontal01 class="mr-15 mb-20" v-for="item in dataVideoSearch.data" :item="item" :key="'sresult_' + item.id" />
      </div>
      <div v-else class="o-err">{{ $t('12') }}</div>
    </section>
    <paging :cur-page="dataVideoSearch.currentPage"
            :total="dataVideoSearch.lastPage"
            :from="dataVideoSearch.pagingFrom"
            :to="dataVideoSearch.pagingTo"
            :has-scroll="true"
            theme-class="theme1"
            @pagingclick="onPagingClick" class="w-full mt-10 text-center"
    />
    <section class="sec__h02 w-full mt-40 pt-15 pb-40">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t('6') }}</h5>
        </div>
        <a href="/finance/videos/trend">
          <button class="btn btn--vi pos-rel">{{ $t('5') }} <span class="btn__i pos-abs">〉</span></button>
        </a>
      </div>
      <div class="vid-l w-1000 flex mt-15">
        <video-horizontal01 class="mr-20" v-for="item in dataVideoTrend" :item="item" :key="'trend_' + item.id" />
      </div>
    </section>
  </div>
</template>

<script>
import BannerTop from '@/components/navi/BannerTop.vue'
import TopMenu from '@/components/navi/TopMenu.vue'
import SearchBox from '@/components/SearchBox.vue'
import VideoHorizontal01 from '@/components/video/VideoHorizontal01.vue'
import Paging from '@@/../components/paging/Paging.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/video-search.json'
import titleI18n from '@@/lang/common/video-search-title.json'
import authorMeta from '@@/../common/pages/author.js'

const obj = Object.assign(
  {
    components: {
      BannerTop,
      TopMenu,
      SearchBox,
      VideoHorizontal01,
      Paging,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        meta: [authorMeta],
        params: {},
      }
    },
    async asyncData({ app, params }) {
      let _params = {
        searchType: params.searchType || 'w',
        page: params.p ? parseInt(params.p) : 1,
        limit: 20,
      }

      if (_params.searchType === 't') {
        _params.tags = params.wt
      } else {
        _params.keyword = params.wt
      }

      let [dataVideoSearch, dataVideoTrend] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/search', { params: _params }),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/popular?limit=5'),
      ])
      return {
        dataVideoSearch,
        dataVideoTrend,
        params: _params,
        keyword: _params.keyword,
        localeHead: titleI18n[app.i18n.locale] || titleI18n['ja'],
      }
    },
    methods: {
      onPagingClick(_page) {
        let p = this.params,
          query = `p/${_page}${
            p.keyword
              ? '/' + p.searchType + '/' + encodeURIComponent(p.keyword)
              : ''
          }`

        location.href = `/finance/videos/searchresult/${query}`
      },
      onSearch() {
        let p = this.params,
          query = p.keyword ? `w/${encodeURIComponent(p.keyword)}` : ''
        location.href = `/finance/videos/searchresult/${query}`
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
      titleTemplate() {
        return this.$t('titleChunk', {keyword: this.keyword || ''})
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.o-err {
  color: red;
  text-align: center;
}
.search_box {
  &.search-X9ikc {
    width: 1000px;
    border: 12px solid #dbdbdb;
    height: 70px;
    border-radius: 0;
    margin: 30px auto;
  }
}
.sec__tit {
  h5 {
    font-size: 22px;
    color: #4d4539;
  }
  .lbl {
    width: 40px;
    height: 22px;
    color: #fff;
    font-size: 14px;
    border-radius: 3px;
    padding-top: 1px;
    &--fee {
      background: #f60;
    }
    &--free {
      background: #9c3;
    }
  }
}
.btn--vi {
  border-radius: 0;
  background: #fff;
  border: 1px solid #b2b2b2;
  color: #666;
  width: 140px;
  height: 30px;
  outline: none;
  .btn__i {
    font-size: 10px;
    right: 3px;
    top: 8px;
  }
  &:hover {
    background: #b2b2b2;
    color: white;
  }
}
.sec__head {
  margin-bottom: 13px !important;
}
.sec__h02 {
  background: #f2f0ed;
}
/deep/ .ban-t {
  max-width: 1400px !important;
  height: 200px !important;
  justify-content: flex-start;
  align-items: normal;
}
/deep/ .p--tb {
  font-size: 14px;
  line-height: 24px;
  margin-top: 18px;
  margin-left: 200px;
  text-align: left !important;
}
.vid-l {
  .vid-i:last-child {
    margin-right: 0;
  }
}
.vid-premier /deep/ {
  p.vid-i__desc {
    max-height: 30px;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>