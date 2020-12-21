<template>
  <tr>
    <td class="ranking-list__rank">{{ rank }}</td>
    <td><google-line-chart :size="[83, 24]" class="img-chart" :data="obj.chart"/></td>
    <td><div class="ranking-list__name wrap-text">{{ obj.name }}</div></td>
    <td>{{ obj.return }}%</td>
    <td>￥{{ obj.amount }}</td>
    <td>{{ obj.winRate }}%</td>
    <td>{{ obj.pf }}</td>
    <td>{{ obj.riskRate }}%</td>
  </tr> 
</template>

<script>
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'

export default {
  components: {
    GoogleLineChart,
  },
  props: ['obj', 'rank'],
}
</script>

<style lang="scss" scoped>
td {
  padding: 7px 0;
  text-align: center;
}
.ranking-list__rank {
  font-weight: bold;
}
.ranking-list__name {
  width: 140px;
  margin: 0 auto;
}
</style>
