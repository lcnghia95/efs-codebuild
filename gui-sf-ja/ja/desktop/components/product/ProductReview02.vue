<template>
  <div class="o-com flex layout-col space-between p-10 cursor-pointer">
    <GogoLink :target="'/review/detail/' + data.productId">
      <img :src="`/img/products/${data.productId}/small`" class="o-com__img">
      <div :title="data.productName" class="o-com__tit mt-5" v-wrap-lines="2">{{ data.productName }}</div>
    </GogoLink>
    <Rate :alway-show="true" :stars="data.review ? data.review.stars : 0" :number="data.review ? data.review.count : 0"
          :target="data.detailUrl" class="o-com__rate"/>
    <GogoLink :target="'/review/detail/' + data.productId">
      <div :title="data.content" class="o-com__cont" v-wrap-lines="3">{{ data.content }}</div>
    </GogoLink>
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
  },
}
</script>

<style lang="scss" scoped>
.o-com {
  width: 110px;
  color: #666;
  text-decoration: none;
  &:hover {
    background: #f5f5f5;
    .o-com__tit,
    .o-com__cont {
      text-decoration: underline;
    }
  }
  &__img {
    width: 90px;
    height: 90px;
    border: 1px solid #b0b0b0;
  }
  &__rate {
    margin-top: 6px;
    /deep/ .rate-num {
      display: none;
    }
  }
  &__cont {
    margin-top: 5px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <ProductReview02 :data="data"/>
  </template>
  <script>
  export default {
    data() {
      return {
        data: {
          "productId": 13778,
          "productName": "利大損小百花繚乱EURUSD",
          "content": "★動作性\ntitan fxのblade口座でバグもなく正常に動いています。\n\n★損益\n一時は良かったのかもしれませんが、私が買って２か月くらいになりますが損切ばかりでたまに大きい損切もあり。かと思えば先週末のユロルでロングポジションを持っていたにも関わらず大きな上げの前に何故か損切。おかげで損ばかりが積み重なっていきます。\n\n★総評\n私は長期的に見ていきますが、今のところ評価は非常に低いです。エントリーポイントも下手だし、損切も下手です。例えば雲反発を狙ったようなポジを持ってるのに雲に入ってしまったも損切しませんし、利益が出て伸ばすときのSLポイントもそこ？って場所に入っています。控えめにいって今のところゴミです。",
          "publishedDate": 1537141468,
          "user": {
              "id": 151175,
              "name": "Yamagata sho"
          },
          "detailUrl": "/systemtrade/fx/13778",
          "review": {
              "stars": 2
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
