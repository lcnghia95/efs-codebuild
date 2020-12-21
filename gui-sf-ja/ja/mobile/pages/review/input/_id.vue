<template>
  <div>
    <div class="title p-10">{{ $t('5') }}</div>
    <div class="input-area">
      <div class="flex product-info p-10">
        <a :href="myReview.productDetailUrl">
          <img :src="'/img/products/' + myReview.productId + '/small'" class="product-img" />
        </a>
        <div class="ml-10">
          <div class="purchase-time" v-if="myReview.isPurchased">
            {{ $t('6') }}:&nbsp;{{ formatTime(myReview.purchasedAt, 7) }}
          </div>
          <a class="product-name mt-5" :href="myReview.productDetailUrl">
            {{ myReview.productName }}
          </a>
        </div>
      </div>
      <div v-if="myReview.isPurchased" class="p-10">
        <div>{{ $t('7') }}</div>
        <div style="color: #e5455d;"><template v-if="isClient && errors.has('star')">{{ $t(29) }}</template> </div>
        <div class="review-rate flex">
          <div class="rate-star flex row-reverse" :class="{ disabled: posting }">
            <span class="star cursor-pointer" v-for="i in 5" :key="'rate' + i" @click="onRate(i)" :class="check(i)"></span>
          </div>
          <input type="hidden" name="star" v-model="review.reviewStars" v-validate="{ rules: { required: true, min_value: 1, max_value: 5 } }" />
        </div>
        <div class="review-comment">
          <div class="pt-10 title02">{{ $t('8') }}</div>
          <div style="color: #e5455d;"><template v-if="isClient && errors.has('title')">{{ $t(25) }}</template> </div>
          <input type="text" 
                 v-model="review.reviewTitle"
                 :placeholder="$t(27)"
                 v-validate="{ rules: { required: true } }"
                 name="title"
                 class="w-full mb-20 h-40 border-radius-5 p-10"
                 :disabled="posting"
          />
          <div class="pt-10 title02">{{ $t('9') }}</div>
          <div style="color: #e5455d;"><template v-if="isClient && errors.has('des')">{{ $t(26) }}</template> </div>
          <textarea v-model="review.reviewContent"
                    name="des"
                    :placeholder="$t(28)"
                    v-validate="{ rules: { required: true } }"
                    class="w-full border-radius-5 p-10"
                    :disabled="posting"
          ></textarea>
          <div class="flex center mid layout-col mt-20">
            <button class="h-40" style="border-radius: 35px;" :class="{ 'disable': posting }" @click="postReview()">
              <div class="flex mid center">
                <b>{{ review.id ? $t('20') : $t('10') }}</b>
                <Loading v-if="posting" class="ml-10 sm" style="width: 20px; height: 20px;" />
              </div>
            </button>
            <div style="text-align: center; color: #bdbdbd;" class="mt-5" v-if="isClient && (((errors || {}).items) || []).length">{{ $t(30) }}</div>
          </div>
        </div>
      </div>
      <template v-else>
        <div class="text-center not-buy">
          <div class="mb-10" v-html="$t('16')"></div>
          <a :href="myReview.productDetailUrl" class="go-product">
            <span>{{ $t('17') }}</span>
          </a>
        </div>
      </template>
    </div>
    <template v-if="(alsoBought || []).length">
      <div class="title title03 mt-20 p-10">{{ $t('11') }}</div>
      <div class="flex layout-col">
        <ReviewItem05 v-for="item in alsoBought" :item="item" :key="'also-bought' + item.id" />
      </div>
    </template>  
    <template v-if="(recommend || []).length">
      <div class="title title03 mt-20 p-10">{{ $t('12') }}</div>
      <div class="flex layout-col">
        <ReviewItem05 v-for="item in recommend" :item="item" :key="'recommend-' + item.id" />
      </div>
    </template>
    <div class="p-10 bg-grey pt-20">
      <ReviewContainer 
        @seeMore="onSeeMore('/review/new')"
        class="mb-20 review-list-item"
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
import i18n from '@@/lang/mobile/review-input.json'
import title from '@@/../common/pages'
import Star from '@@/../components/icons/Star.vue'
import Loading from '@@/../components/icons/Loading.vue'
import ReviewContainer from '@/components/review/ReviewContainer.vue'
import ReviewItem04 from '@/components/review/ReviewItem04.vue'
import ReviewItem05 from '@/components/review/ReviewItem05.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import { filterInt } from '@/utils/client/common'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

