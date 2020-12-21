<template>
  <div class="article-content-container">
    <div class="w-full purchase-btn mt-10 flex center mid" v-if="article.isPurchased && !isOwner">
      {{ t(38) }}&nbsp;&nbsp;&nbsp; \{{ formatNumber(article.articlePrice) }}
    </div>
    <div class="layout-col" style="position: relative">
      <img class="cover mt-30" :src="`/img/articles/${article.id}?ingoreOnErr=1`" alt="" />
      <div
        class="article-name mt-30"
        :class="{ 'mobile-article-title': $parent.isMobile }"
      >
        {{ article.title }}
      </div>
      <div class="category" v-if="category">{{ category }}</div>
      <div
        class="article-content mt-50 ql-editor"
        :class="{ 'hide-partial-content': hideContentIfGuests }"
        v-html="article.paidContent || article.freeContent"
      ></div>
      <template v-if="hideContentIfGuests">
        <div
          class="transparent"
          v-if="!$store.state.user.id && !article.isPaidContent"
        ></div>
        <div class="flex center mt-20 auth-panel-container">
          <div class="require-login-panel flex layout-col">
            <p>
              {{ t(28) }}<span style="color: #3F48CC; font-weight: bold">
                {{ t(29) }}
              </span>{{ t(30) }}
              <span style="color: #FF6600; font-weight: bold">{{ t(31) }}</span>{{ t(32) }}
            </p>
            <a
              class="register-btn mt-10"
              :href="`/register?u=${$route.fullPath}`"
            >
              {{ t(33) }}
            </a>
            <a class="login-btn mt-15" :href="`/login?u=${$route.fullPath}`">
              {{
                t(34)
              }}
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { t } from "@@/../common/assets/js/helper"
export default {
  name: "ArticleContent",
  computed: {
    category() {
      const foundCategory = (
        this.$store.getters["finance/naviCategories"] || []
      ).find(item => item.id === this.article.naviCategoryId)
      if (!foundCategory) return ""
      return foundCategory.categoryName
    },
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    hideContentIfGuests() {
      return !this.$store.state.user.id && !this.article.isPaidContent
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    }
  },
  methods: { t }
}
</script>
<style scoped lang="scss">
.purchase-btn {
  background-color: #DDC6B6;
  color: white;
  margin-bottom: -20px;
  height: 32px;
}
.article-content-container {
  @media all and (min-width: 1280px) {
    width: 620px;
  }
}
.cover {
  width: 100%;
  //height: 389px;
}
.article-name {
  font-size: 36px;
  color: #292929;
  font-weight: bold;
}
.category {
  font-size: 12px;
  background-color: #cccccc;
  padding: 3px 6px;
  border-radius: 2px;
  width: fit-content;
  text-align: center;
  color: white;
}
.article-content /deep/ {
  color: #4f4f4f;
  font-size: 16px;
  * {
    max-width: 100% !important;
  }
  p {
    a {
      color: #337ab7 !important;
    }
    line-height: 1.7;
    margin: 0 0 10px;
  }
}
.hide-partial-content {
  height: 355px;
  overflow-y: hidden;
}
.transparent {
  background: rgba(0, 0, 0, 0)
    linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5),
      rgb(255, 255, 255)
    )
    repeat scroll 0% 0%;
  height: 300px;
  position: absolute;
  width: 100%;
  bottom: 252px;
}
.auth-panel-container {
  width: 100%;
  height: 232px;
  background-color: white;
  z-index: 2;
}
.require-login-panel {
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 22px;
  padding: 30px;
  max-width: 454px;
  width: 100%;
  z-index: 1;
  align-items: center;
  position: absolute;
  bottom: 0;
  a {
    text-decoration: none;
    color: white;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      transition: background-color 0.5s;
    }
    &.register-btn {
      width: 196px;
      background-color: #3f48cc;
      &:hover {
        background-color: darken(#3f48cc, 10%);
      }
    }

    &.login-btn {
      width: 117px;
      background-color: #ff6600;
      border-radius: 5px;
      &:hover {
        background-color: darken(#ff6600, 10%);
      }
    }
  }
}
.mobile-article-title {
  font-size: 24px !important;
}
</style>
