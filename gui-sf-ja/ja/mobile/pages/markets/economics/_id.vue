<template>
  <div>
    <div class="page-title pt-10 pb-10 pl-15">
      <strong>{{ $t('1') }}</strong>
    </div>
    <div class="p-10">
      <div class="pt-10 pb-10 border-bottom"><b>{{ (data || {}).Name }}{{ y }}</b></div>
      <table class="w-full border-radius-5 info">
        <tbody>
          <tr>
            <td width="30%" class="bg-color border-top-left-radius"><p>{{ $t('7') }}</p></td>
            <td><div>{{ formatTime((data || {}).CheckDate, 8) }}</div></td>
            <td class="border-top-right-radius" style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color"><p>{{ $t('8') }}</p></td>
            <td><div>{{ formatTime((data || {}).CheckDate, 17) }}</div></td>
            <td style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color"><p>{{ $t('9') }}</p></td>
            <td><div style="padding: 3px 0;"><img :src="'https://fx-on.com/img/flags/' + (data || {}).Country + '.gif'" alt /></div></td>
            <td style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color"><p>{{ $t('10') }}</p></td>
            <td><div style="padding-bottom: 1px;"><star v-for=" i in parseInt((data || {}).Value || 0)" :key="'star-' + i" /></div></td>
            <td style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color"><p>{{ $t('11') }}</p></td>
            <td><div>{{ (data || {}).LastTime || '-' }}</div></td>
            <td style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color"><p>{{ $t('12') }}</p></td>
            <td><div>{{ (data || {}).ThisTime || '-' }}</div></td>
            <td style="width: 10px;"></td>
          </tr>
          <tr>
            <td class="bg-color border-bottom-left-radius"><p class="border-none">{{ $t('13') }}</p></td>
            <td><div>{{ (data || {}).Result || '-' }}</div></td>
            <td class="border-bottom-right-radius" style="width: 10px;"></td>
          </tr>
        </tbody>
      </table>
      <div class="border-all mt-20 chart mb-50">
        <div class="text-center header p-10"><b>{{ $t('16') }}</b></div>
        <div class="flex layout-col mt-15 mb-10">
          <div class="flex">
            <div class="ml-auto">
              <button class="co-up border-none co-white border-radius-5 mr-10" :disabled="!isLogin" @click="onPostRating(1)">
                {{ $t('14') }}
              </button>
              <div class="text-center">{{ this.percent.up }}%</div>
            </div>
            <div class="mr-auto">
              <button class="co-down border-none co-white border-radius-5 ml-10" :disabled="!isLogin" @click="onPostRating(2)">
                {{ $t('15') }}
              </button>
              <div class="text-center">{{ this.percent.down }}%</div>
            </div>
          </div>
          <img 
            :src="'https://chart.apis.google.com/chart?cht=p3&chd=t:' + 
              (dataChart[1] || 0) + ',' + (dataChart[2] || 0) + 
              '&chs=250x120&chco=ff6666,6699ff&chl=' + 
              $t('17') + '|' + $t('18')" 
            alt=""
            v-if="dataChart.length != 0"
          />
          <img src="https://fx-on.com/img/economic/e_pie_chart.png" alt="" class="w-250 h-150" v-else />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/markets-economics.json'
import title from '@@/../common/pages'
import Star from '@@/../components/icons/Star.vue'
import { filterInt } from '@/utils/client/common'
const obj = Object.assign({
  i18n: {
    messages: i18n
  },
  components: {
    Star
  },
  data() {
    return {
    data: null,
    dataChart: null,
    isLogin: !!this.$store.state.user.id,
    }
  },
  watch: {
    dataChart() {
    this.calcDataChart()
    },
  },
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  async asyncData({ app, params, error }) {
    let [data, dataChart] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/market/${params.id}`),
        app.GoGoHTTP.get(`/api/v3/surface/market/${params.id}/chart`),
      ]),
      percent = {
        up: 0,
        down: 0,
      },
      locale = app.i18n.locale,
      y = `（${new Date().getFullYear()}${i18n[locale][6]}）`
    if (!data || !Object.keys(data).length) {
      return error({ statusCode: 404 })
    }
    if (Object.keys(dataChart).length) {
      let up = dataChart[1] || 0,
        down = dataChart[2] || 0
      percent.up = (up / (up + down)) * 100
      percent.down = 100 - percent.up
    }
    return {
        data,
        y,
        dataChart,
        titleChunk: `${data.Name}${y} - ${i18n[locale][4]}`,
        id: params.id,
        percent,
        descriptionTemplate() {
          return (data.Name || '') + i18n[locale][5]
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/markets/economics/${params.id}`,
          },
        ]
    }
  },
  methods: {
    calcDataChart() {
    if (Object.keys(this.dataChart).length) {
        let up = this.dataChart[1] || 0,
        down = this.dataChart[2] || 0
        this.percent.up = (up / (up + down)) * 100
        this.percent.down = 100 - this.percent.up
    }
    },
    onPostRating(_val) {
        this.GoGoHTTP.post(`/api/v3/surface/market/${this.id}/rate`, {
            value: _val,
        }).then(data => {
            data && (this.dataChart = data)
        })
    },
  },
},title)
export default obj
</script>
<style lang="scss" scoped>
.page-title {
  background-color: #f3f0ef;
  font-weight: bold;
  padding: 5px;
  line-height: 30px;
  color: #434343;
  font-size: 16px;
  border-bottom: 1px solid #d0d0d0;
}
.info {
  border-collapse: separate;
  div {
    text-align: right;
  }
  p {
    padding: 5px 0;
    margin: 0 0 0 10px;
    border-bottom: 1px solid #d0d0d0;
  }
  tr {
    &:first-child {
      td {
        border-top: 1px solid #d0d0d0;
      }
    }
    td {
      &:last-child {
        border-right: 1px solid #d0d0d0;
      }
      &:first-child {
        border-left: 1px solid #d0d0d0;
      }
      &:nth-child(2) {
        border-bottom: 1px solid #d0d0d0;
      }
    }
  }
}
.chart {
  border-radius: 5px;
  img {
    width: 60vw;
    height: auto;
    margin: auto;
    min-width: 280px;
  }
  .co-up {
    background-color: #f66;
  }
  .co-down {
    background-color: #69f;
  }
  button {
    width: 100px;
    height: 30px;
  }
  .header {
    background: #f3f0ef;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: #2d2d2d;
  }
}
div /deep/ .icon-cls {
  color: #f90;
  height: 20px;
  width: 20px;
}
.border-none {
  border: none !important;
}
.co-white {
  color: white;
}
.border-radius-5 {
  border-radius: 5px;
}
.ml-auto {
  margin-left: auto;
}
.mr-auto {
  margin-right: auto;
}
.bg-color {
  background-color: #f3f0ef;
}
.border-top-left-radius {
  border-top-left-radius: 5px;
}
.border-top-right-radius {
  border-top-right-radius: 5px;
}
.border-bottom-left-radius {
  border-bottom-left-radius: 5px;
  border-bottom: 1px solid #d0d0d0;
}
.border-bottom-right-radius {
  border-bottom-right-radius: 5px;
  border-bottom: 1px solid #d0d0d0;
}
</style>