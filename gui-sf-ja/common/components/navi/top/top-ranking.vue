<template>
  <div class="top-ranking flex layout-col">
    <div class="top-ranking-item flex pt-10" v-for="(item, index) in items" :key="index">
      <span class="number-rank flex mid">{{ ++index }}</span>
      <div class="flex item grow0 w-full">
        <a :href="`/finance/navi/${isSeries ? 'series' : 'articles'}/${item.id}`">
          <Lzimg :data-src="`/img/${isSeries ? 'products' : 'articles'}/${isSeries ? item.productId : item.id}/small`" alt="" />
        </a>
        <div class="top-author-name flex layout-col pl-10 pr-5 w-full">
          <a :href="`/finance/navi/${isSeries ? 'series' : 'articles'}/${item.id}`" class="top-item-title no-underlying"
              v-wrap-lines="2" :title="item.title">{{ item.title }}</a>
          <span class="flex mid">
            <author-icon class="mr-5" />
            <a :href="`/finance/navi/authors/${item.user.id}`" class="no-underlying" v-wrap-lines="1"
                :title="item.user.name">{{ item.user.name }}</a>
          </span>
          <!--    Free article    -->
          <span v-if="!item.isPaidContent && !item.isPurchased" class="free-plan">{{ $t(1) }}</span>
          <!--    Having price, not yet paid    -->
          <template v-if="item.isPaidContent || item.isPurchased">
            <div class="top-item-author-price inline-flex mt-5" v-if="!item.isPurchased">
              <strong class="item-price" v-if="item.price">\{{ formatNumber(item.price) }}{{ isSeries ? '/月' : '' }}</strong>
              <strong v-if="item.seriesPrice">&nbsp;(\{{ formatNumber(item.seriesPrice) }}/月)</strong>
            </div>
            <!--     Bought     -->
            <span v-else class="purchased">
              {{ $t(2) }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorIcon from './author-icon'
import i18n from '@@/lang/components-desktop/navi-horizontal06.json'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  name: 'top-ranking',
  i18n: {
    messages: i18n,
  },
  components: { AuthorIcon, Lzimg },
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    isSeries: {
      type: Boolean,
      default() {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.top-ranking {
  width: 335px;
  .top-ranking-item {
    height: 95px;
    &:hover {
      background-color: #f1f1f1;
    }
    .inline-flex:hover {
      text-decoration: none;
    }
    .number-rank {
      padding: 0 12px 20px;
      font-size: 12px;
      text-align: right;
      ~ div + div {
        border-top: 1px solid #d6d6d6;
      }
    }
    img {
      width: 60px;
      height: 60px;
    }
    .item {
      padding-bottom: 10px;
      border-bottom: 1px solid #d6d6d6;
    }
  }
  .top-item-author-price {
    color: red;
    font-size: 12px;
    align-self: flex-end;
  }
  .top-author-name {
    .top-item-title {
      $line: 17px;
      max-height: $line *2;
      line-height: 17px;
      color: #2d2d2d;
      font-size: $line - 3;
      font-weight: 600;
      overflow: hidden;
    }
    svg {
      height: 18px;
      ~ a {
        font-size: 12px;
        color: #2d2d2d;
      }
    }
  }
  .free-plan, .purchased {
    align-self: flex-end;
    font-size: 12px;
    line-height: 22px;
    width: 42px;
    border-radius: 4px;
    color: #888888;
    border: 1px solid #888;
    text-align: center;
  }
}
</style>
