<template>
  <div class="navi-top">
    <navi-menu :is-list-page="true" />
    <div class="navi-top-content flex layout-col">
      <navi-left-menu class="sidebar" @set-plan="handleSelectPlan" @set-category="handleSelectCategory" />
      <navi-left-menu-mobile class="sidebar-sm" @set-plan="handleSelectPlan" @set-category="handleSelectCategory" />
      <div class="w-full flex center">
        <div class="navi-list flex layout-col">
          <span style="text-align: center" v-if="!naviList || !naviList.length">
            該当の記事および連載はありません。
          </span>
          <template v-if="!loading">
            <div class="item flex layout-col" v-for="(item, index) in naviList" :key="index">
              <div class="flex">
                <Lzimg :data-src="`/img/${item.isArticle ? 'articles' : 'products'}/${item.isArticle? item.id : item.productId}/small?ingoreOnErr=1`" onerror="this.style.display='none'" alt="" style="max-height: 348px; max-width: 100%;" />
              </div>
              <a :href="`/finance/navi/${item.isArticle ? 'articles' : 'series'}/${item.id}`"
                 class="item-title pt-20 pb-10 no-underlying"
              >
                {{ item.title }}
              </a>
              <p class="item-content" v-html="item.content"></p>
              <div class="item-sub-content mt-20 flex space-between">
                <div class="inline-flex">
                  <!--         is article         -->
                  <template v-if="item.isArticle">
                    <span class="type-item p-5 article" v-if="item.price || !item.seriesPrice">記事</span>
                    <span v-if="item.price" style="color: #5CCFCA" class="flex mid mr-10 ml-5">\{{ formatNumber(item.price) }}</span>
                    <span v-if="!item.price && !item.seriesPrice" style="color: #5CCFCA" class="flex mid mr-10 ml-5">無料</span>
                    <template v-if="item.seriesPrice">
                      <span class="type-item p-5 series">連載</span>
                      <span v-if="item.seriesPrice" class="flex mid mr-10 ml-5" style="color: #548BDF">¥{{ formatNumber(item.seriesPrice) }}/月</span>
                    </template>
                  </template>
                  <!--         is series         -->
                  <template v-else>
                    <span class="type-item p-5 series">連載</span>
                    <template v-if="item.price">
                      <template v-if="item.isSpecialDiscount">
                        <span class="flex mid ml-5 mr-10" style="color: #548BDF">¥{{ formatNumber(item.specialDiscountPrice) }}/月</span>
                        <span class="flex mid" style="text-decoration: line-through; margin-left: -5px">\{{ formatNumber(item.price) }}/月</span>
                      </template>
                      <span v-else class="flex mid ml-5 mr-10" style="color: #548BDF">¥{{ formatNumber(item.price) }}/月</span>
                    </template>
                    <span v-else style="color: #548BDF" class="flex mid mr-10 ml-5">無料</span>
                    <span v-if="item.isFreeFirstMonth" class="is-free-first-month mr-5">初月無料</span>
                  </template>
                  <div class="navi-category ml-5 flex" v-if="item.naviCategoryId">
                    <span class="item-category p-5 ml-5">{{ getCategory(item.naviCategoryId) }}</span>
                  </div>
                </div>
              </div>
              <div class="item-author flex space-between mt-20">
                <div class="author inline-flex grow00">
                  <a :href="`/finance/navi/authors/${item.userId}`">
                    <Lzimg :data-src="`/img/users/${item.userId}/small`" width="36px" height="36px" alt="" style="border: none" />
                  </a>
                  <div class="flex layout-col ml-5 w-full" style="min-width: 100px">
                    <a :href="`/finance/navi/authors/${item.userId}`" class="author-name wrap-text no-underlying"
                       :title="item.nickName"
                    >
                      {{ item.nickName }}
                    </a>
                    <span class="published-date">{{ formatTime(new Date(item.publishedAt.replace(' ', 'T')).getTime() / 1000, 1) }}</span>
                  </div>
                </div>
                <div class="flex grow10 content-end" v-if="$store.state.user.id">
                  <LikeCount
                    width="28"
                    height="28"
                    :liked="getObjectLike(item).isLiked"
                    :count="getObjectLike(item).totalLike"
                    @onLike="handleLike(item)"
                    class="mr-5"
                  />
                  <FavouriteButton
                    :marked="!!favorites[item.id] || !!(favorites[item.id] || {}).seriesId"
                    @favourite="handleFavorite(item)"
                  />
                </div>
              </div>
              <div class="hoz-divider mt-30 mb-30"></div>
            </div>
          </template>
          <template v-else>
            <div class="item">
              <Loading />
            </div>
          </template>
        </div>
        <div class="top-right-content flex layout-col">
          <!--     article ranking     -->
          <template v-if="articleRanking.length">
            <div class="flex center">
              <SocialLinks />
            </div>
            <div class="article-ranking-section flex layout-col mt-30">
              <div class="title flex mid">
                <corona-icon class="mr-5" /> <span style="margin-top: 2px">記事ランキング</span>
              </div>
              <div class="ranking-period inline-flex mt-10">
                <div :class="{active: articleTab === PERIODS.YESTERDAY}" @click="articleTab = PERIODS.YESTERDAY">昨日</div>
                <div :class="{active: articleTab === PERIODS.WEEK}" @click="articleTab = PERIODS.WEEK">週間</div>
                <div :class="{active: articleTab === PERIODS.MONTH}" @click="articleTab = PERIODS.MONTH">月間</div>
                <div :class="{active: articleTab === PERIODS.ALL}" @click="articleTab = PERIODS.ALL">総合</div>
              </div>
              <div class="article-list mt-10">
                <top-ranking :items="articleRanking[articleTab]" />
              </div>
            </div>
          </template>
          <!--     series ranking     -->
          <template v-if="seriesRanking.length">
            <div class="article-ranking-section flex layout-col mt-30">
              <div class="title flex mid">
                <corona-icon class="mr-5" /> <span style="margin-top: 2px">連載ランキング</span>
              </div>
              <div class="ranking-period inline-flex mt-10">
                <div :class="{active: seriesTab === PERIODS.YESTERDAY}" @click="seriesTab = PERIODS.YESTERDAY">総合</div>
                <div :class="{active: seriesTab === PERIODS.WEEK}" @click="seriesTab = PERIODS.WEEK">FX</div>
                <div :class="{active: seriesTab === PERIODS.MONTH}" @click="seriesTab = PERIODS.MONTH">株</div>
                <div :class="{active: seriesTab === PERIODS.ALL}" @click="seriesTab = PERIODS.ALL">Bitcoin</div>
              </div>
              <div class="article-list mt-10">
                <top-ranking :items="seriesRanking[seriesTab]" is-series />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NaviMenu from '@@/../common/components/navi/navi-header'
