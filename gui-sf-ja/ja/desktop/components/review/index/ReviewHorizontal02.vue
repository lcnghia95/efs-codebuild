<template>
  <LazyComp01 class="item" min-height="105px">
    <a :href="'/review/detail/' + item.productId" class="flex space-between item-link">
      <div :href="'/review/detail/' + item.productId" class="item-img pos-rel">
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
      </div>
      <div class="item-content">
        <div class="item-content-title wrap-text" :title="item.reviewTitle">
          {{ item.reviewTitle }}
        </div>
        <div class="item-content-copy wrap-text" :title="item.reviewContent">
          {{ item.reviewContent }}
        </div>
        <div class="flex mid space-between">
          <Rate02 :stars="(item.review || {}).stars" />
          <div class="item-content-date">{{ formatTime(item.publishedAt, 6) }}</div>
        </div>
        <div class="item-cate wrap-text mt-10"> {{ getCateName() }}</div> 
      </div>
    </a>
  </LazyComp01>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-item.json'
import Rate02 from './Rate02.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate02,
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
  },
  methods: {
    getCateName() {
      //  This function is related with OAM-25511 (TYPEID)
      if(!this.item) {
        return ''
      }
      let item = this.item
      if(item.typeId == 1) { // systemtrade
        if (item.categoryId == 1) { // fx
          return this.$t('systemtrade')
        } else if (item.categoryId == 3) { // stock (kabu)
          return this.$t('kabu')
        }
      }
      if([2, 6, 9, 10].includes(item.typeId)) { // tools
        return this.$t('tools')
      }
      if(item.typeId == 3) {  // navi
        return this.$t('navi')
      }
      if(item.typeId == 4) {  // salon & emagazine
        if([7650, 8812, 9154, 8592, 10520, 8697, 10340, 8955, 14150, 14359, 16211, 21105].includes(item.productId)) { // only these products is salon 
          return this.$t('salon')
        } else {
          return this.$t('emagazine') // mail magazine
        }
      }
      return this.$t('other') // others
    },
  },
}
</script>

<style lang='scss' scoped>
.item {
  width: 295px;
  height: 105px;
  padding: 15px 8px;
  border-bottom: 1px solid #ececec;
  .item-link {
    text-decoration: none;
  }
  .item-img {
    height: 80px;
    width: 80px;
    flex: 0 0 80px;
    img {
      max-height: 80px;
      max-width: 80px;
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
    width: 190px;
    .item-content-title,.item-content-copy {
      display: block;
      font-size: 12px;
      height: 17px;
      overflow: hidden;
      color: #333;
    }
    .item-content-title {
      font-weight: bold;
      cursor: pointer;
      color: #2d2d2d;
      text-decoration: none;
      &:hover {
        opacity: 0.7;
      }
    }
    .item-content-date {
      font-size: 11px;
      color: #a0a0a0;
    }
  }
  /deep/ .gg-rating {
    font-size: 13px;
    align-items: center;
    .rate-num {
      font-size: 12px;
    }
  }
  .item-cate {
    display: inline-block;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    padding: 0 5px;
    font-size: 10px;
    color: #2d2d2d;
    max-width: 200px;
  }
  &:hover {
    box-shadow: 2px 0 5px rgba(33, 33, 33, 0.2);
  }
}
</style>
<docs>
  ```vue
  <template>
    <ReviewHorizontal02 :item='item' rank='1' />
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