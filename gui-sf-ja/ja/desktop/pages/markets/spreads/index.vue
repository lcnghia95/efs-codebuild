<template>
  <div class="w-1000 flex layout-col">
    <div class="p-30 bg-co-59 p-30">
      <div class="w-full text-center co-53 fs-30">{{ $t('1') }}</div>
      <div class="pt-10 pb-10 bg-white mt-30 border-radius-5 h-700">
        <div class="flex mid spread-select ml-10 p-10 border-all border-radius-5" v-if="lineStock.length && !showLoading">
          <radio v-for="(item,i) in settings" :key="i" v-model.number="setting" :attrs="{name: 'setting', value: i, class: 'mr-10'}" :label="item" />
          <select class="custom-select ml-auto" v-model.number="pair">
            <option :value="i" v-for="(item,i) in pairs" :key="'XpKr' + i">{{ item }}</option>
          </select>
        </div>
        <div class="pt-10 pb-10 bg-white border-radius-5 mt-220">
          <div class="h-600 pos-rel p-t-10">
            <LineStock ref="lineStock" :chart="lineStock" :option="lineStockOptions" v-if="lineStock.length && !showLoading" />
            <div class="h-600 flex mid center bg-white mtb-300" v-if="showLoading">
              <img src="https://fx-on.com/img/spread/loading.gif" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-30 bg-co-59 p-30 mt-30">
      <div class="w-full text-center co-53 fs-30">{{ $t('6') }}</div>
      <table class="border-all fs-12 bg-white table02 mt-20  no-select" v-if="realtimeBrokers">
        <thead>
          <tr class="row-middle-all text-center w-full co-white">
            <th class="w-40">#</th>
            <th @click="onChangeSortType(0)" class="cursor-pointer">
              <span>
                {{ $t('7') }}
                <sort-down class="o-icon-sort" v-if="sortType==999" />
                <sort-up class="o-icon-sort u-up" v-if="sortType==-999" />
              </span>
            </th>
            <th class="w-70 cursor-pointer fs-10" v-for="(_pair, i) in pairs" :key="i" @click="onChangeSortType(i)">
              <span>
                {{ _pair }}
              </span>
              <span>
                <sort-down class="o-icon-sort" v-if="sortType==i" />
                <sort-up class="o-icon-sort u-up" v-if="sortType==-i" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="realtimeData">
          <template v-for="(brk, index) in realtimeBrokers" :class="'row-middle-all bg-co-'+ index%2">
            <tr :key="index" v-if="brk.id != 265">
              <!-- business -->
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                <div class="flex space-between">
                  <div class="w-100 wrap-text" :title="brk.name">
                    <a class="no-dec ho-change" :href="brk.newUrl || '/companies/' + brk.id" v-if="brk.url">{{ brk.name }}</a>
                    <div class="w-100 wrap-text" v-else :title="brk.name">{{ brk.name }}</div>
                  </div>
                  <div v-if="brk.id != 114">
                    <!-- business -->
                    <span class="real fs-11 mr-5" v-if="brk.real">{{ $t('9') }}</span>
                    <a class="foreing" v-if="brk.newUrl" :href="brk.newUrl" target="_blank">{{ $t('10') }}</a>
                  </div>
                </div>
              </td>
              <td v-for="(item, idx) in pairs" class="text-center" :key="idx" :id="brk.id + '_' + idx + '_td'">
                <a :href="`/markets/spreads/${brk.id}/${idx}`" :id="brk.id + '_' + idx + '_a'">
                  {{ getDataRealTime(brk.id, idx) }}
                </a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="co-red fs-12 pt-5">{{ $t('8') }}</div>
    </div>
  </div>
