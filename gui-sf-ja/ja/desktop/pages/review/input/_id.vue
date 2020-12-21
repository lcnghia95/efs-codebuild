<template>
  <div class="w-1000">
    <div class="title">{{ $t('5') }}</div>
    <div class="flex space-between">
      <div class="left-content">
        <div class="input-area bg-white">
          <div class="flex product-info">
            <img :src="'/img/products/' + myReview.productId + '/small'" class="product-img" />
            <div class="ml-15">
              <div class="purchase-time" v-if="myReview.isPurchased">
                {{ $t('6') }}{{ formatTime(myReview.purchasedAt, 7) }}
              </div>
              <div class="product-name mt-5">
                {{ myReview.productName }}
              </div>
            </div>
          </div>
          <template v-if="myReview.isPurchased">
            <div class="pt-20 title02">{{ $t('7') }}</div>
            <div style="color: #e5455d;"><template v-if="isClient && errors.has('star')">{{ $t(24) }}</template> </div>
            <div class="review-rate flex">
              <div class="rate-star flex row-reverse" :class="{ disabled: posting }">
                <span class="star cursor-pointer" v-for="i in 5" :key="'rate' + i" @click="onRate(i)" :class="check(i)" @mouseover="onMouseOver(i)" @mouseout="onMouseOut(i)"></span>
              </div>
              <input type="hidden" name="star" v-model="review.reviewStars" v-validate="{ rules: { required: true, min_value: 1, max_value: 5 } }" />
            </div>
            <div class="review-comment">
              <div class="pt-20 title02">{{ $t('8') }}</div>
              <div style="color: #e5455d;" class="mb-5"><template v-if="isClient && errors.has('title')">{{ $t(25) }}</template> </div>
              <input
                type="text" v-model="review.reviewTitle"
                name="title"
                v-validate="{ rules: { required: true } }"
                :placeholder="$t(27)"
                class="w-full mb-20 h-40 border-radius-5 p-10"
                :disabled="posting"
              />
              <div class="pt-20 title02">{{ $t('9') }}</div>
              <div style="color: #e5455d;" class="mb-5"><template v-if="isClient && errors.has('des')">{{ $t(26) }}</template> </div>
              <textarea
                name="des"
                v-model="review.reviewContent"
                class="w-full border-radius-5 p-10"
                :placeholder="$t(28)"
                v-validate="{ rules: { required: true } }"
                :disabled="posting"
              ></textarea>
              <div class="flex center mid layout-col mt-20">
                <button class="h-40" style="border-radius: 35px;" :class="{ 'disable': posting }" @click="postReview()">
                  <div class="flex mid center">
                    <b>{{ review.id ? $t('20') : $t('10') }}</b>
                    <Loading v-if="posting" class="ml-10 sm" style="width: 20px; height: 20px;" />
                  </div>
                </button>
                <div style="text-align: center; color: #bdbdbd;" v-if="isClient && (((errors || {}).items) || []).length" class="mt-5">{{ $t(29) }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center not-buy">
              <div class="mb-10">{{ $t('16') }}</div>
              <a :href="myReview.productDetailUrl" class="go-product">
                <span>{{ $t('17') }}</span>
                <AngleRight class="ml-10" />
              </a>
            </div>
          </template>
        </div>
        <div class="bg-white mt-30" v-if="(alsoBought || []).length">
          <div class="title">
            {{ $t('11') }}
          </div>
          <div class="flex flex-wrap mt-20">
            <template v-for="item in alsoBought">
              <ReviewHorizontal02 :key="'also-bought' + item.id" :item="item" class="m-5" />
            </template>
          </div>
        </div>
        <div class="bg-white mt-30" v-if="(recommend || []).length">
          <div class="title">
            {{ $t('12') }}
          </div>
          <div class="flex flex-wrap mt-20">
            <template v-for="item in recommend">
              <ReviewHorizontal02 :key="'recommend' + item.id" :item="item" class="m-5" />
            </template>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div class="title03 pb-5 bd-1">{{ $t('13') }}</div>
        <template v-for="item in newReview">
          <ReviewHorizontal01 :item="item" :key="item.id" />
        </template>
        <ShowMore01 class="mt-10" target="/review/new" />
        <div class="title03 pb-5 bd-1 mt-40" v-html="$t('14')"></div>
        <template v-for="(item, index) in rankingEA">
          <ReviewHorizontal01 :item="item" :key="item.id" :rank="index + 1" />
        </template>
        <ShowMore01 class="mt-10" target="/review/highpost/systemtrade/3" />
        <div class="title03 pb-5 bd-1 mt-40" v-html="$t('15')"></div>
        <template v-for="(item, index) in rankingEbook">
          <ReviewHorizontal01 :item="item" :key="item.id" :rank="index + 1" />
        </template>
        <ShowMore01 class="mt-10" target="/review/highpost/tools/3" />
        <SocialLinks class="mt-40" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/review-input-new.json'
import title from '@@/../common/pages'
import Star from '@@/../components/icons/Star.vue'
import Loading from '@@/../components/icons/Loading.vue'
import ShowMore01 from '@/components/common/ShowMore01.vue'
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ReviewHorizontal02 from '@/components/review/index/ReviewHorizontal02.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
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
    ShowMore01,
    ReviewHorizontal01,
    ReviewHorizontal02,
    AngleRight,
    SocialLinks,
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
  async asyncData({ app, params, store, error }) {
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
    store.commit('pushBC', {
      name: i18n[app.i18n.locale][5],
      target: { path: `/review/input/${params.id}` },
    })
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
    onMouseOut() {
      this.reviewStars = null
    },
    onMouseOver(i) {
      this.reviewStars = 5 - i + 1
    },
    descriptionTemplate() {
      return this.$t('2', {name: this.myReview.productName})
    },
    onRate(star) {
      if(this.posting) {
        return
      }
      this.review.reviewStars = 5 - star + 1
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
      let reviewStars = this.reviewStars || this.review.reviewStars,
        a = i + reviewStars,
        b = i + parseInt(reviewStars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
$active: #fcd605;
$deactive: #c1c1c1;
.bg-white {
  background: white;
  border-radius: 10px;
  padding: 20px;
}
.title {
  color: #2d2d2d;
  font-size: 22px;
}
.title03 {
  color: #2d2d2d;
  font-size: 18px;
}
/deep/.btn-loadmore:hover {
  opacity: 0.7;
}
.left-content {
  width: 670px;
  flex: 0 0 670px;
  .input-area {
    .product-info {
      padding-bottom: 15px;
      border-bottom: 1px solid #d9d9d9;
      .product-img {
        width: 80px;
        height: 80px;
        flex: 0 0 80px;
      }
      .purchase-time {
        font-size: 12px;
        color: #a0a0a0;
      }
      .product-name {
        color: #2d2d2d;
        font-size: 14px;
      }
    }
    .title02 {
      color: #2d2d2d;
      font-size: 16px;
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
          font-size: 30px;
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
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .not-buy {
      padding: 50px 150px;
      font-size: 20px;
      color: #a0a0a0;
      .go-product:hover {
        color: #fff;
        background-color: #2d2d2d;
      }
      a {
        border: 1px solid #2d2d2d;
        border-radius: 18px;
        padding: 5px 30px;
        font-size: 13px;
        color: #2d2d2d;
        text-decoration: none;
        margin-top: 10px;
        i {
          width: 16px;
          height: 12px;
        }
      }
    }
  }
}
.right-content {
  width: 300px;
  .bd-1 {
    border-bottom: 1px solid #d9d9d9;
  }
  /deep/ .rv-hori-item {
    width: 300px;
    .item-content {
      width: 210px;
    }
  }
}
.disabled .full {
  color: #303030 !important;
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