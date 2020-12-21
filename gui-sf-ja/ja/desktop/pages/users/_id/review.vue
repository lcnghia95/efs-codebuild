<template>
  <div class="panel panel-default">
    <div class="panel-body p-40">
      <title04 :title="($parent.profile.nickName || '')+ $t(33) " class="mb-30"/>
      <template v-if="reviews">
        <review :data="review" class="mb-20 pb-10" v-for="(review,index) in reviews.data" :key="'userReview'+index"/>
        <paging class="text-center mt-45"
                :cur-page="reviews.currentPage"
                :total="reviews.lastPage"
                :from="reviews.pagingFrom"
                :to="reviews.pagingTo"
                :has-scroll="true"
                :is-add-url-param = "true"
                :origin-url = "`/users/${this.id}/review/`"
                @pagingclick="onPagingClick" />
      </template>
      <template v-else>
        <div class="text-center pt-100">{{ $t(32) }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-id.json'
import Review from '@/components/user/Review.vue'
import Title04 from '@/components/review/Title04.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { calPaging } from '@/utils/client/common'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Review,
    Title04,
    Paging,
  },
  async asyncData({ app, params }) {
    let id = params.id,
      data = await app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/review`, {
        sfLoading: true,
      }),
      limit = 20,
      pageRange = 4,
      p = params.p,
      reviews = calPaging(data, p, limit, pageRange)
    return {
      data,
      reviews,
      id,
      p,
      limit,
      pageRange,
    }
  },
  methods: {
    onPagingClick(page) {
      this.reviews = calPaging(this.data, page, this.limit, this.pageRange)
    },
  },
}
</script>
