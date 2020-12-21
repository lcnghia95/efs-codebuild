<template>
  <section>
    <Table01 :headers="headers" class="ranking-table" :options="tblOpt">
      <tr v-for="(product,i) in ranking" :key="'ranking-row-' + i" class="row-middle-all">
        <td class="text-center"><b>{{ i + 1 }}</b></td>
        <td class="text-left flex mid">
          <google-line-chart :size="[48,20]" :data="product.chart"/>
          <GogoLink class="ranking-link wrap-text pl-5 pr-5" :target="product.detailUrl" :title="product.name">
            {{ product.name }}
          </GogoLink>
        </td>
        <td class="text-center">{{ product.profitRate ? product.profitRate + '%' : '-' }}</td>
        <td class="text-right"><span class="pr-5">{{ product.profitTotal ? formatNumber(product.profitTotal) + '円' : '-' }}</span></td>
        <td class="text-center">{{ product.profitFactor ? formatNumber(product.profitFactor) : '-' }}</td>
        <td class="text-center">{{ product.riskReturn ? product.riskReturn + '%' : '-' }}</td>
      </tr>
    </Table01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-mobile/system-ranking.json'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Table01 from '@@/../components/input/Table01.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
export default {
  components: {
    GoogleLineChart,
    Table01,
    GogoLink,
  },
  props: {
    ranking: {
      type: Array,
      detault: () => {
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
        widths: ['8%', '30%', '12%', '22%', '12%', '16%'],
      },
    }
  },
}
</script>
<style lang="scss" scoped>
/deep/ .ranking-table {
  thead {
    background: white;
    th {
      font-size: 3vw;
      color: #a0a0a0;
      border-bottom: 2px solid #f3f0ef;
    }
  }
  tbody {
    tr {
      font-size: 3.2vw;
      td {
        padding: 3vw 0;
        border-bottom: 1px dotted #e8e5e3;
        span {
          display: block;
        }
      }
      &:nth-child(odd) {
        background: white;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
  .ranking-link {
    width: 100%;
    color: #666;
  }
}
</style>
