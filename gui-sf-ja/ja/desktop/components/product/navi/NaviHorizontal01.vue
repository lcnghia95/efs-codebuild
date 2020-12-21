<template>
  <div class="navi-h01__i pos-rel">
    <a :href="`/finance/navi/articles/${item.id}`">
      <!--<a :href="fxonUrl('/navi/detail/?id=' + item.id + '&na=1')">-->
      <img :src="'/img/articles/' + item.id" alt="" :width="imgWidth" :height="imgHeight" />
    </a>
    <div class="navi-h01__o pos-abs w-full p-10">
      <a class="navi-h01__tit mb-5 wrap-text" :href="`/finance/navi/articles/${item.id}`">
        <!--<a class="navi-h01__tit mb-5 wrap-text" :href="fxonUrl('/navi/detail/?id=' + item.id + '&na=1')">-->
        <b :title="item.title">{{ item.title }}</b>
      </a>
      <a :href="`/finance/navi/articles/${item.id}`" v-wrap-lines="2" class="fs-12 navi-h01__dec">{{ item.content }}</a>
      <!--<a :href="fxonUrl('/navi/detail/?id=' + item.id + '&na=1')" v-wrap-lines="2" class="fs-12 navi-h01__dec">{{ item.content }}</a>-->
      <a class="navi-h01__name flex mid" :href="'/finance/navi/authors/' + (item.user || {}).id">
        <!--<a class="navi-h01__name flex mid" :href="fxonUrl('/navi/serial/?w=' + (item.user || {}).id + '&na=2')">-->
        <Edit /><span class="fs-12">{{ (item.user || {}).name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
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
      default: 320,
    },
    imgHeight: {
      type: Number,
      default: 240,
    },
  },
  components: {
    Edit,
  },
}
</script>

<style lang="scss" scoped>
.navi-h01__i {
  width: 320px;
  height: 240px;
  background: #fff;
  a {
    text-decoration: none;
  }
  &:hover {
    opacity: 0.85;
  }
  .navi-h01__o {
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.85);
    .navi-h01__tit {
      display: block;
      color: #000;
      &:hover {
        text-decoration: underline;
      }
    }
    .navi-h01__dec {
      display: block;
      height: 34px;
      color: #2d2d2d;
      overflow: hidden;
    }
    .navi-h01__name {
      color: #2d2d2d;
      margin-top: 1px;
      &:hover {
        text-decoration: underline;
      }
    }
    i.icon-cls {
      width: 17px;
      height: 17px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="height: 250px;">
      <NaviHorizontal01 :item="item" :img-width="320" :img-height="240" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          content:"テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不テクニカル分析ナシでも勝てる技があるんです！FXで勝つにはテクニカル分析が必要不...",
          id:6503,
          title:"【2018年7月号特集】分析いらずの儲かる手法！｜PART1. ゆったり為替さん／月曜朝7時に窓があいたらそれを埋める流れを追う",
          user:{
            id:150527,
            name:"FX攻略.com"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
