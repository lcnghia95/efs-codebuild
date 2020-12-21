<template>
  <div class="flex layout-col mt-20 b-bot">
    <div class="flex mid a-row" v-if="data.currencyPairs">
      <div class="left-outline">{{ $t('1') }}</div>
      <div class="ml-20 flex flex-wrap right-outline">
        <span v-for="(p,i) in (data.currencyPairs || '').split(',')" class="mr-5" :key="'pair-' + i">
          [{{ $t('pairs.' + p) }}]
        </span>
      </div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('2') }}</div>
      <div class="ml-20 flex flex-wrap right-outline">
        <span v-for="(s,i) in (data.tradingStyles || '').split(',')" v-if="localize('trading-styles.' + s)" class="mr-5" :key="'trading-styles-' + i">
          [{{ $t('trading-styles.' + s) }}]
        </span>
        <span v-for="(s,i) in (data.tradingTypes || '').split(',')" v-if="localize('trading-types.' + s)" class="mr-5" :key="'trading-types-' + i">
          [{{ $t('trading-types.' + s) }}]
        </span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('3') }}</div>
      <div class="ml-20 right-outline">
        <span>{{ data.maxPositionsOther ? data.maxPositions : (data.maxPositions || '-') }}</span>
        <span class="ml-10" v-if="data.maxPositionsOther">{{ $t('13') }}:&nbsp;{{ data.maxPositionsOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('4') }}</div>
      <div class="ml-20 right-outline">{{ $t('o' + data.operativeType || 0) }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('5') }}</div>
      <div class="ml-20 right-outline">
        <span>{{ data.maxLotsOther ? data.maxLots : (data.maxLots || '-') }}</span>
        <span class="ml-10" v-if="data.maxLotsOther">{{ $t('13') }}:{{ data.maxLotsOther }}</span>
      </div>
    </div>
    <div class="flex a-row" v-if="data.period">
      <div class="left-outline">{{ $t('6') }}</div>
      <div class="ml-20 right-outline">{{ periods[data.period] }}</div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('7') }}</div>
      <div class="ml-20 right-outline">
        <span>{{ data.maxStopLossOther ? data.maxStopLoss : (data.maxStopLoss || '-') }}</span>
        <span class="ml-10" v-if="data.maxStopLossOther">{{ $t('13') }}:{{ data.maxStopLossOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('8') }}</div>
      <div class="ml-20 right-outline">
        <span>{{ data.maxTakeProfitOther ? data.maxTakeProfit : (data.maxTakeProfit || '-') }}</span>
        <span class="ml-10" v-if="data.maxTakeProfitOther">{{ $t('13') }}:{{ data.maxTakeProfitOther }}</span>
      </div>
    </div>
    <div class="flex a-row">
      <div class="left-outline">{{ $t('9') }}</div>
      <div class="ml-20 right-outline">{{ $t('t' + (data.isHedge || 0)) }}</div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('10') }}</div>
      <div class="ml-20 right-outline">{{ data.isSignalOnly ? $t('s1') : $t('s0') }}</div>
    </div>
    <div class="flex a-row" v-if="data.tradingStyles">
      <div class="left-outline">{{ $t('11') }}</div>
      <div class="ml-20 right-outline">{{ $t('t' + (data.isUsingExternalFiles || 0)) }}</div>
    </div>
    <div class="flex a-row" v-if="data.specialInstructions">
      <div class="left-outline">{{ $t('12') }}</div>
      <div class="ml-20 right-outline">{{ data.specialInstructions == 0 ? $t('t0') : data.specialInstructions }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/system-outline.json'
import getLocalize from '@@/../common/js/getLocalize'
import periods from '@@/../common/commondata/periods.js'

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
