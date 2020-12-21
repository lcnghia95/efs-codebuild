<template>
  <div class="navi-h03 pos-rel cursor-pointer">
    <a :href="`/finance/navi/articles/${item.id}`">
      <ImgWrapper class="w-full" :src="getNaviImg(item, '/img/articles/')" />
    </a>
    <div class="navi-info w-full">
      <a class="navi-title txt-cont wrap-text" :href="`/finance/navi/articles/${item.id}`" :title="item.title" v-wrap-lines="1">
        <b>{{ item.title }}</b>
      </a>
      <a :href="`/finance/navi/articles/${item.id}`" v-wrap-lines="2" class="navi-desc txt-cont fs-12">{{ item.content }}</a>
      <div class="content-wrapp flex space-between mt-5">
        <div class="content-info fs-12">
          <a :href="'/finance/navi/authors/' + (item.user || {}).id" class="txt-text wrap-text flex mid">
            <Edit />
            <span :title="(item.user || {}).name" class="wrap-text user-id">{{ (item.user || {}).name }}</span>
          </a>
          <a :href="`/finance/navi/articles/${item.id}`" class="txt-text block">{{ formatTime(item.publishedDate, 1) }}</a>
        </div>
        <a :href="`/finance/navi/articles/${item.id}`" class="status text-center" v-if="!item.isPaidContent && !item.isPurchased">{{ $t('1') }}</a>
        <a :href="`/finance/navi/articles/${item.id}`" v-if="item.isPaidContent || item.isPurchased">
          <div class="status text-center deactive" v-if="item.isPurchased">{{ $t('4') }}</div>
          <div v-else class="flex article-item-price" style="flex-direction: column;">
            <Price v-if="item.articlePrice" class="article-price" :price="item.price" :old-price="null" />
            <div class="series-price flex" v-if="item.seriesPrice">
              <template v-if="item.articlePrice">(</template><Price :price="item.discountPrice || item.seriesPrice" :old-price="item.discountPrice ? item.seriesPrice: null" />
              <span class="monthly">&nbsp;/&nbsp;<b>{{ $t('6') }}</b> </span><template v-if="item.articlePrice">)</template>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="btn-box pos-abs">
      <Check :class="{'icon-active': !isUnFollow, 'deactive-navi': loadingFollow}" @click.native="onNaviFollow" />
      <Star :class="{'icon-active': !isUnFav, 'deactive-navi': loadingFavorite}" @click.native="onNaviFavorite" />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal02.json'
import Edit from '@@/../components/icons/Edit.vue'
import Star from '@@/../components/icons/Star.vue'
import Check from '@@/../components/icons/Check.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import Price from '@@/../components/prices/Price.vue'
import {
  onNaviFollow,
  onNaviFavorite,
  getNaviImg,
} from '@@/../common/js/finance/utils'
/**
 * The NaviHorizontal03.
 */
export default {
  props: {
    /**
     * The NaviHorizontal03 item.
     */
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    followFn: Function,
    favoriteFn: Function,
  },
  data() {
    return {
      loadingFollow: false,
      loadingFavorite: false,
      isUnFav: true,
      isUnFollow: true,
    }
  },
  components: {
    Edit,
    Star,
    Check,
    ImgWrapper,
    Price,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onNaviFollow,
    onNaviFavorite,
    getNaviImg,
    isFavoriteStore() {
      let favData = this.$store.getters['finance/getFavData']
      return favData.favorite.findIndex(favItem => favItem.id == this.item.id)
    },
    isFollowStore() {
      let favData = this.$store.getters['finance/getFavData']
      return favData.follow.findIndex(
        followItem => followItem.id == this.item.id
      )
    },
    getUnFav() {
      let favData = this.$store.getters['finance/getFavData'],
        isFavoriteStore = this.isFavoriteStore()
      if (isFavoriteStore != -1) {
        this.isUnFav = favData.favorite[isFavoriteStore]['isUnFav']
      } else {
        this.isUnFav = true
      }
    },
    getUnFollow() {
      let favData = this.$store.getters['finance/getFavData'],
        isFollowStore = this.isFollowStore()
      if (isFollowStore != -1) {
        this.isUnFollow = favData.follow[isFollowStore]['isUnFollow']
      } else {
        this.isUnFollow = true
      }
    },
    getInfoStore() {
      this.getUnFav()
      this.getUnFollow()
    },
  },
  mounted() {
    this.getInfoStore()
    this.$nuxt.$on('upDateDataItem', this.getInfoStore)
  },
  beforeDestroy() {
    this.$nuxt.$off('upDateDataItem')
  },
}
</script>

<style lang="scss" scoped>
.navi-h03 {
  width: 360px;
  height: 270px;
  .article-item-price {
    .article-price {
      justify-content: flex-end;
    }
    .series-price {
      color: red;
      .monthly {
        width: auto !important;
        flex: 0;
      }
      /deep/ .price-cls strong {
        margin: 0 !important;
      }
    }
  }
  .img-wrapp {
    border: 1px solid #f2efed;
    height: 165px;
  }
  .navi-info {
    overflow: hidden;
    .txt-cont {
      display: block;
      color: #2d2d2d;
      text-decoration: none;
    }
    .navi-title {
      font-size: 14px;
      margin: 8px 0 2px;
    }
    .navi-desc {
      line-height: 17px;
      max-height: 32px;
      overflow: hidden;
    }
  }
  .navi-user,
  .navi-date {
    font-size: 11px;
    color: #7d7d7d;
  }
  .navi-user .icon-cls {
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
  }
  .content-wrapp {
    align-items: flex-end;
    .content-info {
      .txt-text {
        color: #7d7d7d;
        span {
          display: block;
          margin-top: 3px;
        }
        .icon-cls {
          flex: 0 0 15px;
          width: 15px;
          height: 15px;
        }
      }
    }
    .status {
      width: 60px;
      height: 27px;
      line-height: 27px;
      font-size: 11px;
      color: rgb(125, 125, 125);
      border: 1px solid #a7a7a7;
      border-radius: 3px;
      position: relative;
      top: -4px;
      &.deactive {
        background: #c3c3c3;
        color: white;
        border: none;
      }
    }
  }
  a {
    text-decoration: none;
  }
  &:hover {
    background: #f5f5f5;
    .img-wrapp {
      opacity: 0.85;
    }
  }
  .navi-title,
  .user-id {
    &:hover {
      text-decoration: underline;
    }
  }
  /deep/ .price-cls .old-price {
    margin-left: 5px;
  }
}
.btn-box {
  top: 5px;
  right: 5px;
  .icon-cls {
    width: 18px;
    height: 18px;
    color: white;
    margin-left: 2px;
    &.icon-active {
      color: #fc0;
    }
    &.deactive-navi {
      color: #f5f5f5;
      pointer-events: none;
    }
    /deep/ path {
      stroke: #d9d9d9;
      stroke-width: 7px;
    }
  }
}
.monthly {
  color: red;
  width: 40px;
  flex: 0 0 40px;
}
</style>

<docs>
  ```vue
  <template>
    <div>
      <NaviHorizontal03 :item="item" :img-width="320" :img-height="240" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          content:"テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不...",
          id:6503,
          title:"【2018年7月号特集】分析いらずの儲かる手法！｜PART1. ゆったり為替さん／月曜朝7時に窓があいたらそれを埋める流れを追う",
          user:{
            id:150527,
            name:"FX攻略.com"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
