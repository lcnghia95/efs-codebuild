<template>
  <div class="c-prod-l flex layout-col">
    <div v-if="isRanking === true">
      <item v-for="(item, i) in data" :data="item" :rank="startIdx + i + 1" :type="type" :key="item.id" class="t-i" :class="((startIdx + i + 1) < 4 ? ' t-i--' + i : '')" :style="`order: ${i}`" />
    </div>
    <div v-else>
      <item v-for="(item, i) in data" :data="item" :type="type" :key="item.id" class="t-i u-newproduct" :style="`order: ${i}`" />
    </div>
    <slot name="banner"></slot>
  </div>
</template>
<script>
import Item from '@/components/product/item/Item.vue'
/**
 * The Product Rank Horizontal for mobile.
 */
export default {
  props: {
    isRanking: {
      type: Boolean,
      default: true,
    },
    data: Array,
    rtRanking: {
      type: Array,
      default: () => []
    },
    startIdx: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'profit',
    }
  },
  components: {
    Item,
  },
}
</script>
<style lang="scss" scoped>
$color_def: #f5f2f0;
$color_0: #f1e5b3;
$color_1: #dadada;
$color_2: #eed5bd;
.c-banner {
  height: auto;
  margin-bottom: 2vw;
}
.c-prod-l {
  margin-bottom: 1vw;
}
.c-header {
  margin: 4vw 0 7vw;
  font-weight: bold;
}
.o-tit {
  color: #fff;
  background: #f19149;
  font-size: 8vw;
  width: 16vw;
  height: 16vw;
  border-radius: 50%;
}
.o-subtit {
  font-size: 3.5vw;
  color: #707070;
  margin-top: 2vw;
}
/deep/ .box-wrapp {
  border-radius: 1vw;
  background: #fff;
  &::before {
    content: '';
    position: absolute;
    top: 35%;
    left: -0.5%;
    width: 3vw;
    height: 6vw;
    background: $color_def;
    border-bottom-right-radius: 6vw;
    border-top-right-radius: 6vw;
  }
  &::after {
    content: '';
    position: absolute;
    top: 44%;
    left: -1px;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent transparent transparent white;
    border-width: 1vw 0 1vw 1.5vw;
  }
  a {
    text-decoration: none;
  }
  .o-prod__number {
    width: 18vw;
    font-size: 11vw;
    color: $color_def;
    font-weight: bold;
    letter-spacing: -3px;
    border-right: 0.5vw dashed $color_def;
    padding: 0 1vw 0 2.5vw;
    box-sizing: content-box;
  }
  .o-prod__info {
    width: 32vw;
    margin: 2vw 0 2vw 2.5vw;
    .o-prod__name {
      color: #a0a0a0;
      font-size: 2.8vw;
      display: block;
    }
  }
  .o-prod__info02 {
    width: 9vw;
    margin: 3vw 2vw 3vw 1vw;
  }
  .o-prod__rr {
    color: #a0a0a0;
    font-weight: bold;
    font-size: 2.8vw;
  }
  .o-prod__prices {
    .price-cls {
      flex-direction: row;
    }
  }
  .o-prod__cat {
    width: 100%;
    height: 3vw;
    line-height: 3.5vw;
    border-radius: 0.5vw;
    color: white;
  }
  .o-prod__img {
    width: 9vw;
    height: 9vw;
  }
  .o-prod__chart {
    width: 16vw;
    height: 16vw;
    margin: 3vw 3vw 3vw 0;
  }
  .price-cls {
    font-size: 2.8vw;
    strong {
      margin-right: 5px;
    }
  }
  .gg-rating {
    font-size: 3.2vw;
    letter-spacing: -1px;
    margin-top: -1px;
    align-items: center;
    .rate-num {
      font-size: 2.6vw;
      color: #434343;
      margin-left: 3px;
      letter-spacing: 0;
    }
  }
}
/deep/ .t-i {
  background: $color_def;
  padding: 2.2vw;
  margin-bottom: 2vw;
  &--0 {
    background: $color_0;
    .box-wrapp::before {
      background: $color_0;
    }
    .o-prod__number {
      color: $color_0;
      border-right: 0.5vw dashed $color_0;
    }
  }
  &--1 {
    background: $color_1;
    .box-wrapp::before {
      background: $color_1;
    }
    .o-prod__number {
      color: $color_1;
      border-right: 0.5vw dashed $color_1;
    }
  }
  &--2 {
    background: $color_2;
    .box-wrapp::before {
      background: $color_2;
    }
    .o-prod__number {
      color: $color_2;
      border-right: 0.5vw dashed $color_2;
    }
  }
}
.u-newproduct /deep/ {
  background: #d9d9d9;
  .box-wrapp::before {
    background: #d9d9d9;
  }
  .o-prod__info {
    flex: 1 0 auto;
    margin: 3vw 0 2vw 5vw;
  }
}
@media only screen and (min-width: 600px) {
  /deep/ .t-i {
    padding: 1.5vw;
    margin-bottom: 1.5vw;
  }
  /deep/ .box-wrapp {
    &::before {
      top: 34%;
    }
    &::after {
      top: 44%;
    }
    .o-prod__number {
      width: 14vw;
      font-size: 8vw;
    }
    .o-prod__info {
      width: 37vw;
      margin: 2vw 0 2vw 1.5vw;
      .o-prod__name,
      .price-cls,
      .o-prod__rr {
        font-size: 2.2vw;
      }
      &02 {
        width: 8vw;
        margin: 2vw 1vw 2vw 1vw;
      }
    }
    .o-prod__chart {
      width: 13vw;
      height: 13vw;
      margin: 2vw 2vw 2vw 0;
    }
    .gg-rating {
      font-size: 2.5vw;
      .rate-num {
        font-size: 2vw;
      }
    }
    .o-prod__img {
      width: 8vw;
      height: 8vw;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <product-rank-horizontal :data="data">
      <span slot="tit" class="o-tit flex layout-col-mid">株</span>
      <!-- <bitcoin slot="tit" class="o-tit flex layout-col-mid"/> -->
      <span slot="subtit" class="o-subtit">株 収益率ランキング（3ヶ月）</span>
      <img :src="banner" slot="banner" class="c-banner w-full u-order-2">
    </product-rank-horizontal>
  </template>
  <script>
    export default {
      data() {
        return {
          data: [
            {
              "id": 2854,
              "name": "2356M15_AUDJPYM15_AUDJPY",
              "category": 18,
              "returnRate": 231,
              "prices": {
                "price": 1426,
                "discountPrice": 3274
              },
              "review": {
                "stars": 1,
                "count": 1418
              },
              "chart": "0,0,0,0,0,0,0,-50100,-50100,-50100,305700,305700,282400,282400,280000,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,186200,2200,2200,2200,22700,-30200,-60100,-125200,259900,259900,260300,7900,-155800,-226400,-298800,-298800,-326000,-399900,-399900,-399900,-399900,-399900,-460700,-460700,-460700,-460700,-460700,-460700,-460700,-460700,-459500,-482600,-482600,-482600,-482600,-482600,-482600,-483800,-573400,-573400,-573400,-573400,-595200,-595200,-595200,-595200,-680800,-687200,-687200,-687200,-687200,-687200",
              "detailUrl": "/systemtrade/fx/1877"
            },
            {
              "id": 3708,
              "name": "4701M15_AUDJPYM15_AUDJPY",
              "category": 3,
              "returnRate": 351,
              "prices": {
                "price": 2641,
                "discountPrice": 3876
              },
              "review": {
                "stars": 4,
                "count": 1872
              },
              "chart": "0,0,0,0,0,0,0,-50100,-50100,-50100,305700,305700,282400,282400,280000,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,183400,186200,2200,2200,2200,22700,-30200,-60100,-125200,259900,259900,260300,7900,-155800,-226400,-298800,-298800,-326000,-399900,-399900,-399900,-399900,-399900,-460700,-460700,-460700,-460700,-460700,-460700,-460700,-460700,-459500,-482600,-482600,-482600,-482600,-482600,-482600,-483800,-573400,-573400,-573400,-573400,-595200,-595200,-595200,-595200,-680800,-687200,-687200,-687200,-687200,-687200",
              "detailUrl": "/systemtrade/fx/3760"
            }
          ],
          banner: 'https://via.placeholder.com/350x100'
        }
      }
    }
  </script>
  ```
</docs>
