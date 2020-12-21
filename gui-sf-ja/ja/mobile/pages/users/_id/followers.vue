<template>
  <div class="page-custom">
    <div class="page-title col-gray">
      <span>{{ $t(2) }}</span>
    </div>
    <SimpleUser
      v-for="(user, index) in displayFollowers"
      :user="user"
      :key="'simple-user' + index"
      class="user-bg"
    />
    <div class="no-data pt-20 pb-20" v-if="displayFollowers.length==0">{{ $t(40) }}</div>
    <LoadMore v-show="lastPage > currentPage" class="load-more bg-white" @click.native="onLoadMore()" />
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
      followers = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${id}/followers`,
        { params: { page: currentPage , limit: limit } }
      ),
      lastPage = followers.lastPage || 1 ,
      displayFollowers = followers.data || []

    return {
      id,
      followers,
      limit,
      currentPage,
      lastPage,
      displayFollowers

    }
  },
  methods: {
    onLoadMore() {
      this.currentPage +=1
      this.GoGoHTTP.get(
        `/api/v3/surface/profile/${this.id}/followers`,
        { 
          params: { 
            page: this.currentPage, 
            limit: this.limit 
          } 
        }
      ).then(data => {
        this.displayFollowers = this.displayFollowers.concat(data.data || [])
        this.lastPage = data.lastPage
      })
    },
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