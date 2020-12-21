<template>
  <div class="al-item flex">
    <ImgWrapper
      class="ali-img"
      :href="naviDetailUrl"
      :src="'/img/articles/' + item.id + '/small'"
    />
    <div class="ali-detail">
      <div class="alid-title">
        <a :href="naviDetailUrl" v-wrap-lines="2"> {{ item.title }} </a>
      </div>
      <div class="alid-time">{{ formatTime(item.publishedAt, 6) }}</div>
      <div class="flex space-between">
        <div class="alid-btn">
          <Check :class="{ 'icon-active': item.isReadLater, 'deactive-navi': loadingFollow }" @click.native="followFn(item)"/>
          <Star class="ml-10" :class="{ 'icon-active': item.isFavorite }" @click.native="favFn(item)"/>
        </div>
        <MiniCart02 class="minicart" :price="item.price" :product-id="item.pId" :purchased="item.purchased" :discount-price="item.discountPrice" v-if="isShowCart()" />
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
import MiniCart02 from '@/components/finance/payment/MiniCart02.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    seriesPrice: Number,
    followFn: Function,
    favFn: Function,
  },
  components: {
    Edit,
    Star,
    Check,
    Price,
    ImgWrapper,
    MiniCart02,
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
    isShowCart() {
      if (this.seriesPrice && !this.item.price) {
        return false
      }
      return true
    },
  },
  computed: {
    naviDetailUrl() {
      return `/finance/navi/${this.item.sId}/${this.item.id}`
    },
  },
}
</script>

<style lang="scss" scoped>
.minicart {
  /deep/ &.btn-orange {
    width: auto;
  }
}
</style>
