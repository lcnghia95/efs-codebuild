<template>
  <div class="w-1000 pos-rel">
    <div class="market-title">
      {{ $t('1') }}
    </div>
    <div class="mt-20 mb-10 text-center flex mid center">
      <a class="ho-change-2 icon-title cursor-pointer" @click="clickPrev">
        <AngleLeft />
      </a>
      <span class="fs-20">{{ formatTime(startDate, 14) }}</span>
      <a class="ho-change-2 icon-title cursor-pointer" @click="clickNext">
        <AngleRight />
      </a>
    </div>
    <table class="boder-all table-full">
      <thead class="fs-14">
        <tr class="header text-center w-full co-white">
          <th class="w-80">{{ $t('2') }}</th>
          <th class="w-70">{{ $t('3') }}</th>
          <th class="w-70">{{ $t('4') }}</th>
          <th class="text-center">{{ $t('5') }}</th>
          <th class="w-110">{{ $t('6') }}</th>
          <th class="w-80">{{ $t('7') }}</th>
          <th class="w-80">{{ $t('8') }}</th>
        </tr>
      </thead>
      <tbody class="fs-12">
        <template v-for="(item, index) in (dataShow || {}).data">
          <tr :key="'trrowspan' + index" :id="'tr-scroll-' + (dataShow || {}).data[index][0].CheckDate">
            <td class="text-center" :rowspan="(dataShow || {}).data[index].length">{{ formatTime(index,19) }}</td>
            <td class="text-center">{{ formatTime((dataShow || {}).data[index][0].CheckDate, 17) }}</td>
            <td>
              <div class="flex mid center">
                <star v-for="i in (parseInt((dataShow || {}).data[index][0].Value) || 0)" :key="'star-' + index + '0' + i" />
              </div>
            </td>
            <td>
              <a :href="'/markets/economics/' + (dataShow || {}).data[index][0].ID" class="no-dec">
                <img :src="'https://fx-on.com/img/flags/' + (dataShow || {}).data[index][0].Country + '.gif'" alt="" class="ml-5" />
                <span class="co-black ho-change no-dec ml-5">{{ (dataShow || {}).data[index][0].Name }}</span>
              </a>
            </td>
            <td class="text-center fs-11">{{ (dataShow || {}).data[index][0].LastTime || '-' }}</td>
            <td class="text-center fs-11">{{ (dataShow || {}).data[index][0].ThisTime || '-' }}</td>
            <td class="text-center fs-11">{{ (dataShow || {}).data[index][0].Result || '-' }}</td>
          </tr>
          <template v-for="(row, idx) in (dataShow || {}).data[index]">
            <tr v-if="idx > 0" class="fs-12" :key="row.ID" :id="'tr-scroll-' + row.CheckDate">
              <td class="text-center">{{ formatTime(row.CheckDate, 17) }}</td>
              <td class="text-center">
                <div class="flex mid center">
                  <star v-for="i in parseInt(row.Value || 0)" :key="'star-' + index + idx + i" />
                </div>
              </td>
              <td>
                <a :href="'/markets/economics/' + row.ID" class="no-dec">
                  <img :src="'https://fx-on.com/img/flags/' + row.Country + '.gif'" alt="" class="ml-5" />
                  <span class="co-black ho-change no-dec ml-5">{{ row.Name }}</span>
                </a>
              </td>
              <td class="text-center fs-11">{{ row.LastTime || '-' }}</td>
              <td class="text-center fs-11">{{ row.ThisTime || '-' }}</td>
              <td class="text-center fs-11">{{ row.Result || '-' }}</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="text-center mt-30">
      <Paging :analytic="true" :cur-page="(dataShow || {}).currentPage"
              :total="(dataShow || {}).lastPage"
              :from="(dataShow || {}).pagingFrom"
              :to="(dataShow || {}).pagingTo"
              @pagingclick="onPagingClick"
      />
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/market.json'
import Paging from '@@/../components/paging/Paging.vue'
import Star from '@@/../components/icons/Star.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import title from '@@/../common/pages'
import { calPaging, pushState } from '@/utils/client/common'
import { MOMENT_LOCALE } from '@@/../common/assets/js/consts'

