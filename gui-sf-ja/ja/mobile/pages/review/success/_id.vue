<template>
  <div>
    <div class="title p-10">{{ $t('5') }}</div>
    <div class="flex product-info p-10">
      <img :src="'/img/products/' + myReview.productId + '/small'" class="product-img" />
      <div class="ml-10">
        <div class="purchase-time" v-if="myReview.isPurchased">
          {{ $t('6') }}:&nbsp;{{ formatTime(myReview.purchasedAt, 7) }}
        </div>
        <div class="product-name mt-5">
          {{ myReview.productName }}
        </div>
      </div>
    </div>
    <div class="flex layout-col mid center success-content mt-10">
      <div class="icon-border flex mid center">
        <Check class="icon-check" />
      </div>
      <div class="flex mid mt-10">
        <span class="content">{{ $t('18') }}</span>
      </div>
      <a :href="detailUrl" class="detail-url">
        {{ $t('19') }}
      </a>
      <a href="/review" class="detail-url mt-10">
        {{ $t('24') }}
      </a>
    </div>
    <template v-if="(alsoBought || []).length">
      <div class="title mt-20 p-10">{{ $t('11') }}</div>
      <div class="flex layout-col">
        <ReviewItem05 v-for="item in alsoBought" :item="item" :key="'also-bought' + item.id" />
      </div>
    </template>  
    <template v-if="(recommend || []).length">
      <div class="title mt-20 p-10">{{ $t('12') }}</div>
      <div class="flex layout-col">
        <ReviewItem05 v-for="item in recommend" :item="item" :key="'recommend-' + item.id" />
      </div>
    </template>
    <div class="p-10 bg-grey">
      <ReviewContainer 
        @seeMore="onSeeMore('/review/new')"
        class="mt-10 mb-20 review-list-item"
        :config="{
          title: $t('13'),
        }"
      >
        <ReviewItem04 v-for="(item, idx) in newReview" :rank="idx + 1" :item="item" :key="'new-review-' + item.productId + idx" />
      </ReviewContainer>
      <ReviewContainer 
        @seeMore="onSeeMore('/review/highpost/systemtrade/3')"
        class="mb-20 review-list-item"
        :config="{
          title: $t('14'),
        }"
      >
        <ReviewItem04 v-for="(item, idx) in rankingEA" :rank="idx + 1" :item="item" :key="'ranking-ea-' + item.productId + idx" />
      </ReviewContainer>
      <ReviewContainer 
        @seeMore="onSeeMore('/review/highpost/tools/3')"
        class="mb-20 review-list-item"
        :config="{
          title: $t('15'),
        }"
      >
        <ReviewItem04 v-for="(item, idx) in rankingEbook" :rank="idx + 1" :item="item" :key="'ranking-ebook-' + item.productId + idx" />
      </ReviewContainer>
    </div>
    <SocialLinks class="p-10 mb-40" />
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/review-input.json'
import Check from '@@/../components/icons/Check.vue'
import ReviewContainer from '@/components/review/ReviewContainer.vue'
import ReviewItem04 from '@/components/review/ReviewItem04.vue'
import ReviewItem05 from '@/components/review/ReviewItem05.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign({
  components: {
    Check,
    ReviewContainer,
    SocialLinks,
    ReviewItem04,
    ReviewItem05,
  },
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      rankingEA: [],
      rankingEbook: [],
      recommend: [],
    }
  },
  computed: {
    titleChunk() {
      return this.$t('3', {name: this.myReview.productName})
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ea').then(data => {
      this.rankingEA = data || []
    })
    this.GoGoHTTP.get('/api/v3/surface/review/ranking/ebook').then(data => {
      this.rankingEbook = data || []
    })
    this.GoGoHTTP.get(`/api/v3/surface/review/${this.id}/recommend`).then(data => {
      this.recommend = data || []
    })
  },
  async asyncData({ app, params, req, redirect, error }) {
    let referer = req.headers.referer || ''
    if (!referer.includes(`/review/input/${params.id}`)) {
      return redirect(`/review/input/${params.id}`)
    }
    let [
      newReview,
      myReview,
      alsoBought,
    ] = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/review/popular/new?limit=5'),
      app.GoGoHTTP.get(`/api/v3/surface/review/myreview/${params.id}`),
      app.GoGoHTTP.get(`/api/v3/surface/review/${params.id}/also-bought`),
    ])
    if (!myReview || !Object.keys(myReview).length) {
      return error({ statusCode: 404 })
    }
    return {
      id: params.id,
      newReview,
      myReview,
      alsoBought,
      detailUrl: `/review/detail/${params.id}`,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/success/${params.id}`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('4', {name: this.myReview.productName})
    },
  }
}, title)

export default obj
</script>

<style lang="scss" scoped>
.title {
  color: #434343;
  font-size: 16px;
  background: #f3f0ef;
  font-weight: bold;
}
.product-info {
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  .product-img {
    width: 80px;
    height: 80px;
    flex: 0 0 80px;
  }
  .purchase-time {
    color: #a0a0a0;
  }
  .product-name {
    color: #2d2d2d;
    font-weight: bold;
    word-break: break-all;
  }
}
.success-content {
  padding: 30px 10px;
  text-align: center;
  color: #9c3;
  .icon-border {
    border: 1px solid #9c3;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  .icon-check {
    color: #9c3;
    width: 26px;
    height: 26px;
  }
  .content {
    font-size: 20px;
    color: #9c3;
  }
  .detail-url {
    display: inline-block;
    border: 1px solid #2d2d2d;
    border-radius: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    color: #2d2d2d;
    text-decoration: none;
    margin-top: 20px;
    width: 250px;
    text-align: center;
  }
}
.bg-grey {
  background: #f3f0ef;
}
.review-list-item {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  /deep/ .item {
    padding: 20px 0 10px;
    .rank {
      top: -10px;
      left: 0;
    }
  }
}
</style>