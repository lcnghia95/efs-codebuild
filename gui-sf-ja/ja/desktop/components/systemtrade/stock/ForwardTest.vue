<template>
  <section>
    <div class="mt-30 chart-title flex mid space-between mb-20" id="forward-table">
      <LeftTitle :text="$t('19')" />
      <button class="btn-csv" @click="onExportCSVForwardTest"><b>{{ $t('17') }}</b></button>
    </div>
    <component :is="'ForwardTest' + platform" :data="forward.data" />
    <div class="text-center mt-25">
      <paging :cur-page="forward.currentPage"
              :total="forward.lastPage"
              :from="forward.pagingFrom"
              :to="forward.pagingTo"
              theme-class="theme4"
              @pagingclick="innerGetData" />
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/stock-forward-test.json'
import LeftTitle from '@/components/systemtrade/LeftTitle.vue'
import ForwardTest2 from './ForwardTest2.vue'
import ForwardTest3 from './ForwardTest3.vue'
import ForwardTest4 from './ForwardTest4.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { exportCSVTemplate, scollToOffest } from '@/utils/client/common'
export default {
  components: {
    LeftTitle,
    ForwardTest2,
    ForwardTest3,
    ForwardTest4,
    Paging,
  },
  props: {
    forward: {
      type: Object,
      default: () => {
        return []
      },
    },
    platform: {
      type: Number,
      default: 2,
    },
    onGetDataPage: Function,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      titles: {
        2: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '12',
          '13',
          '15',
          '16',
        ],
        3: ['1', '3', '5', '6', '7', '9', '10', '11', '14', '15', '16'],
        4: ['1', '3', '5', '6', '7', '9', '10', '15', '16'],
      },
    }
  },
  methods: {
    innerGetData(page) {
      scollToOffest('#lz-forward')
      this.onGetDataPage(page)
    },
    onExportCSVForwardTest() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/stocks/${
          this.$route.params.id
        }/forwardPage`,
        {
          params: {
            page: 1,
            limit: 0,
          },
        }
      ).then(data => {
        if (data.data.length) {
          let csvContent = '',
            filename = 'output_' + this.$route.params.id + '_forward_test.csv'
          for (let i in this.titles[this.platform]) {
            let txt = this.titles[this.platform][i]
            csvContent += `${this.$t(txt).replace('<br>', '')}`
            if (i == this.titles[this.platform].length - 1) {
              csvContent += '\n'
            } else {
              csvContent += ','
            }
          }
          for (let i in data.data) {
            let item = data.data[i]
            if (item.status) {
              continue
            }
            csvContent += item.openTime
              ? this.formatTime(item.openTime, 9)
              : '-'
            csvContent += ','
            if (this.platform === 2) {
              csvContent += item.symbol || '-'
              csvContent += ','
            }
            csvContent += item.name
            csvContent += ','
            if (this.platform === 2) {
              csvContent += item.market || '-'
              csvContent += ','
            }
            csvContent += this.$t('t' + item.orderType || 0)
            csvContent += ','
            csvContent += item.openQuantity || '-'
            csvContent += ','
            csvContent += item.openPrice ? item.openPrice + '円' : '-'
            csvContent += ','
            if (this.platform === 2) {
              csvContent += item.openSum ? item.openSum + '円' : '-'
              csvContent += ','
            }
            csvContent += item.closeTime
              ? this.formatTime(item.closeTime, 9)
              : '-'
            csvContent += ','
            if (this.platform === 3 || this.platform === 4) {
              csvContent += item.closePrice ? item.closePrice + '円' : '-'
              csvContent += ','
            }
            if (this.platform === 3) {
              csvContent += item.runUp ? item.runUp + '円' : '-'
              csvContent += ','
              csvContent += item.drowDown ? item.drowDown + '円' : '-'
              csvContent += ','
            }
            if (this.platform === 2) {
              csvContent += item.closeQuantity || '-'
              csvContent += ','
              csvContent += item.closeSum ? item.closeSum + '円' : '-'
              csvContent += ','
            }
            csvContent += item.profit ? item.profit + '円' : '-'
            csvContent += ','
            csvContent += item.profit ? item.profitSum + '円' : '-'
            csvContent += '\n'
          }
          exportCSVTemplate(csvContent, filename)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-csv {
  width: 140px;
  height: 30px;
  box-shadow: 0 3px 0 0 #4a8980;
  outline: none;
  background: #10cac8;
  font-size: 14px;
  border: none;
  color: white;
}
.btn-csv:active {
  transform: translate(0, 5px);
  -webkit-transform: translate(0, 5px);
  box-shadow: 0 1px 0 0;
}
/deep/ .forward-table {
  border: 1px solid #beb4b5;
  thead > tr > th {
    font-size: 13px;
    color: white;
  }
  tbody {
    tr {
      font-size: 13px;
      td {
        padding: 11px 0;
        span {
          display: block;
        }
      }
      &:nth-child(odd) {
        background: #f7f7f7;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
  .co-red {
    color: red;
  }
}
</style>
