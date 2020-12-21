<template>
  <div class="w-1000 flex layout-col">
    <div class="p-30 bg-co-59">
      <div class="w-full detail-title pl-10" v-if="company">{{ pairs[pair] }}&nbsp;{{ (company || {}).name }}</div>
      <div class="mt-30 bg-white p-20 h-640 chart-content">
        <div class="spread-select" v-if="lineStock.length && !showLoading">
          <select class="custom-select ml-auto" v-model.number="pair">
            <option :value="i" v-for="(item,i) in pairs" :key="'XpKr' + i">{{ item }}</option>
          </select>
        </div>
        <div class="h-600 pos-rel pt-10">
          <line-stock ref="lineStock" :chart="lineStock" :option="lineStockOptions" v-if="lineStock.length && !showLoading" />
          <div class="h-600 flex mid center bg-white" v-if="showLoading">
            <img src="https://fx-on.com/img/spread/loading.gif" alt="" />
          </div>
        </div>
      </div>
      <div class="flex mid mt-15">
        <a class="m-center no-dec ho-change" :href="company.url || '/companies/' + company.id" v-if="company.id">
          <div class="w-500 br-5 green-btn">
            <span class="m-center co-white fs-20">{{ $t('32') }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import LineStock from '@@/../components/charts/LineStock01.vue'
import i18n from '@@/lang/desktop/spread.json'
import title from '@@/../common/pages'
import { filterInt, pushState } from '@/utils/client/common'
const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id)) && (!params.pair || params.pair.match(/^\d+$/gm))
    },
    mounted() {
      this.lineStock = []
      this.getDataChart()
      this.other.data.forEach(item => {
        item.events = {
          click: function() {
            window.open('/markets/economics/' + item.id)
          },
        }
      })
      this.lineStock.push(this.other)
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
        this.getDataChart()
      },
    },
    async asyncData({ app, params, store, error }) {
      let [data, company] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/spread/marketDetail`),
          app.GoGoHTTP.get(`/api/v3/surface/spread/company/${params.id}`),
        ]),
        settings = ['High', 'Avg', 'Low'],
        locale = app.i18n.locale,
        rawpair = params.pair,
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
        showLoading = false,
        other = {
          type: 'flags',
          name: i18n[locale][31],
          data: data,
          shape: 'circlepin',
          width: 16,
          color: '#f28f43',
          visible: true,
          cursor: 'pointer',
        }
      if (!company.id) {
        return error({ statusCode: 404 })
      }
      store.commit('pushBC', {
        name: `${company.name}${rawpair ? ' - ' + pairs[rawpair] : ''}`,
        path: `/markets/spreads/${id}${rawpair ? '/' + rawpair : ''}`,
      })
      return {
        company,
        settings,
        showLoading,
        other,
        titleChunk: `${rawpair ? pairs[rawpair] + ' - ' : ''}${company.name +
          (rawpair ? ' : ' : ' - ') || ''}${i18n[locale][9]}`,
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
    components: { LineStock },
    data() {
      return {
        lineStock: [],
        lineStockOptions: {
          chart: {
            plotShadow: true,
            height: 600,
            margin: [40, 20, 20, 20],
          },
          legend: {
            enabled: true,
            layout: 'horizontal',
            verticalAlign: 'bottom',
            floating: false,
            useHTML: true,
            x: 0,
            itemWidth: 200,
          },
          rangeSelector: true,
          inputEnabled: true,
          buttonPosition: {
            align: 'left',
            y: -25,
          },
          inputPosition: {
            align: 'center',
            y: -25,
          },
          navigator: true,
        },
        realtimeData: {},
        setting: 0,
        market: null,
        // cMaps: {
        //   1: 0,
        //   3: 1,
        //   8: 2,
        //   2: 4,
        //   9: 8,
        //   4: 3,
        //   11: 10,
        //   7: 5,
        //   6: 6,
        //   5: 7,
        //   12: 10,
        //   36: 11,
        //   10: 13,
        // },
      }
    },
    methods: {
      descriptionTemplate() {
        return (
          (this.company.name || '') +
          this.$t(this.rawpair ? 38 : 37, [this.pairs[this.rawpair]])
        )
      },
      getDataChart() {
        let me = this
        this.showLoading = true
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
              data: data,
              id: item.id,
            })
            me.showLoading = false
          })
        })
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.ho-change {
  &:hover {
    opacity: 0.8;
  }
}
.no-dec {
  text-decoration: none;
}
.green-btn {
  text-align: center;
  vertical-align: middle;
  line-height: 80px;
  background: #479400;
  border-radius: 5px;
}
.co-white {
  color: white;
}
.fs-20 {
  font-size: 20px;
}
.m-center {
  margin: 0 auto;
}
.w-500 {
  width: 500px;
}
.chart-content {
  height: 640px;
  border-radius: 10px;
  position: relative;
}
.detail-title {
  border-left: 5px solid #f60;
  font-size: 30px;
}
.spread-select {
  position: absolute;
  float: right;
  right: 40px;
  z-index: 8;
  top: 45px;
  select {
    height: 22px;
    width: 120px;
  }
}
.h-600 {
  height: 600px;
}
.bg-co-59 {
  background: #ededed;
}
.bg-white {
  background: white;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>