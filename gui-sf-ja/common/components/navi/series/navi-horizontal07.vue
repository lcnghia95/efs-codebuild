<template>
  <div class="article flex" :key="'article-' + item.id">
    <div class="demo">
      <ImgWrapper :href="`/finance/navi/articles/${item.id}`" :src="'/img/articles/' + item.id + '/small'" alt="" class="article-img cursor-pointer" />
      <MiniCart02 class="hero-header-text" :price="item.price" :product-id="item.pId" :purchased="item.purchased" :discount-price="item.discountPrice" v-if="isShowCart()" />
    </div>
    <div class="w-full article-full-content">
      <a :href="`/finance/navi/articles/${item.id}`">
        <div class="flex width-wrap-text">
          <span v-if="item.categoryName" class="artical-bagde">{{ item.categoryName || '' }}</span>
          <div class="article-name wrap-text" :title="item.title">{{ item.title }}</div>
        </div>
      </a>
      <div class="flex space-between">
        <div class="article-time">
          {{ formatTime(item.publishedAt, 20) }}{{ $t('3') }}
        </div>
      </div>
      <div class="mobile-category">
        #{{ item.categoryName || '' }}
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal07.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import MiniCart02 from '@@/../common/components/navi/series/mini-cart02'
import { onNaviFollow, onNaviFavorite } from '@@/../common/js/finance/utils'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    followFn: Function,
    favoriteFn: Function,
    seriesPrice: Number
  },
  components: {
    ImgWrapper,
    MiniCart02,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onNaviFollow,
    onNaviFavorite,
    isShowCart() {
      // free and purchased !this.item.purchased
      if (this.seriesPrice && !this.item.price && !this.item.purchased) {
        return false
      }
      return true
    },
    isFavoriteStore() {
      let favData = this.$store.getters['finance/getFavData']
      if(favData) {
        return favData.favorite.findIndex(favItem => favItem.id == this.item.id)
      }
    },
    isFollowStore() {
      let favData = this.$store.getters['finance/getFavData']
      if(favData) {
        return favData.follow.findIndex(
          followItem => followItem.id == this.item.id
        )
      }
    },
    getUnFav() {
      let favData = this.$store.getters['finance/getFavData'],
        isFavoriteStore = this.isFavoriteStore()
      if (favData && isFavoriteStore != -1) {
        this.isUnFav = favData.favorite[isFavoriteStore]['isUnFav']
      } else {
        this.isUnFav = true
      }
    },
    getUnFollow() {
      let favData = this.$store.getters['finance/getFavData'],
        isFollowStore = this.isFollowStore()
      if (favData && isFollowStore != -1) {
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
  data() {
    return {
      loadingFollow: false,
      loadingFavorite: false,
      isUnFav: true,
      isUnFollow: true,
    }
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
/deep/ {
  .follow-YD28V {
    height: 21px;
  }
}
.article {
  padding: 15px 0px;
  width: 100%;
  .article-img {
    flex: 0 0 98px;
    width: 98px;
    height: 55px;
  }
  .article-full-content {
    width: 100%;
    margin-left: 20px;
    .article-name {
      color: #595959;
      font-size: 18px;
    }
    .article-content {
      color: #7d7d7d;
      height: 36px;
      overflow: hidden;
    }
    .article-time {
      font-size: 12px;
      color: #7d7d7d;
      margin-top: 10px;
    }
    a {
      text-decoration: none;
      &:hover {
        .article-name {
          text-decoration: underline;
        }
      }
    }
  }
  .follow-YD28V.theme-1 {
    width: 75px;
    height: 20px;
    span {
      font-size: 10px;
    }
  }
  .fav-F7AR2 {
    width: 75px;
    height: 21px;
    span {
      font-size: 10px;
    }
    .icon-cls {
      flex: 0 0 11px;
      width: 11px;
      height: 11px;
    }
  }
}
.deactive-qANNQ {
  opacity: 0.5;
}
.artical-bagde {
  margin-right: 10px;
  border: solid 1px #b2b2b2;
  border-radius: 4px;
  min-width: 100px;
  height: 20px;
  text-align: center;
  font-size: 12px;
  color: #6d6c6c;
}
.demo {
  position: relative !important;
  .hero-header-text{
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    width: 65px;
    height: 30px;
    background: #FF8500 0% 0% no-repeat padding-box;
    border-radius: 9px;
    opacity: 0.75;
  }
}
.width-wrap-text {
  width: 730px;
}
.mobile-category {
  display: none;
}
@media only screen and (max-width: 768px),
only screen
and (max-width: 896px) 
and (max-height: 414px) {
  .width-wrap-text {
    width: 100%;
  }
  .demo {
    display: flex;
    align-items: center;
    .hero-header-text {
      position: static;
      margin-left: 25px;
      transform: none;
    }
  }
  .article {
    flex-direction: column;
    padding-top: 10px;
    .article-full-content {
      margin-left: 0;
      width: 100%;
      .article-name {
        color: white;
        max-width: calc(100vw - 50px);
        margin-top: 15px;
      }
      .article-time {
        font-size: 14px;
        color: #A0A0A0;
        margin-top: 10px;
      }
    }
  }
  .artical-bagde {
    display: none;
  }
  .mobile-category {
    display: block;
    color: #cecece;
    margin-top: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: solid 1px #777777;
  }
}
</style>
