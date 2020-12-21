<template>
  <LazyComp01 class="review-item" min-height="105px" @comp-ready="updateComp">
    <div class="review-title">{{ item.title }}</div>
    <div class="flex space-between mt-5 flex-wrap">
      <div class="flex star-ctn">
        <span class="star-label">{{ $t(1) }}:</span>
        <Rate :stars="item.rvQuality" />
      </div>
      <div class="flex star-ctn">
        <span class="star-label">{{ $t(2) }}:</span>
        <Rate :stars="item.rvSpeed" />
      </div>
      <div class="flex star-ctn">
        <span class="star-label">{{ $t(3) }}:</span>
        <Rate :stars="item.rvSpeed" />
      </div>
    </div>
    <div ref="content" v-wrap-lines="isExpanded ? -1 : 3" class="mt-10">{{ item.rvContent }}</div>
    <div v-if="showExpButton" class="expend-btn" @click="handleExpand">
      <template v-if="!isExpanded">{{ $t(4) }}</template>
      <template v-else>{{ $t(5) }}</template>
    </div>
  </LazyComp01>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import i18n from '@@/lang/components-mobile/scrowdsourcing-dev-review.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    LazyComp01,
  },
  props: {
    item: {
      type: Object,
      default() { return {} }
    }
  },
  data() {
    return {
      isExpanded: false,
      showExpButton: false,
      windowResized: false,
      observer: null,
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
    updateComp() {
      setTimeout(()=>{
        this.showExpButton = $(this.$refs.content).hasClass('ddd-truncated')
        // when window resize, checking ddd-truncated is exist, and upate showExpandButton
        this.observer = new MutationObserver((mutations) => {
          if(!this.windowResized) {
            return
          }
          for (const m of mutations) {
            const s = m.target.getAttribute(m.attributeName)
            if(this.windowResized) {
              this.showExpButton = s.includes('ddd-truncated')
            }
          }
          this.windowResized = false
        })
        this.$refs.content && this.observer.observe(this.$refs.content, {
          attributes: true,
          attributeOldValue : true,
          attributeFilter: ['class'],
        })
      }, 500)
    },
    handleExpand() {
      this.windowResized = false
      this.isExpanded = !this.isExpanded
    },
  }
}
</script>

<style lang="scss" scoped>
.review-item {
  min-height: 155px;
  border-bottom: 1px solid #eaeaea;
  padding: 10px 15px;
  .review-title {
    font-size: 15px;
    font-weight: bold;
  }
  .star-ctn {
    font-size: 12px;
    .star-label {
      font-weight: bold;
    }
  }
}
.expend-btn {
  border-radius: 4px;
  outline: none;
  color: #1d2088;
}
</style>