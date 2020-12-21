<template>
  <authors-page
    :filters="filters"
    :keyword="keyword"
    :data-list="dataList"
    @gotoSearch="gotoSearch"
    @onPagingClick="onPagingClick"
    @selectSort="selectSort"
  />
</template>
<script>
import detail from '@@/../common/containers/navi/authors/authors.js'
export default detail
</script>
