<template>
  <div class="flex layout-col mt-20 b-bot">
    <div class="flex a-row">
      <div class="left-outline">{{ $t('1') }}</div>
      <div class="ml-20 flex flex-wrap right-outline" v-if="data.tradingStyles">
        <span v-for="(s,i) in (data.tradingStyles || '').split(',')" v-if="localize('trading-styles.' + s)" class="mr-5" :key="'trading-styles-' + i">
          [{{ $t('trading-styles.' + s) }}]
        </span>
        <span v-for="(s,i) in (data.tradingTypes || '').split(',')" v-if="localize('trading-types.' + s)" class="mr-5" :key="'trading-types-' + i">
          [{{ $t('trading-types.' + s) }}]
        </span>
      </div>
      <span class="ml-20" v-else>-</span>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('2') }}</div>
      <div class="ml-20 right-outline">{{ formatNumber(data.initialDeposit, '1,000') }}{{ $t('4') }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('3') }}</div>
      <div class="ml-20 right-outline">{{ data.symbolName || '-' }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/system-stocks-outline.json'
import getLocalize from '@@/../common/js/getLocalize'
export default {
  mixins: [getLocalize],
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
.b-bot {
  border-bottom: 1px solid #e8e4e2;
}
.a-row {
  border-bottom: 1px dotted #e8e5e3;
  padding: 2vw 5vw;
}
.left-outline {
  width: 40%;
  flex: 0 0 40%;
  color: #a0a0a0;
}
.right-outline {
  color: #434343;
}
</style>
