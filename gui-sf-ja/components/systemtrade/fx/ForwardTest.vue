<template>
  <section id="forward-table">
    <div class="mt-30 flex mid space-between mb-20">
      <div class="flex">
        <LeftTitle :text="$t('15')" />
        <span v-html="(!domesticBroker ? $t('brokers.' + demoBrokerId) : '') + $t('18')" class="ml-30" v-if="demoBrokerId" />
      </div>
      <button class="btn-csv" @click="onExportCSVForwardTest"><b>{{ $t('16') }}</b></button>
    </div>
    <Table01 :headers="headers" class="forward-table">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i < 15">
        <template v-if="row.status">
          <td colspan="14"><span class="pl-10">{{ $t('s' + row.status) }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ formatTime(row.open, 1) }}</td>
          <td class="text-center">{{ row.symbol }}</td>
          <td class="text-center" :style="{'color': row.type? '#f40' : '#0266c0'}">
            <b>{{ row.type? '↗' : '↘' }}</b>
          </td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.openPrice) }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.stop) }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.takeProfit) }}</td>
          <td class="text-center">{{ row.close ? formatTime(row.close, 1) : '-' }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.closePrice) }}</td>
          <td class="text-center">{{ formatNumber(row.lots, '-', 2) }}</td>
          <td class="text-center">{{ formatNumber(row.commission, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.tax, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.swap, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.pips, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.profit, '-') }}</td>
        </template>
      </tr>
      <tr v-if="!forward.data.length"><td :colspan="headers.length" class="text-center co-red">{{ $t('17') }}</td></tr>
    </Table01>
    <Table01 :headers="headers" class="forward-table" v-if="forward.data.length > 13">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i > 14">
        <template v-if="row.status">
          <td colspan="13"><span class="pl-10">{{ $t('s' + row.status) }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ formatTime(row.open, 1) }}</td>
          <td class="text-center">{{ row.symbol }}</td>
          <td class="text-center" :style="{'color': row.type? '#f40' : '#0266c0'}">
            <b>{{ row.type? '↗' : '↘' }}</b>
          </td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.openPrice) }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.stop) }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.takeProfit) }}</td>
          <td class="text-center">{{ row.close ? formatTime(row.close, 1) : '-' }}</td>
          <td class="text-center">{{ innerFormatNumber(row.symbol, row.closePrice) }}</td>
          <td class="text-center">{{ formatNumber(row.lots, '-', 2) }}</td>
          <td class="text-center">{{ formatNumber(row.commission, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.tax, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.swap, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.pips, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.profit, '-') }}</td>
        </template>
      </tr>
    </Table01>
    <div class="text-center mt-25">
      <paging :cur-page="forward.currentPage"
              :total="forward.lastPage"
              :from="forward.pagingFrom"
              :to="forward.pagingTo"
              theme-class="theme4"
              @pagingclick="innerGetData" />
    </div>
    <GogoModal :show="isShowModal" :cancel-text="$t('20')" @close="onClose" @ok="onGoToRegister" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{$t('19')}}
      </div>
    </GogoModal>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/fx-forward-test.json'
import LeftTitle from '@@/../components/systemtrade/LeftTitle.vue'
import Table01 from '@@/../components/input/Table01.vue'
import Paging from '@@/../components/paging/Paging.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import { exportCSVTemplate, scollToOffest } from '@/utils/client/common'
export default {
  components: {
    LeftTitle,
    Table01,
    Paging,
    GogoModal,
  },
  props: {
    forward: {
      type: Object,
      default: () => {
        return {}
      },
    },
    demoBrokerId: Number,
    domesticBroker: Boolean,
    onGetDataPage: Function,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
  },
  data() {
    return {
      headers: [
        {
          title: this.$t('1'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('2'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('3'),
          classes: ['text-center', 'w-50'],
        },
        {
          title: this.$t('4'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('5'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('6'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('7'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('8'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('9'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('10'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('11'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('12'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('13'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('14'),
          classes: ['text-center', 'w-80'],
        },
      ],
      isShowModal: false,
    }
  },
  methods: {
    innerGetData(page) {
      scollToOffest('#lz-forward')
      this.onGetDataPage(page)
    },
    onGoToRegister() {
      location.href = `/register?u=/systemtrade/fx/${this.$route.params.id}`
    },
    onClose() {
      this.isShowModal = false
    },
    onExportCSVForwardTest() {
      if (!this.userId) {
        this.isShowModal = true
        return
      }
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/fx/${this.$route.params.id}/forwardPage`,
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
          csvContent += `${this.$t('1').replace('<br>', '')},${this.$t(
            '2'
          ).replace('<br>', '')},${this.$t('3')},${this.$t('4')},${this.$t(
            '5'
          )},${this.$t('6')},${this.$t('7').replace('<br>', '')},${this.$t(
            '8'
          )},${this.$t('9')},${this.$t('10')},${this.$t('11')},${this.$t(
            '12'
          )},${this.$t('13')},${this.$t('14')}\n`
          for (let i = 0; i < data.data.length; i++) {
            let item = data.data[i]
            if (item.status) {
              continue
            }
            csvContent += item.open ? this.formatTime(item.open, 9) : '-'
            csvContent += ','
            csvContent += item.symbol || '-'
            csvContent += ','
            csvContent += this.$t('t' + (item.type || 0))
            csvContent += ','
            csvContent += item.openPrice || '-'
            csvContent += ','
            csvContent += item.stop || '-'
            csvContent += ','
            csvContent += item.takeProfit || '-'
            csvContent += ','
            csvContent += item.close ? this.formatTime(item.close, 9) : '-'
            csvContent += ','
            csvContent += item.closePrice || '-'
            csvContent += ','
            csvContent += item.lots || '-'
            csvContent += ','
            csvContent += item.commission || '-'
            csvContent += ','
            csvContent += item.tax || '-'
            csvContent += ','
            csvContent += item.swap || '-'
            csvContent += ','
            csvContent += item.pips || '-'
            csvContent += ','
            csvContent += item.profit || '-'
            csvContent += '\n'
          }
          exportCSVTemplate(csvContent, filename)
        }
      })
    },
    innerFormatNumber(pairs, number) {
      if (!pairs) {
        return number || ''
      }
      if (pairs.indexOf('/JPY') !== -1) {
        return this.formatNumber(number, '-', 3)
      } else {
        return this.formatNumber(number, '-', 5)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .forward-table {
  border: 1px solid #beb4b5;
  thead {
    th {
      font-size: 13px;
      color: white;
    }
  }
  tbody {
    tr {
      font-size: 13px;
      td {
        padding: 8px 0;
        font-size: 13px;
      }
      &:nth-child(odd) {
        background: #f7f7f7;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
}
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
</style>
