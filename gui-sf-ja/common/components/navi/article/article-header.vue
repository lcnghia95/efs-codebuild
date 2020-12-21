<template>
  <div class="article-author-header flex center">
    <div class="flex space-between">
      <div class="flex mid" style="flex-basis: 50%">
        <a :href="`/finance/navi/authors/${article.user.id}`">
          <img :src="`/img/users/${article.user.id}/small`" alt="" />
        </a>
        <div class="flex layout-col" style="margin-left: 12px">
          <a
            class="author-name"
            v-wrap-lines="1"
            :href="`/finance/navi/authors/${article.user.id}`"
            :class="{mobile: $parent.isMobile}"
            >{{ article.user.name }}</a>
          <span class="date-created">{{
            formatTime(article.publishedAt, 6)
          }}</span>
        </div>
      </div>
      <div
        v-wrap-lines="1"
        class="article-title flex mid"
        style="flex-basis: 50%"
        v-if="!$parent.isMobile"
      >
        {{ article.title }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "article-header",
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"];
    }
  }
};
</script>
<style scoped lang="scss">
.article-title {
  color: #292929;
  font-size: 16px;
  font-weight: bold;
}
/deep/.favourite-btn {
  button {
    height: 25px !important;
    span {
      font-size: 12px !important;
    }
    svg {
      width: 19px !important;
    }
  }
}
/deep/.fb-btn svg {
  width: 20px !important;
  height: 20px !important;
}
/deep/.twitter-btn svg {
  width: 24px !important;
  height: 24px !important;
}
img {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  border: 1px solid #efefef;
}

.article-author-header {
  > div {
    max-width: 620px;
    flex: 1;
  }

  height: 64px;
  border-bottom: 1px solid #efefef;
  padding: 0 30px;
  @media only screen and (max-width: 768px),
  only screen
  and (max-width: 896px) 
  and (max-height: 414px) {
    padding: 0 20px;
  }
  @media all and (max-width: 425px) {
    padding: 0 10px;
    > div > span {
      display: none;
    }
  }
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 9;

  .date-created {
    font-size: 12px;
    color: #9e9e9e;
  }

  .author-name {
    font-size: 20px;
    color: #3f3f3f;
  }
}
.author-name,
.article-title {
  &.mobile {
    font-size: 16px;
  }
}
</style>
