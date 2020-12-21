<template>
  <div class="vid-i pos-rel">
    <a class="w-full" :href="'/finance/videos/' + item.id">
      <img :src="item.thumbnailUrl || getThumbnailYoutube(item.watchUrl)" class="vid-i__img w-full" />
      <div class="vid-i__info pt-10 pl-10 pr-10 cursor-pointer">
        <p class="vid-i__tit fs-12 mb-5" :title="item.title" v-wrap-lines="2">
          <strong>{{ item.title }}</strong>
        </p>
        <p class="vid-i__desc fs-12 mb-10" :title="item.content" v-wrap-lines="((item.prices || []).length > 0) ? 2 : 3">{{ item.content }}</p>
        <prices class="vid-i__prices" :prices="item.prices" currency="￥" v-if="(item.prices || []).length" />
      </div>
    </a>
    <rate class="pl-10 pr-10" :stars="item.review.stars" :target="item.productId" :number="item.review.count" v-if="item.review" />
    <div class="o-lbl-fee pos-abs" v-if="(item.prices || []).length"></div>
    <div class="o-lbl-fee__txt pos-abs" v-if="(item.prices || []).length">{{ $t('1') }}</div>
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import { getThumbnailYoutube } from '@/utils/client/common'
import i18n from '@@/lang/components-desktop/video-horizontal01.json'
/**
 * The VideoHorizontal01.
 */
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    /**
     * The VideoHorizontal01 item.
     */
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    Rate,
    Prices,
  },
  methods: {
    getThumbnailYoutube,
  },
}
</script>

<style lang="scss" scoped>
.vid-i {
  width: 184px;
  min-height: 250px;
  background: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  a {
    display: block;
    text-decoration: none;
    &:hover {
      opacity: 0.85;
    }
  }
  .vid-i__img {
    height: 104px;
  }
  .vid-i__tit,
  .vid-i__desc {
    color: #2d2d2d;
    overflow: hidden;
  }
  .vid-i__tit {
    max-height: 34px;
    overflow: hidden;
  }
  .vid-i__desc {
    max-height: 51px;
  }
  .vid-i__prices /deep/ {
    .co-red {
      margin-left: 0 !important;
    }
    .old-price {
      margin-right: 5px;
    }
  }
  .gg-rating /deep/ {
    font-size: 15px;
    letter-spacing: 1px;
    .rate-num {
      color: #666;
      font-size: 12px;
      margin-top: 2px;
    }
  }
}
.o-lbl-fee {
  top: -17.6px;
  right: -5px;
  width: 0;
  height: 0;
  border-top: 27px solid transparent;
  border-bottom: 27px solid transparent;
  border-right: 27px solid #f60;
  transform: rotate(135deg);
}
.o-lbl-fee__txt {
  font-size: 8.5px;
  top: 9px;
  right: -11px;
  color: #fff;
  transform: rotate(45deg);
  width: 50px;
  height: 12px;
  text-align: center;
  line-height: 12px;
}
</style>

<docs>
  ```vue
  <template>
    <video-horizontal01 :item="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item:
          {
            "id": 10055,
            "channelId": 10,
            "title": "『Gogojungle Market Strategy』#010",
            "content": "世界最大手の元プラチナ・トレーダー近藤雅世さんでした。テーマは",
            "watchUrl": "https://www.youtube.com/watch?v=GZ_LRUOyRK8",
            "publishedDate": 1465898583,
            "prices": [
                {
                    "price": 4385,
                    "discountPrice": 9556
                }
            ],
            "review": {
                "stars": 1,
                "count": 233
            }
          }
      }
    },
  }
  </script>
  ```
</docs>
