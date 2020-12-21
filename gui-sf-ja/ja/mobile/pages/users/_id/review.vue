<template>
  <div class="page-bg page">
    <div class="page-title col-gray">
      <span class="bottom">{{ $t(22) }}</span>
    </div>
    <review
      :data="review"
      v-for="(review,index) in displayData"
      :key="'userReview'+index"
      class="bg-white col-gray"
    />
    <div class="no-data pt-20 pb-20" v-if="displayData.length==0"> {{ $t(40) }} </div>
    <LoadMore
      v-show="data.length > (currentPage * limit)"
      class="load-more bg-white"
      @click.native="onLoadMore()"
    />
  </div>
</template>

<script>
import i18n from "@@/lang/mobile/users-id.json"
import Review from "@/components/user/Review.vue"
import LoadMore from "@/components/common/LoadMore.vue"
export default {
  i18n: {
    messages: i18n
  },
  components: {
    Review,
    LoadMore
  },
  async asyncData({ app, params }) {
    let id = params.id,
      data = await app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/review`),
      currentPage = 1,
      limit = 10, // limt of item in 1 time loadmore
      displayData = data.slice(0, limit) 

    return {
      data,
      currentPage,
      displayData,
      limit
    }
  },
  methods: {
    onLoadMore() {
      this.currentPage +=1
      let from = ((this.currentPage - 1) * this.limit)
      let to = Math.min(this.currentPage * this.limit, this.data.length)
      this.displayData = this.displayData.concat(this.data.slice( from , to ))
    }
  }
}
</script>


<style lang="scss" scoped>
.page-title {
  padding: 12px 5px 5px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #b4b5b6;
}
.page-bg {
  background-color: #f3f0ef;
}
.page {
  padding-bottom: 40px;
}
.review-bg {
  background-color: #fff;
}
.no-data {
  text-align: center;
  background-color: #fff;
}
.page /deep/ .btn-loadmore {
  color: #333;
  padding: 15px 0;
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
</style>
