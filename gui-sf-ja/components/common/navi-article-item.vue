<template>
  <LazyComp01 class="rank-wrapper flex layout-col" min-height="40vw" :always-show="!!(index != undefined && index < 3)">
    <div class="top-content w-full flex space-between">
      <div class="rank-left">
        <ImgWrapper
          :href="naviDetailUrl"
          :src="getNaviImg(item, '/img/articles/')"
        />
      </div>
      <div class="rank-right">
        <a :href="naviDetailUrl" :title="item.title" class="rank-title">
          <b>{{ item.title }}</b>
        </a>
        <a :href="naviDetailUrl">
          <div class="rank-des mt-5" v-html="item.content"></div>
        </a>
        <div class="btn-box text-right mt-10">
          <Check :class="{
            'icon-active': item.isReadLater,
            'deactive-navi': loadingFollow,
          }" @click.native="followFn(item)"
          />
          <Star class="ml-10"
                :class="{ 'icon-active': item.isFavorite }"
                @click.native="favFn(item)"
          />
        </div>
      </div>
    </div>
    <div class="bottom-content w-full flex space-between">
      <div class="flex layout-col">
        <a class="rank-user flex mid" :href="'/finance/navi/authors/' + (item.user || {}).id">
          <Edit />
          <span :title="(item.user || {}).name" class="wrap-text user-id">
            {{ (item.user || {}).name }}
          </span>
        </a>
        <a :href="naviDetailUrl" class="txt-text block">{{ formatTime(item.publishedDate, 6) }}</a>
      </div>
      <div class="flex layout-col content-end ">
        <a :href="naviDetailUrl" class="status text-center" v-if="!item.isPaidContent && !item.isPurchased">
          {{ $t('1') }}
        </a>
        <a :href="naviDetailUrl" v-if="item.isPaidContent || item.isPurchased">
          <div class="status text-center deactive" v-if="item.isPurchased">
            {{ $t('4') }}
          </div>
          <div v-else class="flex" style="flex-direction: column; align-items: flex-end;">
            <Price
              v-if="item.articlePrice"
              :price="item.price"
              :old-price="null"
            />
            <div class="series-price flex" v-if="item.seriesPrice">
              <template v-if="item.articlePrice">(</template>
              <Price
                :price="item.discountPrice || item.seriesPrice"
                :old-price="item.discountPrice ? item.seriesPrice : null"
              />
              <span class="monthly">
                &nbsp;/&nbsp;<b>{{ $t('6') }}</b>
              </span>
              <template v-if="item.articlePrice">)</template>
            </div>
          </div>
        </a>
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-rank-horiz.json'
import Edit from '@@/../components/icons/Edit.vue'
import Star from '@@/../components/icons/Star.vue'
import Check from '@@/../components/icons/Check.vue'
import Price from '@@/../components/prices/Price.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    followFn: Function,
    favFn: Function,
    index: Number
  },
  components: {
    Edit,
    Star,
    Check,
    Price,
    ImgWrapper,
    LazyComp01,
  },
  data() {
    return {
      loadingFollow: false,
      loadingFavorite: false,
    }
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    getNaviImg,
  },
  computed: {
    naviDetailUrl() {
      return `/finance/navi/articles/${this.item.id}`
    },
  },
}
</script>

<style lang="scss" scoped>
.series-price {
  color: red;
  /deep/ .price-cls strong {
    margin: 0 !important;
  }
}
.rank-wrapper {
  padding: 4vw;
  border-bottom: 1px solid #dfdedc;
  a {
    color: #8e8e8e;
    &:hover,
    &:active,
    &:visited,
    &:focus {
      text-decoration: none;
    }
  }
  .rank-right {
    flex: 0 0 64%;
    width: calc(100% - 36%);
    .rank-title {
      color: rgb(45, 45, 45);
      max-height: 12vw;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rank-des {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 4.5vw;
      max-height: 8.5vw;
      > /deep/ * {
        width: 100% !important;
      }
    }
    .btn-box {
      .icon-cls {
        width: 6vw;
        height: 6vw;
        color: #ccc;
        &.icon-active {
          color: #fc0;
        }
        &.deactive-navi {
          color: #f5f5f5;
          pointer-events: none;
        }
      }
    }
  }
  .rank-left {
    flex: 0 0 36%;
    .img-wrapp {
      width: 30vw;
      height: 25vw;
      top: 1%;
    }
  }
  .bottom-content {
    .rank-user {
      .icon-cls {
        width: 4vw;
        height: 4.5vw;
        margin-right: 2px;
      }
    }
    .status {
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 0.8vw;
      padding: 1.4vw 5vw 1vw;
      color: #8e8e8e;
    }
    .price-cls /deep/ {
      .old-price {
        margin-left: 5px;
      }
    }
  }
}
.monthly {
  color: red;
  flex: 0 0 auto;
}
</style>
<docs>
  ```vue
  <template>
      <NaviRankHorizontal01 :item="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          content: "現在子供たちが貯金箱に保存しているお金を置き換える...",
          id: 6559,
          isCampaign:0,
          isPaidContent:1,
          publishedDate:1535796360,
          title: "2億人をターゲットにする新規公開コインICO 10月31日まで",
          user: {
            id: 120662,
            name: "EDGE"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>