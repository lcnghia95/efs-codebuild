<template>
  <div class="accept-item">
    <div class="title">{{ item.title }}</div>
    <div class="flex item-row">
      <div class="row-label">{{ $t(1) }}:</div>
      <div>{{ item.template }}</div>
    </div>
    <div class="flex">
      <div>{{ $t(2) }}:</div>
      <div>{{ item.period }}{{ $t(3) }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/scrowdsourcing-dev-accept.json'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    item: {
      type: Object,
      default() { return {} }
    }
  }
}
</script>

<style lang="scss" scoped>
.accept-item {
  min-height: 80px;
  border-bottom: 1px solid #e0dedc;
  padding: 10px 15px;
  .title {
    font-size: 15px;
    color: #2d2d2d;
    font-weight: bold;
  }
  .item-row {
    .row-label {
      flex-shrink: 0;
      min-width: 85px;
    }
  }
}
</style>