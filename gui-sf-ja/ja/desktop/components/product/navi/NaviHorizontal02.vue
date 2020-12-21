<template>
  <div class="navi-h02__i flex">
    <a class="img-wrapp pos-rel" :href="`/finance/navi/articles/${item.id}`">
      <!--<a class="img-wrapp pos-rel" :href="fxonUrl('/navi/detail/?id=' + item.id + '&na=2')">-->
      <img class="pos-abs" :src="'/img/articles/' + item.id" alt="" />
    </a>
    <div class="navi-h02__info flex layout-col ml-10">
      <a :href="`/finance/navi/articles/${item.id}`" :title="item.title" class="navi-h02__tit mb-5 fs-12" v-wrap-lines="2">
        <!--<a :href="fxonUrl('/navi/detail/?id=' + item.id + '&na=1')" :title="item.title" class="navi-h02__tit mb-5 fs-12" v-wrap-lines="2">-->
        {{ item.title }}
      </a>
      <div class="navi-h02__cont fs-12">
        <span class="navi-h02__cont-free text-center" v-if="!item.isPaidContent">
          {{ $t('1') }}
        </span>
        <span class="navi-h02__cont-no-free text-center" v-else>
          {{ $t('3') }}
        </span>
        <span>{{ $t('2') }} {{ formatTime(item.publishedDate, 1) }}</span>
      </div>
      <div class="wrap-text" :title="item.content">{{ item.content }}</div>
      <a :href="'/finance/navi/authors/' + (item.user || {}).id" class="navi-h02__name wrap-text flex fs-12">
        <!--<a :href="fxonUrl('/navi/serial/?w=' + (item.user || {}).id + '&na=2')" class="navi-h02__name wrap-text flex fs-12">-->
        <Edit class="navi-horizontal02__icon" />
        <span class="wrap-text">{{ (item.user || {}).name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal02.json'
import Edit from '@@/../components/icons/Edit.vue'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    imgWidth: {
      type: Number,
      default: 360,
    },
    imgHeight: {
      type: Number,
      default: 280,
    },
  },
  components: {
    Edit,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.navi-h02__i {
  width: 320px;
  .img-wrapp {
    width: 117px;
    height: 90px;
    background: #fbf9f8;
    img {
      height: auto;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &:hover {
      opacity: 0.85;
    }
  }
  .navi-h02__info {
    max-width: 191px;
    margin-top: 1px;
    .navi-h02__tit {
      max-height: 34px;
      color: #666;
    }
  }
  .navi-h02__cont {
    &-free,
    &-no-free {
      font-size: 11px;
      color: white;
      padding: 1px 1px 0 5px;
      margin-right: 5px;
    }
    &-free {
      background-color: #52bc00;
    }
    &-no-free {
      background-color: #ff1c42;
    }
  }
  .navi-h02__name {
    color: #2d2d2d;
    margin-top: 2px;
    i.icon-cls {
      width: 15px;
      height: 15px;
      flex: 0 0 15px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
      <NaviHorizontal02 :item="item" :img-width="117" :img-height="90" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          content:"現在子供たちが貯金箱に保存しているお金を置き換える...",
          id:6559,
          isCampaign:0,
          isPaidContent:1,
          publishedDate:1535796360,
          title:"2億人をターゲットにする新規公開コインICO 10月31日まで",
          user:{
            id:120662,
            name:"EDGE"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
