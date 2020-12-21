<template>
  <article-detail-page
    :article="data"
    :also-bought="alsoBought"
    :series-rank="seriesRank"
    :article-rank="articleRank"
    :locked="checkShowPass"
    :unlock-article="getArticlePassword"
    :is-mobile="true"
  />
</template>
<script>
import detail from "@@/../common/containers/navi/article/detail.js"
export default detail
</script>
