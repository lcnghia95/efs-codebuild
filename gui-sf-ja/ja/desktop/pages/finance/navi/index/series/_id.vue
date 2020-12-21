<template>
  <series-detail-page
    :check-show-pass="checkShowPass"
    :check-show-payment="checkShowPayment"
    :data-show="dataShow"
    :is-error="isError"
    :data="data"
    :sort-type="sortType"
    :sort-article="sortArticle"
    :loading2="loading2"
    :is-un-fav="isUnFav"
    :force-sub="forceSub"
    :loading="loading"
    :like-status="likeStatus"
    :total-article="(datas || []).length"
    @onFavoriteSeries="onFavoriteSeries"
    @getPasswordSeries="getPasswordSeries"
    @selectSort="selectSort"
    @changeFavorite="changeFavorite"
    @changeFollow="changeFollow"
    @onPagingClick="onPagingClick"
    @onLoadMore="onLoadMore"
    @onFilterTab="onFilterTab"
    @getSeries="getSeries"
    @onLike="onLike"
  />
</template>
<script>
import detail from '@@/../common/containers/navi/series/detail.js'
export default detail
</script>