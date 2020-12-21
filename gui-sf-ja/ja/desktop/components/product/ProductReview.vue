<template>
  <div class="review-8tHz0b flex">
    <a class="review-img" :href="'/users/' + data.reviewUserId + '/review'" :title="data.reviewNickName">
      <img :src="'/img/users/' + data.reviewUserId" width="50" height="50" alt="" />
    </a>
    <div class="review-des ml-10">
      <Rate :stars="data.reviewStars || 0" :number="data.reviewCount || 0"
            :target="'/review/detail/' + productId"
      />
      <a class="cursor-pointer link-8tHz0b" :href="'/review/detail/' + productId">
        <div class="title wrap-text" :title="data.title"><b>{{ data.reviewTitle }}</b></div>
        <div class="content" v-wrap-lines="3" :title="data.content">{{ data.reviewContent }}</div>
      </a>
    </div>
  </div>
</template>

<script>
import GogoLink from '@@/../components/link/GogoLink.vue'
import Rate from '@@/../components/product/Rate.vue'
export default {
  components: {
    GogoLink,
    Rate,
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
    productId: {
      type: [Number, String],
      default: 0,
    },
  },
}
</script>

<style lang="scss" scoped>
.review-8tHz0b {
  width: 300px;
  .review-img {
    flex: 0 0 50px;
  }
  .review-des {
    width: 240px;
    /deep/ .gg-rating {
      font-size: 17px;
      letter-spacing: -1px;
      margin-top: -4px;
      .rate-num {
        a {
          margin-left: 4px;
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
    .link-8tHz0b {
      width: 100%;
      font-size: 12px;
      /deep/ .gogo-link {
        width: 100%;
        color: #666;
      }
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductReview :data="rv" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        rv: {
          content: 'このEAは私が一番最初に買ったEAです。2017年6月頃から運用しています。途中損失が続くこともありましたが、なんだかんだで利益を積み上げていきます。 このEAはコツコツ利益を積み上げるというよりは、勝ち負けを繰り返しながら、たまに...',
          publishedDate: 1526605308,
          review: {
            stars: 5,
          },
          title: 'なんだかんだで利益を積み上げていきます。',
          user: {
            id: 55872,
            name: 'ea_trader151',
          },
        },
      }
    },
    $route: {
      params: {
        id: 1,
      },
    },
  }
  </script>
  ```
</docs>
