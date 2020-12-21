<template>
  <div class="w-1000">
    <div class="head-title mt-20 mb-10">{{ $t(2) }}</div>
    <!-- top -->
    <div class="flex space-between">
      <!-- top left -->
      <div class="top-left-block" style="width: 670px;">
        <!-- new popular -->
        <div class="w-full mb-30 left-item-ctn" style="height: 750px;">
          <div class="fs-22 mb-15">{{ $t(3) }}</div>
          <div class="flex space-around mt-20" style="height: 550px; flex-flow: column wrap;">
            <template v-if="reviewPopular && reviewPopular.length">
              <ReviewHorizontal02 v-for="(item, index) in reviewPopular"
                                  :key="'review-popular-' + item.productId"
                                  :item="item"
                                  :rank="index + 1"
              />
            </template>
            <span v-else style="font-size: 22px; margin: 60px auto auto; color: red;">
              {{ $t(21) }}
            </span>
          </div>
          <div class="w-full text-center">
            <a class="showmore-btn" href="/review/popular"> {{ $t(4) }}<AngleRight /></a>
          </div>
        </div>
        <!-- highscore 12 -->
        <div class="w-full mb-30 left-item-ctn">
          <div class="fs-22 mb-15">{{ $t(5) }}</div>
          <div class="flex flex-wrap cate-ctn">
            <button class="cate-btn mr-10 mb-5" 
                    v-for="(item, index) in hightScoreCates" 
                    :class="{ 'active': hightScore.index == index }" 
                    :key="item.title + 'aiwjdwd'"
                    @click="hightScore = { index, url: item.url, type: item.type }"
            >
              {{ item.title }}
            </button>
          </div>
          <div class="flex mt-10" style="height: 600px; flex-flow: column wrap;">
            <template v-if="hightScoreData[hightScore.type] && hightScoreData[hightScore.type].length">
              <ReviewHorizontal02 v-for="(item, index) in hightScoreData[hightScore.type]"
                                  :item="item" 
                                  :key="'review-high-score-' + item.productId" :rank="index + 1"
                                  class="m-5"
              />
            </template>
            <span v-else style="font-size: 22px; margin: 60px auto auto; color: red;">
              {{ $t(21) }}
            </span>
          </div>
          <div class="w-full text-center">
            <a class="showmore-btn" :href="hightScore.url">{{ $t('25') }}<AngleRight /></a>
          </div>
        </div>
        <!-- highpost 12 -->
        <div class="w-full mb-30 left-item-ctn">
          <div class="fs-22 mb-15">{{ $t(6) }}</div>
          <div class="flex flex-wrap cate-ctn">
            <button class="cate-btn mr-10 mb-5" 
                    v-for="(item, index) in hightPostcates" 
                    :class="{ 'active': hightPost.index == index }" 
                    :key="item.title + 'aiwjdwd'"
                    @click="hightPost = { index, url: item.url, type: item.type }"
            >
              {{ item.title }}
            </button>
          </div>
          <div class="flex mt-10" style="height: 600px; flex-flow: column wrap;">
            <template v-if="hightPostData[hightPost.type] && hightPostData[hightPost.type].length">
              <ReviewHorizontal02 v-for="(item, index) in hightPostData[hightPost.type]"
                                  :key="'review-high-post-' + item.productId" 
                                  :item="item" 
                                  :rank="index + 1"
                                  class="m-5"
              />
            </template>
            <span v-else style="font-size: 22px; margin: 60px auto auto; color: red;">
              {{ $t(21) }}
            </span>
          </div>
          <div class="w-full text-center">
            <a class="showmore-btn" :href="hightPost.url"> {{ $t('24') }}<AngleRight /></a>
          </div>
        </div>
      </div>
      <!-- top right -->
      <div class="top-right-block" style="width: 300px;">
        <!-- new review -->
        <div class="right-item-ctn">
          <div class="title-01">{{ $t(7) }}</div>
          <ReviewHorizontal01 v-for="(item, index) in newReview"
                              :item="item"
                              :key="'review-new-' + item.productId + '-' + index" :rank="index + 1"
          />
          <ShowMore01 target="/review/new" class="pt-15" style="border-top: 1px solid #ececec;" />
        </div>
        <!-- ea -->
        <div class="mt-20 right-item-ctn">
          <div class="title-01" v-html="$t(8)"></div>
          <ReviewHorizontal01 v-for="(item, index) in rankingEA"
                              :item="item"
                              :key="'highpost-ea-3-' + item.productId" :rank="index + 1"
          />
          <ShowMore01 target="/review/highpost/systemtrade/3" class="pt-15" style="border-top: 1px solid #ececec;" />
        </div>
        <!-- ebook -->
        <div class="mt-20 right-item-ctn">
          <div class="title-01" v-html="$t(9)"></div>
          <ReviewHorizontal01 v-for="(item, index) in rankingEbook"
                              :style="index + 1 == newReview.length"
                              :item="item" :key="'highpost-tools-3-' + item.productId"
                              :rank="index + 1"
          />
          <ShowMore01 target="/review/highpost/tools/3" class="pt-20" style="border-top: 1px solid #ececec;" />
        </div>
        <!-- social button -->
        <SocialLinks class="mt-20" />
      </div>
    </div>
    <!-- bottom -->
    <div class="bottom-block mb-25 bg-white mt-10">
      <div class="fs-22 mb-15">{{ $t(13) }}</div>
      <div class="flex">
        <button class="cate-btn mr-15"
                v-for="(item, index) in hightScoreCatesAll"
                :class="{ 'active': hightScoreAll.index == index }"
                :key="item.title + '2d121'"
                @click="hightScoreAll = { index, url: item.url, type: item.type }"
        >
          {{ item.title }}
        </button>
      </div>
      <div class="mt-20 mb-15 flex space-between cate-table">
        <div style="width: 195px;" v-for="el in timeList" :key="el.key">
          <h4 style="border-bottom: 1px solid;" class="mb-20"> {{ el.text }} </h4>
          <template v-if="(highScoreDataAll[hightScoreAll.type] || {})[el.key] && (highScoreDataAll[hightScoreAll.type] || {})[el.key].length">
            <ReviewHorizontal03 class="mb-10"
                                v-for="(item, index) in (highScoreDataAll[hightScoreAll.type] || {})[el.key] || []"
                                :key="hightScoreAll.type + '-' + item.productId"
                                :item="item"
                                :rank="index + 1"
            />
          </template>
          <span v-else style="font-size: 14px; margin: 60px auto auto; color: red;">
            {{ $t(21) }}
          </span>
        </div>
      </div>
      <div class="w-full text-center">
        <a class="showmore-btn" :href="hightScoreAll.url"> {{ $t(22) }}<AngleRight /></a>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/review-index-new.json'
