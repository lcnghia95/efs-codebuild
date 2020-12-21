<template>
  <div class="w-1000 flex space-between">
    <div class="left-content mb-30">
      <SearchArea />
      <LazyComp01
        v-if="rtRanking.length"
        min-height="350px"
        class="mt-20 list-product list-product-chart pt-20"
        :timeout="3e4"
        @comp-ready="onSliderReady('slider3')"
      >
        <div class="flex mid ml-20 mb-20">
          <span class="icon-other no-circle mr-5 icon-trade">R</span>
          <h2 class="title-icon mb-0">
            <b>{{ $t('32') }}</b>
          </h2>
        </div>
        <div ref="slider3" class="owl-carousel flex flex-wrap ">
          <SystemProductVert
            v-for="(item, idx) in rtRanking"
            :rank="idx + 1"
            :key="'real-' + item.id"
            :product="item"
          />
        </div>
        <ShowMore
          class="bg-dot mt-10"
          :text="$t('33')"
          :target="'/systemtrade/realasset'"
        />
      </LazyComp01>
      <BubbleChart02 :chart="rankingActive" style="min-height: 450px; margin-top: 20px;" />
      <div class="mt-15 flex content-end" min-height="40px">
        <a href="/systemtrade/search/?sort=0profitTotal&page=1&minActiveCount=20&minActiveRate=40&isOnSale=false&isOperating=false" style="font-size: 14px;">{{ $t('30') }}</a>
      </div>
      <div class="list-product mt-20 pt-20">
        <div class="flex mid ml-20 mb-10">
          <div class="icon-other flex mid center mr-5">
            FX
          </div>
          <h2 class="title-icon m-0">
            <b>{{ $t('1') }}</b>
          </h2>
        </div>
        <div class="flex space-between c-bestsell ml-20 mr-20">
          <SystemProductVert
            v-for="i in 3"
            :key="i"
            :one-line="1"
            :size="[138, 138]"
            class="price-hor"
            :product="bestsell[i - 1]"
            :rank="i"
          />
        </div>

        <div
          class="bestsell-wrapp flex flex-wrap space-between ml-20 mr-20 mb-10"
          v-if="bestsell.length > 3"
        >
          <div
            v-for="index in bestsell.length - 3"
            :key="'bestsell-' + (index + 2)"
            class="mt-15 pr-5"
          >
            <ProductRankHorizontal01
              :product="bestsell[index + 2]"
              :rank="index + 3"
            />
          </div>
        </div>
        <div class="flex mid pl-15 pb-10">
          ※<span>
            {{
              $t('2', {
                date: `${formatTime(rangeDate.from, 13)}${
                  $i18n.locale == 'ja' ? '～' : ' - '
                }${formatTime(rangeDate.to, 13)}`,
              })
            }}
          </span>
        </div>
        <ShowMore
          class="bg-dot"
          :text="$t('3')"
          :target="'/systemtrade/sell/fx'"
        />
      </div>
      <div class="flex space-between mt-20 h-450">
        <div class="w50p list-product pr-10 pt-25">
          <PieChart
            v-if="(chartPieScatter.pie || []).length"
            :chart="[{ data: chartPieScatter.pie }]"
            :option="pieChartOptions"
          />
        </div>
        <div class="w50p list-product pt-25">
          <Scatter3d
            :chart="chartPieScatter.scatter"
            :option="scatterOptions"
          />
        </div>
      </div>
      <div class="flex space-between mt-20">
        <div class="w50p list-product flex layout-col pt-20">
          <div class="title-icon flex ml-20 mb-10 h-48">
            <img
              class="mr-5"
              :src="
                'https://www.countryflags.io/' +
                  criterial.unemploy.flag +
                  '/shiny/32.png'
              "
              alt=""
              width="30"
              height="26"
            />
            <h2 class="m-0">
              <b class="mt-3" v-html="criterial.unemploy.title"></b>
            </h2>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.unemploy.data"
              :key="'unemploy-' + idx"
            >
              <SystemProductHor
                class="p-10"
                :product="product"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/economics/fx/1'"
          />
        </div>
        <div class="w50p list-product flex layout-col pt-20">
          <div class="title-icon flex ml-20 mb-10 h-48">
            <img
              class="mr-5"
              :src="
                'https://www.countryflags.io/' +
                  criterial.financial.flag +
                  '/shiny/32.png'
              "
              alt=""
              width="30"
              height="26"
            />
            <h2 class="m-0">
              <b class="mt-3" v-html="criterial.financial.title"></b>
            </h2>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.financial.data"
              :key="'financial-' + idx"
            >
              <SystemProductHor
                class="p-10"
                :product="product"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/economics/fx/2'"
          />
        </div>
      </div>
      <div class="flex space-between mt-20">
        <div class="w50p list-product flex layout-col pt-20">
          <div class="flex mid ml-20 mb-10">
            <div class="icon-other mr-5 flex mid center">
              %
            </div>
            <div>
              <h2 class="title-icon m-0">
                <b>{{ $t('11') }}</b>
              </h2>
              <div class="sub-title"><b>{{ $t('14') }}</b></div>
            </div>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.rateOf3M.data"
              :key="'rateOf3M-' + idx"
            >
              <SystemProductHor
                :product="product"
                class="c-rateof3m p-10"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/profitrate/fx'"
          />
        </div>
        <div class="w50p list-product flex layout-col pt-20">
          <div class="flex mid ml-20 mb-10">
            <div class="icon-other icon-yen mr-5 flex mid center">
              ¥
            </div>
            <div>
              <h2 class="title-icon m-0">
                <b>{{ $t('12') }}</b>
              </h2>
              <div class="sub-title"><b>{{ $t('14') }}</b></div>
            </div>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.amountOf3M.data"
              :key="'profitOf3M-' + idx"
            >
              <SystemProductHor
                :product="product"
                class="c-profitof3m p-10"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/profit/fx'"
          />
        </div>
      </div>
      <div class="flex space-between mt-20">
        <div class="w50p list-product flex layout-col pt-20">
          <div class="flex ml-20 mb-10">
            <BalanceScale class="icon-other no-circle mr-5" />
            <div>
              <h2 class="title-icon m-0">
                <b>{{ $t('13') }}</b>
              </h2>
              <div class="sub-title">
                <b>{{ $t('14') }}</b>
              </div>
            </div>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.profitOf3M.data"
              :key="'profitOf3M-' + idx"
            >
              <SystemProductHor
                class="p-10"
                :product="product"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/profitfactor/fx'"
          />
        </div>
        <div class="w50p list-product flex layout-col pt-20">
          <div class="flex ml-20 mb-10">
            <Sync class="icon-other no-circle mr-5" />
            <div>
              <h2 class="title-icon m-0">
                <b>{{ $t('15') }}</b>
              </h2>
              <div class="sub-title">
                <b>{{ $t('14') }}</b>
              </div>
            </div>
          </div>
          <div class="flex layout-col criterial-wrapp">
            <div
              v-for="(product, idx) in criterial.riskOf3M.data"
              :key="'riskOf3M-' + idx"
            >
              <SystemProductHor
                class="p-10"
                :product="product"
                :show-criterial="true"
              />
            </div>
          </div>
          <ShowMore
            class="bg-dot"
            :text="$t('10')"
            :target="'/systemtrade/riskreturn/fx'"
          />
        </div>
      </div>
      <div class="flex space-between mt-20">
        <div class="w50p list-product">
          <h2 class="title-icon ml-20 mt-25 mb-20">
            <b v-html="$t('16')"></b>
          </h2>
          <ColumnChart
            class="flex center"
            :chart="[{ name: $t('26'), data: chartColumnScatterLine.column }]"
            :option="colChartOp"
          />
        </div>
        <div class="w50p list-product">
          <h2 class="title-icon ml-20 mt-25 mb-20">
            <b v-html="$t('17')"></b>
          </h2>
          <BubbleChart
            :option="bubblesOp"
            :chart="chartColumnScatterLine.scatterLine"
          />
        </div>
      </div>
    </div>
    <div class="right-content">
      <h2 class="title-right flex mid pl-10 m-0">
        <b>{{ $t('19') }}</b>
      </h2>
      <div class="flex layout-col">
        <div
          v-for="(product, idx) in bestsell"
          class="border-bottom-dotted"
          :key="'bestsell-' + idx"
        >
          <SystemProductHor :product="product" :rank="idx + 1" />
        </div>
      </div>
      <ShowMore class="fs-12 mt-5" :target="'/systemtrade/sell/fx'" />
      <h2 class="title-right flex mid pl-10 mt-35 mb-0">
        <b>{{ $t('4') }}</b>
      </h2>
      <div class="flex layout-col">
        <div v-for="(product, idx) in newProduct" :key="'new-product-' + idx">
          <SystemProductHor :product="product" />
        </div>
      </div>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('5')"
        :target="'/systemtrade/newproduct/fx'"
      />
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-fx.json'
import title from '@@/../common/pages'
import SearchArea from '@@/../components/systemtrade/SearchArea.vue'
import ProductRankHorizontal01 from '@/components/product/ProductRankHorizontal01.vue'
import ProductRankHorizontal04 from '@/components/product/ProductRankHorizontal04.vue'
import PieChart from '@@/../components/charts/PieChart.vue'
import Scatter3d from '@/components/charts/Scatter3d.vue'
import BubbleChart from '@@/../components/charts/BubbleChart.vue'
import ColumnChart from '@/components/charts/ColumnChart.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import SystemProductHor from '@/components/product/SystemProductHor.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import Sync from '@@/../components/icons/Sync.vue'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const left = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #d9d9da;" xml:space="preserve"><g><g id="keyboard-arrow-left"><polygon points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306"/></g></g></svg>`,
      right = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: #d9d9da;" xml:space="preserve"><g><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/></g></g></svg>`

