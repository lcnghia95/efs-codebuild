<template>
  <div class="m-t-10 pb-3 pt-4 trade-info wrapper-content" min-height="180px">
    <div class="my-chart" align-v="center">
      <div class="hide-for-medium content-title">
        <a :title="data.accountName || '名称未設定'" class="detail-title wrap-text" :href="linkNavigate(data)">
          {{ data.accountName || '名称未設定' }}
        </a>
      </div>
      <div class="chart-wrapper p-0">
        <ProductStockTrade :chart="dataChart" :option="option" />
      </div>
      <div class="detail m-0">
        <div class="pl-3 hide-for-small">
          <a :title="data.accountName || '名称未設定'" class="detail-title wrap-text" :href="linkNavigate(data)">
            {{ data.accountName || '名称未設定' }}
          </a>
        </div>
        <div class="detail-content m-0">
          <div class="content-info wrap-text p-0">
            <div class="item">
              <div class="title">{{ $t('41') }}</div>
              <span class="wrap-text">: {{ formatPips(data.pipsTotal) }} pips</span>
              <!-- <span class="wrap-text">: {{ formatPips(data.pipsTotal * 10) }} pips</span> -->
            </div>
            <div class="item">
              <div class="title">{{ $t('42') }}</div>
              <span>: {{ formatPips(data.pipsAverage) }} pips</span>
              <!-- <span>: {{ formatPips(data.pipsAverage * 10) }} pips</span> -->
            </div>
            <div>
              <span v-show="!data.isDemo" class="badge badge-realtrade" style="color: #fff; font-weight: 500;">REAL</span>
            </div>
          </div>
          <div v-if="data.userId" class="detail-avatar">
            <a :title="data.accountName || '名称未設定'" :href="linkNavigate(data)" class="ava">
              <Lzimg 
                :class-name="'w-100'"
                :alt="data.accountName || '名称未設定'"
                :data-src="`/img/real-trade/user/${data.userId}/large`"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/users-id.json'
import ProductStockTrade from '@@/desktop/components/charts/ProductStockTrade.vue'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  i18n: {messages: i18n},
  components: {
    ProductStockTrade,
    Lzimg
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    num: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data() {
    return {
      dataChart: [],
      option: {
        currency: 'pips',
        chart: {
          reflow: true
        },
        legend: {
          enabled: false
        },
        yAxis: {
          labels: {
            enabled: false
          }
        }
      }
    }
  },
  mounted() {
    this.buildChart()
  },
  watch: {
    data() {
      this.buildChart()
    },
  },
  methods: {
    linkNavigate(data) {
      return `https://real-trade.tech/accounts/${data.accountId}`
    },
    buildChart() {
      const charts = this.data.stockChart.pipChart || {}
        this.dataChart = [
          {
            name: 'Profitability',
            tooltip: { valueDecimals: 2 },
            color: '#81b8ec',
            curUnit: 'pips',
            label: { enabled: false },
            data: charts
          }
        ]
        return
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: inherit;
  &:visited {
    color: inherit;
  }
}
.my-chart {
  display: flex;
}
.chart-wrapper {
  width: 100%;
  height: 160px;
  z-index: 1;
  /deep/ .inner-chart {
    height: 160px;
    overflow: visible !important;
  }
  /deep/ .highcharts-container {
    overflow: visible !important;
  }
  /deep/ svg {
    overflow: visible !important;
  }
}
.content-title {
  display: flex;
  align-items: center;
  min-height: 35px;
}
.detail {
  padding: 5px 0 20px 0;
  color: #7f7f7f;
  width: 100%;
  &-title {
    font-weight: bold;
  }
  &-content {
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    /deep/ img {
      max-height: 78px;
    }
  }
}
.ava {
  border: 1px solid #fff;
  min-width: 72px;
  width: 100%;
  &:hover {
    border: 1px solid darkorange;
  }
}
@media (max-width: 575.98px) {
  .detail {
    padding: 0 !important;
  }
}
@media (max-width: 1199.98px) {
  .chart-wrapper {
    margin: 0 auto;
  }
}
@media (max-width: 767.98px) {
  .hide-for-small {
    display: none !important;
  }
  .detail-title {
    margin-top: 0;
  }
  .detail-avatar {
    display: block !important;
  }
  .my-chart {
    display: block;
  }
}
@media (max-width: 991.98px) {
  .icon {
    cursor: pointer;
  }
}
@media (min-width: 768px) {
  .hide-for-medium {
    display: none !important;
  }
}
@media (min-width: 768px) and (max-width: 1199.98px) {
  .detail {
    padding-top: 1rem !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
.icon {
  cursor: pointer;
  svg {
    margin: 0 !important;
  }
}
.detail-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.25rem;
}
.badge-realtrade {
  margin-top: 0.5rem;
  background-color: #ff981a;
  border-radius: 0.25rem;
}
.content-info {
  min-width: 75%;
  overflow: visible;
  .item {
    display: flex;
  }
  .title {
    width: 60%;
  }
}
</style>
