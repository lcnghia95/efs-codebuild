<template>
  <div class="floating-panel flex layout-col" ref="floatingPanel">
    <span>
      {{ t(3) }}：<span class="date">
        {{
          formatTime(article.publishedAt, 6)
        }}
      </span>
    </span>
    <span>
      {{ t(4) }}：<span class="date">
        {{
          formatTime(article.updatedAt, 6)
        }}
      </span>
    </span>
    <div class="flex center mb-20 mt-20">
      <LikeCount
        width="30"
        height="30"
        @onLike="$emit('onLike')"
        :liked="likeStatus.isLiked"
        :count="likeStatus.totalLike"
      />
    </div>
    <navi-favourite-button
      class="mt-15"
      @favourite="markFavourite"
      :marked="article.isFavorite"
    />
    <div class="inline-flex mt-15" style="justify-content: center">
      <navi-line-button class="mr-20" />
      <navi-twitter-button class="mr-20" />
      <navi-facebook-btn />
    </div>
    <div class="flex center">
      <navi-cart-button
        v-if="article.articlePrice && !article.isPurchased && !isOwner"
        class="mt-20"
        :price="article.articlePrice"
        container-class="article-price-container"
        button-class="article-price-button"
      />
      <div class="purchase-btn flex mt-15" v-if="article.isPurchased && !isOwner">
        <span>{{ t(38) }}</span>
        <span>\{{ formatNumber(article.articlePrice || 0) }}</span>
      </div>
    </div>
    <template v-if="article.seriesId">
      <div class="divider mt-20 mb-20"></div>
      <div class="series-section inline-flex" style="align-items: center">
        <series-icon />
        <span class="ml-5" style="color: #737E8E; font-size: 14px">
          {{
            t(5)
          }}
        </span>
      </div>
      <a
        class="series-title mt-10"
        v-if="article.seriesName"
        v-wrap-lines="2"
        :title="article.seriesName"
        :href="`/finance/navi/series/${article.seriesId}`"
      >
        {{ article.seriesName }}
      </a>
      <div
        class="series-content mt-10"
        v-html="urlify(article.seriesContent || '')"
        v-wrap-lines="7"
      ></div>
      <div class="flex center">
        <navi-cart-button
          class="mt-20"
          monthly
          v-if="article.seriesPrice && !article.isPurchasedSeries && !isOwner"
          :price="article.seriesPrice"
          button-class="series-price-button"
          container-class="series-price-container"
        />
      </div>
      <div class="purchase-btn flex mt-20" v-if="article.seriesPrice && article.isPurchasedSeries && !isOwner">
        <span>{{ t(38) }}</span>
        <span>\{{ formatNumber(article.seriesPrice || 0) }}</span>
      </div>
    </template>
  </div>
</template>
<script>
import SeriesIcon from "@@/../common/components/navi/series-icon"
import NaviFavouriteButton from "@@/../common/components/favourite-button"
import NaviFacebookBtn from "@@/../common/components/facebook-button"
import NaviTwitterButton from "@@/../common/components/twitter-button"
import NaviCartButton from "@@/../common/components/navi/article/article-cart-button"
import ArticleMixins from "@@/../common/containers/navi/article/mixins"
import { urlify, t } from "@@/../common/assets/js/helper"
import NaviLineButton from "@@/../common/components/line-button"
import LikeCount from "@@/../common/components/like-count"

export default {
  name: "ArticleFloatingPanel",
  mixins: [ArticleMixins],
  components: {
    LikeCount,
    NaviLineButton,
    NaviCartButton,
    NaviTwitterButton,
    NaviFacebookBtn,
    NaviFavouriteButton,
    SeriesIcon
  },
  props: {
    likeStatus: {
      type: Object,
      default: () =>({
        totalLike: 0,
        isLiked: false
      })
    }
  },
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    cartInfo() {
      const { cartInfo = { article: {}, serie: {} } } = this.article
      return cartInfo
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleWindowResize)
    window.document.body.addEventListener("scroll", this.handleWindowScroll)
    this.$nextTick(() => {
      this.reLocationPanel()
    })
  },
  beforeDestroy() {
    window.document.body.removeEventListener("scroll", this.handleWindowScroll)
    window.removeEventListener("resize", this.handleWindowResize)
  },
  methods: {
    t,
    urlify,
    reLocationPanel() {
      const articleContent = document.querySelector(
        ".article-content-container"
      )
      const floatingPanel = document.querySelector(".floating-panel")
      if (articleContent && floatingPanel) {
        floatingPanel.style.left = `${articleContent.getBoundingClientRect()
          .left - 300}px`
        floatingPanel.style.visibility = "visible"
      }
    },
    handleWindowResize() {
      if (window.innerWidth < 1440) {
        this.$refs.floatingPanel.style.display = "none"
        return
      }
      this.reLocationPanel()
    },
    handleWindowScroll() {
      const commentsSection = document.querySelector(".article-comments")
      const articleContentElement = document.querySelector(".article-content")

      if (commentsSection) {
        this.$refs.floatingPanel.style.display =
          this.isElementInViewport(commentsSection, 300) ||
          !this.isElementInViewport(articleContentElement) ||
          window.innerWidth < 1280
            ? "none"
            : "flex"
      }
    }
  }
}
</script>
<style scoped lang="scss">
.floating-panel {
  display: none;
  @media all and (min-width: 1280px) {
    display: flex;
    visibility: hidden;
  }
  max-width: 230px;
  position: fixed;
  top: 18%;
  left: 14%;
  border: 1px solid #cbcbcb;
  padding: 30px 20px;
  border-radius: 4px;
  span {
    color: #777777;
    align-self: center;
    .date {
      color: #2c2c2c;
    }
  }
  .divider {
    width: 100%;
    height: 2px;
    background-color: #cbcbcb;
  }
  .series-title {
    color: #2c2c2c;
    font-size: 14px;
    font-weight: bold;
    align-self: self-start;
  }
  .series-content {
    color: #606060;
    font-size: 12px;
    word-break: break-word;
  }
}
/deep/.navi-cart-button {
  min-width: 115px !important;
  width: auto !important;
  height: 25px !important;
  align-self: center;
  .current-price {
    margin-left: 8px;
  }
  svg {
    width: 20px !important;
    height: 20px !important;
  }
}
.purchase-btn {
  width: 100%;
  height: 32px;
  padding: 5px 15px;
  background-color: #DDC6B6;
  justify-content: space-between;
  align-self: center;
  align-items: center;
  line-height: 40px;
  span {
    color: white;
  }
}
</style>
<style lang="scss">
.series-price-container {
  min-width: 130px;
  .discount-time {
    font-size: 10px !important;
  }
}
.series-price-button {
  padding: 5px 15px;
}

.article-price-container {
  width: 125px;
}
.article-price-button {
  padding: 5px 15px;
  height: 32px;
}
</style>
