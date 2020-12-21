<template>
  <LazyComp01 class="flex item-review-01" min-height="100px" @comp-ready="updateComp"> 
    <a class="img-ctn pos-rel mr-10" :href="goToDetail? `/review/detail/${item.productId}` : item.productUrl">
      <img :src="'/img/products/' + item.productId + '/small'" alt="" />
      <div class="rank"
           v-if="rank"
           :style="{
             background: rankColor[rank] || '#e1dede',
             color: rankColor[rank] ? 'white' : '#505050'
           }"
      >
        {{ rank }}
      </div>
    </a>
    <div>
      <a class="review-title" :href="`/review/detail/${item.productId}`">{{ item.reviewTitle }}</a>
      <div class="flex">
        <Rate :stars="5" class="mr-10" /> <span style="color: #adadad;">{{ formatTime(item.publishedAt, 6) }}</span>
      </div>
      <div v-wrap-lines="isExpanded ? -1 : minLine + 2" ref="content" class="review-content mb-10">
        {{ item.reviewContent }}
      </div>
      <span v-if="showExpandButton" @click="handleExpand" class="show-more cursor-pointer">
        <template v-if="!isExpanded"><AngleDown />{{ $t(1) }}</template>
        <template v-else><AngleUp />{{ $t(2) }}</template>
      </span>
    </div>
  </LazyComp01>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import i18n from '@@/lang/components-mobile/review-item.json'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import AngleUp from '@@/../components/icons/AngleUp.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    LazyComp01,
    AngleDown,
    AngleUp,
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
        return 4
      }
    },
    rank: {
      type: Number,
      default() {
        return 0
      }
    },
    goToDetail: {
      type: [Number, Boolean],
      default() {
        return 0
      }
    }
  },
  mounted() {
    window.onresize = () => { this.$nuxt.$emit('resize') } // emit for all reviews item 06
    this.$nuxt.$on('resize', ()=> {
      this.windowResized = true
    })
  },
  beforeDestroy() {
    this.observer && this.observer.disconnect()
  }, 
  methods: {
    handleExpand() {
      this.windowResized = false
      this.isExpanded = !this.isExpanded
    },
    updateComp() {
      setTimeout(()=>{
        this.showExpandButton = $(this.$refs.content).hasClass('ddd-truncated')
        // when window resize, checking ddd-truncated is exist, and upate showExpandButton
        this.observer = new MutationObserver((mutations) => {
          if(!this.windowResized) {
            return
          }
          for (const m of mutations) {
            const s = m.target.getAttribute(m.attributeName)
            if(this.windowResized) {
              this.showExpandButton = s.includes('ddd-truncated')
            }
          }
          this.windowResized = false
        })
        this.observer.observe(this.$refs.content, {
          attributes: true,
          attributeOldValue : true,
          attributeFilter: ['class'],
        })
      }, 500)
    }
  },
  data() {
    return {
      showExpandButton: false,
      isExpanded: false,
      observer: null,
      windowResized: false,
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
.item-review-01 {
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0 15px 0;
  .review-title {
    font-size: 15px;
    font-weight: bold;
    color: #2d2d2d;
  }
  .img-ctn {
    height: 60px;
    width: 60px;
    flex: 0 0 60px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
    .rank {
      position: absolute;
      top: -10px;
      left: 0;
      background: purple;
      color: white;
      min-width: 20px;
      height: 20px;
      border-radius: 3px;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      text-align: center;
    }
  }
  /deep/ .gg-rating {
    font-size: 15px;
  }
  .show-more {
    color: #1d2088;
    /deep/ .icon-cls {
      width: 12px;
      height: 12px;
      color: #2d2d2d;
    }
  }
  .pt-8 {
    padding-top: 8px;
  }
  .review-content {
    text-align: justify;
    margin-top: -1em;
    white-space: pre-line;
  }
  &:first-child {
    border: none;
  }
}
</style>