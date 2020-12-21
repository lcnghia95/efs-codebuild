<template>
  <div class="navi-h04 pos-rel cursor-pointer">
    <a :href="`${naviDetailUrl}articles/${item.id}`">
      <ImgWrapper class="w-full" :src="customs.imgUrl || getNaviImg(item, '/img/articles/')" />
    </a>
    <div class="navi-info w-full">
      <a :href="`${naviDetailUrl}articles/${item.id}`" :title="item.title" class="navi-title fs-12 cusor-pointer" v-wrap-lines="2">
        <b>{{ item.title }}</b>
      </a>
      <div class="content-wrapp flex space-between">
        <div>
          <a :href="'/finance/navi/authors/' + (item.user || {}).id" class="txt-text wrap-text flex mid">
            <Edit />
            <span :title="(item.user || {}).name" class="wrap-text user-id">{{ (item.user || {}).name }}</span>
          </a>
          <a :href="`${naviDetailUrl}articles/${item.id}`" class="txt-text block">{{ formatTime(item.publishedDate, 1) }}</a>
        </div>
        <div class="content-info flex space-between">
          <a :href="`${naviDetailUrl}articles/${item.id}`" class="status text-center" v-if="!item.isPaidContent && !item.isPurchased">{{ $t('1') }}</a>
          <a :href="`${naviDetailUrl}articles/${item.id}`" v-if="item.isPaidContent || item.isPurchased" class="w-100">
            <div class="status text-center deactive" v-if="item.isPurchased">{{ $t('4') }}</div>
            <div v-else class="flex navi-price-item">
              <Price v-if="item.articlePrice" :price="item.price" :old-price="null" class="fs-12 content-end article-price" />
              <div class="series-price flex" v-if="item.seriesPrice">
                <template v-if="item.articlePrice">(</template><Price :price="item.discountPrice || item.seriesPrice" :old-price="item.discountPrice ? item.seriesPrice: null" class="fs-12" />
                <span class="monthly fs-12">&nbsp;/&nbsp;<b>{{ $t('6') }}</b> </span><template v-if="item.articlePrice">)</template>
              </div>
              <template v-if="$route.params.type==='series' && item.price">
                <Price :price="item.discountPrice || item.price" :old-price="item.discountPrice ? item.price: null" class="fs-12" />
              </template>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div v-if="customs.showFavFolButtons === undefined ? true : customs.showFavFolButtons" class="btn-box pos-abs">
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
import Price from '@@/../components/prices/Price.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import {
  onNaviFollow,
  onNaviFavorite,
  getNaviImg,
} from '@@/../common/js/finance/utils'
export default {
  name: "NaviNewestList",
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    followFn: Function,
    favoriteFn: Function,
    extUrl: null,
    customs: {
      type: Object,
      default() {
        return {
          showFavFolButtons: true,
        }
      },
    },
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
      isUnFav: true,
      isUnFollow: true,
    }
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
  computed: {
    naviDetailUrl() {
      return '/finance/navi/' + (this.extUrl || '')
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
.navi-h04 {
  width: 235px;
  height: 185px;
  .navi-price-item {
    flex-direction: column;
    .series-price {
      color: red;
      /deep/ .price-cls strong {
        margin: 0 !important;
      }
    }
  }
  .img-wrapp {
    border: 1px solid #f2efed;
    height: 110px;
  }
  .content-info {
    align-items: flex-end;
  }
  .navi-title {
    display: block;
    line-height: 16px;
    height: 32px;
    color: #2d2d2d;
    overflow: hidden;
    margin: 7px 0 2px;
  }
  .content-wrapp {
    margin-top: 8px;
    .txt-text {
      font-size: 11px;
      color: #7d7d7d;
      span {
        width: 80px;
        display: block;
        margin-top: 1px;
      }
      .icon-cls {
        flex: 0 0 15px;
        width: 15px;
        height: 15px;
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
      top: -2px;
      &.deactive {
        background: #c3c3c3;
        color: white;
        border: none;
      }
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
  a {
    text-decoration: none;
    &.block {
      display: block;
    }
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
.monthly {
  color: red;
  flex: 0 0 auto;
}
</style>
<docs>
```vue
<template>
  <NaviHorizontal04 :item="item" />
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
