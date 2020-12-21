<template>
  <section style="padding: 4vw;">
    <Panel :title="$t('1')">
      <div class="flex layout-col criterial">
        <div class="flex mid">
          <div class="w50p title">{{ $t('2') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.profitTotal, criterial.currency) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('4') }}</div>
          <div class="w50p content">{{ formatPF(criterial.profitFactor) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('5') }}</div>
          <div class="w50p content">{{ criterial.riskReturn }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('6') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.averageProfit, criterial.currency) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('7') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.averageLoss, criterial.currency) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('8') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.accountBalance, criterial.currency) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('10') }}</div>
          <div class="w50p content">{{ formatNumber(criterial.profitRate, criterial.profitRate, 2) }}%</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('11') }}</div>
          <div class="w50p content">
            {{ formatNumber(criterial.winRate, criterial.winRate, 2) }}%&nbsp;
            ({{ criterial.profitTrades }}/{{ criterial.totalTrades }})
          </div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('12') }}</div>
          <div class="w50p content">{{ criterial.maxPosition }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('13') }}</div>
          <div class="w50p content">{{ formatNumber(criterial.maxDDRate, criterial.maxDDRate, 2) }}%&nbsp;({{ formatCurrency(criterial.maxDDPrice, criterial.currency) }})</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('14') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.maxProfit, criterial.currency) }}</div>
        </div>
        <div class="flex mid">
          <div class="w50p title">{{ $t('15') }}</div>
          <div class="w50p content">{{ formatCurrency(criterial.maxLoss, criterial.currency) }}</div>
        </div>
      </div>
      <ul class="flex mid">
        <li v-for="(item,idx) in timeTitles" :key="'ranking-' + idx"
            :class="{'ranking-tab-active' : timeVal == item}"
            @click="clickTimeTab(item)"
            class="ranking mt-10 grow1"
        >
          {{ $t(item) }}
        </li>
      </ul>
    </Panel>
    <div class="flex layout-col criterial mt-20 bg-f5" style="padding: 0 4vw 4vw; border-radius: 5px;">
      <div class="flex mid">
        <div class="w50p title co-all">{{ $t('3') }}</div>
        <div class="w50p content">{{ formatCurrency(criterial.recommendedMargin, criterial.currency) }}</div>
      </div>
      <div class="flex mid" style="background: #dbdbdb;">
        <div class="w50p title co-all">{{ $t('9') }}</div>
        <div class="w50p content">{{ formatCurrency(criterial.revenueIncludes, criterial.currency) }}</div>
      </div>
      <div class="flex mid">
        <div class="w50p title co-all">{{ $t('16') }}</div>
        <div class="w50p content">{{ formatCurrency(criterial.firstAmount, criterial.currency) }}</div>
      </div>
      <div class="flex mid" style="background: #dbdbdb;">
        <div class="w50p title co-all">{{ $t('17') }}</div>
        <div class="w50p content">{{ $t('cur' + (criterial.currency || 1)) + $t('18') }}</div>
      </div>
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/system-fx-criterial.json'
import Panel from '@/components/Panel.vue'
import { formatPF } from '@/utils/client/common'
const timeTitles = [
  'all',
  'm24',
  'm12',
  'm6',
  'm3',
  'm1',
]

const queryMaps = {
  'all': '',
  'm24': 24,
  'm12': 12,
  'm6': 6,
  'm3': 3,
  'm1': 1,
}

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
  data() {
    let timeVal = this.$route.query.t
    timeVal = 'm' + timeVal
    if (!timeTitles.includes(timeVal) || !this.data[timeVal]) {
      timeVal = 'all'
    }
    return {
      timeVal,
      timeTitles,
    }
  },
  methods: {
    formatPF,
    clickTimeTab(val) {
      if (this.data[val]) {
        this.timeVal = val
      
        if (history.replaceState) {
          var params = new URLSearchParams(location.search)
          if (val != 'all') {
            params.set('t', queryMaps[val])
          } else {
            params.delete('t')
          }
          var newUrl = location.protocol + "//" + location.host + location.pathname + '?' + params.toString()
          history.replaceState({path:newUrl},'',newUrl)
        }
      }
    }
  },
  computed: {
    criterial() {
      return this.data[this.timeVal]
    }
  },
}
</script>
<style lang="scss" scoped>
ul {
  width: 100%;
  padding: 0;
  margin-bottom: 0;
  margin-top: 1vw;
  li {
    list-style-type: none;
    display: inline-block;
    background-color: #fff;
    color: #a1a1a1;
    cursor: pointer;
    border: 1px solid #a1a1a1;
  }
  .ranking {
    padding: 2vw;
    font-size: 3.5vw;
    margin-right: 2px;
    border-radius: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
  .ranking-tab-active {
    background-color: #a1a1a1;
    color: #fff;
    border-radius: 5px;
    border: 1px solid #a1a1a1;
  }
}
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
    &.co-all {
      color: #9e6566;
    }
  }
  .content {
    color: #434343;
  }
}
.bg-f5 {
  background: #f5f5f5;
}
</style>
