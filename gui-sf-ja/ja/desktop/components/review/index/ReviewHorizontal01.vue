<template>
  <LazyComp01 class="rv-hori-item flex space-between" min-height="100px">
    <a class="item-img pos-rel" :href="'/review/detail/' + item.productId">
      <img :src="'/img/products/' + item.productId + '/small'" alt="" />
      <div class="rank"
           v-if="rank"
           :style="{
             background: rankColor[rank] || '#e1dede',
             color: rankColor[rank] ? 'white' : '#505050'
           }"
      >
        {{ rank }}
      </div>
    </a>
    <div class="item-content">
      <a class="item-content-name wrap-text" :title="item.name" :href="'/review/detail/' + item.productId">
        {{ item.name || item.reviewTitle }}
      </a>
      <div v-if="item.reviewContent" class="wrap-text">{{ item.reviewContent }}</div>
      <Rate :stars="(item.review || {}).stars" :number="(item.review || {}).count" :target="item.productId" />
      <Prices :prices="item.prices" style="margin-top: 10px;" />
    </div>
  </LazyComp01>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  components: {
    Rate,
    Prices,
    LazyComp01,
  },
  props: {
    rank: {
      type: Number,
      default() {
        return 0
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rankColor: {
        1: '#ffcc00', // rank 1
        2: '#6e766a', // rank 2
        3: '#e2594e' // rank 3
      },
    }
  }
}
</script>

<style lang='scss' scoped>
.rv-hori-item {
  width: 265px;
  height: 100px;
  padding: 18px 5px 18px 5px;
  font-size: 12px;
  border-top: 1px solid #ececec;
  .item-img {
    height: 60px;
    width: 60px;
    flex: 0 0 60px;
    min-width: 60px;
    img {
      max-height: 60px;
      max-width: 60px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .rank {
    position: absolute;
    top: -10px;
    left: 0;
    background: purple;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
  }
  .item-content {
    width: 170px;
    .item-content-name {
      display: block;
      font-size: 12px;
      height: 17px;
      max-height: 17px;
      overflow: hidden;
      color: #2d2d2d;
      text-decoration: none;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  /deep/ .gg-rating {
    font-size: 14px;
    align-items: center;
    .rate-num {
      font-size: 12px;
      color: #a0a0a0;
    }
  }
  &:hover {
    box-shadow: 2px 0 5px rgba(33, 33, 33, 0.2);
  }
}
</style>
<docs>
  ```vue
  <template>
    <ReviewHorizontal01 :item='item' rank='1' />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "productId": 10118,
          "reviewTitle": "読まないよりはいいかも。",
          "reviewContent": "「海外サイトの和訳」と「売り買いのシグナル」の情報です。\n\nもっと企画を増やしてほしいです。\n\n売り買いシグナル通りに行動した実践記のようなこととか。\n海外のオススメの情報入手先とか。\nオススメの書籍とか。\n仮想通貨関連のサービスの始め方とか。(メモリーチェーンなど)\nテクニカル講座とか。\nQ&Aコーナーとか。\n\nここの会員しか知ることが出来ないような情報を増やしてほしいです。\n\n同じような価格でホリエモンがメルマガをやっています。\n比べるものじゃないかもしれませんがコンテンツの量と質が全然違います。\n\n海外のサイトを和訳してシグナルをちょいちょい知らせるだけで月に何十万円も\n儲かる発行者さんは正直おいしいなと思います。\n\n否定的なレビューになり申し訳ないですが、これからも読み続けたいので\nコンテンツの質と量を増やしてほしいです。\n\n",
          "review": {
            "stars": 3
          },
          "publishedAt": 1498699572,
          "typeId": 3,
          "userId": 55449,
          "productUrl": "/finance/navi/series/74"
        }
      }
    },
  }
  </script>
  ```
</docs>
