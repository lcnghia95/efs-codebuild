<template>
  <a :href="'/finance/navi/authors/' + item.id" class="navi-h09 flex pos-rel p-10 mb-15">
    <ImgWrapper :src="'/img/users/' + item.id" />
    <div class="navi-info flex layout-col ml-10">
      <div class="navi-title" :title="item.name" v-wrap-lines="2">
        <b>{{ item.name || $t('1') }}</b>
      </div>
      <div class="navi-des" :title="item.introduction" v-wrap-lines="3">
        {{ item.introduction }}
      </div>
    </div>
  </a>
</template>

<script>
import i18n from '@@/lang/components-desktop/user-info.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
/**
 * The NaviHorizontal09.
 */
export default {
  props: {
    /**
     * The NaviHorizontal09 item.
     */
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    ImgWrapper,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.navi-h09 {
  width: 235px;
  height: 100px;
  border: 1px solid #ddd;
  text-decoration: none;
  .img-wrapp {
    width: 70px;
    height: 70px;
  }
  .navi-info {
    width: 125px;
    color: #2d2d2d;
    .navi-title {
      font-size: 14px;
      line-height: 16px;
      max-height: 32px;
      overflow: hidden;
    }
    .navi-des {
      font-size: 11px;
      line-height: 13px;
      max-height: 40px;
      margin-top: 2px;
      overflow: hidden;
    }
  }
  &:hover {
    background: #f5f5f5;
    .img-wrapp {
      opacity: 0.85;
    }
    .navi-title {
      text-decoration: underline;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <div style="width: 360px; padding: 10px 0;">
      <navi-horizontal09 :item="item" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "id": 23554,
          "name": "チャリストレーダー",
          "introduction": "普段は年利10％から20"
        }
      }
    },
  }
  </script>
  ```
</docs>
