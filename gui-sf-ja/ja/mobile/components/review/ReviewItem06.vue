<template>
  <LazyComp01 class="item-review-01" min-height="100px" @comp-ready="updateComp"> 
    <div class="flex mb-20">
      <a class="img-ctn pos-rel mr-10" :href="item.productUrl">
        <img :src="'/img/products/' + item.productId + '/small'" alt="" />
        <div class="rank"
             v-if="rank"
             :style="{
               background: rankColor[rank] || '#e1dede',
               color: '#fff'
             }"
        >
          {{ rank }}
        </div>
      </a>
      <div class="info-ctn">
        <div class="review-title flex mid">
          <a class="no-underlying" :href="`/review/detail/${item.productId}`">
            <Rate :stars="item.review ? item.review.stars : 0" class="mr-10" />
          </a>
          <a 
            :href="item.productUrl" 
            class="wrap-text name-item no-underlying" 
            :style="'flex: 0 0 ' + item.review ? 'calc(100% - 80px)' : '100%'"
          >
            {{ item.name }}
          </a>
        </div>
        <div class="flex flex-wrap user-info w-full">
          <a class="flex nick-name mr-10 w-full" :href="`/users/${item.userId}/review`">
            <Pencil02 class="mr-5" />
            <div style="60px" class="wrap-text name">{{ item.nickName || $t('3') }}</div>
          </a>
          <div>{{ formatTime(item.publishedAt, 6) }}</div>
        </div>
      </div>
    </div>
    <a :href="`/review/detail/${item.productId}`" class="mt-20 title">{{ item.reviewTitle }}</a>
    <div v-wrap-lines="isExpanded ? -1 : minLine + 2" ref="content" class="review-content mb-10">
      {{ item.reviewContent }}
    </div>
    <span v-if="showExpandButton" @click="handleExpand" class="show-more cursor-pointer">
      <template v-if="!isExpanded"><AngleDown class="mr-5" />{{ $t(1) }}</template>
      <template v-else><AngleUp class="mr-5" />{{ $t(2) }}</template>
    </span>
  </LazyComp01>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
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
        return 4
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
        //
      }, 500)
    },
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
.title {
  font-weight: 700;
  font-size: 15px;
  color: #2d2d2d;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
  }
}
.info-ctn {
  .review-title {
    width: calc(100vw - 110px);
  }
  .name-item {
    line-height: 23px;
  }
  .user-info {
    width: calc(100vw - 110px);
    color: #a0a0a0;
    line-height: 25px;
  }
  .nick-name {
    flex: 0 0 calc(100% - 300px);
    color: #a0a0a0;
    .icon-cls {
      width: 18px;
      height: 20px;
      flex: 0 0 18px;
      /deep/ svg {
        height: 25px;
      }
    }
  }
}
.item-review-01 {
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0 15px 0;
  .review-title {
    font-size: 15px;
    color: #2d2d2d;
    text-decoration: none;
    margin-top: -5px;
  }
  .img-ctn {
    height: 50px;
    width: 50px;
    flex: 0 0 50px;
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
    font-size: 17px;
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
    font-size: 15px;
    color: #2d2d2d;
    text-align: justify;
    margin-top: -1em;
    white-space: pre-line;
  }
}
</style>