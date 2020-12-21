<template>
  <div class="navi-h06__i flex w-full pt-10 pb-10">
    <a :href="detailUrl" :title="item.title">
      <ImgWrapper :src="imgUrl" />
    </a>
    <div class="navi-h06__info flex layout-col ml-10">
      <a :href="detailUrl" :title="item.title" class="navi-h06__tit fs-12">
        <span v-wrap-lines="2"><b>{{ item.title }}</b></span>
      </a>
      <a :href="'/finance/navi/authors/' + (item.user || {}).id" class="flex fs-12">
        <Edit />
        <span :title="(item.user || {}).name" class="wrap-text name">{{ (item.user || {}).name }}</span>
      </a>
      <a :href="detailUrl" class="flex price-content">
        <template v-if="!item.isPaidContent && !item.isPurchased">
          <div class="status text-center">{{ $t('1') }}</div>
        </template>
        <template v-if="item.isPaidContent || item.isPurchased">
          <template v-if="item.isPurchased">
            <div class="status text-center deactive">{{ $t('2') }}</div>
          </template>
          <template v-else>
            <div v-if="item.price" class="flex mid">
              <Price v-if="item.articlePrice" class="price-VVvUC" :price="item.articlePrice" :old-price="null" />
              <div class="inline-flex series-price" v-if="item.seriesPrice">
                <template v-if="item.articlePrice">&nbsp;(</template><Price v-if="item.seriesPrice" class="price-VVvUC" :price="item.discountPrice||item.seriesPrice" :old-price="item.discountPrice ? item.seriesPrice: null" />
                <span class="co-red">&nbsp;/ <b>{{ $t('3') }}</b></span><template v-if="item.articlePrice">)</template>
              </div>
              <!--series price-->
              <template v-if="type === 1 && item.price">
                <Price v-if="item.price" class="price-VVvUC" :price="item.discountPrice || item.price" :old-price="item.discountPrice ? item.price : null" />
              </template>
            </div>
          </template>
        </template>
      </a>
    </div>
  </div>
</template>

<script>
import Edit from '@@/../components/icons/Edit.vue'
import Price from '@@/../components/prices/Price.vue'
import i18n from '@@/lang/components-desktop/navi-horizontal06.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import { getNaviImg } from '@@/../common/js/finance/utils'
/**
 * The NaviHorizontal06.
 */
export default {
  props: {
    /**
     * The NaviHorizontal06 item.
     */
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    type: Number,
  },
  i18n: {
    messages: i18n,
  },
  components: {
    Edit,
    Price,
    ImgWrapper,
  },
  computed: {
    detailUrl() {
      return `/finance/navi/${
        this.type ? "series/" : 'articles/'
      }${this.item.id}`
    },
    imgUrl() {
      let type = this.type ? 'products' : 'articles',
        id = this.type ? this.item.productId : this.item.id
      if (this.item.image) {
        return getNaviImg(this.item, type)
      }
      return `/img/${type}/${id}/small`
    },
  },
  methods: { getNaviImg },
}
</script>

<style lang="scss" scoped>
.navi-h06__i {
  border-bottom: 1px solid #ddd;
  height: 85px;
  .series-price {
    color: red;
    /deep/ .price-cls .co-red {
      margin: 0 !important;
    }
  }
  .img-wrapp {
    width: 78px;
    height: 60px;
  }
  .navi-h06__info {
    width: 130px;
    a {
      color: #2d2d2d;
      line-height: 16px;
      text-decoration: none;
    }
    .navi-h06__tit {
      max-height: 32px;
      overflow: hidden;
    }
    .icon-cls {
      flex: 0 0 15px;
      width: 15px;
      height: 15px;
    }
    .name {
      line-height: 16px;
    }
  }
  &:hover {
    background: #f5f5f5;
    .img-wrapp {
      opacity: 0.85;
    }
  }
  .navi-h06__tit:hover,
  .name:hover {
    text-decoration: underline;
  }
}
.price-VVvUC /deep/ {
  justify-content: flex-end;
  font-size: 11px;
  font-weight: normal;
}
.co-red {
  font-size: 11px;
  color: red;
}
.status {
  height: 16px;
  font-size: 10px;
  color: #a7a7a7;
  line-height: 16px;
  border: 1px solid #a7a7a7;
  border-radius: 3px;
  padding: 0 5px;
}
.price-content {
  justify-content: flex-end;
}
.deactive {
  background: #c3c3c3;
  color: white;
  border: none;
}
.monthly {
  color: red;
  flex: 0 0 30px;
  font-size: 11px;
}
</style>

<docs>
  ```vue
  <template>
    <div style="width: 300px; padding: 10px 0;">
      <navi-horizontal06 :item="item" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "id": 2962,
          "title": "BTCUSDが5000USD超えたので、次の動きを考えてみた...",
          "user": {
            "name": "トレスト"
          }
        }
      }
    },
  }
  </script>
  ```
</docs>
