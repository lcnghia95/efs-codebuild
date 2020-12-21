<template>
  <div class="flex layout-col mt-20 b-bot">
    <div class="flex a-row" v-if="data.currencyPairs">
      <div class="left-outline">{{ $t('1') }}</div>
      <div class="ml-20 flex flex-wrap">
        <span v-for="(p,i) in (data.currencyPairs || '').split(',')" class="mr-5" :key="'pair-' + i">
          [{{ $t('pairs.' + p) }}]
        </span>
      </div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('2') }}</div>
      <div class="ml-20 flex flex-wrap">
        <span v-for="(s,i) in (data.tradingStyles || '').split(',')" v-if="localize('trading-styles.' + s)" class="mr-5" :key="'trading-styles-' + i">
          [{{ localize('trading-styles.' + s) }}]
        </span>
        <span v-for="(s,i) in (data.tradingTypes || '').split(',')" v-if="localize('trading-types.' + s)" class="mr-5" :key="'trading-types-' + i">
          [{{ localize('trading-types.' + s) }}]
        </span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('3') }}</div>
      <div class="ml-20">
        <span>{{ data.maxPositionsOther ? data.maxPositions : (data.maxPositions || '-') }}</span>
        <span class="ml-10" v-if="data.maxPositionsOther">{{ $t('13') }}:&nbsp;{{ data.maxPositionsOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('4') }}</div>
      <div class="ml-20">{{ $t('o' + (data.operativeType || 0)) }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('5') }}</div>
      <div class="ml-20">
        <span>{{ data.maxLotsOther ? data.maxLots : (data.maxLots || '-') }}</span>
        <span class="ml-10" v-if="data.maxLotsOther">{{ $t('13') }}:&nbsp;{{ data.maxLotsOther }}</span>
      </div>
    </div>
    <div class="flex a-row" v-if="data.period">
      <div class="left-outline">{{ $t('6') }}</div>
      <div class="ml-20">{{ periods[data.period] }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('7') }}</div>
      <div class="ml-20">
        <span>{{ data.maxStopLossOther ? data.maxStopLoss : (data.maxStopLoss || '-') }}</span>
        <span class="ml-10" v-if="data.maxStopLossOther">{{ $t('13') }}:&nbsp;{{ data.maxStopLossOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('8') }}</div>
      <div class="ml-20">
        <span>{{ data.maxTakeProfitOther ? data.maxTakeProfit : (data.maxTakeProfit || '-') }}</span>
        <span class="ml-10" v-if="data.maxTakeProfitOther">{{ $t('13') }}:&nbsp;{{ data.maxTakeProfitOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('9') }}</div>
      <div class="ml-20">{{ $t('t' + (data.isHedge || 0)) }}</div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('10') }}</div>
      <div class="ml-20">{{ data.isSignalOnly ? $t('s1') : $t('s0') }}</div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('11') }}</div>
      <div class="ml-20">{{ $t('t' + (data.isUsingExternalFiles || 0)) }}</div>
    </div>
    <div class="flex a-row" v-if="data.specialInstructions">
      <div class="left-outline">{{ $t('12') }}</div>
      <div class="ml-20">{{ data.specialInstructions == 0 ? $t('t0') : data.specialInstructions }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/system-outline.json'
import getLocalize from '@@/../common/js/getLocalize'
const periods = {
  1: 'M1',
  10080: 'W1',
  1440: 'D1',
  15: 'M15',
  240: 'H4',
  30: 'M30',
  5: 'M5',
  60: 'H1',
}
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
  data() {
    return {
      periods,
    }
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
