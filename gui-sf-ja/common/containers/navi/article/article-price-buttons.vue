<template>
  <div v-if="(article.seriesPrice || article.articlePrice) && !isOwner" class="price-actions flex layout-col">
    <template v-if="!checkShowPassword">
      <div v-if="article.articlePrice && !article.isPurchased && !isOwner" class="information mt-40 mb-20 flex mid center">
        {{ t(17) }}
      </div>
      <navi-cart-button
        :show-cart="false"
        :left-text="t(18)"
        v-if="article.articlePrice && !article.isPurchased"
        :price="article.articlePrice"
        :product-id="article.productId"
        container-class="price-button-container"
        button-class="price-button"
      />
      <div class="pos-rel">
        <navi-cart-button
          :show-cart="false"
          :left-text="t(19)"
          monthly
          class="mt-5"
          v-if="article.seriesPrice && !article.isPurchasedSeries"
          :price="article.seriesPrice"
          :product-id="article.seriesProductId"
          container-class="price-button-container"
          button-class="price-button"
        />
        <IsFreeFirstMonthIcon v-if="isFFM" class="ffm" :class="{'has-discount': !!info.serie.oldPrice}" />
      </div>
    </template>
    <article-password-lock v-else :unlock="unlock" class="mt-40" />
  </div>
</template>
<script>
import NaviCartButton from "@@/../common/components/navi/article/article-cart-button"
import ArticlePasswordLock from '@@/../common/components/navi/article/article-password-lock'
import {t} from '@@/../common/assets/js/helper'
import IsFreeFirstMonthIcon from '@@/../common/components/navi/article/is-free-first-month-icon'

export default {
  name: "ArticlePrices",
  components: {
    IsFreeFirstMonthIcon,
    NaviCartButton,
    ArticlePasswordLock
  },
  props: ['unlock'],
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    info() {
      return this.$store.state.cart.info
    },
    checkArticle() {
      if (!this.info.article || !this.info.article.price) {
        return false
      }
      return Object.keys(this.info.article).length
    },
    checkShowPassword() {
      return this.isPassword !== 0 && this.productStatus !== 1
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    isFFM() {
      return this.info.serie.isFFM || this.info.article.isFFM || this.info.serie.productId == 15153 //OAM-30772 serie 512 is free first month
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    }
  },
  methods: {t}
}
</script>
<style scoped lang="scss">
.ffm {
  position: absolute;
  left: -35px;
  top: 5px;
  &.has-discount {
    top: 28px
  }
}
.price-actions {
  align-items: center;

  .information {
    border: 1px solid #ff8500;
    color: #ff8500;
    width: 274px;
    height: 51px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.price-button-container {
  width: 274px;
}
.price-button {
  padding: 5px 15px;
  min-height: 50px;
}
</style>
