export default {
  methods: {
    async markFavourite() {
      const selectedArticle = this.$store.getters["finance/selectedArticle"];
      await this.GoGoHTTP.post("/api/v3/surface/navi/favorite/article", {
        articleId: selectedArticle.id
      });
      this.$store.commit(
        "finance/markArticleAsFavourite",
        1 - selectedArticle.isFavorite
      );
    }
  }
};
