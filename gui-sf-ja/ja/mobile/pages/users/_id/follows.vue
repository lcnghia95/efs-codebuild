<template>
  <div class="page-custom">
    <div class="page-title col-gray">
      <span>{{ $t(1) }}</span>
    </div>
    <SimpleUser
      v-for="(user, index) in displayFollows"
      :user="user"
      :key="'simple-user' + index"
      class="user-bg"
    />
    <div class="no-data pt-20 pb-20" v-if="!displayFollows.length">{{ $t(40) }}</div>
    <LoadMore v-show="lastPage > currentPage" class="bg-white" @click.native="onLoadMore()" />
  </div>
</template>

<script>
import i18n from "@@/lang/mobile/users-id.json"
import SimpleUser from "@/components/user/SimpleUser.vue"
import LoadMore from "@/components/common/LoadMore.vue"
export default {
  i18n: {
    messages: i18n
  },
  components: {
    SimpleUser,
    LoadMore,
  },
  async asyncData({ params, app }) {
    let currentPage = params.p || 1,
      id = params.id,
      limit = 10, // limt of item in 1 time loadmore
      follows = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${id}/follows`,
        { params: { page: currentPage , limit: limit } }
      ),
      lastPage = follows.lastPage || 1,
      displayFollows = follows.data || []
    
    return {
      id,
      follows,
      limit,
      currentPage,
      lastPage,
      displayFollows

    }
  },
  methods: {
    onLoadMore() {
      this.currentPage += 1
      this.GoGoHTTP.get(
        `/api/v3/surface/profile/${this.id}/follows`,
        { 
          params: { 
            page: this.currentPage, 
            limit: this.limit 
          } 
        }
      ).then(data => {
        this.displayFollows = this.displayFollows.concat(data.data || [])
        this.lastPage = data.lastPage
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #b4b5b6;
  padding: 12px 5px 5px 10px;
}
.page-custom {
  background-color: #f3f0ef;
  padding-bottom: 40px;
}
.user-bg {
  background-color: #fff;
}
.no-data {
  text-align: center;
  background-color: #fff;
}
.page-custom /deep/ .btn-loadmore {
  color: #333;
  padding: 15px 0;
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
</style>