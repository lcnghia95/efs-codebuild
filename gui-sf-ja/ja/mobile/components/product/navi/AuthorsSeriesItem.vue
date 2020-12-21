<template>
  <div class="auseri-wrapper flex">
    <ImgWrapper
      class="authorsr_img"
      :href="'/finance/navi/series/' + item.sId"
      :src="'/img/products/' + item.pId + '/small'"
    />
    <div class="right-content flex layout-col">
      <a
        :href="'/finance/navi/series/' + item.sId"
        class="series-name"
        :title="item.name"
        v-wrap-lines="2"
      >
        <b>{{ item.name }}</b>
      </a>
      <div v-if="item.updatedAt" class="des-info" v-wrap-lines="2" :title="item.description">
        {{ formatTime(item.updatedAt, 20) }}更新
      </div>
      <div class="star-read flex flex-wrap">
        <div class="flex mid">
          <Star class="fav-btn" :class="{ active: item.isFavorite }" :is-favorite="item.isFavorite" @click.native="favFn(item)" />
          <a v-if="item.articleId" :href="'/finance/navi/' + item.articleId" class="link-arr">{{ $t('1') }}»</a>
        </div>
        <MiniCart :price="item.price" :product-id="item.pId" :discount-price="item.discountPrice" v-if="item.price" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/author-seri-item.json'
import Star from '@@/../components/icons/Star.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import MiniCart from '@/components/finance/payment/MiniCart.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    favFn: Function,
  },
  components: {
    Star,
    ImgWrapper,
    MiniCart,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    getNaviImg,
  },
}
</script>

<style lang="scss" scoped>
.auseri-wrapper {
  margin: 3vw;
  padding: 3vw;
  border: 1px solid #dfdedc;
  a {
    font-size: 3vw;
    color: #2d2d2d;
    &.series-name {
      font-size: 3.5vw;
    }
  }
  .authorsr_img {
    flex: 0 0 21vw;
    height: 20vw;
  }
  .right-content {
    margin: 0 0 0 3vw;
    width: 63vw;
  }
}
.des-info {
  font-size: 3vw;
}
.deactive-5IFT8 {
  opacity: 0.5;
}
.star-read {
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
  .icon-cls {
    width: 22px;
    height: 22px;
    color: #ccc;
    &.active {
      color: #fc0;
    }
  }
}
.link-arr {
  line-height: 11px;
  border-bottom: 1px solid #2d2d2d;
  margin: 0 0 -3px 7px;
}
</style>
<docs>
  ```vue
  <template>
      <SeriesItem :item="item" :fav-fn="onNaviFavoriteItem" />
  </template>
  <script>
  import SeriesItem from '@/components/product/navi/AuthorsSeriesItem.vue'
  import onNaviFavoriteItem from '@@/../common/js/finance/utils'

  export default {
    data() {
      return {
        item: {
          pId:	15840,
          sId:	625,
          name:	"MT4インジケータ＆EAの紹介",
          articleId:	8061,
          description:	"【MT4】チャートチェンジャーツールの紹介",
          isFavorite:	0,
          price:	0,
        }
      }
    },
    methods: {
      onNaviFavoriteItem,
    }
  }
  </script>
  ```
</docs>
