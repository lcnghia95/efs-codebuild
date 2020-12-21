<template>
  <div>
    <div class="top-title mb-10">{{ $t(1) }}</div>
    <div class="pt-15 pt-5 text-center chart-title ">{{ $t(2) }}</div>
    <SpreadChart 
      :chart="lineStock" class="p-10" 
      style="background: #f3f0ef;"
      :hide-range-select="false"
      :is-loading="isLoading"
      :current-symbol="pair"
      @onSymbolSelect="value => pair = value"
      :options="{ 
        chart: { 
          height: 400,
          margin: [0, 5, 120, 5],
          backgroundColor: '#f3f0ef',
          plotBackgroundColor: '#fff'
        },
        legendBoxBg: '#fff',
        title: {},
      }"
    />
    <div style="background: #f3f0ef; padding: 10px 10px 50px 10px;">
      <a :href="company.url || '/companies/' + company.id" v-if="company.id" class="green-btn">
        <span class="m-center co-white fs-20">{{ $t(3) }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/markets-spreads-detail.json'
import title from '@@/../common/pages'
import SpreadChart from '@/components/markets/SpreadChart.vue'
import { filterInt, pushState } from '@/utils/client/common'
const obj = Object.assign(
  {
    components: {
      SpreadChart,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id)) && (!params.pair || params.pair.match(/^\d+$/gm))
    },
    mounted() {
      this.lineStock = []
      this.getDataChart()
    },
    i18n: {
      messages: i18n,
    },
    watch: {
      pair() {
        pushState(
          `markets/spreads/${this.id}/${this.pair}`,
          null,
          '',
          location.protocol + '//' + location.host
        )
        this.titleChunk = `${this.pair ? this.pairs[this.pair] + ' - ' : ''}${this.company.name +
          (this.pair ? ' : ' : ' - ') || ''}${this.$t(6)}`
        this.getDataChart()
      },
    },
    async asyncData({ app, params, error }) {
      let [data, company] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/spread/marketDetail`),
          app.GoGoHTTP.get(`/api/v3/surface/spread/company/${params.id}`),
        ]),
        settings = ['High', 'Avg', 'Low'],
        locale = app.i18n.locale,
        rawpair = parseInt(params.pair),
        pair = rawpair || 1,
        id = params.id,
        pairs = {
          1: 'USD/JPY',
          3: 'EUR/JPY',
          8: 'EUR/USD',
          2: 'GBP/JPY',
          9: 'GBP/USD',
          4: 'AUD/JPY',
          11: 'AUD/USD',
          7: 'NZD/JPY',
          6: 'CAD/JPY',
          5: 'CHF/JPY',
        },
        other = {
          type: 'flags',
          name: i18n[locale][7],
          data: data,
          shape: 'circlepin',
          width: 16,
          color: '#f28f43',
          visible: true,
          cursor: 'pointer',
        },
        isLoading = false
      if(!pairs[pair]) {
        return error({ statusCode: 404 })
      }
      if (!company.id) {
        return error({ statusCode: 404 })
      }
      return {
        company,
        settings,
        isLoading,
        other,
        titleChunk: `${rawpair ? pairs[rawpair] + ' - ' : ''}${company.name +
          (rawpair ? ' : ' : ' - ') || ''}${i18n[locale][6]}`,
        pairs,
        pair,
        rawpair,
        id,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/markets/spreads/${id}${
              rawpair ? '/' + rawpair : ''
            }`,
          },
        ],
      }
    },
    data() {
      return {
        lineStock: [],
      }
    },
    methods: {
      descriptionTemplate() {
        return (
          (this.company.name || '') +
          this.$t(this.rawpair ? 5 : 4, [this.pairs[this.rawpair]])
        )
      },
      getDataChart() {
        let me = this,
          colors = {
            'Avg': '#7cb5ec',
            'High': '#434348',
            'Low': '#90ed7d',
          }
        if(me.isLoading) {
          return
        }
        me.isLoading = true
        me.$set(me, 'lineStock', [])
        me.other.data.forEach(item => {
          item.events = {
            click: function() {
              window.open('/markets/economics/' + item.id)
            },
          }
        })
        me.lineStock.push(me.other)
        me.settings.forEach(item => {
          me.GoGoHTTP.get('/api/v3/spread/performance', {
            params: {
              id: me.id,
              symbol: me.pair,
              setting: item,
              dayago: 7,
              callback: '?',
            },
          }).then(data => {
            me.lineStock.push({
              name: item,
              data,
              id: item.id,
              color: colors[item],
            })
            me.isLoading = false
          })
        })
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scope>
.top-title {
  font-weight: bold;
  padding: 5px;
  line-height: 30px;
  color: #434343;
  background: #f3f0ef;
  font-size: 16px;
  border-bottom: 1px solid #d0d0d0;
}
.table-title {
  font-size: 2.1rem;
  font-weight: bold;
  text-align: center;
  margin: 14px 0;
}
.chart-title {
  font-size: 1.5rem;
  font-weight: bold;
  background: #f3f0ef;
}
.green-btn {
  display: block;
  background: #479400;
  color: #fff;
  line-height: 50px;
  height: 50px;
  border-radius: 5px;
  text-align: center;
}
</style>