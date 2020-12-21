<template>
  <div>
    <simple-user v-for="(user,index) in follows.data" :user="user" :key="'simple-user'+index"/>
    <div class="text-center mt-60">
      <paging
        class="surface-paging"
        :analytic="true"
        :cur-page="follows.currentPage"
        :total="follows.lastPage"
        :from="follows.pagingFrom"
        :to="follows.pagingTo"
        @pagingclick="onChangePage"/>
    </div>
  </div>
</template>

<script>
import SimpleUser from '@/components/user/SimpleUser.vue'
import Paging from '@@/../components/paging/Paging.vue'
export default {
  components: {
    SimpleUser,
    Paging,
  },
  async asyncData({ params, app }) {
    let p = params.p || 1,
      id = params.id,
      follows = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${id}/follows`,
        { params: { page: p } }
      )
    return {
      follows,
      id,
      p,
    }
  },
  methods: {
    onChangePage(_page) {
      location.href = `/users/${this.id}/follows/p/${_page}`
    },
  },
}
</script>