import title from '@@/../common/pages'
import ShowMore01 from '@/components/common/ShowMore01.vue'
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ReviewHorizontal02 from '@/components/review/index/ReviewHorizontal02.vue'
import ReviewHorizontal03 from '@/components/review/index/ReviewHorizontal03.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'

const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    ReviewHorizontal01,
    ReviewHorizontal02,
    ReviewHorizontal03,
    ShowMore01,
    AngleRight,
    SocialLinks
  },
  async asyncData({ app }) {
    let [
      newReview,
      reviewPopular,
      hightScoreData,
    ] = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/review/popular/new'),
      app.GoGoHTTP.get('/api/v3/surface/review/popular'),
      app.GoGoHTTP.get('/api/v3/surface/review/highscore/12'),
    ])
    return {
      newReview,
      reviewPopular,
      hightScoreData,
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ea').then(data => {
      this.rankingEA = data || []
    })
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ebook').then(data => {
      this.rankingEbook = data || []
    })
    this.GoGoHTTP.get('/api/v3/surface/review/highpost/12').then(data => {
      this.hightPostData = data || {}
    })
    this.GoGoHTTP.get('/api/v3/surface/review/highscore').then(data => {
      this.highScoreDataAll = data || {}
    })
  },
  data() {
    return {
      rankingEA: [],
      rankingEbook: [],
      hightPostData: {},
      highScoreDataAll: {},
      timeList: [
        {
          text: this.$t('14'),
          key: 'all',
        },
        {
          text: this.$t('15'),
          key: 'sixMonths',
        },
        {
          text: this.$t('16'),
          key: 'threeMonths',
        },
        {
          text: this.$t('17'),
          key: 'oneMonth',
        },
      ],
      hightScoreCatesAll: [
        {
          title: this.$t('cate-1'),
          url: '/review/highscore/systemtrade',
          type: 'systemtrade'
        },
        // {
        //   title: this.$t('cate-2'),
        //   url: '/review/highscore/kabu',
        //   type: 'kabu'
        // },
        {
          title: this.$t('cate-3'),
          url: '/review/highscore/tools',
          type: 'tools'
        },
        {
          title: this.$t('cate-4'),
          url: '/review/highscore/navi',
          type: 'navi'
        },
        {
          title: this.$t('cate-5'),
          url: '/review/highscore/salons',
          type: 'salons'
        },
        // {
        //   title: this.$t('cate-6'),
        //   url: '/review/highscore/emagazine',
        //   type: 'emagazine'
        // },
      ],
      hightScoreCates: [
        {
          title: this.$t('cate-1'),
          url: '/review/highscore/systemtrade/12',
          type: 'systemtrade',
        },
        // {
        //   title: this.$t('cate-2'),
        //   url: '/review/highscore/kabu/12',
        //   type: 'kabu',
        // },
        {
          title: this.$t('cate-3'),
          url: '/review/highscore/tools/12',
          type: 'tools',
        },
        {
          title: this.$t('cate-4'),
          url: '/review/highscore/navi/12',
          type: 'navi',
        },
        {
          title: this.$t('cate-5'),
          url: '/review/highscore/salons/12',
          type: 'salons',
        },
        {
          title: this.$t('cate-6'),
          url: '/review/highscore/emagazine/12',
          type: 'emagazine',
        },
        {
          title: this.$t('cate-7'),
          url: '/review/highscore/others/12',
          type: 'others',
        },
      ],
      hightPostcates: [
        {
          title: this.$t('cate-1'),
          url: '/review/highpost/systemtrade/12',
          type: 'systemtrade',
        },
        // {
        //   title: this.$t('cate-2'),
        //   url: '/review/highpost/kabu/12',
        //   type: 'kabu',
        // },
        {
          title: this.$t('cate-3'),
          url: '/review/highpost/tools/12',
          type: 'tools',
        },
        {
          title: this.$t('cate-4'),
          url: '/review/highpost/navi/12',
          type: 'navi',
        },
        {
          title: this.$t('cate-5'),
          url: '/review/highpost/salons/12',
          type: 'salons',
        },
        {
          title: this.$t('cate-6'),
          url: '/review/highpost/emagazine/12',
          type: 'emagazine',
        },
        {
          title: this.$t('cate-7'),
          url: '/review/highpost/others/12',
          type: 'others',
        },
      ],
      hightScoreAll: {
        index: 0,
        url: 'review/highscore/systemtrade',
        type: 'systemtrade',
      },
      hightScore: {
        index: 0,
        url: 'review/highscore/systemtrade/12',
        type: 'systemtrade',
      },
      hightPost: {
        index: 0,
        url: 'review/highpost/systemtrade/12',
        type: 'systemtrade',
      },
      titleChunk: this.$t('title'),
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('des')
    },
  },
}, title)

