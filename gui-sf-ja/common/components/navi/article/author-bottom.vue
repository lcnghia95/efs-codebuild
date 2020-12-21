<template>
  <div class="author-bottom flex layout-col pb-30 mb-35">
    <span class="section-title mt-30">
      {{t(20)}}
    </span>
    <div class="section-author mt-40 inline-flex">
      <a :href="`/finance/navi/authors/${article.user.id}`">
        <img :src="`/img/users/${article.user.id}`" :alt="article.user.name" />
      </a>
      <div class="author-content flex layout-col ml-15">
        <a class="author-content-title" :title="article.user.name" :href="`/finance/navi/authors/${article.user.id}`">{{ article.user.name }}</a>
        <div class="author-content-content mt-10" v-html="urlify(article.user.selfIntroduction)" v-wrap-lines="5">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {urlify, t} from '@@/../common/assets/js/helper'
export default {
  name: "navi-article-author-bottom",
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"];
    }
  },
  methods: {
    urlify,
    t
  }
};
</script>
<style scoped lang="scss">
.author-bottom {
  border-bottom: 1px solid #d3d3d3;
  margin-bottom: 40px;
}
.section-title {
  text-align: center;
  color: #2c2c2c;
  font-size: 16px;
  font-weight: bold;
}
.section-author {
  img {
    border-radius: 50%;
    min-width: 80px;
    height: 80px;
    border: 1px solid #efefef;
  }
  .author-content {
    &-title {
      color: #757575;
      font-size: 20px;
    }
    &-content {
      color: #606060;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
</style>