function formatNumber(val, defaultVal, floatNum = 0) {
  let n = Number.parseFloat(val)
  return n
    ? val.toLocaleString('en-GB', {
        minimumFractionDigits: floatNum,
      })
    : defaultVal || val
} // refactor later

const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      SearchArea,
      ProductRankHorizontal01,
      ProductRankHorizontal04,
      PieChart,
      Scatter3d,
      BubbleChart,
      ColumnChart,
      ShowMore,
      SystemProductHor,
      SystemProductVert,
      BalanceScale,
      Sync,
      BubbleChart02,
      LazyComp01,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        tempData: [],
        rangeDate: {
          from: moment()
            .utc()
            .subtract(3, 'month')
            .unix(),
          to: moment()
            .utc()
            .unix(),
        },
        bubblesOp: {
          yAxis: {
            title: {
              text: this.$t('24'),
            },
          },
          xAxis: {
            title: {
              text: this.$t('25'),
            },
          },
          zAxis: {
            title: {
              text: 'リスクリターン率',
            },
          },
          legend: {
            enabled: false,
          },
          // height: 310,
        },
        pieChartOptions: {
          width: 320,
          showInLegend: true,
          exporting: true,
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('7')}</b></h2>`,
            style: {
              color: '#7d7d7d',
              fontSize: this.$i18n.locale === 'th' ? '18px' : '20px',
              fontWeight: 'bold',
            },
            align: this.$i18n.locale === 'th' ? 'left' : 'center',
          },
        },
        scatterOptions: {
          subTitle: {
            text: this.$t('9'),
            verticalAlign: 'bottom',
          },
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('8')}</b></h2>`,
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
        titleChunk: this.$t('titlePrefix'),
        colChartOp: {
          xLabel: true,
          width: 300,
          height: 300,
          yTitle: this.$t('23'),
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.yt}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif',
                },
              },
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.yt}</b><br/>`,
          },
        },
      }
    },
    async asyncData({ app }) {
      let [
            top,
            rankingActive,
          ] = await Promise.all([
            app.GoGoHTTP.get('/api/v3/surface/systemtrade/fx/top', { params: { rtRankingLimit: 30 } }),
            app.GoGoHTTP.get('/api/v3/surface/top/rankingActive'),
          ]),
        defaultData = {
          title: '',
          flag: 'JP',
          data: [],
        }
      let _chartColumnScatterLine = top.chartColumnScatterLine || {},
        _column = _chartColumnScatterLine.column || []
      _column.map((item, index) => {
        if (index === 0) {
          item.name = `1~4,999円`
          item.yt = formatNumber(item.y)
          return item
        }
        let a = formatNumber(index * 5000),
          b = formatNumber((index + 1) * 5000 - 1)
        item.name = `${a}円~${b}円`
        item.yt = formatNumber(item.y)
        return item
      })
      if (!top.chartColumnScatterLine) {
        top.chartColumnScatterLine = {}
      }
      top.chartColumnScatterLine.column = _column

      return {
        rtRanking: top.rtRanking || [],
        bestsell: top.bestsell || [],
        criterial: top.criterial || {
          financial: defaultData,
          unemploy: defaultData,
          rateOf3M: defaultData,
          amountOf3M: defaultData,
          profitOf3M: defaultData,
          riskOf3M: defaultData,
        },
        newProduct: top.newProduct || [],
        chartPieScatter: top.chartPieScatter || {
          pie: [],
          scatter: [],
        },
        chartColumnScatterLine: top.chartColumnScatterLine || {
          column: [],
          scatterLine: [],
        },
        rankingActive,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/fx`,
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('27')
      },
      onSliderReady(ref) {
        this.$nextTick(() => {
          $(this.$refs[ref]).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 4e3,
            autoplay: true,
            loop: true,
            nav: true,
            navigation: true,
            center: true,
            dots: false,
            smartSpeed: 500,
            autoplayHoverPause: true,
            autoWidth: true,
            items: 5,
            margin: 8,
            navText: [left, right],
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
    &-chart {
      .title-icon {
        font-size: 20px;
        font-weight: bold;
        color: #7d7d7d;
        margin-top: 2px;
      }
      .product-review /deep/ .o-com__tit {
        min-height: 36px;
        color: #666;
      }
      .product-review /deep/ .o-com__cont {
        height: 65px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    border: 1px solid #dbdbdb;
    .bg-dot {
      border-top: 1px solid #dbdbdb;
    }
    .icon-other {
      width: 30px;
      height: 30px;
      background: #7d7d7d;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      font-size: 16px;
      &.no-circle {
        padding: 2px;
      }
      &.icon-yen {
        font-size: 18px;
        padding-top: 4px;
      }
    }
    .title-icon,
    .sub-title,
    .title-icon h2 {
      font-size: 20px;
      color: #7d7d7d;
      line-height: 24px;
    }
    .sub-title {
      font-size: 16px;
    }
    .h-48 {
      height: 48px;
      min-height: 48px;
    }
    /deep/ .chart-title {
      font-size: 20px;
      color: #7d7d7d;
      text-align: center;
      line-height: 24px;
    }
  }
  .bestsell-wrapp {
    border-top: 1px dotted #ccc;
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
  .criterial-wrapp {
    flex: 1 0 auto;
    .product-BjNGXdi {
      min-height: 103px;
    }
    > div:not(:last-child) {
      border-bottom: dotted 1px #ccc;
    }
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
.w50p {
  width: 48.5%;
}
.h-450 {
  height: 450px;
}
.icon-trade {
  font-size: 20px !important;
  text-align: center;
}
</style>
