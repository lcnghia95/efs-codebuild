<template>
  <div class="flex layout-col mt-20 b-bot">
    <div class="flex a-row">
      <div class="left-outline">{{ $t('1') }}</div>
      <div class="ml-20 flex flex-wrap" v-if="data.tradingStyles">
        <span v-for="(s,i) in (data.tradingStyles || '').split(',')" v-if="localize('trading-styles.' + s)" class="mr-5" :key="'trading-styles-' + i">
          [{{ localize('trading-styles.' + s) }}]
        </span>
        <span v-for="(s,i) in (data.tradingTypes || '').split(',')" v-if="localize('trading-types.' + s)" class="mr-5" :key="'trading-types-' + i">
          [{{ localize('trading-types.' + s) }}]
        </span>
      </div>
      <span class="ml-20" v-else>-</span>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('2') }}</div>
      <div class="ml-20">{{ formatNumber(data.initialDeposit, '1,000') }}{{ $t('4') }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('3') }}</div>
      <div class="ml-20">{{ data.symbolName || '-' }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/system-stocks-outline.json'
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
.system-outline {
  color: #666;
  .b-bot {
    border-bottom: 1px solid #e8e4e2;
  }
  .a-row {
    border-top: 1px solid #e8e4e2;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .left-outline {
    width: 200px;
    flex: 0 0 200px;
    border-right: dotted 2px #e8e4e2;
  }
}
</style>
