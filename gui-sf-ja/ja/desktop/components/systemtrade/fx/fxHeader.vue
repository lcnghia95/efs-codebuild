<template>
  <section>
    <div class="flex space-between criterial mt-10 pt-5 pb-10 pl-10 pr-10">
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('1') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.profitTotal, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('2') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.recommendedMargin, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('3') }}</div>:&nbsp;
          <span>{{ formatPF(detail.criterial.profitFactor) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('4') }}</div>:&nbsp;
          <span>{{ detail.criterial.riskReturn }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('5') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.averageProfit, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('6') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.averageLoss, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('7') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.accountBalance, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('8') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.revenueIncludes, detail.currencyType) }}</span>
        </div>
      </div>
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('9') }}</div>:&nbsp;
          <span>{{ formatNumber(detail.criterial.profitRate, detail.criterial.profitRate, 2) }}%</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('10') }}</div>:&nbsp;
          <span>
            {{ formatNumber(detail.criterial.winRate, detail.criterial.winRate, 2) }}%
            ({{ detail.criterial.profitTrades }}/{{ detail.criterial.totalTrades }})
          </span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('11') }}</div>:&nbsp;
          <span>{{ detail.criterial.maxPosition }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('12') }}</div>:&nbsp;
          <span>
            {{ formatNumber(detail.criterial.maxDDRate,detail.criterial.maxDDRate, 2) }}%
            ({{ formatCurrency(detail.criterial.maxDDPrice, detail.currencyType) }})
          </span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('13') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.maxProfit, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('14') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.maxLoss, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('15') }}</div>:&nbsp;
          <span>{{ formatCurrency(detail.criterial.firstAmount, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('16') }}</div>:&nbsp;
          <span>{{ $t('cur' + (detail.criterial.currency || 1)) + $t('18') }}</span>
        </div>
      </div>
    </div>
    <div class="brokers mt-10 flex">
      <div class="brokers-title fs-12 flex mid center">
        {{ $t('17') }}
      </div>
      <div class="flex flex-wrap mid pl-15 pr-15 pt-10 pb-10">
        <a :href="'/companies/' + item" v-for="item in brokers"
           :key="'fx-broker-' + item"
           v-if="getBrokers(item)"
           class="mr-10 fs-12 no-underlying"
        >
          {{ getBrokers(item) }}
        </a>
      </div>
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/fx-detail-header.json'
import { formatPF } from '@/utils/client/common'
const GET_BROKERS_URL = "/api/v3/brokers/domestic"
export default {
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          criterial: {},
          brokers: [],
        }
      },
    },
    goCommunity: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      allowedBrokers: []
    }
  },
  mounted() {
    this.onGetBrokers()
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    formatPF,
    onGetBrokers() {
      this.GoGoHTTP.get(`${GET_BROKERS_URL}`).then(data => {
        this.allowedBrokers = data || []
      })
    },
    getBrokers(id) {
      let allowedBrokers = this.allowedBrokers
      if (Object.keys(allowedBrokers).includes(id.toString())) {
        return allowedBrokers[id]
      }
      return ''
    },
  },
  computed: {
    brokers() {
      return this.detail.brokers || []
    },
  },
}
</script>
<style lang="scss" scoped>
.criterial {
  background: #f5f5f5;
  color: #666;
  .w50p {
    width: 49%;
    .criterial-title {
      flex: 0 0 160px;
      font-size: 12px;
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
.brokers {
  border: 1px solid #d9d9d9;
  .brokers-title {
    flex: 0 0 120px;
    min-height: 50px;
    background: #f5f5f5;
  }
}
.no-underlying {
  color: #23527c;
}
</style>
