<template>
  <section>
    <Header :detail="detail" :goCommunity="goCommunity"/>
    <div class="flex space-between criterial mt-20">
      <div class="w50p">
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('1') }}</div>:
          <span class="ml-10">{{ formatCurrency(detail.criterial.profitTotal) }}</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('2') }}</div>:
          <span class="ml-10">{{ formatNumber(detail.criterial.profitRate, detail.criterial.profitRate, 2) }}%</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('3') }}</div>:
          <span class="ml-10">{{ formatNumber(detail.criterial.maxDD, detail.criterial.maxDD, 2) }}%</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('4') }}</div>:
          <span class="ml-10">{{ detail.criterial.maxContractsHeld }}</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('5') }}</div>:
          <span class="ml-10">{{ formatNumber(detail.criterial.winRate, detail.criterial.winRate, 2) }}%</span>
        </div>
      </div>
      <div class="w50p">
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('6') }}</div>:
          <span class="ml-10">{{ formatPF(detail.criterial.profitFactor) }}</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('7') }}</div>:
          <span class="ml-10">{{ detail.criterial.riskReturn }}</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('8') }}</div>:
          <span class="ml-10">{{ formatNumber(parseInt(detail.criterial.totalProfitPips, '-')) }}pips</span>
        </div>
        <div class="flex mid fs-12 p-5 b-dotted">
          <span class="square"/>
          <div class="criterial-title fs-12 ml-10">{{ $t('9') }}</div>:
          <span class="ml-10">{{ formatCurrency(detail.criterial.expectedProfit) }}</span>
        </div>
        <div class="fs-12 p-15 b-dotted"/>
      </div>
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/stock-detail-header.json'
import { formatPF } from '@/utils/client/common'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
    goCommunity: {
      type: Function,
      default() {},
    },
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
  background: #f5f5f5;
  padding: 10px 20px;
  color: #666;
  .w50p {
    width: 48%;
    .criterial-title {
      flex: 0 0 150px;
    }
    .square {
      width: 8px;
      height: 8px;
      background: #ff8400;
    }
    .b-dotted {
      border-bottom: 1px dotted #d9d9d9;
    }
  }
}
</style>
