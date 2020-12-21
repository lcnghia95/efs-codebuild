<template>
  <div class="rank-wrapper flex layout-col">
    <div class="top-content w-full flex space-between">
      <div class="rank-left">
        <a
          :href="naviDetailUrl"
          :title="item.title"
          class="rank-title"
          v-wrap-lines="2"
        >
          <b>{{ item.title }}</b>
        </a>
        <a :href="naviDetailUrl">
          <div class="rank-des mt-5" v-wrap-lines="2" v-html="item.content"></div>
        </a>
      </div>
      <div class="rank-right">
        <ImgWrapper
          :href="naviDetailUrl"
          :src="getNaviImg(item, '/img/articles/')"
        />
        <div class="btn-box text-right mt-10">
          <Check
            :class="{
              'icon-active': item.isReadLater,
              'deactive-navi': loadingFollow,
            }"
            @click.native="followFn(item)"
          />
          <Star
            class="ml-10"
            :class="{ 'icon-active': item.isFavorite }"
            @click.native="favFn(item)"
          />
        </div>
      </div>
    </div>
    <div class="bottom-content w-full flex space-between">
      <div class="flex layout-col">
        <a
          class="rank-user flex mid"
          :href="'/finance/navi/authors/' + (item.user || {}).id"
        >
          <Edit />
          <span :title="(item.user || {}).name" class="wrap-text user-id">
            {{
              (item.user || {}).name
            }}
          </span>
        </a>
        <a :href="naviDetailUrl" class="txt-text block">
          {{
            formatTime(item.publishedDate, 6)
          }}
        </a>
      </div>
      <div class="flex layout-col content-end ">
        <a
          :href="naviDetailUrl"
          class="status text-center"
          v-if="!item.isPaidContent && !item.isPurchased"
        >
          {{ $t('1') }}
        </a>
        <a :href="naviDetailUrl" v-if="item.isPaidContent || item.isPurchased">
          <div class="status text-center deactive" v-if="item.isPurchased">
            {{ $t('4') }}
          </div>
          <div v-else class="flex mid">
            <Price
              v-if="item.price"
              :price="item.discountPrice || item.price"
              :old-price="item.discountPrice ? item.price : null"
            />
            <span class="monthly" v-if="item.isMonthlyPrice && item.price">
              &nbsp;/&nbsp;<b>{{ $t('6') }}</b>
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-rank-horiz.json'
import Edit from '@@/../components/icons/Edit.vue'
import Star from '@@/../components/icons/Star.vue'
import Check from '@@/../components/icons/Check.vue'
import Price from '@@/../components/prices/Price.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'

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
  },
  components: {
    Edit,
    Star,
    Check,
    Price,
    ImgWrapper,
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
.rank-wrapper {
  padding: 4vw;
  border-bottom: 1px solid #dfdedc;
  a {
    font-size: 3vw;
    color: #8e8e8e;
    &:hover,
    &:active,
    &:visited,
    &:focus {
      text-decoration: none;
    }
  }
  .rank-right {
    flex: 0 0 25%;
    .img-wrapp {
      width: 100%;
      padding-bottom: 76%;
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
    flex: 0 0 70%;
    .rank-title {
      font-size: 4vw;
      color: #666;
      max-height: 11vw;
      overflow: hidden;
    }
    .rank-des {
      font-size: 3.2vw;
      line-height: 4.5vw;
      max-height: 8.5vw;
      overflow: hidden;
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
      font-size: 3.5vw;
      .old-price {
        margin-left: 5px;
      }
    }
  }
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
