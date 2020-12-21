<template>
  <a :href="data.isMagazine ? `/finance/mailmagazine/${data.isMagazine}` : (!isNavi ? `/finance/salons/${data.id}` : `/finance/navi/series/${data.id}`)" class="sal-h01__i flex layout-col">
    <div class="img-wrapp pos-rel">
      <img :src="data.img" alt="" class="pos-abs" />
      <img src="/img/assets/pc/common/new.png" alt="" class="new-icon pos-abs" v-if="data.createdDate > time7day" />
    </div>
    <div class="sal-h01__detail">
      <div v-wrap-lines="2" class="sal-h01__name" :title="data.name">{{ data.name }}</div>
      <div class="sal-h01__company wrap-text fs-12" :title="data.company">{{ data.company }}</div>
      <div class="flex">
        <price :price="data.price" class="sal-h01__price fs-12" />
        <span class="fs-12 ml-10">({{ $t('3') }})</span>
        <span class="fs-12 ml-15">({{ $t('4') }})</span>
      </div>
    </div>
  </a>
</template>

<script>
import i18n from '@@/lang/components-desktop/salon-horizontal01.json'
import Price from '@@/../components/prices/Price.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Price,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    isNavi: {
      type: Boolean,
      default: false
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
.sal-h01__i {
  width: 320px;
  text-decoration: none;
  &:hover {
    opacity: 0.85;
  }
  .img-wrapp {
    width: 320px;
    height: 130px;
    background: #fbf8f6;
    img {
      height: auto;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .new-icon {
      top: 0;
      right: 0;
    }
  }
  .sal-h01__detail {
    background-color: #f3f0ee;
    color: #666;
    padding: 8px 13px;
    .sal-h01__name {
      height: 40px;
      line-height: 19px;
    }
    .sal-h01__company {
      height: 20px;
      line-height: 19px;
    }
    .sal-h01__price {
      flex: 0 0 auto;
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