import LikeCount from '@@/../common/components/like-count'
import FavouriteButton from '@@/../common/components/favourite-button'
import SocialLinks from '@@/../ja/desktop/components/review/SocialLinks.vue'
import CoronaIcon from '@@/../common/components/navi/top/corona-icon'
import i18n from '@@/lang/desktop/navi-layout.json'
import TopRanking from '@@/../common/components/navi/top/top-ranking'
import Loading from '@@/../components/icons/Loading.vue'
import NaviLeftMenu from '@@/../common/components/navi/navi-left-menu'
import NaviLeftMenuMobile from '@@/../common/components/navi/navi-left-menu-mobile'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  name: 'navi-top',
  i18n: {
    messages: i18n,
  },
  components: {
    NaviLeftMenuMobile,
    NaviLeftMenu,
    TopRanking,
    FavouriteButton,
    LikeCount,
    NaviMenu,
    SocialLinks,
    CoronaIcon,
    Loading,
    Lzimg,
  },
  props: {
    items: {
      type: Array,
      default() {return []}
    },
    articleRanking: {
      type: Array,
      default() {return []}
    },
    seriesRanking: {
      type: Array,
      default() {return []}
    },
    isMobile: {
      type: Boolean,
      default() {return false}
    }
  },
  data() {
    return {
      naviList: this.items,
      titleChunk: this.$t('1'),
      PERIODS: {
        YESTERDAY: 0,
        WEEK: 1,
        MONTH: 2,
        ALL: 3
      },
      seriesTab: 0,
      articleTab: 0,
      loading: false,
      articleLikes: {},
      seriesLikes: {},
      page: 1,
      isBusy: false,
      poolNaviList: []
    }
  },
  computed: {
    favorites() {
      const {favorite = []} = this.$store.getters['finance/getFavData'] || {}
      return favorite.reduce((f, val) => {
        f[val.id] = val
        return f
      }, {})
    }
  },
  mounted() {
    this.manipulateData(this.naviList)
    this.registerLazyLoad()
  },
  beforeDestroy() {
    this.unRegisterLazyLoad()
  },
  methods: {
    changeUrlState(query) {
      delete query['page']
      const params = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      if (params) {
        history.replaceState(null, document.title, `${location.pathname}?${params}`)
      }
    },
    async handleSelectPlan(value) {
      this.loading = true
      const params = { ...this.getURLParams(), plan: value, page: 1}
      this.naviList = await this.GoGoHTTP.get('/api/v3/surface/navi/top/new', {params})
      this.manipulateData(this.naviList, true)
      this.changeUrlState(params)
      this.loading = false
      this.page = 1
      this.registerLazyLoad()
    },
    async handleSelectCategory(value) {
      this.loading = true
      const params = {...this.getURLParams(), category: value, page: 1}
      this.naviList = await this.GoGoHTTP.get('/api/v3/surface/navi/top/new', {params})
      this.manipulateData(this.naviList, true)
      this.changeUrlState(params)
      this.loading = false
      this.page = 1
      this.registerLazyLoad()
    },
    getCategory(id) {
      const category = this.$store.getters['finance/naviCategoryToObject'] || {}
      const foundCategory = category[id] || {}
      return foundCategory.categoryName
    },
    /**
     * @param item {{id: number, isArticle: boolean}}
     * @returns {{isLiked: boolean, totalLike: number}}
     */
    getObjectLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      const result = item.isArticle ? this.articleLikes[item.id] : this.seriesLikes[item.id]
      return result || defaultItem
    },
    /**
     * @param item {{id: number, isArticle: boolean}}
     */
    handleLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      if (item.isArticle) {
        return this.GoGoHTTP.post(`/api/v3/surface/navi/article/${item.id}/like`)
          .then(() => {
            const favoriteItem = this.articleLikes[item.id] || defaultItem
            this.articleLikes = {
              ...this.articleLikes,
              [item.id]: {
                ...favoriteItem,
                isLiked: !favoriteItem.isLiked,
                totalLike: favoriteItem.isLiked ? --favoriteItem.totalLike : ++favoriteItem.totalLike
              }
            }
          })
      }
      this.GoGoHTTP.post(`/api/v3/surface/navi/series/${item.id}/like`)
        .then(() => {
          const favoriteItem = this.seriesLikes[item.id] || defaultItem
          this.seriesLikes = {
            ...this.seriesLikes,
            [item.id]: {
              ...favoriteItem,
              isLiked: !favoriteItem.isLiked,
              totalLike: favoriteItem.isLiked ? --favoriteItem.totalLike : ++favoriteItem.totalLike
            }
          }
        })
    },
    async handleFavorite(item) {
      const url = item.isArticle ? '/api/v3/surface/navi/favorite/article' : '/api/v3/surface/navi/favorite/series'
      const path = `/finance/navi/${item.isArticle ? 'articles' : 'series'}/${item.id}`
      const res = await this.GoGoHTTP.post(url, {
        articleId: item.id,
        seriesId: item.id
      })
      if (res.status) {
        return this.$store.commit('finance/addFavItem', {
          id: item.id,
          seriesId: item.seriesId,
          detailUrl: path,
          title: item.title
        })
      }
      this.$store.commit('finance/removeFavItem', {id: item.id})
    },
    manipulateData(naviList, isReset = false) {
      if (isReset) {
        this.articleLikes = this.seriesLikes = {}
      }
      const articlesIds = [], seriesIds = []
      naviList.forEach(item => {
        if (item.isArticle) articlesIds.push(item.id)
        else seriesIds.push(item.id)
      })

      this.GoGoHTTP.get('/api/v3/surface/navi/like', {
        params: {
          articleIds: articlesIds.join(','),
          seriesIds: seriesIds.join(',')
        }
      }).then(res => {
        const {articleLikes = [], seriesLikes = []} = res
        articleLikes.forEach(al => {
          this.articleLikes = {
            ...this.articleLikes,
            [al.masterId]: al
          }
        })
        seriesLikes.forEach(sl => {
          this.seriesLikes = {
            ...this.seriesLikes,
            [sl.masterId]: sl
          }
        })
      })
    },
    handleLazyLoad() {
      if (this.isBusy) return
      let a = $('.navi-list').get(0).getBoundingClientRect(),
          gap = a.bottom - window.innerHeight
      if (gap < 1200) {
        this.isBusy = true
        this.GoGoHTTP.get('/api/v3/surface/navi/top/new', { params: {...this.getURLParams(), page: ++this.page} })
          .then(res => {
            if (res && res.length) {
              this.poolNaviList = this.poolNaviList.concat(res)
              // this.naviList = this.naviList.concat(res)
              // this.manipulateData(res)
              this.showPoolNavi()
            } else this.unRegisterLazyLoad()
            // this.isBusy = false
          })
      }
    },
    showPoolNavi() {
      if (!this.poolNaviList.length) {
        this.isBusy = false
        this.handleLazyLoad()
        return
      }
      let arr = this.poolNaviList.splice(0, 5)
      this.naviList = this.naviList.concat(arr)
      this.manipulateData(arr)
      setTimeout(this.showPoolNavi, 300)
    },
    unRegisterLazyLoad() {
      document.body.removeEventListener('scroll', this.handleLazyLoad)
    },
    registerLazyLoad() {
      document.body.addEventListener('scroll', this.handleLazyLoad)
    }
  }
}
</script>

