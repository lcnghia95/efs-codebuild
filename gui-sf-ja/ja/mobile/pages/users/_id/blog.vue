<template>
  <div class="page-custom mb-50">
    <div class="page-title col-gray">
      <b>{{ !keyword ? $t(21) : `${$t(21)} ー ${this.$t('44', { keyword })}: ${this.data.length} ${$t(45)}` }}</b>
    </div>
    <div class="input-form flex">
      <input class="no-border" ref="input" type="text" @keyup.enter="onClickSearch" v-model="input" v-bind="attr" />
      <i is="Search" @click.native="onClickSearch" />
    </div>     
    <UserBlog :data="blogdata" v-for="(blogdata,index) in displayData"
              :key="index"
    />
    <div class="no-data pt-20 pb-20" v-if="data.length === 0"> {{ $t(40) }} </div> 
    <LoadMore class="bg-white" v-if="p !== 0 && data.length !== displayData.length" @click.native="onLoadmore" />
  </div>
</template>


<script>
import UserBlog from '@/components/user/UserBlog.vue'
import i18n from '@@/lang/mobile/users-id.json'
import LoadMore from "@/components/common/LoadMore.vue"
import Search from '@@/../components/icons/Search.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    UserBlog,
    LoadMore,
    Search
  },
  data(){
    return {
      attr: {
        placeholder: this.$t('46'),
        name: 'q',
      },
      keyword:null,
      input:null
    }
  },
  mounted(){
    this.data[0] ? this.data[0].isNew = true : false
    this.data[1] ? this.data[1].isNew = true : false
    this.displayData= this.data.slice(0,10)
    this.p = 10
  },
  async asyncData({ params, app }) {
    let id = params.id,
      blog = await app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/blog`,{ params: {type: 1}}),
      data = blog || [],
      displayData= data.slice(0,10)
    data[0] ? data[0].isNew = true : false
    data[1] ? data[1].isNew = true : false
    return {
      id,
      blog,
      data,
      p: 10,
      displayData
    }
  },
  methods: {
    onLoadmore(){
      this.displayData = this.displayData.concat(this.data.slice(this.p,this.p+10) || [])
      this.p += 10
    },
    onClickSearch() {
      if (this.input){
        this.data = this.blog.filter(item => 
          item.title.toLowerCase().indexOf(this.input.toLowerCase())!==-1
        )
        this.displayData= this.data.slice(0,10)
        this.keyword=this.input
      }
      this.p = 10
    },
  },
}
</script>
<style lang="scss" scoped>
.page-title {
  font-size: 16px;
  border-bottom: 1px solid #b4b5b6;
  padding: 12px 5px 5px 10px;
}
.no-data {
  text-align: center;
  background-color: #fff;
}
i {
  color: #a0a0a0;
}
.input-form {
  background-color: rgb(224, 222, 220);
  padding: 10px 20px;
  input {
    height: 35px;
    width: 100%;
    border: 1px solid rgb(178, 178, 178);
    padding-left: 10px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  ::placeholder {
    color: rgb(160, 160, 160);
  }
  i {
    background-color: rgb(178, 178, 178);
    border: 1px solid rgb(178, 178, 178);
    color: white;
    padding: 5px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
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
