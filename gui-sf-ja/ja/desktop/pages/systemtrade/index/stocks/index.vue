<template>
  <div class="w-1000 flex space-between">
    <div class="left-content">
      <SearchArea class="mb-20" />
      <div
        ref="slider"
        class="slider-container owl-carousel owl-theme"
        style="height: 166px;"
      >
        <div v-for="(item, i) in topSliders" :key="'item-' + i" class="item">
          <a class="banner w-full mt-20" :href="item.linkUrl" rel="nofollow">
            <img class="w-full" :src="item.imageUrl" alt="" />
          </a>
        </div>
      </div>
      <div class="banner mt-20 w-full" v-if="advertiseBanners[0]">
        <a :href="(advertiseBanners[0] || {}).landingPageUrl">
          <img :src="(advertiseBanners[0] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <div
        class="list-product mt-20 pt-20"
        v-if="checkNested(['criterial', 'bestsell', 'length'], this.data) || 0"
      >
        <div class="flex mid ml-20 mb-10">
          <div
            class="icon-other flex mid center mr-5 text-center"
            :style="
              $i18n.locale != 'ja' && $i18n.locale != 'th'
                ? 'font-size: 11px; width: 38px; height: 38px;'
                : ''
            "
          >
            {{ $t('1') }}
          </div>
          <h2 class="title-icon m-0">
            <b>{{ $t('2') }}</b>
          </h2>
        </div>
        <div class="flex space-between c-bestsell mr-20 ml-20">
          <SystemProductVert
            v-for="i in 3"
            :key="i"
            :one-line="1"
            :size="[138, 138]"
            class="price-hor"
            :product="data.criterial.bestsell[i - 1]"
            :rank="i"
          />
        </div>
        <div
          class="bestsell-wrapp flex flex-wrap space-between ml-20 mr-15 mb-20"
          v-if="
            (checkNested(['criterial', 'bestsell', 'length'], this.data) || 0) >
              3
          "
        >
          <div
            v-for="index in data.criterial.bestsell.length - 3"
            :key="'bestsell-' + (index + 2)"
            class="mt-15 pr-5"
          >
            <ProductRankHorizontal01
              :product="data.criterial.bestsell[index + 2]"
              :rank="index + 3"
            />
          </div>
        </div>
        <div class="flex mid pl-15 pb-10">
          ※
          <span>
            {{
              $t('22', {
                date: `${formatTime(rangeDate.from, 7)}～${formatTime(
                  rangeDate.to,
                  7
                )}`,
              })
            }}
          </span>
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('3')"
          :target="'/systemtrade/sell/stocks'"
        />
      </div>
      <div class="flex space-between mt-20 h-450">
        <PieChart
          class="w50p chart-border pt-25"
          :chart="[{ data: data.pie }]"
          :option="pieChartOptions"
        />
        <ColumnChart
          class="w50p chart-border pt-25"
          :chart="data.column"
          :option="columnChartOpt"
        />
      </div>
      <div class="list-product mt-20 pt-20">
        <div class="flex mid ml-20">
          <div class="icon-other mr-5 flex mid center">
            %
          </div>
          <h2 class="title-icon m-0">
            <b>{{ $t('6') }}</b>
          </h2>
        </div>
        <div class="flex space-between m-20">
          <SystemProductVert
            :product="product"
            v-for="(product, idx) in data.criterial.returnRate"
            :rank="idx + 1"
            :key="'returnRate-' + idx"
            :show-criterial="true"
          />
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('19')"
          :target="'/systemtrade/profitrate/stocks'"
        />
      </div>
      <div class="list-product mt-20 pt-20">
        <div class="flex mid ml-20">
          <div class="icon-other mr-5 flex mid center">
            ¥
          </div>
          <h2 class="title-icon m-0">
            <b>{{ $t('7') }}</b>
          </h2>
        </div>
        <div class="flex space-between m-20">
          <SystemProductVert
            :product="product"
            v-for="(product, idx) in data.criterial.amount"
            :rank="idx + 1"
            :key="'amount-' + idx"
            :show-criterial="true"
          />
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('17')"
          :target="'/systemtrade/profit/stocks'"
        />
      </div>
      <div class="banner mt-20 w-full" v-if="advertiseBanners[1]">
        <a :href="(advertiseBanners[1] || {}).landingPageUrl">
          <img :src="(advertiseBanners[1] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <div class="list-product mt-20 pt-20">
        <div class="flex mid ml-20">
          <BalanceScale class="icon-other no-circle mr-5" />
          <h2 class="title-icon m-0">
            <b>{{ $t('21') }}</b>
          </h2>
        </div>
        <div class="flex space-between m-20">
          <SystemProductVert
            :product="product"
            v-for="(product, idx) in data.criterial.pf"
            :rank="idx + 1"
            :key="'pf-' + idx"
            :show-criterial="true"
          />
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('18')"
          :target="'/systemtrade/profitfactor/stocks'"
        />
      </div>
      <div class="list-product mt-20 pt-20">
        <div class="flex mid ml-20">
          <Sync class="icon-other no-circle mr-5" />
          <h2 class="title-icon m-0">
            <b>{{ $t('16') }}</b>
          </h2>
        </div>
        <div class="flex space-between m-20">
          <SystemProductVert
            :product="product"
            v-for="(product, idx) in data.criterial.riskReturn"
            :rank="idx + 1"
            :key="'riskReturn-' + idx"
            :show-criterial="true"
          />
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('20')"
          :target="'/systemtrade/riskreturn/stocks'"
        />
      </div>
    </div>
    <div class="right-content">
      <div class="banner w-full mb-20" v-if="advertiseBanners[2]">
        <a :href="(advertiseBanners[2] || {}).landingPageUrl">
          <img :src="(advertiseBanners[2] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <div class="banner w-full mb-20" v-if="advertiseBanners[3]">
        <a :href="(advertiseBanners[3] || {}).landingPageUrl">
          <img :src="(advertiseBanners[3] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <template v-if="checkNested(['bestsell', 'length'], this.data)">
        <h2 class="title-right m-0 flex mid pl-10">
          <b>{{ $t('10') }}</b>
        </h2>
        <div class="flex layout-col">
          <div
            v-for="(product, idx) in data.bestsell"
            class="border-bottom-dotted"
            :key="'bestsell-' + idx"
          >
            <SystemProductHor :product="product" :rank="idx + 1" />
          </div>
        </div>
        <ShowMore class="fs-12 mt-5" :target="'/systemtrade/sell/stocks'" />
      </template>
      <div class="banner mt-30 w-full" v-if="advertiseBanners[4]">
        <a :href="(advertiseBanners[4] || {}).landingPageUrl">
          <img :src="(advertiseBanners[4] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <div class="banner mt-20 w-full" v-if="advertiseBanners[5]">
        <a :href="(advertiseBanners[5] || {}).landingPageUrl">
          <img :src="(advertiseBanners[5] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <div class="banner mt-20 w-full" v-if="advertiseBanners[6]">
        <a :href="(advertiseBanners[6] || {}).landingPageUrl">
          <img :src="(advertiseBanners[6] || {}).bannerUrl" alt="" />
        </a>
      </div>
      <h2 class="title-right m-0 flex mid pl-10 mt-40">
        <b>{{ $t('9') }}</b>
      </h2>
      <template v-if="data.newProduct.length">
        <div class="flex layout-col">
          <SystemProductHor
            :product="product"
            v-for="(product, idx) in data.newProduct"
            :key="'new-product-' + idx"
          />
        </div>
        <ShowMore
          class="fs-12 mt-5"
          :target="'/systemtrade/newproduct/stocks'"
        />
      </template>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-stock.json'
