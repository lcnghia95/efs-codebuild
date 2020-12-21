<template>
  <div>
    <div class="page-title pt-10 pb-10 pl-15">
      <strong>{{ $t('1') }}</strong>
    </div>
    <LazyComp01 class="p-10" min-height="200px">
      <div class="sub-title pl-15 mb-10">{{ $t('2') }}</div>
      <div class="mt-20 mb-10 text-center flex mid center change-time">
        <a class="flex mid center icon-title left" @click="clickPrev">
          <AngleLeft />
        </a>
        <div class="fs-18 selected-time"><strong>{{ formatTime(startDate, 14) }}</strong></div>
        <a class="flex mid center icon-title right" @click="clickNext">
          <AngleRight />
        </a>
      </div>
      <EconomicsTable :data="dataShow.data || {}" :mark-scroll="markScroll" />
      <div class="text-center mt-20 mb-50 mobile-paging">
        <Paging
          :cur-page="(dataShow || {}).currentPage"
          :total="(dataShow || {}).lastPage"
          :from="(dataShow || {}).pagingFrom"
          :to="(dataShow || {}).pagingTo"
          @pagingclick="onPagingClick"
        />
      </div>
    </LazyComp01>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/markets-economics.json'
import { MOMENT_LOCALE } from '@@/../common/assets/js/consts'
import { calPaging, pushState } from '@/utils/client/common'
import EconomicsTable from '@/components/markets/EconomicsTable.vue'
import Paging from '@/components/paging/Paging.vue'
import title from '@@/../common/pages'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

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
const obj = Object.assign({
  components: {
    EconomicsTable,
    Paging,
    AngleRight,
    AngleLeft,
    LazyComp01,
  },
  i18n: {
    messages: i18n
  },
  mounted() {
    if (this.markScroll) {
      pushState(
        { y: this.y, m: this.m, p: this.p },
        null,
        '',
        '/markets/economics'
      )
    }
    if(this.$route.params.m - 1 < 0 || this.$route.params.m - 1 > 11) {
      this.changeRoute()
    }
  },
  async asyncData({ app, params }) {
    let dateNow = new Date(),
      y = params.y || dateNow.getFullYear(),
      m = params.m - 1 >= 0 && params.m - 1 <= 11 ? params.m - 1 : dateNow.getMonth(),
      objDate = {
        year: y,
        month: m
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
          to: endDate
        }
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
      currentFormat,
      titleChunk: i18n[locale][2],
      p,
      y,
      m: m + 1,
      dataShow,
      markScroll,
      descriptionTemplate() {
        return i18n[locale][3]
      },
      linkMeta: [
        {
          rel: 'canonical',
          href: 'https://www.gogojungle.co.jp/markets/economics'
        }
      ]
    }
  },
  methods: {
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
      $('html, body').animate(
        {
          scrollTop: $('.economics').offset().top - 50,
        },
        'slow'
      )
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
    changeRoute() {
      let _url = `/markets/economics${this.y ? '/y/' + this.y : ''}${
        this.m ? '/m/' + this.m : ''
      }${this.p ? '/p/' + this.p : '/'}`
      location.href = _url
    },
  }
},
title)
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
.sub-title {
  font-size: 16px;
  border-left: 5px solid #b2b2b2;
  line-height: 39px;
  padding-left: 5px;
  height: 38px;
  font-weight: 700;
}
.change-time {
  .selected-time {
    color: #707070;
    min-width: 200px;
  }
  .icon-title {
    border: 1px solid #aaa;
    border-radius: 5px;
    height: 35px;
    width: 35px;
    /deep/ .icon-cls {
      color: #2d2d2d;
      width: 25px;
      height: 25px;
    }
  }
  .left {
    margin-right: auto;
  }
  .right {
    margin-left: auto;
  }
}
.mobile-paging {
  /deep/ .paging-wrap {
    ul > li {
      width: 32px;
      height: 34px;
      line-height: inherit;
      display: flex;
    }
    ul li a {
      padding: 4px;
      font-size: 15px;
      margin: auto;
      width: 100%;
      .icon-cls {
        width: 100%;
        height: auto;
      }
    }
    .active {
      padding: 6px;
    }
  }
}
.fs-18 {
  font-size: 18px;
}
</style>