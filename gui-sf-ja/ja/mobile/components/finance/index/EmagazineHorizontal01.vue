<template>
  <a :href="'/finance/mailmagazine/' + data.salonId + '/' + data.id" class="emagazine-item-i flex layout-col space-between">
    <div class="emagazine-item-detail">
      <div class="emagazine-item-name wrap-text" :title="data.title">{{ data.title }}</div>
      <div class="mt-5 mb-10">{{ formatTime(data.publishedAt, 6) }}</div>
      <div v-wrap-lines="3" style="height: 60px; overflow: hidden;">
        {{ tagRemoved(data.content) }}
      </div>
    </div>
  </a>
</template>

<script>
import { tagRemoved } from '@/utils/client/common'
import i18n from '@@/lang/components-desktop/salon-horizontal01.json'
export default {
  i18n: {
    messages: i18n,
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
  methods: {
    tagRemoved,
  }
}
</script>

<style lang="scss" scoped>
.emagazine-item-i {
  position: relative;
  width: 100%;
  height: 140px;
  text-decoration: none;
  &:hover {
    opacity: 0.85;
  }
  .emagazine-item-detail {
    background-color: #f3f0ee;
    color: #666;
    padding: 10px 15px;
    height: 100%;
    &::after {
      position: absolute;
      height: 20px;
      width: 20px;
      bottom: 0;
      right: 0;
    }
    .emagazine-item-name {
      font-weight: bold;
      height: 20px;
      line-height: 19px;
      font-size: 15px;
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