import title from '@@/../common/pages'
import SearchArea from '@@/../components/systemtrade/SearchArea.vue'
import ProductRankHorizontal01 from '@/components/product/ProductRankHorizontal01.vue'
import ProductRankHorizontal04 from '@/components/product/ProductRankHorizontal04.vue'
import PieChart from '@@/../components/charts/PieChart.vue'
import ColumnChart from '@/components/charts/ColumnChart.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import SystemProductHor from '@/components/product/SystemProductHor.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import Sync from '@@/../components/icons/Sync.vue'
import { checkNested } from '@/utils/client/common'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const pieChartMapName = {
  '1個': 24,
  '2個': 25,
  '3個': 26,
  '4個': 27,
  '5個': 28,
  '6個以上': 29
} 
const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      SearchArea,
      ProductRankHorizontal01,
      ProductRankHorizontal04,
      PieChart,
      ColumnChart,
      ShowMore,
      SystemProductHor,
      SystemProductVert,
      BalanceScale,
      Sync,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        rangeDate: {
          from: moment()
            .utc()
            .subtract(3, 'month')
            .unix(),
          to: moment()
            .utc()
            .unix(),
        },
        pieChartOptions: {
          width: 320,
          showInLegend: true,
          exporting: true,
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('4')}</b></h2>`,
            align: 'left',
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
          legend: {
            width: 300,
            itemWidth: 100,
          },
        },
        columnChartOpt: {
          width: 300,
          height: 400,
          chartType: 'bar',
          exporting: true,
          yValue: this.$t('15'),
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('5')}</b></h2>`,
            align: 'left',
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 40,
            floating: true,
            borderWidth: 1,
            shadow: true,
          },
          xAxis: {
            categories: [
              this.$t('11'),
              this.$t('12'),
              this.$t('13'),
              this.$t('14'),
            ],
            title: {
              text: null,
            },
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                x: 2,
                style: {
                  fontSize: '11px',
                  fontFamily: 'Verdana, sans-serif',
                },
              },
            },
          },
        },
        titleChunk: this.$t('titlePrefix'),
        textSearch: null,
      }
    },
    async asyncData({ app, store }) {
      let data = await app.GoGoHTTP.get(
        '/api/v3/surface/systemtrade/stocks/top'
      ),
        topSliders = Object.values(
          store.state.advertisements.topSliders || {}
        ).sort(() => (Math.random() > 0.5 ? 1 : -1)),
        advertiseBanners = store.state.advertisements.advertiseBanners || {},
        positions = Object.keys(advertiseBanners)

      if (!data.criterial) {
        data.criterial = {}
      }
      if(data.pie) {
        data.pie = data.pie.map(item => {
          let index = pieChartMapName[item.name],
            name = i18n[app.i18n.locale][index] || item.name
          item.name = name
          return item
        })
      }
      if(positions.length > 0) {
        positions.map((element) => {
          advertiseBanners[element] = advertiseBanners[element][0]
        })
      }

      return {
        data,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/stocks`,
          },
        ],
        topSliders,
        advertiseBanners,
      }
    },
    methods: {
      checkNested,
      descriptionTemplate() {
        return this.$t('23')
      },
    },
    mounted() {
      if (this.data.column) {
        this.data.column = this.data.column.map(item => {
          item.name = this.$t(item.name)
          return item
        })
      }
      this.$nextTick(() => {
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          items: 1,
          dotClass: 'custom-dot',
        })
      })
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
@import '@/assets/systemtrade/common.scss';
.c-bestsell {
  /deep/ .product-BjNGX {
    width: 180px;
    padding: 20px;
    .product-name {
      font-size: 15px;
      margin: 7px 0 3px;
    }
    .prices {
      font-size: 14px;
    }
    .rate-num {
      color: #666;
    }
  }
}
/deep/ .old-price {
  margin-left: 0;
}
.left-content {
  width: 670px;
  .list-product {
    border: 1px solid #dbdbdb;
    .bg-dot {
      border-top: 1px solid #dbdbdb;
    }
    .title-icon {
      font-size: 20px;
      font-weight: bold;
      color: #7d7d7d;
      line-height: 24px;
    }
  }
  .chart-border {
    border: solid #dbdbdb 1px;
  }
  /deep/ .chart-title {
    font-size: 20px;
    font-weight: bold;
    color: #7d7d7d;
    line-height: 24px;
  }
}
.right-content {
  width: 300px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  .layout-col > div {
    border-bottom: dotted 1px #ccc;
  }
}
.bestsell-wrapp {
  border-top: dotted 1px #ccc;
  > div {
    width: calc(100% / 3);
    /deep/ .co-red {
      margin-left: 2px;
    }
    /deep/ .grow1 {
      margin-left: 5px;
    }
  }
}
.criterial-wrapp > div:not(:last-child) {
  border-bottom: dotted 1px #ccc;
}
.banner {
  a,
  img {
    width: 100%;
    &:hover {
      opacity: 0.85;
    }
  }
}
.w50p {
  width: 48.5%;
}
.h-450 {
  height: 450px;
}
div.slider-container /deep/ {
  height: 163px;
  div.slides {
    height: 138px;
  }
}
.owl-carousel .item {
  display: none;
}
/deep/ .owl-stage-outer .item {
  display: unset;
}
/deep/ .custom-dot {
  width: 32px;
  height: 7px;
  border: none;
  background: #e6e9ed;
  margin: 0 5px;
  outline: none;
  transition: all 0.1s;
  &:hover,
  &.active {
    background: #858585;
  }
}
</style>