const obj = Object.assign({
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  components: {
    Star,
    Loading,
    ReviewContainer,
    SocialLinks,
    ReviewItem04,
    ReviewItem05,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      reviewStars: null,
      posting: false,
      rankingEA: [],
      rankingEbook: [],
      recommend: [],
      isClient: process.browser,
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
    this.isClient = process.browser
  },
  async asyncData({ app, params, error }) {
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
      review: Object.assign({}, {
        title: null,
        content: null,
        reviewStars: 0,
      }, myReview),
      newReview,
      myReview,
      alsoBought,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/input/${params.id}`,
        },
      ],
    }
  },
  computed: {
    titleChunk() {
      return this.$t('1', {name: this.myReview.productName})
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('2', {name: this.myReview.productName})
    },
    onRate(star) {
      // let istars = this.review.reviewStars
      this.review.reviewStars = 5 - star + 1
      this.reviewStars = 5 - star + 1
    },
    postReview() {
      this.$validator.validateAll().then(rs => {
        if(rs) {
          this.posting = true
          this.GoGoHTTP.post(
            `/api/v3/surface/review/myreview/${this.id}`,
            this.review
          ).then(() => {
            location.href = `/review/success/${this.id}`
          }).finally(() => {
            this.posting = false
          })
        }
      })
    },
    check(i) {
      let a = i + this.review.reviewStars,
        b = i + parseInt(this.review.reviewStars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
    onSeeMore(url) {
      location.href = url
    }
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
$active: #fcd605;
$deactive: #c1c1c1;
.title {
  color: #434343;
  font-size: 16px;
  background: #f3f0ef;
  font-weight: bold;
}
.title03 {
  color: #707070;
}
/deep/.btn-loadmore:hover {
  opacity: 0.7;
}
.input-area {
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
  .title02 {
    color: #2d2d2d;
  }
  .review-rate {
    align-items: center;
    .rate-star {
      .star:hover ~ .star {
        color: $active;
      }
      .star {
        color: $deactive;
        display: inline-block;
        font-size: 38px;
        padding-right: 5px;
        &:hover {
          color: $active;
        }
      }
      .full {
        color: $active;
      }
      .half {
        position: relative;
      }
      .half::after {
        top: 0;
        left: 0;
        position: absolute;
        overflow: hidden;
        content: '\2605';
        color: $active;
        width: 50%;
      }
    }
    .star-note {
      align-items: center;
      i {
        color: #fcd605;
        padding-bottom: 3px;
        width: 20px;
        height: auto;
      }
      p {
        margin: 0;
      }
    }
  }
  .review-comment {
    input,
    textarea {
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      &::placeholder {
        color: #bdbdbd;
      }
    }
    textarea {
      resize: none;
      height: 150px;
    }
    button {
      display: block;
      width: 200px;
      height: 40px;
      background: #00a0e9;
      border: none;
      color: white;
      border-radius: 24px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .not-buy {
    padding: 30px;
    font-size: 16px;
    color: #a0a0a0;
    .go-product:hover {
      color: #fff;
      background-color: #2d2d2d;
    }
    a {
      display: inline-block;
      border: 1px solid #2d2d2d;
      border-radius: 25px;
      padding: 7px 30px;
      color: #2d2d2d;
      text-decoration: none;
      margin-top: 20px;
      font-size: 15px;
    }
  }
}
.bd-1 {
  border-bottom: 1px solid #d9d9d9;
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
.disabled .full {
  color: #303030 !important;
}
</style>
