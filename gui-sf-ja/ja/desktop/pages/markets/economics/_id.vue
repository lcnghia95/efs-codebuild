<template>
  <div v-if="data" class="w-1000 pos-rel">
    <div class="fs-18 pt-10 pb-10 border-bottom">{{ (data || {}).Name }}{{ y }}</div>
    <div class="flex space-between">
      <div class="w-800">
        <div class="flex space-between">
          <div class="w-250 border-all pl-10 pr-10 mt-20 fs-12">
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('2') }}</b>
              <span>{{ formatTime((data || {}).CheckDate, 8) }}</span>
            </div>
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('3') }}</b>
              <span>{{ formatTime((data || {}).CheckDate, 17) }}</span>
            </div>
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('9') }}</b>
              <img :src="'https://fx-on.com/img/flags/' + (data || {}).Country + '.gif'" alt="" />
            </div>
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('4') }}</b>
              <div class="flex mid center">
                <star v-for=" i in parseInt((data || {}).Value || 0)" :key="'star-' + i" />
              </div>
            </div>
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('6') }}</b>
              <span>{{ (data || {}).LastTime || '-' }}</span>
            </div>
            <div class="flex mid space-between border-bottom pt-5 pb-5">
              <b>{{ $t('7') }}</b>
              <span>{{ (data || {}).ThisTime || '-' }}</span>
            </div>
            <div class="flex mid space-between pt-5 pb-5">
              <b>{{ $t('8') }}</b>
              <span>{{ (data || {}).Result || '-' }}</span>
            </div>
          </div>
          <div class="w-500 border-all p-10 mt-20">
            <div class="text-center"><b>{{ $t('10') }}</b></div>
            <div class="flex mid space-between h-full">
              <div class="m-l-20 w-250 flex space-between">
                <div>
                  <button class="co-up w-100 h-35 border-none co-white border-radius-5" :disabled="!isLogin" @click="onPostRating(1)">
                    {{ $t('13') }}
                  </button>
                  <div class="text-center">{{ this.percent.up }}%</div>
                </div>
                <div>
                  <button class="co-down w-100 h-35 border-none co-white border-radius-5" :disabled="!isLogin" @click="onPostRating(2)">
                    {{ $t('14') }}
                  </button>
                  <div class="text-center">{{ this.percent.down }}%</div>
                </div>
              </div>
              <img :src="'https://chart.apis.google.com/chart?cht=p3&chd=t:' + (dataChart[1] || 0) + ',' + (dataChart[2] || 0) + '&chs=250x120&chco=ff6666,6699ff&chl=' + $t('11') + '|' + $t('12')" alt="" class="w-250 h-150" v-if="dataChart.length != 0" />
              <img src="https://fx-on.com/img/economic/e_pie_chart.png" alt="" class="w-250 h-150" v-else />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-20">
        <a class="banner" v-if="advertiseBanners && advertiseBanners[0]" :href="advertiseBanners[0].landingPageUrl">
          <img :src="advertiseBanners[0].bannerUrl" alt="" class="w-170" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/market.json'
import Star from '@@/../components/icons/Star.vue'
import { filterInt } from '@/utils/client/common'
const obj = Object.assign(
  {
    components: {
      Star,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    data() {
      return {
        data: null,
        dataChart: null,
        isLogin: !!this.$store.state.user.id,
      }
    },
    i18n: {
      messages: i18n,
    },
    watch: {
      dataChart() {
        this.calcDataChart()
      },
    },
    async asyncData({ app, store, params, error }) {
      let [data, dataChart] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/market/${params.id}`),
          app.GoGoHTTP.get(`/api/v3/surface/market/${params.id}/chart`),
        ]),
        percent = {
          up: 0,
          down: 0,
        },
        locale = app.i18n.locale,
        y = `（${new Date().getFullYear()}${i18n[locale][28]}）`,
        advertiseBanners = Object.values(
          store.state.advertisements.advertiseBanners || {}
        )
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      store.commit('pushBC', {
        name: `${data.Name}${y}`,
        path: `/markets/economics/${params.id}`,
      })
      if (Object.keys(dataChart).length) {
        let up = dataChart[1] || 0,
          down = dataChart[2] || 0
        percent.up = (up / (up + down)) * 100
        percent.down = 100 - percent.up
      }
      if(advertiseBanners.length > 0) {
        advertiseBanners[0] = advertiseBanners[0][0]
      }
      return {
        data,
        y,
        dataChart,
        titleChunk: `${data.Name}${y} - ${i18n[locale][26]}`,
        id: params.id,
        percent,
        descriptionTemplate() {
          return (data.Name || '') + i18n[locale][27]
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/markets/economics/${params.id}`,
          },
        ],
        advertiseBanners
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
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.w-800 {
  width: 800px;
}
.w-500 {
  width: 500px;
}
.w-250 {
  width: 250px;
}
.w-200 {
  width: 200px;
}
.w-100 {
  width: 100px;
}
.h-40 {
  height: 40px;
}
.h-150 {
  height: 150px;
}
.co-up {
  background-color: #f66;
}
.co-down {
  background-color: #69f;
}
.co-red {
  color: red;
}
.co-white {
  color: white;
}
.h-14 {
  height: 14px;
}
.h-35 {
  height: 35px;
}
.f-b {
  font-weight: bold;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.border-none {
  border: none;
}
.border-radius-5 {
  border-radius: 5px;
}
.btn-green {
  background: #1ba3b2;
  color: white;
  border-radius: 5px;
  align-self: center;
  border: none;
}
.fs-18 {
  font-size: 18px;
}
.confirm-body {
  height: 90px;
  overflow-y: auto;
  margin: 10px 0;
}
/deep/ .modal-content {
  height: 170px;
  justify-content: center;
  flex-direction: column;
  top: 300px;
}
.btn-orange {
  outline: none;
  background: #ff7d00;
  color: white;
  border-radius: 5px;
  align-self: center;
  border: none;
}
div /deep/ .icon-cls {
  color: #f90;
  height: 20px;
  width: 20px;
}
.fs-11 {
  font-size: 11px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>