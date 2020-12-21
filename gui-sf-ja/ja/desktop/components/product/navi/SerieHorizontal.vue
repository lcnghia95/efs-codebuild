<template>
  <div class="series flex p-15 mb-20" :key="'series-' + item.sId">
    <ImgWrapper :href="'/finance/navi/series/' + item.sId" :src="'/img/products/' + item.pId + '/small'" alt="" class="series-img cursor-pointer" />
    <div class="series-des ml-20 flex layout-col space-between">
      <div>
        <a :href="'/finance/navi/series/' + item.sId">
          <div class="series-name wrap-text" :title="item.name"><b>{{ item.name }}</b></div>
        </a>
        <div class="wrap-text fs-12" :title="item.articleTitle">{{ item.articleTitle }}</div>
        <div v-if="item.updatedAt" class="fs-12">{{ formatTime(item.updatedAt, 20) }}{{ $t('4') }}</div>
        <a v-if="item.articleId" :href="'/finance/navi/' + item.articleId" class="fs-12" :title="item.articleTitle">
          <span class="series-name">{{ $t('3') }}</span>
        </a>
      </div>
      <div class="flex space-between">
        <div class="flex">
          <FavoriteBtn :class="{'deactive-5IFT8': loadingFavorite}" :is-favorite="!isUnFav?1:0" :text="$t('2')" class="mr-10" @click="onFavorite" />
        </div>
        <MiniCart :price="item.price" :product-id="item.pId" :discount-price="item.discountPrice" v-if="item.price" />
      </div>
    </div>
  </div>
</template>

<script>
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import MiniCart from '@/components/finance/payment/MiniCart.vue'
import i18n from '@@/lang/components-desktop/serie-horizontal.json'
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    ImgWrapper,
    FavoriteBtn,
    MiniCart,
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
  methods: {
    onFavorite() {
      this.$emit('favorite', this.item)
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
}
</script>

<style lang="scss" scoped>
.series {
  border: 1px solid #d9d9d9;
  .series-img {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    &:hover {
      opacity: 0.85;
    }
  }
  .series-des {
    flex: 0 0 600px;
    width: 600px;
    color: #2d2d2d;
    a {
      color: #2d2d2d;
      text-decoration: none;
      &:hover > .series-name {
        text-decoration: underline;
      }
    }
    .des-info {
      height: 36px;
      overflow: hidden;
    }
  }
}
.deactive-5IFT8 {
  opacity: 0.5;
}
</style>
