<template>
  <div>
    <div class="banner-ctn">
      <img src="/img/assets/mobile/finance/videos/top_banner.jpg" alt="" />
    </div>
    <TopMenu />
    <div class="flex w-full space-between videos-header">
      <span class="title">{{ $t(1) }}</span>
      <SelectBox v-if="type !== 'searchresult'" :data-source="dataSource" @input="onCurrentTypeChange" :id-selected="type" width="165px" />
    </div>
    <div class="flex search-box">
      <input class="text-field pl-20" :placeholder="$t(6)" v-model="keyword" @keyup.enter="onSearch" />
      <span class="btn-search" @click="onSearch"> <Search /> </span>
    </div>
    <VideoHorizontal01 v-for="item in data" :key="item.id" :item="item" />
    <div class="no-content" v-if="!(data || []).length">
      {{ $t('7') }}
    </div>
    <Loading v-if="isLoading" />
    <div v-else @click="handleShowMore">
      <LoadMore class="mb-25" style="border-bottom: 1px solid #e0dedc;" v-if="!isEndOfPaging" />
    </div>
  </div>
</template>

<script>
import VideoHorizontal01 from '@/components/finance/videos/VideoHorizontal01.vue'
import SelectBox from '@/components/finance/videos/SelectBox.vue'
import TopMenu from '@/components/finance/TopMenu.vue'
import Search from '@@/../components/icons/Search.vue'
import Loading from '@@/../components/icons/Loading.vue'
import i18n from '@@/lang/mobile/finance-videos.json'
import LoadMore from "@/components/common/LoadMore.vue"
import title from '@@/../common/pages'

const limit = 10
const obj =Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    VideoHorizontal01,
    TopMenu,
    SelectBox,
    Search,
    LoadMore,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      page: 1,
    }
  },
  async asyncData({ app, params }) {
    let type = params.type || 'new',
      listUrl = {
        'new': '/api/v3/surface/ggjtv/new',
        'premier': '/api/v3/surface/ggjtv/premier',
        'trend': '/api/v3/surface/ggjtv/popular',
        'gogojungletv': '/api/v3/surface/ggjtv/free',
        'searchresult': '/api/v3/surface/ggjtv/search'
      },
      apiUrl = listUrl[type],
      keyword = params.keyword || '',
      [
        data,
        total,
      ] = await Promise.all([
        app.GoGoHTTP.get(apiUrl, { params: { limit, keyword }}),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/total'),
      ]),
      isEndOfPaging = false
    if (data.length < limit) {
      isEndOfPaging = true
    }
    return {
      type,
      data,
      total,
      apiUrl,
      keyword,
      isEndOfPaging,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/videos${params.type ? '/' + params.type : '' }${params.type == 'searchresult' ? '/w/' + keyword : ''}`,
        },
      ],
    }
  },
  computed: {
    dataSource() {
      return [
        {
          text: `<div class="flex space-between w-full">${this.$t(2)} <span style="margin-left: auto;">（${(this.total || {})['new'] || 0}）</span></div>`,
          id: 'new',
        },
        {
          text: `<div class="flex space-between w-full">${this.$t(3)} <span style="margin-left: auto;">（${(this.total || {})['popular'] || 0}）</span></div>`,
          id: 'trend',
        },
        {
          text: `<div class="flex space-between w-full">${this.$t(4)} <span style="margin-left: auto;">（${(this.total || {})['free'] || 0}）</span></div>`,
          id: 'gogojungletv',
        },
        {
          text: `<div class="flex space-between w-full">${this.$t(5)} <span style="margin-left: auto;">（${(this.total || {})['premier'] || 0}）</span></div>`,
          id: 'premier',
        },
      ]
    }
  },
  methods: {
    onCurrentTypeChange(val) {
      location.href = "/finance/videos/" + val
    },
    async handleShowMore() {
      if (this.isEndOfPaging || this.isLoading) {
        return
      }
      this.isLoading = true
      let data = await this.GoGoHTTP.get(this.apiUrl, {
        params: {
          page: this.page + 1,
          limit,
          keyword: this.keyword
        }
      })
      data = data.data ? data.data : data
      if (data && data.length) {
        this.data = this.data.concat(data)
        this.page = this.page + 1
      }
      if (data && !data.length) {
        this.isEndOfPaging = true
      }
      this.isLoading = false
    },
    onSearch() {
      if(!this.keyword) {
        return
      }
      location.href = `/finance/videos/searchresult/w/${this.keyword}`
    },
    descriptionTemplate() {
      let type = this.$route.params.type,
        s = `des${type ? '-' + type : ''}`
      if(type == 'searchresult') {
        
        return this.$t(s)
      }
      return this.$t(s)
    },
    titleTemplate() {
      let type = this.$route.params.type
      if(type == 'searchresult') {
        return this.$t('tChunk-searchresult', { keyword: this.keyword })
      }
      return this.$t(`tChunk-${type ? type : 'index'}`)
    },
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
.banner-ctn {
  min-height: 68px;
  width: 100%;
  img {
    width: 100%;
    height: auto;
  }
}
.videos-header {
  background: #f3f0ef;
  padding: 8px 10px;
  .title {
    color: #707070;
    line-height: 30px;
    font-weight: bold;
    font-size: 16px;
  }
}
.search-box {
  width: 100%;
  z-index: 999;
  padding: 10px;
  background: #e0dedc;
  .btn-search {
    flex: 1 0 auto;
    border: solid 0.5px #b2b2b2;
    padding: 5px 0 5px;
    line-height: 30px;
    text-align: center;
    color: white;
    background: #b2b2b2;
    cursor: pointer;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 40px;
    /deep/ .icon-cls {
      width: 30px;
    }
  }
  .text-field {
    flex: 1 0 85%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border: 2px solid #b2b2b2;
    color: #a0a0a0;
  }
}
/deep/ .loader {
  height: 90px !important;
}
.no-content {
  margin-top: 20px;
  margin-bottom: 120px;
  font-weight: bold;
  text-align: center;
}
</style>

<style lang="scss">
#search-bar-header {
  display: none;
}
</style>