<template>
  <LazyComp01 class="video-item flex" min-height="135px">
    <a :href="'/finance/videos/' + item.id" class="img-wrapper mr-10">
      <img :src="item.thumbnailUrl || getThumbnailYoutube(item.watchUrl)" alt="" />
    </a>
    <div class="video-item-info">
      <a v-if="item.title" :href="'/finance/videos/' + item.id" class="video-item-info-title" v-wrap-lines="2">
        {{ item.title }}
      </a>
      <a class="video-item-info-content" 
         v-wrap-lines="2" 
         :href="'/finance/videos/' + item.id" 
         :style="{'font-weight': !item.title ? 'bold' : 'normal'}"
      >
        {{ item.content }}
      </a>
      <Prices :prices="item.prices" />
      <Rate :stars="(item.review || {}).stars || 0" />
    </div>
  </LazyComp01>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { getThumbnailYoutube } from '@/utils/client/common'
export default {
  components: {
    Prices,
    Rate,
    LazyComp01,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    getThumbnailYoutube,
  },
}
</script>

<style lang="scss" scoped>
.video-item {
  padding: 20px 10px;
  color: #707070;
  border-bottom: 1px solid #e0dedc;
  .img-wrapper {
    width: 45%;
    max-width: 205px;
    flex: 0 0 45%;
    position: relative;
    img {
      width: 100%;
      max-width: 100%;
      height: auto;
      max-height: 100%;
    }
  }
  .video-item-info {
    flex-shrink: 4;
    width: 100%;
  }
  .video-item-info-title {
    font-size: 15px;
    font-weight: bold;
    line-height: 17px;
    margin-bottom: 2px;
    height: 38px;
    max-height: 38px;
    overflow-y: hidden;
    color: #707070;
    display: block;
  }
  .video-item-info-content {
    font-size: 15px;
    margin-bottom: 2px;
    height: 38px;
    max-height: 38px;
    overflow-y: hidden;
    color: #707070;
    display: block;
  }
  /deep/ .price-cls {
    font-size: 15px;
    .co-red {
      margin: 0 !important;
    }
  }
  /deep/ .gg-rating {
    font-size: 15px;
  }
}
</style>