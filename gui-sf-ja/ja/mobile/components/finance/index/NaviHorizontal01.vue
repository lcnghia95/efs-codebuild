<template>
  <div class="navi-item">
    <a :href="`/finance/navi/articles/${item.id}`" class="img-wrapper">
      <slot>
        <img :src="'/img/articles/' + item.id" alt="" :width="imgWidth" :height="imgHeight" />
      </slot>
    </a>
    <div class="navi-item-content pos-abs w-full p-10">
      <a class="navi-item-title mb-5" v-wrap-lines="2" :href="`/finance/navi/articles/${item.id}`" :title="item.title">
        {{ item.title }}
      </a>
      <div class="flex space-between w-full pb-5">
        <div class="left-detail">
          <a class="navi-item-name flex mid" :href="'/finance/navi/authors/' + (item.user || {}).id">
            <Edit /><span class="wrap-text fs-15">{{ (item.user || {}).name }}</span>
          </a>
          <span>{{ formatTime(item.publishedDate, 6) }}</span>
        </div>
        <Price :price="item.price" />
      </div>
    </div>
  </div>
</template>

<script>
import Edit from '@@/../components/icons/Edit.vue'
import Price from '@@/../components/prices/Price.vue'
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
    Price,
  },
}
</script>

<style lang="scss" scoped>
.navi-item {
  width: calc(100vw - 20px);
  height: 240px;
  background: #f3f0ee;
  a {
    text-decoration: none;
  }
  .img-wrapper {
    img {
      width: 100%;
      height: auto;
    }
  }
  .navi-item-content {
    bottom: 0;
    left: 0;
    background: #f3f0ee;
    .left-detail {
      width: 65%;
      max-width: 65%;
      .fs-15 {
        font-size: 15px;
      }
    }
    .navi-item-title {
      display: block;
      color: #707070;
      height: 40px;
      max-height: 40px;
      font-weight: bold;
      overflow-y: hidden;
      &:hover {
        text-decoration: underline;
      }
    }
    .navi-item-name {
      color: #707070;
      margin-top: 1px;
      &:hover {
        text-decoration: underline;
      }
    }
    /deep/ .price-cls {
      background: #fff;
      min-width: 50px;
      text-align: center;
      height: 35px;
      line-height: 35px;
      border: solid 2px #b2b2b2;
      color: #7d7d7d;
      padding: 0 5px;
      border-radius: 4px;
      font-size: 15px;
      flex: none;
      .co-red {
        margin: 0 auto;
        color: #7d7d7d;
      }
    }
    i.icon-cls {
      width: 22px;
      flex: 0 0 22px;
      height: 22px;
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
