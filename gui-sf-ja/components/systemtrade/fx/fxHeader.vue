<template>
  <section>
    <ul>
      <li v-for="(item,idx) in timeTitles" :key="'ranking-' + idx"
          :class="{'ranking-tab-active' : timeVal == item}"
          @click="clickTimeTab(item)"
          class="ranking mt-10">
        {{ $t(item) }}
      </li>
    </ul>
    <div class="flex space-between criterial pt-5 pb-10 pl-10 pr-10">
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('1') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.profitTotal, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('3') }}</div>:&nbsp;
          <span>{{ formatPF(criterial.profitFactor) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('4') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t4')">?</span>
          </div>:&nbsp;
          <span>{{ criterial.riskReturn }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('5') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.averageProfit, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('6') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.averageLoss, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('7') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t6')">?</span>
          </div>:&nbsp;
          <span>{{ formatCurrency(criterial.accountBalance, detail.currencyType) }}</span>
        </div>
      </div>
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('9') }}</span>
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t1')">?</span>
          </div>:&nbsp;
          <span>{{ formatNumber(criterial.profitRate, criterial.profitRate, 2) }}%</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('10') }}</div>:&nbsp;
          <span>
            {{ formatNumber(criterial.winRate, criterial.winRate, 2) }}%
            ({{ criterial.profitTrades }}/{{ criterial.totalTrades }})
          </span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('11') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t3')">?</span>
          </div>:&nbsp;
          <span>{{ criterial.maxPosition }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('12') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t5')">?</span>
          </div>:&nbsp;
          <span>
            {{ formatNumber(criterial.maxDDRate,criterial.maxDDRate, 2) }}%
            ({{ formatCurrency(criterial.maxDDPrice, detail.currencyType) }})
          </span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('13') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.maxProfit, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square"></span>
          <div class="criterial-title ml-5">{{ $t('14') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.maxLoss, detail.currencyType) }}</span>
        </div>
      </div>
    </div>
    <div class="flex space-between criterial mt-10 pb-10 pl-10 pr-10">
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square bg-split"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('2') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t2')">?</span>
          </div>:&nbsp;
          <span>{{ formatCurrency(criterial.recommendedMargin, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square bg-split"></span>
          <div class="criterial-title ml-5">{{ $t('8') }}</div>:&nbsp;
          <span>{{ formatCurrency(criterial.revenueIncludes, detail.currencyType) }}</span>
        </div>
      </div>
      <div class="w50p">
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square bg-split"></span>
          <div class="criterial-title ml-5 flex mid">
            <span>{{ $t('15') }}</span>&nbsp;
            <span class="tool-tip" data-toggle="tooltip" data-placement="right" :title="$t('t7')">?</span>
          </div>:&nbsp;
          <span>{{ formatCurrency(criterial.firstAmount, detail.currencyType) }}</span>
        </div>
        <div class="flex mid fs-12 pt-5 pb-5 b-dotted">
          <span class="square bg-split"></span>
          <div class="criterial-title ml-5">{{ $t('16') }}</div>:&nbsp;
          <span>{{ $t('cur' + (criterial.currency || 1)) + $t('18') }}</span>
        </div>
      </div>
    </div>
    <div class="brokers mt-10 flex">
      <div class="brokers-title fs-12 flex mid center">
        {{ $t('17') }}
      </div>
      <div class="flex flex-wrap mid pl-15 pr-15 pt-10 pb-10" style="max-width: 80%;">
        <components
          :is="isSuportLocale 
            ? 'div'
            : 'a'" :href="companyUrls[item] || '/companies/' + item" v-for="item in brokers"
          :key="'fx-broker-' + item"
          class="mr-10 fs-12 no-underlying"
        >
          {{ allowedBrokers[item] }}
        </components>
        <div v-if="!brokers.length">-</div>
      </div>
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/fx-detail-header.json'
import { formatPF } from '@/utils/client/common'
const GET_BROKERS_URL = "/api/v3/brokers/domestic"
if (process.browser) {
  require('bootstrap/js/tooltip.js')
}
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
    let timeVal = this.$route.query.t
    timeVal = 'm' + timeVal
    if (!timeTitles.includes(timeVal) || !this.detail.criterialAll[timeVal]) {
      timeVal = 'all'
    }
    return {
      allowedBrokers: [],
      companyUrls: {},
      timeVal,
      timeTitles,
    }
  },
  mounted() {
    this.onGetBrokers()
    this.getCompanyUrls()
    $(this.$el)
      .find('span[data-toggle="tooltip"]')
      .each(function () {
        $(this).tooltip({ html: true })
      })
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
    getCompanyUrls() {
      if (this.isSuportLocale) {
        return
      }
      this.GoGoHTTP.get('/api/v3/surface/company/urls', {
        params: {
          ids: this.detail.brokers
        }
      }).then(data => {
        this.companyUrls = data
      })
    },
    clickTimeTab(val) {
      if (this.detail.criterialAll[val]) {
        this.timeVal = val
      
        if (history.replaceState) {
          var params = new URLSearchParams(location.search);
          if (val != 'all') {
            params.set('t', queryMaps[val]);
          } else {
            params.delete('t');
          }
          var newUrl = location.protocol + "//" + location.host + location.pathname + '?' + params.toString();
          history.replaceState({path:newUrl},'',newUrl);
        }
      }
    }
  },
  computed: {
    brokers() {
      return (this.detail.brokers || []).filter(e => Object.keys(this.allowedBrokers).includes(e.toString()))
    },
    isSuportLocale() {
      return this.langSupported().includes(this.$i18n.locale)
    },
    criterial() {
      return this.detail.criterialAll[this.timeVal]
    }
  },
}
</script>
<style lang="scss" scoped>
ul {
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
  padding: 0;
  margin-bottom: 0;
  li {
    list-style-type: none;
    display: inline-block;
    background-color: #fff;
    color: #606060;
    cursor: pointer;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-left: 1px solid #e2e2e2;
    border-right: 1px solid #e2e2e2;
    border-top: 1px solid #e2e2e2;
  }
  .month {
    margin: auto 4px -3px 4px;
    padding: 2px 4px;
  }
  .ranking {
    margin: auto 0px -1px 0px;
    padding: 2px 20px;
  }
  .ranking-tab-active {
    background-color: #f5f5f5;
    color: #606060;
    border: 1px solid #e2e2e2;
    border-bottom: none;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
}
.criterial {
  background: #f5f5f5;
  color: #666;
  .w50p {
    width: 49%;
    .criterial-title {
      flex: 0 0 160px;
      font-size: 12px;
      .tool-tip {
        width: 14px;
        flex: 0 0 14px;
        height: 14px;
        color: white;
        font-size: 12px;
        font-weight: bold;
        background: #a4d1ff;
        border-radius: 50%;
        padding: 0 4px;
        cursor: pointer;
        margin-bottom: 3px;
      }
    }
    .square {
      width: 8px;
      height: 8px;
      background: #ff8400;
      &.bg-split {
        background: #606060;
      }
    }
    .b-dotted {
      border-bottom: 1px dotted #d9d9d9;
    }
  }
}
.brokers {
  border: 1px solid #d9d9d9;
  .brokers-title {
    flex: 0 0 130px;
    min-height: 50px;
    background: #f5f5f5;
  }
}
.no-underlying {
  cursor: pointer;
  color: #23527c;
}
/deep/ .tooltip {
  & > .tooltip-inner {
    background-color: rgba(1, 1, 1, 0.85);
    color: #f0e9e9;
    text-align: left;
    padding: 10px;
    max-width: 200px;
    border-radius: 4px;
  }
  $direct: (
    top,
    bottom,
    left,
    right
  );
  @each $dir in $direct {
    &.#{$dir} > .tooltip-arrow {
      border-#{$dir}: 5px solid rgba(1, 1, 1, 0.85);
    }
  }
  .right {
    padding: 0 5px;
    margin-left: 3px;
  }
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    left: -3px;
    margin-top: -2px;
  }
}
</style>
