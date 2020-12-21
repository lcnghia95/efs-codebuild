<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body p-30">
        <template v-if="blogs.data">
          <Title04 :title="($parent.profile.nickName || '')+$t(29)" class="mb-30"/>
          <UserBlog class="mt-40 mb-40" :data="blog" v-for="(blog,index) in blogs.data"
                    :key="'userBlog'+blogs.currentPage+index"/>
          <div class="text-center">
            <paging
              class="surface-paging"
              :analytic="true"
              :cur-page="blogs.currentPage"
              :total="blogs.lastPage"
              :from="blogs.pagingFrom"
              :to="blogs.pagingTo"
              :is-add-url-param = "true"
              :origin-url = "`/users/${this.id}/blog/`"
              @pagingclick="onChangePage"/>
          </div>
        </template>
        <template v-else>
          <div class="text-center p-tb-100">{{ $t(30) }}</div>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import UserBlog from '@/components/user/UserBlog.vue'
import i18n from '@@/lang/desktop/users-id.json'
import Title04 from '@/components/review/Title04.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { calPaging } from '@/utils/client/common'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    UserBlog,
    Title04,
    Paging,
  },
  async asyncData({ params, app }) {
    let type = 1,
      id = params.id,
      p = params.p || 1,
      data = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${id}/blog`,
        { params: { type } },
        { sfLoading: true }
      ),
      blogs = calPaging(data, p)
    return {
      data,
      id,
      blogs,
      p,
    }
  },
  methods: {
    onChangePage(page) {
      this.blogs = calPaging(this.data, page)
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
