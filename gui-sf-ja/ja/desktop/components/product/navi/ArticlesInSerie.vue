<template>
  <div class="c-com">
    <h4>{{ $t('heading')['h5'] }}</h4>
    <div class="c-com__inner flex space-between flex-wrap">
      <article-item class="no-underlying" v-for="(item, i) in data" :key="i" :data="item"/>
    </div>
  </div>
</template>
<script>
import ArticleItem from '@/components/product/navi/article-item/Item.vue'
import i18n from '@@/lang/desktop/navi-detail.json'
/**
 * The Articles in Serie.
 */
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ArticleItem,
  },
  props: ['data'],
}
</script>
<style lang="scss" scoped>
%flex {
  display: flex;
}
%w-full {
  width: 100%;
}
%fs-11 {
  font-size: 11px;
}
.c-com {
  margin-top: 60px;
  h4 {
    color: #666;
    font-size: 20px;
    line-height: 20px;
    border-left: 2px solid #ddd;
    padding: 10px 17px;
  }
  .c-com__inner {
    margin-top: 20px;
  }
}
/deep/ .o-item {
  position: relative;
  width: 235px;
  height: 180px;
  margin-bottom: 20px;
  @extend %flex;
  .o-item__img {
    @extend %w-full;
    height: 100%;
  }
  .o-item__info {
    position: absolute;
    bottom: 0;
    padding: 5px;
    background: #fff;
    opacity: 0.8;
    flex-direction: column;
    @extend %flex;
    @extend %w-full;
  }
  .o-item__tit {
    font-size: 12px;
    margin-bottom: 5px;
    min-height: 34px;
    font-weight: bold;
    color: #333;
  }
  .o-item__cont-w {
    align-items: center;
    @extend %flex;
    @extend %fs-11;
  }
  .o-item__cont {
    width: 108px;
  }
  .o-item__cont-free,
  .o-item__cont-no-free {
    @extend %fs-11;
    text-align: center;
    color: #fff;
    padding: 1px 5px 0 5px;
    margin-right: 5px;
  }
  .o-item__cont-no-free {
    background-color: #ff1c42;
  }
  .o-item__cont-free {
    background-color: #52bc00;
  }
  .o-item__name-w {
    width: 117px;
    color: #2d2d2d;
    justify-content: flex-end;
    @extend %flex;
  }
  .o-item__icon {
    width: 14px;
    height: auto;
  }
  .o-item__name {
    line-height: 16px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <articles-in-serie :data="dataArticlesInSerie"/>
  </template>
  <script>
  export default {
    data() {
      return {
        dataArticlesInSerie: [
          {
            "id": 4136,
            "title": "4875【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "publishedDate": 1536973965,
            "user": {
              "id": 337083,
              "name": "4670FX攻略.com"
            },
            "isCampaign": 0,
            "isPaidContent": 0
          },
          {
            "id": 2567,
            "title": "3157【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "publishedDate": 1536973965,
            "user": {
              "id": 213887,
              "name": "2019FX攻略.com"
            },
            "isCampaign": 0,
            "isPaidContent": 1
          }
        ]
      }
    },
  }
  </script>
  ```
</docs>