</template>
<script>
import LineStock from '@@/../components/charts/LineStock01.vue'
import i18n from '@@/lang/desktop/spread-brokers.json'
import Radio from '@@/../components/form/Radio.vue'
import title from '@@/../common/pages'
import SortDown from '@@/../components/icons/SortDown.vue'
import SortUp from '@@/../components/icons/SortUp.vue'
const obj = Object.assign(
  {
    components: {
      SortDown,
      SortUp,
      LineStock,
      Radio,
    },
    data() {
      return {
        URL: '/api/v3/surface/spread',
        market: null,
        brokers: null,
        lineStock: [],
        realtimeData: {},
        realtimeBrokers: [],
        settings: [this.$t('2'), this.$t('3'), this.$t('4')],
        sortType: 0,
        revertMaps: {
          0: 1,
          1: 3,
          2: 8,
          4: 2,
          8: 9,
          3: 4,
          12: 11,
          5: 7,
          6: 6,
          7: 5,
          10: 11,
          11: 36,
          13: 10,
        },
      }
    },
    i18n: {
      messages: i18n,
    },
    watch: {
      setting() {
        this.lineStockOptions.title.text = `${this.pairs[this.pair]} ${
          this.settings[this.setting]
        } Spread`
        this.getDataChart()
      },
      pair() {
        this.lineStockOptions.title.text = `${this.pairs[this.pair]} ${
          this.settings[this.setting]
        } Spread`
        this.getDataChart()
      },
    },
    mounted() {
      this.onGetDataRealTimeBrokers()
      this.getDataChart()
    },
    async asyncData({ app }) {
      let [brokers, realtimeBrokers] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/spread/company'),
          app.GoGoHTTP.get('/api/v3/surface/spread/realtime'),
        ]),
        locale = app.i18n.locale,
        setting = 0,
        pair = 1,
        settings = [i18n[locale][2], i18n[locale][3], i18n[locale][4]],
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
        lineStockOptions = {
          title: {
            text: `${pairs[pair]} ${settings[setting]} Spread`,
            style: {
              fontWeight: 'bold',
              fontSize: '26px',
            },
            y: 55,
            floating: true,
          },
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
          },
          rangeSelector: true,
          inputEnabled: true,
          buttonPosition: {
            align: 'left',
            y: -25,
          },
          inputPosition: {
            align: 'right',
            x: -10,
            y: -25,
          },
          navigator: true,
        },
        showLoading = true
      return {
        brokers,
        realtimeBrokers,
        showLoading,
        titleChunk: i18n[locale][11],
        lineStockOptions,
        pairs,
        pair,
        settings,
        setting,
        descriptionTemplate() {
          return i18n[locale][12]
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/markets/spreads',
          },
        ],
      }
    },
    computed: {
      title() {
        return (
          this.pairs[this.pair] +
          ' ' +
          this.settings[this.setting] +
          ' ' +
          this.$t('5')
        )
      },
    },
    methods: {
      onGetDataRealTimeBrokers() {
        (this.realtimeBrokers || []).forEach(item => {
          this.onGetDataRealTime(item.id)
        })
      },
      getDataRealTime(brkId, _pair) {
        if (!this.realtimeData[brkId]) {
          return '-'
        }
        let _data =
          this.realtimeData[brkId].filter(item => {
            return (parseInt(item.Symbol) === parseInt(_pair))
          })[0] || []
        return _data.Spread || '-'
      },
      getDataChart() {
        let me = this
        this.showLoading = true
        me.lineStock = []
        me.brokers.forEach(item => {
          if (item.id === 265) {
            return
          }
          me.GoGoHTTP.get('/api/v3/spread/performance', {
            params: {
              id: item.id,
              symbol: me.pair,
              setting: me.settings[me.setting],
              dayago: 7,
              callback: '?',
            },
          }).then(data => {
            me.lineStock.push({
              name: item.name,
              data: data,
              id: item.id,
            })
            me.showLoading = false
          })
        })
      },
      onGetDataRealTime(_id) {
        let me = this
        me.GoGoHTTP.get('/api/spread_realtime.php', {
          baseURL: process.env.FXON_BLOG_URL,
          params: {
            id: _id,
            callback: '?',
          },
        })
          .then(data => {
            data = data.substring(2, data.length - 2)
            data = JSON.parse(data)
            for (let props in data) {
              if (data[props].Spread !== 0) {
                let el = $(
                    '#' +
                      _id +
                      '_' +
                      data[props].Symbol +
                      '_td'
                  ),
                  ela = $(
                    '#' +
                      _id +
                      '_' +
                      data[props].Symbol +
                      '_a'
                  ),
                  _number = parseFloat(el.text()),
                  _spread = parseFloat(data[props].Spread).toFixed(1)
                ela.text(_spread || '-')
                if (_number < _spread) {
                  el.css('background-color', '#fee4e4')
                } else if (_number > _spread) {
                  el.css('background-color', '#dffedf')
                }
                setTimeout(() => {
                  el.css('background-color', '')
                }, 1000)
              }
            }
            me.realtimeData[_id] = data
          })
          .finally(() => {
            setTimeout(() => {
              me.onGetDataRealTime(_id)
            }, 5000)
          })
      },
      onChangeSortType(_type) {
        if (parseInt(_type) === 0) {
          if (this.sortType === 0) {
            this.$set(this, 'sortType', -999)
          } else {
            if (this.sortType === -999) {
              this.$set(this, 'sortType', 999)
            } else {
              this.$set(this, 'sortType', -999)
            }
          }
        } else {
          if (Math.abs(this.sortType) !== parseInt(_type)) {
            this.$set(this, 'sortType', parseInt(_type))
          } else {
            this.$set(this, 'sortType', -this.sortType)
          }
        }
        this.onSortDataByType()
      },
      onSortDataByType() {
        if (this.sortType === -999) {
          this.realtimeBrokers = this.realtimeBrokers.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          return
        } else if (this.sortType === 999) {
          this.realtimeBrokers = this.realtimeBrokers.sort((a, b) => {
            return b.name.localeCompare(a.name)
          })
          return
        }
        let arr = [],
          me = this,
          tmpArr = []
        for (let i in me.realtimeData) {
          let obj = $.grep(me.realtimeData[i], function(obj) {
            return parseInt(obj.Symbol) === Math.abs(me.sortType)
          })[0]
          arr.push([parseInt(i), (obj || {}).Spread])
        }
        arr.sort((a, b) => {
          if (me.sortType > 0) {
            return a[1] - b[1]
          } else {
            return b[1] - a[1]
          }
        })
        for (let j in arr) {
          let brk = $.grep(me.realtimeBrokers, function(obj) {
            return parseInt(obj.id) === parseInt(arr[j][0])
          })[0]
          tmpArr.push(brk)
        }
        me.$set(me, 'realtimeBrokers', tmpArr)
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.w-40 {
  width: 40px;
}
.w-70 {
  width: 70px;
}
.w-100 {
  width: 100px;
}
.w-full {
  width: 100%;
}
.h-700 {
  height: 700px;
}
.fs-30 {
  font-size: 30px;
}
.fs-10 {
  font-size: 10px;
}
.mtb-300 {
  margin: 300px 0;
}
.table02 {
  tr {
    border-bottom: 1px solid #b4b5b6;
    border-left: 1px solid #b4b5b6;
    border-right: 1px solid #b4b5b6;
  }
  th {
    font-weight: normal;
    line-height: 20px;
  }
}
td,
th {
  padding-top: 4px;
  padding-bottom: 4px;
}
th {
  text-align: center;
}
.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 2s;
}
@keyframes fadeInOpacity {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
.spread-select {
  top: 10px;
  width: 920px;
}
.custom-select {
  height: 22px;
  border-radius: 3px;
  font-size: 12px;
}
.real {
  background: #00623d;
  border-radius: 3px;
  padding: 0 2px;
  color: white;
}
.foreing {
  background: #156fe2;
  border-radius: 3px;
  padding: 0 2px;
  color: white;
}
.border-radius-5 {
  border-radius: 5px;
}
.bg-co-59 {
  background: linear-gradient(
    to bottom,
    rgb(242, 240, 237) 0%,
    rgb(215, 215, 215) 100%
  );
}
.pos-rel {
  position: relative;
}
/deep/ .spread-select .c-label {
  position: relative;
  padding-left: 22px;
  margin-bottom: 0;
  user-select: none;
  margin-right: 10px;
}
.co-red {
  color: red;
}
.bg-white {
  background: white;
}
.ml-auto {
  margin-left: auto;
}
.no-dec {
  text-decoration: none;
}
.ho-change {
  color: black;
  &:hover {
    color: gray;
  }
}
.o-icon-sort {
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin-top: 2px;
  position: absolute;
  /deep/ svg {
    width: 10px;
    height: 10px;
    color: rgb(102, 102, 102);
  }
  /deep/ &.u-up svg {
    margin-top: 3px;
  }
}
.no-select {
  user-select: none;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>