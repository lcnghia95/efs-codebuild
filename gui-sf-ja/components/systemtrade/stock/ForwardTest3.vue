<template>
  <section>
    <Table01 :headers="headers" class="forward-table">
      <tr v-for="(row,i) in data" :key="'forward-row3-' + i" class="row-middle-all" v-if="i < 15" >
        <template v-if="row.status">
          <td colspan="11"><span class="pl-10">{{ $t('20') }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ row.openTime ? formatTime(row.openTime, 4) : '-' }}</td>
          <td class="text-center">
            <span class="wrap-text" :title="row.name">{{ row.name }}</span>
          </td>
          <td class="text-center">{{ $t('t' + (row.orderType || 0)) }}</td>
          <td class="text-center">{{ formatNumber(row.openQuantity, '-') }}</td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.openPrice ? formatNumber(row.openPrice) + '円' : '-' }}
            </span>
          </td>
          <td :class="{'text-right': row.closePrice, 'text-center': !row.closePrice}">
            <span class="pr-5">
              {{ row.closePrice ? formatNumber(row.closePrice) + '円' : '-' }}
            </span>
          </td>
          <td class="text-center">{{ row.closeTime ? formatTime(row.closeTime, 4) : '-' }}</td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.runUp || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.drowDown || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.profit || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.profitSum || 0) }}円
            </span>
          </td>
        </template>
      </tr>
      <tr v-if="!data.length"><td :colspan="headers.length" class="text-center co-red">{{ $t('18') }}</td></tr>
    </Table01>
    <Table01 :headers="headers" class="forward-table" v-if="data.length > 13">
      <tr v-for="(row,i) in data" :key="'forward-row3-' + i" class="row-middle-all" v-if="i > 14" >
        <template v-if="row.status">
          <td colspan="13"><span class="pl-10">{{ $t('20') }}</span></td>
        </template>
        <template v-else>
          <td class="text-center">{{ row.openTime ? formatTime(row.openTime, 4) : '-' }}</td>
          <td class="text-center">
            <span class="wrap-text" :title="row.name">{{ row.name }}</span>
          </td>
          <td class="text-center">{{ $t('t' + (row.orderType || 0)) }}</td>
          <td class="text-center">{{ formatNumber(row.openQuantity, '-') }}</td>
          <td class="text-right">
            <span class="pr-5">
              {{ row.openPrice ? formatNumber(row.openPrice) + '円' : '-' }}
            </span>
          </td>
          <td :class="{'text-right': row.closePrice, 'text-center': !row.closePrice}">
            <span class="pr-5">
              {{ row.closePrice ? formatNumber(row.closePrice) + '円' : '-' }}
            </span>
          </td>
          <td class="text-center">{{ row.closeTime ? formatTime(row.closeTime, 4) : '-' }}</td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.runUp || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.drowDown || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.profit || 0) }}円
            </span>
          </td>
          <td class="text-right">
            <span class="pr-5">
              {{ formatNumber(row.profitSum || 0) }}円
            </span>
          </td>
        </template>
      </tr>
    </Table01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/stock-forward-test.json'
import Table01 from '@@/../components/input/Table01.vue'
export default {
  components: {
    Table01,
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      headers: [
        {
          title: this.$t('1'),
          classes: ['text-center', 'w-70'],
        },
        {
          title: this.$t('3'),
          classes: ['text-center'],
        },
        {
          title: this.$t('5'),
          classes: ['text-center', 'w-40'],
        },
        {
          title: this.$t('6'),
          classes: ['text-center', 'w-50'],
        },
        {
          title: this.$t('7'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('8'),
          classes: ['text-center', 'w-70'],
        },
        {
          title: this.$t('9'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('11'),
          classes: ['text-center', 'w-90'],
        },
        {
          title: this.$t('14'),
          classes: ['text-center', 'w-100'],
        },
        {
          title: this.$t('15'),
          classes: ['text-center', 'w-90'],
        },
        {
          title: this.$t('16'),
          classes: ['text-center', 'w-110'],
        },
      ],
    }
  },
}
</script>