const procData = function(data, l = 'ja') {
  let res = {}
  for (let i in data.data) {
    let startD = moment
      .unix(data.data[i]['CheckDate'])
      .locale(l)
      .startOf('day')
      .unix()
    if (!res[startD]) {
      res[startD] = []
    }
    res[startD].push(data.data[i])
  }
  data.data = res
  return data
}
const obj = Object.assign(
  {
    components: {
      Paging,
      Star,
      AngleRight,
      AngleLeft,
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      if (this.markScroll) {
        pushState(
          { y: this.y, m: this.m, p: this.p },
          null,
          '',
          '/markets/economics'
        )
        $('html, body').animate(
          {
            scrollTop: $('#tr-scroll-' + this.markScroll).offset().top - 10,
          },
          800
        )
      }
    },
    async asyncData({ app, params }) {
      let dateNow = new Date(),
        y = params.y || dateNow.getFullYear(),
        m =
          params.m - 1 >= 0 && params.m - 1 <= 11
            ? params.m - 1
            : dateNow.getMonth(),
        objDate = {
          year: y,
          month: m,
        },
        locale = app.i18n.locale,
        currentFormat = MOMENT_LOCALE[locale] || MOMENT_LOCALE['ja'],
        startDate = moment(objDate)
          .locale(currentFormat)
          .startOf('month')
          .unix(),
        endDate = moment(objDate)
          .locale(currentFormat)
          .endOf('month')
          .unix(),
        market = await app.GoGoHTTP.get('/api/v3/surface/market', {
          params: {
            from: startDate,
            to: endDate,
          },
        }),
        p = params.p || 1,
        idx = 0,
        dataShow,
        markScroll = 0
      if (!params.y && !params.m && !params.p) {
        for (let i in market) {
          if (
            parseInt(market[i]['CheckDate']) >
            moment()
              .locale(currentFormat)
              .unix()
          ) {
            markScroll = parseInt(market[i]['CheckDate'])
            idx = i
            break
          }
        }
        p = parseInt(idx / 20 + 1)
      }
      dataShow = calPaging(market, p, 20, 4)
      dataShow = procData(dataShow, currentFormat)
      return {
        market,
        startDate,
        titleChunk: i18n[locale][1],
        p,
        y,
        m: m + 1,
        dataShow,
        markScroll,
        currentFormat,
        descriptionTemplate() {
          return i18n[locale][25]
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/markets/economics',
          },
        ],
      }
    },
    methods: {
      changeRoute() {
        let _url = `/markets/economics${this.y ? '/y/' + this.y : ''}${
          this.m ? '/m/' + this.m : ''
        }${this.p ? '/p/' + this.p : '/'}`
        location.href = _url
      },
      onPagingClick(_page) {
        this.p = _page
        pushState(
          { y: this.y, m: this.m, p: this.p },
          null,
          '',
          '/markets/economics'
        )
        this.dataShow = calPaging(this.market, this.p, 20, 4)
        this.dataShow = procData(this.dataShow, this.currentFormat)
      },
      clickPrev() {
        this.m--
        if (this.m < 1) {
          this.m = 12
          this.y--
        }
        this.p = 1
        this.changeRoute()
      },
      clickNext() {
        this.m++
        if (this.m > 12) {
          this.m = 1
          this.y++
        }
        this.p = 1
        this.changeRoute()
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.w-70 {
  width: 70px;
}
.w-80 {
  width: 80px;
}
.w-110 {
  width: 110px;
}
.market-title {
  font-size: 26px;
  color: #a40000;
}
td,
th {
  border: 1px solid #b4b5b6;
  padding-top: 10px;
  padding-bottom: 10px;
}
th {
  text-align: center;
}
.no-dec {
  text-decoration: none;
}
.header {
  background-color: #a40000;
}
.co-star {
  color: #f90;
}
.table-full {
  width: 100%;
  table-layout: fixed;
}
.ho-change {
  &:hover {
    opacity: 0.8;
  }
}
.ho-change-2 {
  &:hover {
    opacity: 0.5;
  }
}
.co-black {
  color: black;
}
.co-white {
  color: white;
}
.fs-20 {
  font-size: 20px;
}
.fs-14 {
  font-size: 14px;
}
.fs-12 {
  font-size: 12px;
}
.fs-11 {
  font-size: 11px;
  color: #000;
}
.icon-title {
  border-radius: 50%;
  background: #337ab7;
  margin: 0 10px;
  height: 20px;
}
.icon-title /deep/ .icon-cls {
  color: white;
  height: 20px;
  width: 20px;
}
td /deep/ .icon-cls {
  color: #f90;
  height: 20px;
  width: 20px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>