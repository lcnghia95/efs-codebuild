<template>
  <div class="flex space-between dev-bid bg-white" :style="{opacity: isCanceled ? '.5' : 1}">
    <div class="flex layout-col space-between dev-info">
      <a class="dev-name" :href="`/users/${(item.user || {}).id}`">
        {{ (item.user || {}).name }}
      </a>
      <div v-if="item.price">
        <span class="mr-5">{{ $t(1) }}</span>
        <span class="bid-num">{{ formatNumber(item.price) }}</span>
        <b>円</b>
      </div>
    </div>
    <template v-if="!isCanceled">
      <div 
        class="type flex mid"
        :style="{ background: '#d9d9d9' }"
        v-if="isSelected"
        v-html="$t(3)"
      ></div>
      <!-- <div
        class="type flex mid"
        v-else
        v-html="$t(2)"
      ></div> -->
    </template>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowd-dev-bid.json'
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    item: {
      type: Object,
      default() { return {} }
    },
    isCanceled: {
      type: [Boolean, Object],
      default: null,
      validate(val) { 
        return [true, false, null].includes(val)
      }
    },
    isSelected: {
      type: [Boolean, Object],
      default: null,
      validate(val) { 
        return [true, false, null].includes(val)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 380px) {
  .dev-bid {
    .type {
      width: 87px !important;
      font-size: 11px !important;
    }
    .dev-info {
      font-size: 13px !important;
    }
    .bid-num {
      font-size: 18px !important;
    }
  }
}
.dev-bid {
  border: 1px solid #2d2d2d;
  border-radius: 5px;
  padding: 10px;
  .type {
    width: 130px;
    background: #8fc31f;
    color: #fff;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-size: 17px;
  }
  .bid-num {
    font-size: 26px;
  }
  .dev-info {
    color: #707070;
  }
  .dev-name {
    color: #0066c0;
  }
}
</style>