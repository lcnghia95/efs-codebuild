<template>
  <div class="navi-article-top-ranking flex layout-col">
    <span class="title mb-20 mt-30">{{ title }}</span>
    <div class="ranking-period flex center mb-10" v-if="usePeriod">
      <div
        class="day"
        :class="{ active: rankingPeriod === PERIODS.DAY }"
        @click="rankingPeriod = PERIODS.DAY"
      >
        {{t(7)}}
      </div>
      <div
        class="week"
        :class="{ active: rankingPeriod === PERIODS.WEEK }"
        @click="rankingPeriod = PERIODS.WEEK"
      >
        {{t(8)}}
      </div>
      <div
        class="month"
        :class="{ active: rankingPeriod === PERIODS.MONTH }"
        @click="rankingPeriod = PERIODS.MONTH"
      >
        {{t(9)}}
      </div>
      <div
        class="all"
        :class="{ active: rankingPeriod === PERIODS.ALL }"
        @click="rankingPeriod = PERIODS.ALL"
      >
        {{t(10)}}
      </div>
    </div>
    <div class="list-article flex">
      <div
        v-for="(product, index) in productList"
        class="list-article-item inline-flex pt-10 pb-10"
        :key="index"
      >
        <div class="number">{{ index + 1 }}</div>
        <Lzimg
          class="article-avatar-item ml-10 mr-10"
          :data-src="composeImageUrl(product)"
          alt=""
        />
        <div class="flex layout-col article-ranking-content">
          <a v-wrap-lines="2" style="color: #7F7F7F" :title="product.title" :href="`/finance/navi/${usePeriod ? 'articles' : 'series'}/${product.id}`">
            {{ product.title }}
          </a>
          <a style="color: #C1C1C1" v-if="product.user" :href="`/finance/navi/authors/${product.user.id}`" :title="product.user.name" class="mt-5">{{
            product.user.name
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Lzimg from '@@/../components/Lzimg.vue'
import {t} from '@@/../common/assets/js/helper'
export default {
  name: "article-ranking",
  components: {
    Lzimg
  },
  props: {
    title: String,
    products: Array,
    usePeriod: Boolean
  },
  data: () => ({
    rankingPeriod: 0,
    PERIODS: {
      DAY: 0,
      WEEK: 1,
      MONTH: 2,
      ALL: 3
    }
  }),
  computed: {
    productList() {
      if (this.usePeriod) return this.products[this.rankingPeriod];
      return this.products;
    }
  },
  methods: {
    t,
    composeImageUrl(product) {
      if (this.usePeriod) {
        return `/img/articles/${product.id}`
      }

      return `/img/products/${product.productId}/small`
    }
  }
};
</script>
<style scoped lang="scss">
.ranking-period {
  div {
    color: #c1c1c1;
    width: 40px;
    cursor: pointer;
    text-align: center;
    &:hover {
      color: #4f4f4f;
    }
    &.active {
      font-weight: bold;
      color: #4f4f4f;
      border-bottom: 1px solid #4f4f4f;
    }
  }
}
.navi-article-top-ranking {
  border-top: 1px solid #d3d3d3;
  margin-top: 40px !important;
}
.title {
  color: #4f4f4f;
  font-weight: bold;
  text-align: center;
}
.list-article {
  height: 428px;
  width: 90%;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-between;
  flex-direction: column;
  align-self: center;
  &-item {
    width: 265px;
    .number {
      min-width: 14px;
      text-align: right;
    }
  }
}
img.article-avatar-item {
  max-width: 59px;
  width: 100%;
  height: 59px;
}
.article-ranking-content {
  max-width: 180px;
}
@media all and (max-width: 620px) {
  .article-ranking-content {
    max-width: 100%;
  }
  .list-article {
    height: auto;
    width: 100%;
    &-item {
      width: 100%;
    }
  }
}
</style>