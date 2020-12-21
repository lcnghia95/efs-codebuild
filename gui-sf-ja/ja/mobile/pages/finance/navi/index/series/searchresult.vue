<template>
  <search-result
    v-if="dataList"
    :data-list="dataList"
    :params="params"
    :navi-search-url="naviSearchUrl"
    :ext-url="extUrl"
    :is-paid-content-list="isPaidContentList"
    :period-type-list="periodTypeList"
    :title-chunk="titleChunk"
    :locale-head="localeHead"
    :force-sub="forceSub"
    :page-type="pageType"
    :keyword="keyword"
    @onFilterTab="onFilterTab"
    @onPagingClick="onPagingClick"
    @selectSort="selectSort"
    @selectSortPrice="selectSortPrice"
    @searchByPrice="searchByPrice"
    @gotoSearch="gotoSearch"
  />
</template>
<script>
import detail from '@@/../common/containers/navi/search/search-result.js'
export default detail
</script>