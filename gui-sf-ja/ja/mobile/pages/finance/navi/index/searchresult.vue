<template>
  <div class="articles-list-wrapper">
    <div class="ml-15 mr-15 mt-15">
      <span v-if="filter.keyword" class="mr-15">{{ filter.keyword }}</span>
      {{ $t('16') }} 
      /  
      {{ dataArticlesList.total || 0 }} {{ $t('14') }}
    </div>
    <div class="select-filter flex mb-15 space-between">
      <div class="btn-toggle flex">
        <RadioTag v-model="filter.isPaidContent" :theme="'theme-2'" :attrs="{ id: 'isPaidContent'+item.id, value: item.id }" :label="item.text" v-for="item in paidFilter" :key="`isPaidContent-${item.id}`" @input="selectSort" />
      </div>
      <SelectBox class="g-select" :data-source="newFilter" :display="'text'" :id-val="'id'" v-model="filter.periodType" @input="selectSort" />
    </div>
    <div class="articles-list">
      <NaviArticleItem class="al-item" v-for="item in dataArticlesList.data" :key="'articles-list' + item.id" :item="item" :follow-fn="onNaviFollowItem" :fav-fn="onNaviFavoriteItem" />
    </div>
    <paging :cur-page="dataArticlesList.currentPage"
            :total="dataArticlesList.lastPage"
            :from="dataArticlesList.pagingFrom"
            :to="dataArticlesList.pagingTo"
            :has-scroll="true"
            theme-class="theme1"
            @pagingclick="onPagingClick"
            class="w-full mt-15 pb-25 text-center"
    />
  </div>
</template>

<script>
import title from '@@/../common/pages'
import SelectBox from '@@/../components/form/SelectBox2.vue'
import RadioTag from '@@/../components/form/RadioTag.vue'
import Paging from '@/components/paging/Paging.vue'
import NaviArticleItem from '@/components/product/navi/NaviArticleItem.vue'
import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'
import i18n from '@@/lang/mobile/navi-new.json'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      NaviArticleItem,
      Paging,
      SelectBox,
      RadioTag,
    },
    data() {
      return {
        isLoading: false,
        paidFilter: [
          {
            text: this.$t('3'),
            id: 0,
          },
          {
            text: this.$t('2'),
            id: 1,
          },
        ],
        newFilter: [
          {
            text: this.$t('7'),
            id: 3,
          },
          {
            text: this.$t('4'),
            id: 1,
          },
          {
            text: this.$t('5'),
            id: 2,
          },
          {
            text: this.$t('6'),
            id: 0,
          },
        ],
        filter: {},
      }
    },
    async asyncData({ app, params, store }) {
      let query = {
        tags: params.t || 1,
        isPaidContent: parseInt(params.isPaidContent) || 0,
        periodType: parseInt(params.periodType),
        page: parseInt(params.p) || 1,
        limit: 10,
        isGetContent: 1,
      }

      if (query.periodType == undefined || isNaN(query.periodType)) {
        query.periodType = 3
      }

      store.commit('navi/setSearchType', 'articles/')

      let dataArticlesList = await app.GoGoHTTP.get(
        `/api/v3/surface/navi/search/article`,
        { params: query }
      )

      return {
        dataArticlesList,
        filter: query,
      }
    },
    methods: {
      onNaviFollowItem,
      onNaviFavoriteItem,
      onPagingClick(_page) {
        let query = `p/${_page}/ipc/${this.filter.isPaidContent}/pt/${
          this.filter.periodType
        }/${
          this.filter.keyword
            ? `w/${encodeURIComponent(this.filter.keyword)}`
            : ''
        }`

        location.href = `/finance/navi/searchresult/${query}`
      },
      selectSort() {
        let query = `p/1/ipc/${this.filter.isPaidContent}/pt/${
          this.filter.periodType
        }/${
          this.filter.keyword
            ? `w/${encodeURIComponent(this.filter.keyword)}`
            : ''
        }`

        location.href = `/finance/navi/searchresult/${query}`
      },
    },
  },
  title
)

export default obj
</script>

<style lang="scss" scoped>
.select-filter {
  padding: 15px;
  border-bottom: 1px solid #dfdedc;
  .btn-toggle {
    border: 1px solid rgb(178, 178, 178);
    border-radius: 4px;
    overflow: hidden;
  }
  .g-select {
    /deep/ button {
      background: #fff;
    }
  }
}
/deep/ .btn-loadmore {
  border-bottom: 1px solid #dfdedc;
}
</style>

<style lang="scss">
/* stylelint-disable */
.menu-cls,
.search-box,
.nav-wrapper--fi {
  display: none;
}
/* stylelint-enable */
</style>
