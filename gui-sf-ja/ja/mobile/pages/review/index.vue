<template>
  <div class="p-10" style="background: #f3f0ef;">
    <div class="mt-5 mb-15" style="font-weight: bold; font-size: 16px; color: #434343;">{{ $t(4) }}</div>
    <!-- popular -->
    <ReviewContainer 
      @seeMore="onSeeMore"
      :config="{ 
        title: $t(5),
        seeMoreURL: '/review/popular',
      }"
      class="mb-20"
    >
      <ReviewItem01 
        v-for="(item, index) in reviewPopular" 
        :item="item" 
        :key="item.productId+ index" 
        :rank="parseInt(index) + 1" 
        :go-to-detail="true"
      />
    </ReviewContainer>

    <!-- highscore 12 -->
    <ReviewSlider
      @seeMore="onSeeMore"
      @onNextPrev="(type) => type01 = type"
      ref="slider01"
      class="mb-20"
      :config="{ 
        title: $t(6),
        cates: hightScoreCates.map(item => item.type),
        seeMoreURL: '/review/highscore/{type}/12',
      }"
    >
      <div class="slider-ctn">
        <ReviewItem01 
          v-for="(item, index) in hightScoreData[type01]" 
          :item="item" :key="item.productId + 1" 
          :rank="parseInt(index) + 1" 
          :go-to-detail="true"
        />
      </div>
    </ReviewSlider>

    <!-- highpost 12 -->
    <ReviewSlider
      @seeMore="onSeeMore"
      @onNextPrev="(type) => type02 = type"
      ref="slider01"
      class="mb-20"
      :config="{ 
        title: $t(7),
        cates: hightPostcates.map(item => item.type),
        seeMoreURL: '/review/highpost/{type}/12',
      }"
    >
      <div class="slider-ctn">
        <ReviewItem01 
          v-for="(item, index) in hightPostData[type02]" 
          :item="item" :key="item.productId + 1" 
          :rank="parseInt(index) + 1"
          :go-to-detail="true"
        />
      </div>
    </ReviewSlider>

    <!-- highscore all -->
    <ReviewSlider
      @seeMore="onSeeMore"
      @onNextPrev="(type) => type03 = type"
      ref="slider03"
      class="mb-20 highscore"
      :config="{ 
        title: $t(8),
        cates: hightScoreCatesAll.map(item => item.type),
        seeMoreURL: '/review/highscore/{type}',
        typeSeeMoreURL: true,
      }"
    >
      <div v-for="(time, index) in ['all', 'sixMonths', 'threeMonths', 'oneMonth']" :key="index + time" style="min-height: 80px;">
        <div class="time-text mb-15 mt-10">{{ $t(time) }}</div>
        <template v-if="((highScoreDataAll[type03] || {})[time] || [] ).length">
          <ReviewItem03 
            v-for="(item, idx) in (highScoreDataAll[type03] || {})[time]" 
            :rank="parseInt(idx)+1" :item="item" 
            :key="item.productId + 3" 
            :style="idx? '' : 'border: none'"
          />
        </template>
        <template v-else>
          <div style="font-size: 14px; color: red; padding: 0 12px;">{{ $t(12) }}</div>
        </template>
      </div>
    </ReviewSlider>

    <!-- new review -->
    <ReviewContainer
      @seeMore="onSeeMore('/review/new')"
      class="mb-20"
      :config="{ 
        title: $t(9),
      }"
    >
      <ReviewItem04 v-for="(item, index) in newReview" :item="item" :key="item.productId + 6" :rank="parseInt(index)+1" />
    </ReviewContainer>

    <!-- ea -->
    <ReviewContainer 
      class="mb-20"
      @seeMore="onSeeMore('/review/highpost/systemtrade/3')"
      :config="{
        title: $t(10),
      }"
    >
      <ReviewItem04 v-for="(item, index) in rankingEA" :item="item" :key="item.productId + 6" :rank="parseInt(index)+1" />
    </ReviewContainer>

    <!-- ebook -->
    <ReviewContainer 
      @seeMore="onSeeMore('/review/highpost/tools/3')"
      class="mb-20"
      :config="{
        title: $t(11),
      }"
    >
      <ReviewItem04 v-for="(item, index) in rankingEbook" :item="item" :key="item.productId + 6" :rank="parseInt(index)+1" />
    </ReviewContainer>

    <SocialLinks class="mt-20" />
  </div>
</template>

<script>
import ReviewItem01 from '@/components/review/ReviewItem01.vue'
import ReviewItem03 from '@/components/review/ReviewItem03.vue'
import ReviewItem04 from '@/components/review/ReviewItem04.vue'
import ReviewContainer from '@/components/review/ReviewContainer.vue'
import ReviewSlider from '@/components/review/ReviewSlider.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import i18n from '@@/lang/mobile/review-index.json'
import title from '@@/../common/pages'

const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    ReviewItem01,
    ReviewItem03,
    ReviewItem04,
    ReviewContainer,
    ReviewSlider,
    SocialLinks,
  },
  async asyncData({ app }) {
    let [
      newReview,
      reviewPopular,
      hightScoreData,
    ] = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/review/popular/new', { params: { limit: 5 }}),
      app.GoGoHTTP.get('/api/v3/surface/review/popular', { params: { limit: 5 }}),
      app.GoGoHTTP.get('/api/v3/surface/review/highscore/12', { params: { limit: 5 }}),
    ])
    return {
      newReview,
      reviewPopular,
      hightScoreData,
    }
  },
  mounted() {
    this.type01 = this.hightScoreCates[0].type
    this.type02 = this.hightPostcates[0].type
    this.type03 = this.hightScoreCatesAll[0].type
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ea', { params: { limit: 5 }}).then(data => {
      this.rankingEA = data || []
    })
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ebook', { params: { limit: 5 }}).then(data => {
      this.rankingEbook = data || []
    })
    this.GoGoHTTP.get('/api/v3/surface/review/highpost/12', { params: { limit: 5 }}).then(data => {
      this.hightPostData = data || {}
    })
    this.GoGoHTTP.get('/api/v3/surface/review/highscore', { params: { limit: 5 }}).then(data => {
      this.highScoreDataAll = data || {}
    })
  },
  data() {
    return {
      type01: 'systemtrade',
      type02: 'systemtrade',
      type03: 'systemtrade',
      rankingEA: [],
      rankingEbook: [],
      hightPostData: {},
      highScoreDataAll: {},
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
    onSeeMore(url) {
      location.href = url
    },
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
.time-text {
  background: #eee;
  padding: 5px 12px;
  border-radius: 20px;
  color: #2d2d2d;
}
.slider-ctn {
  width: calc(100vw - 40px);
}
.highscore {
  /deep/ .see-more {
    border-top: 1px solid #e0e0e0;
  }
}
</style>
