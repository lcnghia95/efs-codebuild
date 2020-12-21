<template>
  <div class="series-list w-full">
    <div class="left-menu flex layout-col">
      <div class="flex layout-col filters">
        <div class="status-list inline-flex">
          <span @click="setPlan(-1)" class="mr-30" :class="{selected: plan === -1}">すべて</span>
          <span @click="setPlan(1)" class="mr-30" :class="{selected: plan === 1}">有料</span>
          <span @click="setPlan(0)" :class="{selected: !plan}">無料</span>
        </div>
        <div class="divider"></div>
        <div class="series-period inline-flex mt-20 mid">
          <span class="desktop">並び順: &nbsp;</span>
          <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              {{ periods[period] || '新着順' }}
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li class="pl-10 pt-10 pb-5" :class="{selected: period === 1}" @click="setPeriod(1)">{{ periods[1] }}</li>
              <li class="pl-10 pt-10 pb-5" :class="{selected: period === 2}" @click="setPeriod(2)">{{ periods[2] }}</li>
              <li class="pl-10 pt-10 pb-5" :class="{selected: !period }" @click="setPeriod(0)">{{ periods[0] }}</li>
              <li class="pl-10 pt-10 pb-5" :class="{selected: period === 3}" @click="setPeriod(3)">{{ periods[3] }}</li>
            </ul>
          </div>
        </div>
        <div class="divider"></div>
        <div class="category inline-flex mt-30">
          <span class="desktop">カテゴリ:&nbsp;</span>
          <div class="desktop flex layout-col">
            <span class="list-item" :class="{selected: !category}" @click="setCategory(0)">すべて </span>
            <span class="list-item" @click="setCategory(cg.id)" v-for="(cg, index) in categories" :key="index" :class="{selected: category == cg.id}">{{ cg.categoryName }}</span>
          </div>
          <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              {{ getCategory(category) || 'すべて' }}
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li class="pl-10 pt-10 pb-5" :class="{selected: !category}" @click="setCategory(0)">すべて</li>
              <li v-for="(cg, index) in categories" :key="index" class="pl-10 pt-10 pb-5" :class="{selected: category == cg.id}" @click="setCategory(cg.id)">{{ cg.categoryName }}</li>
            </ul>
          </div>
        </div>
        <div class="divider"></div>
      </div>
      <div class="series-search">
        <input ref="searchInput" @keyup="submitByEnter" />
        <SeriesSearch @click="onSearch" />
      </div>
    </div>
    <div class="series-list-content center layout-col w-full loading" ref="seriesContent">
      <a class="banner flex center p-15 pb-30" v-if="banners.landingPageUrl" target="_blank" rel="nofollow" :href="banners.landingPageUrl">
        <img :src="banners.bannerUrl" alt="" style="max-width: 1000px; max-height: 130px; width: 100%" />
      </a>
      <template v-if="loading">
        <Loading />
      </template>
      <div v-else-if="!articleList.length" class="flex center mid">
        該当の記事および連載はありません。
      </div>
      <template v-else>
        <div class="highlight-items row flex flex-wrap">
          <div class="series-item col-xs-12 col-sm-4 col-md-6 col-lg-4 flex layout-col space-between pb-50" v-for="(item, index) in highlightItems" :key="index">
            <div class="flex layout-col">
              <div class="placeholder-container">
                <img alt="placeholder" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAXCAYAAACWEGYrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAA7SURBVEhL7c6hDQAwDMTAT/ffOSnoCAap5COmrr6y3HldzUmKkxQnKU5SnKQ4SXGS4iTFSYqTlA8mkwFuCgQq9mcLUwAAAABJRU5ErkJggg==" />
                <Lzimg :data-src="`/img/articles/${item.id}/small`" alt="" @click="handleThumbnailClick(item)" class="cursor-pointer" />
              </div>
              <a class="flex series-title mt-15" :href="`/finance/navi/articles/${item.id}`" style="overflow: hidden; max-height: 65px" :title="item.title">{{ item.title }}</a>
              <div class="series-content mt-10" style="max-height: 42px; overflow: hidden">{{ item.content }}</div>
            </div>
            <div class="flex layout-col">
              <div class="inline-flex mt-20" style="font-size: 14px;">
                <span v-if="item.articlePrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">¥{{ formatNumber(item.price) }}</span>
                <span v-else-if="!item.seriesPrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">無料</span>
                <span v-if="item.seriesPrice" style="color: #548BDF;">
                  <template v-if="item.articlePrice || !item.seriesPrice">(</template>連載 ¥{{ formatNumber(item.seriesPrice) }}/月
                  <template v-if="item.articlePrice || !item.seriesPrice">)</template>
                </span>
              </div>
              <div class="inline-flex mt-10" style="height: 24px">
                <span class="navi-category mr-15" v-if="getCategory(item.categoryId)">{{ getCategory(item.categoryId) }}</span>
                <LikeCount :count="getObjectLike(item).totalLike" :liked="getObjectLike(item).isLiked" width="24" height="24" class="mr-10" @onLike="handleLike(item)" />
              </div>
              <div class="author mt-15">
                <a :href="`/finance/navi/authors/${item.user.id}`">
                  <Lzimg class="mr-10" :data-src="`/img/users/${item.user.id}/small`" alt="" />
                </a>
                <div class="author-info flex layout-col">
                  <a :href="`/finance/navi/authors/${item.user.id}`" :title="item.user.name" class="author-name" style="height: 18px; overflow: hidden">{{ item.user.name }}</a>
                  <span class="published-date">{{ formatTime(item.publishedDate, 1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="normal-items-and-ranking">
          <div class="series-normal-items w-full" style="align-content: flex-start">
            <div class="series-item normal-item-img p-10" v-for="(item, index) in normalItems" :key="index" style="min-width: 250px">
              <div class="flex layout-col space-between h-full">
                <div class="flex layout-col">
                  <div class="placeholder-container">
                    <img alt="placeholder" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAXCAYAAACWEGYrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAA7SURBVEhL7c6hDQAwDMTAT/ffOSnoCAap5COmrr6y3HldzUmKkxQnKU5SnKQ4SXGS4iTFSYqTlA8mkwFuCgQq9mcLUwAAAABJRU5ErkJggg==" />
                    <Lzimg :data-src="`/img/articles/${item.id}/medium`" alt="" @click="handleThumbnailClick(item)" class="cursor-pointer" />
                  </div>
                  <a class="series-title pt-15" :href="`/finance/navi/articles/${item.id}`" :title="item.title" style="max-height: 65px; overflow: hidden">{{ item.title }}</a>
                  <div class="series-content mt-10" style="overflow: hidden; max-height: 42px">{{ item.content }}</div>
                </div>
                <div class="series-info flex layout-col">
                  <div class="inline-flex mt-15" style="font-size: 14px;">
                    <span v-if="item.articlePrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">¥{{ formatNumber(item.price) }}</span>
                    <span v-else-if="!item.seriesPrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">無料</span>
                    <span v-if="item.seriesPrice" style="color: #548BDF;">
                      <template v-if="item.articlePrice || !item.seriesPrice">(</template>連載 ¥{{ formatNumber(item.seriesPrice) }}/月
                      <template v-if="item.articlePrice || !item.seriesPrice">)</template>
                    </span>
                  </div>
                  <div class="mt-10 inline-flex" style="max-height: 24px">
                    <div class="navi-category mr-15" v-if="getCategory(item.categoryId)">{{ getCategory(item.categoryId) }}</div>
                    <LikeCount :count="getObjectLike(item).totalLike" :liked="getObjectLike(item).isLiked" width="18" height="18" class="mr-10" @onLike="handleLike(item)" />
                  </div>
                  <div class="author mt-15">
                    <a :href="`/finance/navi/authors/${item.user.id}`">
                      <Lzimg class="mr-10" :data-src="`/img/users/${item.user.id}/small`" alt="" />
                    </a>
                    <div class="author-info flex layout-col">
                      <a class="author-name" :href="`/finance/navi/authors/${item.user.id}`" style="height: 18px; overflow: hidden">{{ item.user.name }}</a>
                      <span class="published-date">{{ formatTime(item.publishedDate, 1) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-30 ranking flex layout-col">
            <div class="title flex mid">
              <corona-icon class="mr-5" />
              <span style="margin-top: 2px">記事ランキング</span>
            </div>
            <div class="ranking-period inline-flex mt-10">
              <div :class="{active: activeTab === PERIODS.YESTERDAY}" @click="activeTab = PERIODS.YESTERDAY">昨日</div>
              <div :class="{active: activeTab === PERIODS.WEEK}" @click="activeTab = PERIODS.WEEK">週間</div>
              <div :class="{active: activeTab === PERIODS.MONTH}" @click="activeTab = PERIODS.MONTH">月間</div>
              <div :class="{active: activeTab === PERIODS.ALL}" @click="activeTab = PERIODS.ALL">総合</div>
            </div>
            <div class="ranking-content">
              <div class="series-item flex layout-col pt-30" v-for="(item, index) in articleRanking[activeTab]" :key="index" style="min-width: 200px">
                <CupIcon1 v-if="(index + 1) === 1" style="width: 40px" />
                <CupIcon2 v-if="(index + 1) === 2" style="width: 40px" />
                <CupIcon3 v-if="(index + 1) === 3" style="width: 40px" />
                <CupIcon4 v-if="(index + 1) === 4" style="width: 40px" />
                <CupIcon5 v-if="(index + 1) === 5" style="width: 40px" />
                <div class="flex layout-col h-full space-between">
                  <div class="flex layout-col">
                    <div class="placeholder-container mt-10">
                      <img alt="placeholder" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAXCAYAAACWEGYrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAA7SURBVEhL7c6hDQAwDMTAT/ffOSnoCAap5COmrr6y3HldzUmKkxQnKU5SnKQ4SXGS4iTFSYqTlA8mkwFuCgQq9mcLUwAAAABJRU5ErkJggg==" />
                      <Lzimg :data-src="`/img/articles/${item.id}/small?u=${new Date().getTime()}`" alt="" @click="handleThumbnailClick(item)" class="cursor-pointer img-rank" />
                      <LikeCount :count="getObjectLike(item).totalLike" :liked="getObjectLike(item).isLiked" width="18" height="18" class="mr-10 like-fav" style="height: 24px" @onLike="handleLike(item)" />
                    </div>
                    <a :href="`/finance/navi/articles/${item.id}`" class="series-title pt-10 pb-5" title="item.title" style="height: 48px; overflow: hidden; font-size: 14px;">{{ item.title }}</a>
                  </div>
                  <!--                <div class="series-content pb-10">{{ item.content }}</div>-->
                  <div class="flex layout-col">
                    <div class="inline-flex mt-15" style="font-size: 14px; height: 24px">
                      <span v-if="item.articlePrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">¥{{ formatNumber(item.price) }}</span>
                      <span v-else-if="!item.seriesPrice" style="color: #5CCFCA; font-weight: bold" class="mr-10">無料</span>
                      <span v-if="item.seriesPrice" style="color: #548BDF;">
                        <template v-if="item.articlePrice || !item.seriesPrice">(</template>連載 ¥{{ formatNumber(item.seriesPrice) }}/月
                        <template v-if="item.articlePrice || !item.seriesPrice">)</template>
                      </span>
                    </div>
                    <div class="author mt-5">
                      <a :href="`/finance/navi/authors/${item.user.id}`">
                        <Lzimg class="mr-10" :data-src="`/img/users/${item.user.id}/small?u=${new Date().getTime()}`" alt="" style="width:30px; height: 30px" />
                      </a>
                      <div class="author-info flex layout-col">
                        <a style="font-size: 12px; height: 18px; overflow: hidden" :href="`/finance/navi/authors/${item.user.id}`" class="author-name" :title="item.user.name">{{ item.user.name }}</a>
                        <span class="published-date" style="font-size: 11px">{{ formatTime(+item.publishedDate, 1) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

import LikeCount from '@@/../common/components/like-count'
import CoronaIcon from '@@/../common/components/navi/top/corona-icon'
import CupIcon1 from '@@/../common/components/cup-icon-1'
import CupIcon2 from '@@/../common/components/cup-icon-2'
import CupIcon3 from '@@/../common/components/cup-icon-3'
import CupIcon4 from '@@/../common/components/cup-icon-4'
import CupIcon5 from '@@/../common/components/cup-icon-5'
import i18n from '@@/lang/desktop/navi-series.json'
import Loading from '@@/../components/icons/Loading.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import SeriesSearch from '@@/../components/icons/SeriesSearch.vue'

export default {
  name: 'article-list',
  i18n: {
    messages: i18n
  },
  components: {
    SeriesSearch, Loading, Lzimg, CoronaIcon, LikeCount, CupIcon1, CupIcon2, CupIcon3, CupIcon4, CupIcon5 },
  props: ['articleRanking', 'data'],
  data() {
    return {
      activeTab: 3,
      articleList: (this.data || {}).data || [],
      total: (this.data || {}).total || 0,
      PERIODS: {
        YESTERDAY: 0,
        WEEK: 1,
        MONTH: 2,
        ALL: 3
      },
      page: 1,
      plan: +this.$route.query.plan || -1,
      period: +this.$route.query.period || 3,
      category: +this.$route.query.category || 0,
      loading: false,
      isBusy: false,
      articleLikes: {},
      periods: {
        0: '人気順（総合）',
        1: '人気順（週間）',
        2: '人気順（月間）',
        3: '新着順'
      },
      searchString: '',
      poolNaviList: []
    }
  },
  computed: {
    highlightItems() {
      if (this.articleList.length < 6) return []
      return this.articleList.slice(0, 3)
    },
    normalItems() {
      if (this.articleList.length < 6) return this.articleList
      return this.articleList.slice(3)
    },
    categories() {
      return this.$store.getters['finance/naviCategories'] || []
    },
    banners() {
      const defaultBanner = {landingPageUrl: '', bannerUrl:''}
      const bn = this.$store.getters['getBanners']
      if (!bn || (bn instanceof Array)) return defaultBanner
      return bn[3] || defaultBanner
    }
  },
  methods: {
    handleLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      this.GoGoHTTP.post(`/api/v3/surface/navi/article/${item.id}/like`)
        .then(() => {
          const likeItem = this.articleLikes[item.id] || defaultItem
          this.articleLikes = {
            ...this.articleLikes,
            [item.id]: {
              ...likeItem,
              isLiked: !likeItem.isLiked,
              totalLike: likeItem.isLiked ? --likeItem.totalLike : ++likeItem.totalLike
            }
          }
        })

    },
    getObjectLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }

      return this.articleLikes[item.id] || defaultItem
    },
    changeUrlState(query) {
      delete query['page']
      const params = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      if (params) {
        history.replaceState(null, document.title, `${location.pathname}?${params}`)
      }
    },
    setPeriod(period) {
      this.fetchData('period', period)
    },
    setPlan(plan) {
      this.fetchData('plan', plan)
    },
    setCategory(category) {
      this.fetchData('category', category)
    },
    getCategory(id) {
      const category = this.$store.getters['finance/naviCategoryToObject'] || {}
      const foundCategory = category[id] || {}
      return foundCategory.categoryName
    },
    async fetchData(typeName, typeValue) {
      if (this.loading) return
      this.loading = true
      const params = { ...this.getURLParams(), [typeName]: typeValue }
      this[typeName] = typeValue
      this.page =1
      const response = await this.GoGoHTTP.get('/api/v3/surface/navi/search/article/top', {
        params: {
          ...params,
          page: this.page
        }
      })
      this.articleList = response.data || response
      this.total = response.total || 0
      this.changeUrlState(params)
      this.loading = false
    },
    handleLazyLoad() {
      if (this.articleList.length === this.total) {
        this.unRegisterLazyLoad()
        return
      }
      if (this.isBusy) return
      if (document.body.scrollTop >= (document.body.scrollHeight / 2)) {
        this.isBusy = true
        const params = {...this.getURLParams(), page: this.page + 1 }
        this.GoGoHTTP.get('/api/v3/surface/navi/search/article/top', { params: params })
          .then(res => {
            if (res.data instanceof Array) {
              this.patchLike(res.data)
              this.articleList.push(...res.data)
              this.total = res.total
              this.page = res.currentPage
            } else this.unRegisterLazyLoad()
            this.isBusy = false
          })
      }
    },
    unRegisterLazyLoad() {
      document.body.removeEventListener('scroll', this.handleLazyLoad)
    },
    registerLazyLoad() {
      document.body.addEventListener('scroll', this.handleLazyLoad)
    },
    patchLike(list = this.articleList) {
      if (!list.length) return
      const ids = list.map(l => l.id)
      this.GoGoHTTP.get('/api/v3/surface/navi/like', {
        params: {
          articleIds: ids.join(',')
        }
      }).then(({articleLikes = []}) => {
        articleLikes.forEach(like => {
          this.articleLikes = {
            ...this.articleLikes,
            [like.masterId]: like
          }
        })
      })
    },
    onSearch() {
      this.fetchData('keyword', this.$refs.searchInput.value)
    },
    submitByEnter(e) {
      if (e.keyCode == 13) {
        this.onSearch()
      }
    },
    handleThumbnailClick(item) {
      location.href = '/finance/navi/articles/' + item.id
    }
  },
  mounted() {
    this.$refs.searchInput.value = this.$route.query.keyword || ''
    this.registerLazyLoad()
    this.patchLike([...this.articleList, ...this.articleRanking.flat()])
    const html = document.querySelector('html'), body = document.querySelector('body')
    if (html) html.setAttribute('style', 'width: 100% !important; overflow: hidden;')
    if (body) body.setAttribute('style', 'width: 100% !important; overflow: hidden auto')
  },
  beforeDestroy() {
    const html = document.querySelector('html'), body = document.querySelector('body')
    if (html) html.removeAttribute('style')
    if (body) body.removeAttribute('style')
  }
}
</script>

<style scoped lang="scss">
.placeholder-container {
  position: relative;

  img[alt="placeholder"] {
    //filter: blur(2px);
    z-index: -1;
  }

  img:last-child,.img-rank {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    object-fit: cover;
  }

  .like-fav {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ecececd1;
    padding: 0 10px;
    margin: 0;
    z-index: 9;
  }
}
.series-list {
  display: inline-flex;
  padding-top: 15px;
  position: relative;

  .left-menu {
    width: 300px;
    font-size: 15px;
    padding-left: 50px;

    .category div[class="dropdown"] {
      display: none;
    }

    .divider {
      height: 1px;
      width: 100%;
      margin: 10px 0;
      background-color: #F5F5F5;
    }

    * {
      color: #777777;

      &.selected {
        font-weight: bold;
      }
    }

    .series-period, .category {
      button {
        border: none;
        outline: none;
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
        color: #777777;
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

  .series-list-content {
    position: relative;
    padding: 0 15px;

    .normal-items-and-ranking {
      display: flex;

      .series-normal-items {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;

        .series-item {
          width: 100%;
          margin: 10px 0;
        }

        @media all and (max-width: 375px) {
          .series-item {
            > div {
              flex-direction: column;

              .img-placeholder {
                width: auto !important;
                height: auto !important;

                img {
                  width: 100% !important;
                  height: auto !important;
                }
              }

              .series-info {
                padding-left: 0 !important;

                .series-title {
                  margin: 10px 0;
                }
              }
            }
          }
        }
        @media all and (min-width: 768px) {
          .series-item {
            width: 50%;
          }
        }
        @media all and (min-width: 1024px) {
          .series-item {
            width: 25%;
          }
        }
        @media all and (min-width: 1440px) {
          .series-item {
            width: 20%;
          }
        }
      }

      .ranking {
        width: 200px;

        .title {
          svg {
            width: 34px;
          }
        }

        .ranking-period {
          margin-top: 10px;

          div {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            width: 80px;
            height: 24px;
            background-color: #CCCCCC;
            color: #333333;

            &.active, &:hover {
              background-color: #494949;
              color: white;
              transition: background-color .5s;
            }
          }
        }

        .series-item > * {
          font-size: 13px;
        }

        .ranking-content {
          display: flex;
          flex-direction: column;
        }
      }
    }

    .series-item {
      img {
        width: 100%;
      }

      .series-title {
        font-size: 18px;
        font-weight: 600;
        color: #2C2C2C;
      }

      .series-content {
        font-size: 14px;
        color: #7C7C7C;
      }

      .navi-category {
        color: white;
        background-color: #CCCCCC;
        border-radius: 3px;
        height: 24px;
        line-height: 24px;
        padding: 0 5px;
      }

      .author {
        display: inline-flex;

        img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
        }

        .author-name {
          color: #333333;
        }

        .published-date {
          font-size: 12px;
          color: #898989;
        }
      }

      .series-favourite {
        font-size: 11px;

        svg {
          width: 18px;
        }
      }
    }
  }

  @media screen and (min-width: 1024px) {
    padding-top: 40px;
    .series-list-content {
      padding: 0 60px;
    }
  }
  @media screen and (max-width: 1023px) {
    display: flex;
    flex-direction: column;
    .left-menu {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap-reverse;
      align-items: center;
      padding: 0 20px 20px;

      .series-search {
        width: auto;
        margin-top: 0
      }

      .filters {
        .divider {
          display: none;
        }

        .category div {
          &:first-child {
            display: none;
          }

          &:last-child {
            display: inline-flex;
          }
        }

        align-items: center;
        height: 40px;
        flex-direction: row;
        flex-wrap: wrap;

        .status-list {
          margin-right: 20px;

          span {
            line-height: 38px;
            margin: 0;
            padding: 0 10px;
            width: 68px !important;

            &.selected {
              background-color: #A9A9A9;
              color: white;
              font-weight: normal;
            }

            border-bottom: 1px solid #a9a9a9;
            border-top: 1px solid #a9a9a9;
            border-right: 1px solid #a9a9a9;

            &:first-child {
              border-left: 1px solid #a9a9a9;
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }

            &:last-child {
              border-bottom-right-radius: 3px;
              border-top-right-radius: 3px;
            }
          }
        }

        .series-period, .category {
          margin-top: 0;
          align-items: center;
          margin-right: 20px;
        }
      }
    }
  }
}

@media screen and (max-width: 896px) {
  .normal-items-and-ranking {
    flex-wrap: wrap-reverse;

    .ranking {
      width: 100% !important;
      margin: 0;
      background-color: #494949;
      color: white;
      padding: 0 20px;
    }

    .title {
      padding: 20px 0 0 0;
    }

    .ranking-period {
      .active {
        background-color: black !important;
      }
    }

    .ranking-content {
      display: inline-flex !important;
      flex-direction: row !important;
      height: 350px;
      overflow-x: auto;

      .series-item {
        background: white;
        border-radius: 4px;
        padding: 10px;
        margin: 20px 10px;
      }
    }
  }
  .series-search {
    width: 100% !important;
    margin-bottom: 15px;
  }
//}
//
//@media screen and (max-width: 480px) {
  .desktop {
    display: none;
  }
  .series-period {
    .dropdown {
      //min-width: 150px;
      border: 1px solid #ccc !important;
      border-radius: 4px;
      button {
        font-weight: normal !important;
      }
    }
  }
  .category {
    //min-width: 150px;
    border: 1px solid #ccc !important;
    border-radius: 4px;
    button {
      font-weight: normal !important;
    }
  }
  .left-menu {
    .filters {
      .status-list, .category, .series-period {
        margin-top: 15px !important;
      }

      .series-period {
        //width: 50% !important;
        margin-right: 10px !important;
      }

      .category {
        margin-right: 0 !important;
        //width: 50% !important;
      }
    }
  }
}
@media screen and (max-width: 425px){
  .left-menu {
    margin-bottom: 4rem;
  }
}
</style>
