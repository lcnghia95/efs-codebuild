<template>
  <a :href="'/finance/videos/' + data.id" class="video-item flex layout-col space-between">
    <div class="img-wrapp">
      <slot>
        <img :src="data.thumbnailUrl || getThumbnailYoutube(data.watchUrl)" alt="" />
      </slot>
    </div>
    <div class="video-item-detail">
      <div class="video-item-name wrap-text" v-wrap-lines="2" :title="data.title">{{ data.title }}</div>
      <div v-wrap-lines="2" class="fs-12 video-item-content mt-5">{{ data.content }}</div>
      <div class="wrap-text mt-5">{{ data.watchUrl }}</div>
    </div>
  </a>
</template>

<script>
import i18n from '@@/lang/components-desktop/salon-horizontal01.json'
import { getThumbnailYoutube } from '@/utils/client/common'
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
    getThumbnailYoutube,
  },
}
</script>

<style lang="scss" scoped>
.video-item {
  position: relative;
  width: calc(100vw - 20px);
  height: 300px;
  text-decoration: none;
  &:hover {
    opacity: 0.85;
  }
  .img-wrapp {
    width: 100%;
    min-height: 100px;
    background: #fbf8f6;
    img {
      width: 100%;
      height: auto;
    }
    .new-icon {
      top: 0;
      right: 0;
    }
  }
  .video-item-detail {
    background-color: #f3f0ee;
    color: #666;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 10px 15px;
    opacity: 0.9;
    &::after {
      position: absolute;
      height: 20px;
      width: 20px;
      bottom: 0;
      right: 0;
    }
    .video-item-name {
      height: 40px;
      line-height: 19px;
      font-size: 17px;
      font-weight: bold;
    }
    .video-item-content {
      height: 40px;
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
