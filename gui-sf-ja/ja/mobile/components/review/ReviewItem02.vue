<template>
  <LazyComp01 min-height="200px">
    <div class="flex">
      <div class="img-ctn pos-rel mr-10">
        <img :src="'/img/products/' + item.productId + '/small'" alt="" />
      </div>
      <div>
        <div style="font-size: 15px; font-weight: bold;" class="title-view"><Pencil02 />{{ item.reviewTitle }}</div>
        <div style="color: #adadad;">{{ formatTime(item.publishedAt, 6) }}</div>
      </div>
    </div>
    <Rate :stars="5" class="mr-5" />
    <span style="font-size: 17px; font-weight: bold;">{{ item.reviewTitle }}</span>
    <div class="mt-5">
      <div v-wrap-lines="isExpanded ? -1 : minLine" ref="content">
        {{ item.reviewContent }}
      </div>
      <div v-if="showExpandButton" class="mt-5" style="color: #6d70b3;" @click="isExpanded = !isExpanded">{{ $t(1) }} </div>
    </div>
  </LazyComp01>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import i18n from '@@/lang/components-mobile/review-item.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    LazyComp01,
    Pencil02,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    minLine: {
      type: Number,
      default() {
        return 5
      }
    },
    rank: {
      type: Number,
      default() {
        return 0
      }
    },
  },
  mounted() {
    setTimeout(()=>{
      this.showExpandButton = $(this.$refs.content).hasClass('ddd-truncated')
    }, 500)
  },
  data() {
    return {
      showExpandButton: false,
      isExpanded: false,
      rankColor: {
        1: '#ffcc00', // rank 1
        2: '#6e766a', // rank 2
        3: '#e2594e' // rank 3
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.img-ctn {
  height: 38px;
  width: 38px;
  flex: 0 0 38px;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.title-view {
  .icon-cls {
    height: 14px;
    width: 20px;
    /deep/ svg {
      height: 18px;
    }
  }
}
/deep/ .gg-rating {
  font-size: 22px;
}
</style>