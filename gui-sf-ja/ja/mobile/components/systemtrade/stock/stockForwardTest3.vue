<template>
  <section id="forward-table">
    <Table01 :headers="headers" class="forward-table" :options="tblOpt">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i < 15">
        <template v-if="row.status">
          <td colspan="6"><span class="pl-10">{{ $t('7') }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ row.openTime ? formatTime(row.openTime, 4) : '-' }}</td>
          <td class="text-center" :style="{'color': row.orderType ? 'red' : '#0066c0'}">
            {{ $t('t' + (row.orderType || 0)) }}
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.openPrice ? formatNumber(row.openPrice) + '円' : '-' }}
            </span>
          </td> 
          <td class="text-center">{{ row.closeTime ? formatTime(row.closeTime, 4) : '-' }}</td>
          <td :class="{'text-right': row.drowDown, 'text-center': !row.drowDown}">
            <span class="pr-5">
              {{ row.drowDown ? formatNumber(row.drowDown) + '円' : '-' }}
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.profit ? formatNumber(row.profit) + '円' : '-' }}
            </span>
          </td>
        </template>
      </tr>
    </Table01>
    <Table01 :headers="headers" class="forward-table" :options="tblOpt">
      <tr v-for="(row,i) in forward.data" :key="'forward-row1-' + i" class="row-middle-all" v-if="i > 14">
        <template v-if="row.status">
          <td colspan="6"><span class="pl-10">{{ $t('7') }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ row.openTime ? formatTime(row.openTime, 4) : '-' }}</td>
          <td class="text-center" :style="{'color': row.orderType ? 'red' : '#0066c0'}">
            {{ $t('t' + (row.orderType || 0)) }}
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.openPrice ? formatNumber(row.openPrice) + '円' : '-' }}
            </span>
          </td> 
          <td class="text-center">{{ row.closeTime ? formatTime(row.closeTime, 4) : '-' }}</td>
          <td :class="{'text-right': row.drowDown, 'text-center': !row.drowDown}">
            <span class="pr-5">
              {{ row.drowDown ? formatNumber(row.drowDown) + '円' : '-' }}
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.profit ? formatNumber(row.profit) + '円' : '-' }}
            </span>
          </td>
        </template>
      </tr>
    </Table01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/stock-forwardtest.json'
import Table01 from '@@/../components/input/Table01.vue'
export default {
  props: {
    forward: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: {
    Table01,
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
      ],
      tblOpt: {
        widths: ['12%', '12%', '18%', '14%', '22%', '22%'],
      },
    }
  },
}
</script>
