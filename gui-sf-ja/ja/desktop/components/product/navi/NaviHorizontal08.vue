<template>
  <div class="navi-h08 flex pos-rel cursor-pointer pt-15 pb-15 pl-15 pr-25">
    <a :href="this.path + `/${item.id}`">
      <ImgWrapper :src="`/img/products/${item.productId}/small`" />
    </a>
    <div class="navi-h08__info flex layout-col ml-15">
      <a :href="this.path + `/${item.id}`">
        <p class="navi-h08__tit" v-wrap-lines="2" :title="item.title">
          {{ item.title }}
        </p>
      </a>
      <div class="navi-h08__cont-wrapper flex layout-col">
        <a :href="this.path + `/${item.id}`">
          <div class="navi-h08__cont fs-11" :title="item.content" v-wrap-lines="2" v-html="item.content"></div>
        </a>
        <a :href="`/finance/navi/authors/${(item.user || {}).id}`" class="navi-h08__name flex wrap-text">
          <Edit class="navi-horizontal02__icon" />
          <span class="wrap-text name">{{ (item.user || {}).name }}</span>
        </a>
      </div>
      <div class="flex price-content" v-if="item.price">
        <Price :price="item.discountPrice || item.price" :old-price="item.discountPrice ? item.price : null" />
        <span class="monthly">&nbsp;/&nbsp;<b>月</b> </span>
      </div>
    </div>
    <a :href="this.path + `/${item.id}`" class="navi-h08__al flex mid center pos-abs h-full center">〉</a>
  </div>
</template>

<script>
import Edit from '@@/../components/icons/Edit.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import Price from '@@/../components/prices/Price.vue'
/**
 * The NaviHorizontal08.
 */
export default {
  props: {
    /**
     * The NaviHorizontal08 item.
     */
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    path: {
      type: String,
      default: '/finance/navi/series',
    },
  },
  components: {
    Price,
    Edit,
    ImgWrapper,
  },
}
</script>

<style lang="scss" scoped>
.fs-11 {
  font-size: 11px;
}
.navi-h08 {
  width: 360px;
  height: 130px;
  border: 1px solid #ddd;
  align-items: center;
  .price-content {
    padding-top: 4px;
    justify-content: flex-end;
    font-size: 12px !important;
    .monthly {
      color: red;
    }
    .price-cls {
      justify-content: flex-end;
      flex: 0;
      height: 16px;
    }
  }
  .img-wrapp {
    width: 80px;
    height: 80px;
  }
  .navi-h08__tit {
    max-height: 32px;
    line-height: 16px;
    overflow: hidden;
    font-weight: bold;
    color: rgb(45, 45, 45);
    margin-bottom: 2px;
  }
  .navi-h08__cont-wrapper {
    .navi-h08__cont {
      line-height: 16px;
      color: rgb(125, 125, 125);
      max-height: 30px;
      overflow: hidden;
    }
    .navi-h08__name {
      font-size: 11px;
      margin-top: 6px;
      width: 220px;
      color: rgb(125, 125, 125);
      .name {
        line-height: 16px;
      }
    }
    .navi-horizontal02__icon {
      flex: 0 0 15px;
      height: 15px;
    }
  }
  .navi-h08__al {
    top: 0;
    right: 0;
    color: #fff;
    background: #d9d9d9;
    width: 10px;
    height: 100%;
    padding-left: 7px;
    text-decoration: none;
  }
  a {
    text-decoration: none;
  }
  &:hover {
    background: #f5f5f5;
    .img-wrapp {
      opacity: 0.85;
    }
  }
  .navi-h08__tit,
  .navi-h08__name {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <div style="width: 360px; padding: 10px 0;">
      <navi-horizontal08 :item="item" :path="'/finance/navi/series'"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          id: 6562,
          title: '9/1 本当に取りたい方のみ見て下さい「有料記事なし」',
          content: '今回は、なぜ毎回勝てるのか？その秘密の一部教えましょう。&nbsp;1、メン…',
          publishedDate: 1533565706,
          user: {
            id: 154764,
            name: '為替鬼［編集：FX攻略.com］'
          },
          isCampaign: 0,
          isPaidContent: 1
        }
      }
    },
  }
  </script>
  ```
</docs>