export default obj
</script>

<style lang='scss' scoped>
.head-title {
  font-size: 26px;
  color: #2d2d2d;
}
.fs-22 {
  font-size: 22px;
  color: #2d2d2d;
}
.cate-ctn {
  padding: 0;
}
.left-item-ctn {
  background: white;
  padding: 15px 25px 45px 25px;
  border-radius: 5px;
  height: 850px;
}
.right-item-ctn {
  background: white;
  padding: 15px;
  border-radius: 5px;
}
.title-01 {
  font-size: 17px;
  line-height: 22px;
  margin-bottom: 15px;
}
/deep/ .btn-loadmore:hover {
  opacity: 0.8;
}
.showmore-btn {
  margin: 30px auto 0 auto;
  display: inline-block;
  padding: 0 25px;
  min-width: 300px;
  height: 40px;
  background: #fff;
  border: 1px solid #2d2d2d;
  color: #2d2d2d;
  border-radius: 20px;
  font-size: 13px;
  text-align: center;
  line-height: 38px;
  text-decoration: none;
  cursor: pointer;
  .icon-cls {
    width: 15px;
    height: 11px;
  }
  &:hover {
    border-color: #9c3;
    color: #9c3;
  }
  &:active {
    background: #fff;
    color: #2d2d2d;
  }
}
.bottom-block {
  padding: 35px;
  .cate-table {
    height: 420px;
  }
}
.cate-btn {
  background: #fff;
  color: #d9d9d9;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  height: 30px;
  min-width: 140px;
  outline: none;
  &.active {
    background: #9c3;
    color: #fff;
    border-color: #9c3;
    &:hover {
      border-color: #659800;
      background: #659800;
      color: #fff;
    }
  }
  &:hover {
    border-color: #9c3;
    color: #9c3;
  }
  &:active {
    opacity: 0.7;
  }
}
</style>
<style lang='scss'>
body {
  background: #f7faf9;
}
#menu {
  background: #fff;
}
#header-01 {
  background: #fff;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
