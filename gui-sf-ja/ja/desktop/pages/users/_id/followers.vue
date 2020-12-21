<template>
  <div>
    <simple-user v-for="(user,index) in followers.data" :user="user" :key="'simple-user123'+index"/>
    <div class="text-center m-t-60">
      <paging
        class="surface-paging"
        :analytic="true"
        :cur-page="followers.currentPage"
        :total="followers.lastPage"
        :from="followers.pagingFrom"
        :to="followers.pagingTo"
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
      followers = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${id}/followers`,
        { params: { page: p, limit: 20 } }
      )
    return {
      followers,
      id,
      p,
    }
  },
  methods: {
    onChangePage(_page) {
      location.href = `/users/${this.id}/followers/p/${_page}`
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar {
  flex: 0 0 50px;
  height: 50px;
}
</style>
