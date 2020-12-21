<template>
  <section>
    <LeftTitle :text="$t('1')" class="mt-30"/>
    <ul>
      <li v-for="(item,idx) in rankingTitles" :key="'ranking-' + idx"
          :class="{'ranking-tab-active' : rankingTab == idx}"
          @click="clickRankingTab(idx)"
          class="ranking">
        {{ item }}
      </li>
    </ul>
    <Table01 :headers="headers" class="ranking-table">
      <tr v-for="(product,i) in ranking" :key="'ranking-row-' + i" class="row-middle-all">
        <td class="text-center"><b>{{ i + 1 }}</b></td>
        <td class="text-center"><google-line-chart :size="[83,24]" :data="product.chart"/></td>
        <td class="text-left">
          <GogoLink class="ranking-link" :target="product.detailUrl">
            <span class="wrap-text pl-20 link-color" :title="product.name">{{ product.name }}</span>
          </GogoLink>
        </td>
        <td class="text-center">{{ product.profitRate ? product.profitRate + '%' : '-' }}</td>
        <td class="text-right">
          <span class="pr-10">
            {{ product.profitTotal ? formatNumber(product.profitTotal) + $t('cur' + (product.currencyType || 1)) : '-' }}
          </span>
        </td>
        <td class="text-center">{{ product.winningRate ? product.winningRate + '%' : '-' }}</td>
        <td class="text-center">{{ formatPF(product.profitFactor) }}</td>
        <td class="text-center">{{ product.riskReturn ? product.riskReturn + '%' : '-' }}</td>
      </tr>
    </Table01>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/systemtrade-ranking.json'
import LeftTitle from '@@/../components/systemtrade/LeftTitle.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Table01 from '@@/../components/input/Table01.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import { formatPF } from '@/utils/client/common'
export default {
  components: {
    LeftTitle,
    GoogleLineChart,
    Table01,
    GogoLink,
  },
  props: {
    rankingList: {
      type: Object,
      detault: () => {
        return {}
      },
    },
  },
  i18n: {
    messages: i18n,
  },
  created() {
    this.ranking = this.rankingList['profit']
  },
  data() {
    return {
      rankingTab: 'profit',
      rankingTitles: {
        bestSell: this.$t('2'),
        returnRate: this.$t('3'),
        profit: this.$t('4'),
      },
      ranking: [],
      headers: [
        {
          title: this.$t('5'),
          classes: ['text-center', 'w-60'],
        },
        {
          title: this.$t('6'),
          classes: ['text-center', 'w-120'],
        },
        {
          title: this.$t('7'),
          classes: ['text-center'],
        },
        {
          title: this.$t('8'),
          classes: ['text-center', 'w-100'],
        },
        {
          title: this.$t('9'),
          classes: ['text-center', 'w-100'],
        },
        {
          title: this.$t('10'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('11'),
          classes: ['text-center', 'w-80'],
        },
        {
          title: this.$t('12'),
          classes: ['text-center', 'w-120'],
        },
      ],
    }
  },
  methods: {
    formatPF,
    clickRankingTab(idx) {
      this.rankingTab = idx
      this.ranking = this.rankingList[idx]
    },
  },
}
</script>
<style lang="scss" scoped>
ul {
  width: 100%;
  border-bottom: 5px solid #bdb3b3;
  text-align: right;
  padding: 0;
  li {
    list-style-type: none;
    display: inline-block;
    background-color: #bdb3b3;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
  .month {
    margin: auto 7px -5px 7px;
    padding: 5px 8px;
  }
  .ranking {
    margin: auto 7px -5px 7px;
    padding: 5px 30px;
  }
  .ranking-tab-active {
    background-color: #fff;
    color: #bdb3b3;
    border: 5px solid #bdb3b3;
    border-bottom: none;
  }
}
.ranking-table {
  thead {
    background: white;
    th {
      font-size: 14px;
    }
  }
  tbody {
    tr {
      font-size: 14px;
      td {
        padding: 8px 0;
      }
      &:nth-child(odd) {
        background: #f7f7f7;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
  .ranking-link {
    width: 100%;
    .link-color {
      display: block;
      color: #666;
    }
  }
}
</style>
