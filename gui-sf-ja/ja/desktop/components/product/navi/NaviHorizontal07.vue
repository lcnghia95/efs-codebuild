<template>
  <div class="article flex pt-20 pb-20" :key="'article-' + item.id">
    <ImgWrapper :href="`/finance/navi/articles/${item.id}`" :src="'/img/articles/' + item.id + '/small'" alt="" class="article-img cursor-pointer" />
    <div class="w-full ml-10 flex layout-col space-between article-full-content">
      <a :href="`/finance/navi/articles/${item.id}`">
        <div class="article-name wrap-text" :title="item.title"><b>{{ item.title }}</b></div>
        <div class="article-content" v-wrap-lines="2" :title="item.content" v-html="item.content"></div>
        <div class="article-time">
          {{ formatTime(item.publishedAt, 20) }}{{ $t('3') }}
        </div>
      </a>
      <div class="flex space-between">
        <div class="flex">
          <FollowBtn :class="{'deactive-qANNQ': loadingFollow}" :text="$t('1')" :followed="!isUnFollow?1:0" @click="onNaviFollow" />
          <FavoriteBtn :class="{'deactive-qANNQ': loadingFavorite}" :is-favorite="!isUnFav?1:0" :text="$t('2')" class="ml-10" @click="onNaviFavorite" />
        </div>
        <MiniCart02 :price="item.price" :product-id="item.pId" :purchased="item.purchased" :discount-price="item.discountPrice" v-if="isShowCart()" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal07.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import FollowBtn from '@/components/finance/payment/FollowBtn02.vue'
import MiniCart02 from '@/components/finance/payment/MiniCart02.vue'
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
    seriesPrice: Number,
  },
  components: {
    ImgWrapper,
    FavoriteBtn,
    FollowBtn,
    MiniCart02,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onNaviFollow,
    onNaviFavorite,
    isShowCart() {
      if (this.seriesPrice && !this.item.price) {
        return false
      }
      return true
    },
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
  border-bottom: 1px solid #d9d9d9;
  .article-img {
    flex: 0 0 120px;
    width: 120px;
    height: 92px;
  }
  .article-full-content {
    width: 610px;
    .article-name {
      color: #2d2d2d;
    }
    .article-content {
      color: #7d7d7d;
      height: 36px;
      overflow: hidden;
    }
    .article-time {
      font-size: 10px;
      color: #7d7d7d;
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
</style>
