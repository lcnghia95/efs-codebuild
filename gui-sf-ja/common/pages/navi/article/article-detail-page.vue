<template>
  <div class="article-password-lock flex center" v-if="locked">
    <article-password-lock :unlock="unlockArticle" />
  </div>
  <div v-else class="article-detail-page flex layout-col pb-60">
    <app-header
      :back-label="$t(1)"
      back-link="/finance/navi/articles"
      :right-label="$t(27)"
    />
    <article-header :article="article" />
    <div class="article-detail-page-container">
      <article-floating-panel :like-status="likeStatus" @onLike="onLike" />
      <article-content />
      <article-prices :unlock="unlockArticle" />
      <div class="sharing-bottom flex space-between mt-30">
        <div class="inline-flex">
          <LikeCount
            width="30"
            height="30"
            :liked="likeStatus.isLiked"
            :count="likeStatus.totalLike"
            @onLike="onLike"
            class="mr-20"
          />
          <navi-favourite-button
            @favourite="markFavourite"
            :marked="article.isFavorite"
          />
        </div>
        <div class="inline-flex">
          <navi-line-button class="mr-20" />
          <navi-twitter-button />
          <navi-facebook-btn class="ml-20" />
        </div>
      </div>
      <LazyComp01 min-height="192px">
        <article-comments v-if="article.seriesId !== 811" />
      </LazyComp01>
      <LazyComp01 min-height="194px" v-if="isShownPaging">
        <article-paging />
      </LazyComp01>
      <LazyComp01 min-height="110px">
        <article-author-bottom />
      </LazyComp01>
      <div class="separate-section"></div>
      <LazyComp01 min-height="428px" v-if="seriesRank && seriesRank.length">
        <article-ranking
          :title="$t(2)"
          :products="seriesRank"
          v-if="seriesRank && seriesRank.length"
        />
      </LazyComp01>
      <LazyComp01 min-height="428px" v-if="articleRank && articleRank.length">
        <article-ranking :title="$t(26)" :products="articleRank" use-period />
      </LazyComp01>
      <LazyComp01 min-height="288px" v-if="alsoBought && alsoBought.length">
        <article-also-bought
          :products="alsoBought"
          v-if="alsoBought && alsoBought.length"
        />
      </LazyComp01>
    </div>
  </div>
</template>
<script>
import ArticleHeader from "@@/../common/components/navi/article/article-header"
import ArticleContent from "@@/../common/components/navi/article/article-content"
import ArticlePaging from "@@/../common/components/navi/article/article-paging"
import ArticleAlsoBought from "@@/../common/components/navi/article/article-also-bought"
import ArticleFloatingPanel from "@@/../common/components/navi/article/article-floating-panel"
import ArticleAuthorBottom from "@@/../common/components/navi/article/author-bottom"
import ArticleComments from "@@/../common/containers/navi/article/article-comments"
import ArticleRanking from "@@/../common/containers/navi/article/article-ranking"
import AppHeader from "@@/../common/components/app-header"
import NaviTwitterButton from "@@/../common/components/twitter-button"
import NaviFacebookBtn from "@@/../common/components/facebook-button"
import NaviFavouriteButton from "@@/../common/components/favourite-button"
import LazyComp01 from "@@/../components/LazyComp01.vue"
import { checkNested } from "@/utils/client/common"
import ArticleMixins from "@@/../common/containers/navi/article/mixins"
import ArticlePasswordLock from "@@/../common/components/navi/article/article-password-lock"
import ArticlePrices from "@@/../common/containers/navi/article/article-price-buttons"
import i18n from "@@/lang/common/navi-article.json"
import NaviLineButton from "@@/../common/components/line-button"
import LikeCount from "@@/../common/components/like-count"

export default {
  name: "ArticleDetailPage",
  i18n: {
    messages: i18n
  },
  components: {
    LikeCount,
    NaviLineButton,
    ArticleAlsoBought,
    ArticleRanking,
    ArticleAuthorBottom,
    ArticlePaging,
    ArticleComments,
    NaviFavouriteButton,
    NaviFacebookBtn,
    NaviTwitterButton,
    ArticleContent,
    ArticleFloatingPanel,
    AppHeader,
    ArticleHeader,
    LazyComp01,
    ArticlePasswordLock,
    ArticlePrices
  },
  data() {
    return {
      likeStatus: {}
    }
  },
  mixins: [ArticleMixins],
  props: [
    "alsoBought",
    "seriesRank",
    "articleRank",
    "unlockArticle",
    "locked",
    "isMobile"
  ],
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    isShownPaging() {
      return (
        +this.article.seriesId &&
        (+this.article.prev.id || +this.article.next.id)
      )
    }
  },
  mounted() {
    this.GoGoHTTP.get(
      `/api/v3/surface/navi/article/${this.article.id}/like`
    ).then(res => (this.likeStatus = res))
  },
  methods: {
    checkNested,
    onLike() {
      this.GoGoHTTP.post(
        `/api/v3/surface/navi/article/${this.article.id}/like`
      ).then(() => {
        this.likeStatus = {
          totalLike: this.likeStatus.isLiked
            ? --this.likeStatus.totalLike
            : ++this.likeStatus.totalLike,
          isLiked: !this.likeStatus.isLiked
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.article-detail-page {
  margin-bottom: 40px;

  .article-detail-page-container {
    max-width: 620px;
    align-self: center;
    @media screen and (max-width: 620px) {
      width: 100vw;
    }
  }
  .sharing-bottom {
    padding: 10px 0;
    border-bottom: 1px solid #d8d8d8;
  }
}

.separate-section {
  height: 84px;
  background: repeating-linear-gradient(
    -45deg,
    #fff,
    #fff 20px,
    #d8d8d8 20px,
    #d8d8d8 30px
  );
}

.tag {
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  background: #f7f7f7;
  color: #2d2d2d;
  height: 30px;
}
@media all and (max-width: 767px) {
  /deep/ .article-content-container {
    padding-left: 20px;
    padding-right: 20px;

    ~ div {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
}
@media all and (max-width: 425px) {
  /deep/ .article-content-container {
    padding-left: 15px;
    padding-right: 15px;

    ~ div {
      padding-left: 15px !important;
      padding-right: 15px !important;
    }
  }
}
</style>
