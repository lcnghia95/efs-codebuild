<template>
  <Panel :title="$t('1')">
    <div class="flex layout-col criterial">
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('2') }}</div>
        <div class="w50p content">{{ formatCurrency(data.profitTotal) }}</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('3') }}</div>
        <div class="w50p content">{{ formatNumber(data.profitRate, data.profitRate, 2) }}%</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('4') }}</div>
        <div class="w50p content">{{ formatNumber(data.maxDD, data.maxDD, 2) }}%</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('5') }}</div>
        <div class="w50p content">{{ data.maxContractsHeld }}</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('6') }}</div>
        <div class="w50p content">{{ formatNumber(data.winRate, data.winRate, 2) }}%</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('7') }}</div>
        <div class="w50p content">{{ formatPF(data.profitFactor) }}</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('8') }}</div>
        <div class="w50p content">{{ data.riskReturn }}</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('9') }}</div>
        <div class="w50p content">{{ formatNumber(parseInt(data.totalProfitPips, '-')) }}pips</div>
      </div>
      <div class="flex mid p-5">
        <div class="w50p title">{{ $t('10') }}</div>
        <div class="w50p content">{{ formatCurrency(data.expectedProfit, data.currency) }}</div>
      </div>
    </div>
  </Panel>
</template>
<script>
import i18n from '@@/lang/components-mobile/system-stock-criterial.json'
import Panel from '@/components/Panel.vue'
import { formatPF } from '@/utils/client/common'
export default {
  props: {
    data: Object,
  },
  components: {
    Panel,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    formatPF,
  },
}
</script>
<style lang="scss" scoped>
.criterial {
  > div {
    padding: 2.5vw 0;
    font-size: 3.5vw;
    &:nth-child(even) {
      background: #eee;
      border-radius: 5px;
    }
  }
  .w50p {
    width: 50%;
    flex: 0 0 50%;
    padding-left: 3vw;
  }
  .title {
    color: #a0a0a0;
  }
  .content {
    color: #434343;
  }
}
</style>
