<template>
  <section id="forward-table">
    <Table01 :headers="headers" class="forward-table" :options="tblOpt">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i < 15">
        <template v-if="row.status">
          <td colspan="8"><span class="pl-10">{{ $t('s' + row.status) }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ formatTime(row.open, 1) }}</td>
          <td class="text-center">{{ row.close ? formatTime(row.close, 1) : '-' }}</td>
          <td class="text-center" :style="{'color': row.type? '#f40' : '#0266c0'}">
            <b>{{ row.type? '↗' : '↘' }}</b>
          </td>
          <td class="text-center fs-11">{{ row.symbol }}</td>
          <td class="text-center">
            {{ innerFormatNumber(row.symbol, row.openPrice) }}<br>
            {{ innerFormatNumber(row.symbol, row.closePrice) }}
          </td>
          <td class="text-center">{{ formatNumber(row.lots, '-', 2) }}</td>
          <td class="text-center">{{ formatNumber(row.pips, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.profit, '-') }}</td>
        </template>
      </tr>
    </Table01>
    <Table01 :headers="headers" class="forward-table" :options="tblOpt">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i > 14">
        <template v-if="row.status">
          <td colspan="8"><span class="pl-10">{{ $t('s' + row.status) }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ formatTime(row.open, 1) }}</td>
          <td class="text-center">{{ row.close ? formatTime(row.close, 1) : '-' }}</td>
          <td class="text-center" :style="{'color': row.type? '#f40' : '#0266c0'}">
            <b>{{ row.type? '↗' : '↘' }}</b>
          </td>
          <td class="text-center">{{ row.symbol }}</td>
          <td class="text-center">
            {{ innerFormatNumber(row.symbol, row.openPrice) }}<br>
            {{ innerFormatNumber(row.symbol, row.closePrice) }}
          </td>
          <td class="text-center">{{ formatNumber(row.lots, '-', 2) }}</td>
          <td class="text-center">{{ formatNumber(row.pips, '-') }}</td>
          <td class="text-center">{{ formatNumber(row.profit, '-') }}</td>
        </template>
      </tr>
    </Table01>
    <div class="text-center mt-10">
      <paging :cur-page="forward.currentPage"
              :total="forward.lastPage"
              :from="forward.pagingFrom"
              :to="forward.pagingTo"
              theme-class="theme1"
              @pagingclick="innerGetData" />
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/fx-forwardtest.json'
import Table01 from '@@/../components/input/Table01.vue'
import Paging from '@/components/paging/Paging.vue'
import { scollToOffest } from '@/utils/client/common'
export default {
  props: {
    forward: {
      type: Object,
      default: () => {
        return {}
      },
    },
    onGetDataPage: Function,
  },
  components: {
    Table01,
    Paging,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      headers: [
        {
          title: this.$t('1'),
        },
        {
          title: this.$t('2'),
        },
        {
          title: this.$t('3'),
        },
        {
          title: this.$t('4'),
        },
        {
          title: this.$t('5'),
        },
        {
          title: this.$t('6'),
        },
        {
          title: this.$t('7'),
        },
        {
          title: this.$t('8'),
        },
      ],
      tblOpt: {
        widths: ['11%', '11%', '8%', '15%', '15%', '9%', '12%', '18%'],
      },
    }
  },
  methods: {
    innerGetData(page) {
      scollToOffest('#lz-forward', 100)
      this.onGetDataPage(page)
    },
    innerFormatNumber(pairs, number) {
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
.fs-11 {
  font-size: 11px;
}
/deep/ .forward-table {
  thead {
    background: #bdb3b3;
    th {
      font-size: 3vw;
      line-height: 3.5vw;
      color: white;
      font-weight: normal;
      hr {
        margin: 2px 2px 5px;
      }
    }
  }
  tbody {
    tr {
      font-size: 3.2vw;
      td {
        padding: 2vw 0;
      }
      &:nth-child(odd) {
        background: #f3f0ef;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
}
</style>
