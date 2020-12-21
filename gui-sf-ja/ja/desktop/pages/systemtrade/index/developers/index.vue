<template>
  <div class="w-1000 flex space-between">
    <div class="left-content">
      <div class="flex mid">
        <User2 class="icon-other no-circle mr-5" />
        <span class="title-icon"><b>{{ $t('1') }}</b></span>
      </div>
      <div class="search-content flex mid center mt-15 mb-5">
        <div class="flex mid w-full">
          <input type="text" v-model="name" class="pl-15 pr-15 w-full" :placeholder="$t('2')" maxlength="80">
          <button class="flex mid center" type="button" @click="Search">
            <span class="glyphicon glyphicon-search" />
          </button>
        </div>
      </div>

      <div class="flex flex-wrap mt-10">
        <UserVertical v-for="(item, i) in dataDevsShow.data" :key="i" :user="item" :alt="item.name + ' ' + $t('5')"/>
      </div>
      <paging :cur-page="dataDevsShow.currentPage"
              :total="dataDevsShow.lastPage"
              :from="dataDevsShow.pagingFrom"
              :to="dataDevsShow.pagingTo"
              :has-scroll="true"
              :is-add-url-param="true"
              :origin-url="'/systemtrade/developers'"
              theme-class="theme4"
              @pagingclick="onPagingClick"
              class="w-full mt-10 text-center"/>
    </div>
    <div class="right-content">
      <div class="title-right flex mid pl-10 mb-15"><b>{{ $t('3') }}</b></div>
      <div class="banner" v-html="campaigns.content"/>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-devs.json'
import Paging from '@@/../components/paging/Paging.vue'
import User2 from '@@/../components/icons/User2.vue'
import UserVertical from '@/components/user/UserVertical.vue'
import title from '@@/../common/pages'
import { calPaging } from '@/utils/client/common'

const obj = Object.assign(
  {
    components: {
      User2,
      Paging,
      UserVertical,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        dataDevsShow: {
          currentPage: 1,
          lastPage: 1,
          pagingFrom: 1,
          pagingTo: 1,
          data: [],
        },
        name: null,
      }
    },
    methods: {
      onPagingClick(page) {
        this.dataDevsShow = calPaging(this.dataDevs, page, 72, 4)
      },
      async Search() {
        let dataDevs = await this.GoGoHTTP.get(
          `/api/v3/surface/systemtrade/developers?name=${this.name}`
        )

        this.dataDevs = dataDevs
        this.dataDevsShow = calPaging(this.dataDevs, 1, 72, 4)
      },
      descriptionTemplate() {
        return this.$t('4')
      },
    },
    async asyncData({ app, params }) {
      let [dataDevs, campaigns] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/systemtrade/developers'),
          app.GoGoHTTP.get('/api/v3/surface/campaigns'),
        ]),
        dataDevsShow = calPaging(dataDevs, params.p, 72, 4)
      return {
        dataDevs,
        campaigns,
        titleChunk: i18n[app.i18n.locale][1],
        dataDevsShow,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/developers`,
          },
        ],
      }
    },
  },
  title
)
export default obj
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
    &.no-circle {
      padding: 2px;
    }
  }
  .title-icon {
    font-size: 20px;
    color: #7d7d7d;
    margin-top: 2px;
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
  .banner /deep/ img:hover {
    opacity: 0.85;
  }
}
.search-content {
  background: #dbdbdb;
  height: 60px;
  padding: 0 7px;
  input {
    border-radius: 4px 0 0 4px;
    border: 1px solid #cecdce;
    border-right: 0;
    outline: none;
    overflow: hidden;
    height: 46px;
    &::placeholder {
      font-size: 15px;
      color: #bfbfbf;
    }
  }
  button {
    background-color: white;
    width: 46px;
    height: 46px;
    color: #777;
    font-size: 15px;
    outline: none;
    border-radius: 0 4px 4px 0;
    border: 1px solid #cecdce;
    border-left: 0;
    &:hover {
      background-color: #eee;
    }
  }
}
</style>
