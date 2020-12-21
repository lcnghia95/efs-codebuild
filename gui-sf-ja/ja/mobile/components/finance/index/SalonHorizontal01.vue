<template>
  <a :href="cateType.url" class="salon-item flex layout-col">
    <div class="salon-type text-center" :style="{ background: cateType.background }">{{ cateType.name }}</div>
    <div class="img-wrapp">
      <slot>
        <img :src="data.img" alt="" />
      </slot>
    </div>
    <div class="salon-item-detail">
      <div v-wrap-lines="2" class="salon-item-name" :title="data.name">{{ data.name }}</div>
      <div class="salon-item-company wrap-text fs-12" :title="data.company">{{ data.company }}</div>
      <div class="flex">
        <price :price="data.price" class="salon-item-price fs-12" />
        <span class="fs-12 ml-10">({{ $t('3') }})</span>
        <span class="fs-12 ml-15">({{ $t('4') }})</span>
      </div>
    </div>
  </a>
</template>

<script>
import i18n from '@@/lang/components-mobile/salon-horizontal01.json'
import Price from '@@/../components/prices/Price.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Price,
  },
  computed: {
    cateType() {
      if(this.data.isMagazine) { // non-ad 
        return {
          name: this.$t(2),
          background: 'linear-gradient(-90deg,#be0537,#7d0022,#be0538)', // red
          url: `/finance/mailmagazine/${this.data.isMagazine}`,
        }
      }
      if(this.data.categoryId == 2) { // non-ad 
        return {
          name: this.$t(2),
          background: 'linear-gradient(-90deg,#be0537,#7d0022,#be0538)', // red
          url: `/finance/salons/${this.data.id}`,
        }
      }
      if(!this.data.categoryId) { // data school 
        let id =this.data.id == 16211 ? 1072 : 1065 // TODO: product id to series id
        return {
          name: this.$t(5),
          background: 'linear-gradient(-90deg,#2c99ec,#0068b7,#2c99ec)', // blue 
          url: `/finance/navi/series/${id}`,
        }
      }
      return { // ad
        name: this.$t(1),
        background: 'linear-gradient(-90deg,#c29964,#9b7543,#c29964)', // yellow
          url: `/finance/salons/${this.data.id}`,
      }
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      time7day: moment()
        .subtract(7, 'day')
        .unix(),
    }
  },
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 320px) {
  .salon-item {
    height: 255px !important;
  }
}
.salon-type {
  height: 35px;
  background: #b28a57;
  color: #fff;
  line-height: 35px;
}
.salon-item {
  position: relative;
  width: calc(100vw - 20px);
  height: 280px;
  text-decoration: none;
  &:hover {
    opacity: 0.85;
  }
  .img-wrapp {
    width: 100%;
    min-height: 60px;
    background: #fbf8f6;
    img {
      width: 100%;
      height: auto;
    }
  }
  .salon-item-detail {
    background-color: #f3f0ee;
    color: #666;
    padding: 10px 15px;
    position: absolute;
    bottom: 0;
    width: 100%;
    opacity: 0.9;
    &::after {
      position: absolute;
      height: 20px;
      width: 20px;
      bottom: 0;
      right: 0;
    }
    .salon-item-name {
      height: 40px;
      line-height: 19px;
      font-size: 15px;
      font-weight: bold;
    }
    .salon-item-company {
      height: 20px;
      line-height: 19px;
      font-size: 15px;
    }
    .salon-item-price {
      flex: 0 0 auto;
      font-size: 15px;
      /deep/ .co-red {
        font-weight: normal;
        color: #666;
        margin-left: 0;
      }
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <div class="flex flex-wrap space-between">
      <salon-horizontal01 :data="data" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          data:
          {
            "id": 7650,
            "name": "TAKIZAWAシカゴ・レター/今日の視点・明日の視",
            "description": "現役トレーダーの志摩力男現在もファンド筋などとの交流は活発で鋭く世界を分析",
            "salonId": 3,
            "categoryId": 1,
            "prices": [
              {
                "price": 4500
              }
            ],
            "user": {
              "id": 111941,
              "name": "志摩力男"
            },
            "registrationNumber": "株式会社ゴゴジャン関東財務局(金商）第1960号",
            "createdDate": 1434423651,
            "updatedDate": 1470220164
          }
        }
      }

    }
  </script>
  ```
</docs>
