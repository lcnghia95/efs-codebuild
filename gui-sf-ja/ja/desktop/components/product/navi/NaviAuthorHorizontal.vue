<template>
  <div class="navi-h08__i flex mid pos-rel">
    <a :href="`/finance/navi/${item.id}`">
      <img class="navi-h08__img" v-if="item.productId" :src="`/img/products/${item.productId}`">
      <img class="navi-h08__img" v-else :src="`/img/articles/${item.id}`">
    </a>
    <div class="navi-h08__info flex layout-col p-5">
      <a :href="`/finance/navi/${item.id}`">
        <p class="navi-h08__tit fs-13 mb-5" v-wrap-lines="2" :title="item.title">
          {{ item.title }}
        </p>
      </a>
      <div class="navi-h08__cont-wrapper flex layout-col">
        <a :href="`/finance/navi/${item.id}`">
          <div class="navi-h08__cont fs-11" :title="item.content" v-wrap-lines="2" v-html="item.content"/>
        </a>
        <a :href="`/users/${(item.user || {}).id}`" class="navi-h08__name wrap-text">
          <Edit class="navi-horizontal02__icon"/>
          <span class="wrap-text name">{{ (item.user || {}).name }}</span>
        </a>
      </div>
    </div>
    <a :href="`/finance/navi/${item.id}`" class="navi-h08__al flex mid pos-abs no-underlying h-full center">〉</a>
  </div>
</template>

<script>
import Edit from '@@/../components/icons/Edit.vue'
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
  },
  components: {
    Edit,
  },
}
</script>

<style lang="scss" scoped>
.fs-11 {
  font-size: 11px;
}
.navi-h08__i {
  flex: 0 1 360px;
  height: 120px;
  padding-left: 20px;
  padding-right: 32px;
  margin-bottom: 18px;
  border: 1px solid #ddd;
  .navi-h08__img {
    flex: 0 0 80px;
    width: 80px;
    height: 80px;
  }
  .navi-h08__info {
    bottom: 0;
    margin-left: 14px;
  }
  .navi-h08__tit {
    max-height: 36px;
    overflow: hidden;
    color: rgb(45, 45, 45);
    font-weight: bold;
  }
}
.navi-h08__cont-wrapper {
  font-size: 11px;
  .navi-h08__cont {
    color: #2d2d2d;
    max-height: 30px;
    overflow: hidden;
  }
  .navi-h08__name {
    display: flex;
    flex: 1 1 auto;
    margin-top: 3px;
    width: 117px;
    color: #2d2d2d;
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
  display: flex;
  align-items: center;
  right: 0;
  color: #fff;
  background: #d9d9d9;
  width: 10px;
  height: 100%;
  padding-left: 7px;
  text-decoration: none;
}
</style>

<docs>
  ```vue
  <template>
    <div style="width: 360px; padding: 10px 0;">
      <navi-horizontal08 :item="item" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          id: 6562,
          title: '9/1 本当に取りたい方のみ見て下さい「有料記事なし」',
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
