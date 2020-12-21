<template>
  <LazyComp01 class="item flex space-between" min-height="130px">
    <a class="item-img-ctn pos-rel" :href="item.productUrl">
      <div class="rank"
           v-if="rank"
           :style="{
             background: rankColor[rank] || '#e1dede',
             color: rankColor[rank] ? 'white' : '#505050'
           }"
      >
        {{ rank }}
      </div>
      <img :src="'/img/products/' + item.productId + '/small'" alt="" />
    </a>
    <div class="item-info-ctn">
      <a class="item-title" :href="'/review/detail/' + item.productId">{{ item.name }}</a>
      <div class="mt-10" style="word-break: break-all;"><strong>{{ item.reviewTitle }}</strong></div>
      <div class="rv-content">{{ item.reviewContent }}</div>
      <div class="flex mid mt-10">
        <Rate :stars="item.review ? item.review.stars : 0" class="mr-10" />
        <span class="mr-15 flex mid" style="font-size: 12px; color: #707070;"><a class="user-tag mr-10" :href="'/users/'+item.userId+'/review'"><Pencil02 />{{ item.nickName }}</a> {{ formatTime(item.publishedAt, 6) }}</span>
        <div class="item-cate wrap-text">{{ getCateName() }}</div> 
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-item.json'
import Rate from '@@/../components/product/Rate.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    Pencil02,
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
      prices: [{"price":19000,"discountPrice":16800}]
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

<style lang="scss" scoped>
.item {
  min-height: 110px;
  width: 670px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
  }
  .item-img-ctn {
    width: 70px;
    img {
      max-width: 70px;
      max-height: 70px;
      &:hover {
        opacity: 0.7;
      }
    }
    .rank {
      position: absolute;
      top: -8px;
      left: -10px;
      background: purple;
      color: white;
      min-width: 20px;
      height: 20px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      text-align: center;
      z-index: 200;
    }
  }
  /deep/ .gg-rating {
    font-size: 12px;
  }
  .icon-cls {
    width: 18px;
    height: 14px;
  }
  .user-tag {
    color: #707070;
    .icon-cls {
      width: 17px;
      height: 13px;
    }
    &:hover {
      opacity: 0.7;
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
  .item-info-ctn {
    width: 540px;
    color: #2d2d2d;
    .item-title {
      border-bottom: 1px solid #d9d9d9;
      font-size: 18px;
      color: #2d2d2d;
      text-decoration: none;
      display: block;
      padding-bottom: 8px;
      &:hover {
        opacity: 0.7;
      }
    }
    .rv-content {
      white-space: pre-line;
      word-break: break-all;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <ListItem :item='item' rank='1' />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "productId": 14352,
          "typeId": 1,
          "categoryId": 1,
          "review": {
            "stars": 1.6875,
            "count": 32
          },
          "productUrl": "/systemtrade/fx/14352",
          "reviewTitle": "運ゲーの領域で使えない",
          "reviewContent": "★１つ付与しないとレビューできないので★１つ付けました。月曜日の定時にエントリーし、あとは１週間のうち、上にいくか下にいくか、まさに運ゲーの領域です。これがたまたま当たればOK、そうでなければ大損。他のEAにロットを配分して安定運用した方がよいですね。",
          "userId": 159587,
          "publishedAt": 1573305429,
          "name": "Beatrice DELTA2",
          "nickName": "festa"
        }
      }
    },
  }
  </script>
  ```
</docs>