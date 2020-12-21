<template>
  <section class="w-1000 flex space-between">
    <div class="left-content mt-5">
      <div class="flex mid mb-10">
        <span class="icon-other flex mid center mr-5">
          <Crown class="icon-crown" />
        </span>
        <span class="title">
          <b>
            {{ leftTitle }}
          </b>
        </span>
      </div>
      <template v-for="(product,idx) in data.data">
        <slot :product="product" :index="'ElHuL-' + idx" :number="(data.currentPage-1)*20 + idx + 1"></slot>
      </template>
      <div class="text-center mt-20 mb-50">
        <paging :cur-page="data.currentPage"
                :total="data.lastPage"
                :from="data.pagingFrom"
                :to="data.pagingTo"
                :has-scroll="true"
                :is-add-url-param="true"
                :origin-url="originUrl"
                theme-class="theme4"
                @pagingclick="onGetDataPage"
        />
      </div>
    </div>
    <right-content class="mt-5" :category="category" :economics="rightEconomicsTitle" />
  </section>
</template>
<script>
import Paging from '@@/../components/paging/Paging.vue'
import RightContent from './RightContent.vue'
import Crown from '@@/../components/icons/Crown.vue'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    rightEconomicsTitle: {
      type: Array,
      default: () => {
        return []
      },
    },
    banners: {
      type: Array,
      default: () => {
        return []
      },
    },
    category: String,
    revenue: String,
    leftTitle: String,
    originUrl: String,
    curPage: [Number, String],
    onGoPage: Function,
  },
  components: {
    Paging,
    RightContent,
    Crown,
  },
  methods: {
    onGetDataPage(_page) {
      this.onGoPage ? this.onGoPage(_page) : location.href = `/systemtrade/${this.revenue}${
        this.category ? '/' + this.category : ''
      }/p/${_page}`
    },
  },
}
</script>
<style lang="scss" scoped>
.left-content {
  width: 670px;
  .icon-other {
    width: 30px;
    height: 30px;
    background: #7d7d7d;
    border-radius: 50%;
    color: white;
    font-size: 16px;
  }
  .title {
    color: #7d7d7d;
    font-size: 20px;
  }
  .bg-prd-new:nth-child(4n) {
    margin-right: 0;
  }
  .btc-icon {
    color: #7d7d7d;
  }
  .icon-crown {
    width: 24px;
    height: 24px;
  }
}
.right-content {
  width: 300px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  /deep/ .gogo-link {
    width: 100%;
    img:hover {
      opacity: 0.85;
    }
  }
}
</style>