<style scoped lang="scss">
.navi-top-content {
  position: relative;
  .sidebar-sm, .sidebar {
    display: none;
  }
  @media all and (max-width: 1229px){
    .sidebar-sm {
      display: flex;
    }
  }

}
.navi-top {
  font-size: 16px;
  @media all and (min-width: 1229px) {
    .navi-list {
      margin-right: 60px;
    }
    .navi-top-content {
      flex-direction: row;
    }
    .sidebar {
      display: flex;
      width: 300px;
    }
  }
}
.navi-list {
  position: relative;
  max-width: 600px;
  width: 100%;
  /deep/ .favourite-button {
    min-width: 90px;
    span {
      font-size: 12px;
    }
  }
  .item-title {
    color: #333;
    font-size: 22px;
    font-weight: bold;
  }
  .item-content {
    color: #333;
    line-height: 24px;
  }
  .item-sub-content {
    height: 24px;
    font-size: 12px;
    .type-item {
      color: white;
      width: 40px;
      text-align: center;
      &.series {
        background-color: #548BDF;
      }
      &.article {
        background-color: #5CCFCA;
      }
    }
    .navi-category {
      padding-left: 5px;
      border-left: 1px solid #d6d6d6;
      .item-category {
        text-align: center;
        color: white;
        font-weight: bold;
        background-color: #CCC;
        //border-radius: 3px;
      }
    }
    .item-divider {
      height: 24px;
      width: 1px;
      background-color: #CCC;
      margin: 0 10px;
    }
  }
  .item-author {
    .author {
      max-width: 60%;
    }
    img {
      border-radius: 50%;
    }
    .author-name {
      color: #333;
    }
    .published-date {
      color: #898989;
      font-size: 12px;
    }
  }
  .hoz-divider {
    width: 100%;
    height: 1px;
    background-color: #CCC;
  }
}
.top-right-content {
  margin-top: 30px;
  padding-left: 10px;
  padding-right: 10px;
  .social {
    margin: auto;
  }
  /deep/ a.btn-social {
    width: 224px;
      height: 60px;
      i {
        width: 36px;
        height: 36px;
        margin-left: 20px;
      }
      p {
        display: flex;
        flex-direction: column-reverse;
        // margin-top: -10px;
        margin-left: 20px;
        span {
          font-size: 12px;
        }
      }
  }
}
.article-ranking-section {
  align-self: center;
  .title {
    color: #000;
    svg {
      width: 34px;
    }
  }
  .ranking-period div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    flex: 1;
    width: 72px;
    height: 24px;
    background-color: #CCC;
    color: #333;
    &.active, &:hover {
      background-color: #494949;
      color: white;
      transition: background-color .5s;
    }
  }

}
@media screen and (max-width: 1000px) {
  .top-right-content {
    display: none;
  }
  .navi-list {
    // margin: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
    max-width: 100%;
  }
  .item {
    padding-left: 15px;
    padding-right: 15px;
  }
}
@media screen and (max-width: 620px) {
  .item-author .author-name {
    max-width: 70px;
  }
}
.is-free-first-month {
  text-align: center;
  background-color: #CCCCCC;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  line-height: 24px;
}
.top-anchor-lazy {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 400px;
  z-index: -1;
  opacity: 0;
}
</style>
