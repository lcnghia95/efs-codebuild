<template>
  <div class="o-layout">
    <div class="c-nav flex layout-col space-between text-center">
      <a href="/systemtrade/search/detail" class="c-btn w-full pos-rel">
        <b>{{ $t('1') }}</b><i class="o-arrow-r pos-abs"></i>
      </a>
      <a href="/systemtrade/search/easy" class="c-btn w-full pos-rel">
        <b>{{ $t('2') }}</b><i class="o-arrow-r pos-abs"></i>
      </a>
    </div>
    <div class="c-keyword pos-rel">
      <search class="o-icon pos-abs" />
      <button class="o-close pos-abs" @click="resetQ" v-if="q!=null && q!=''"></button>
      <input type="text" class="c-keyword__in w-full" v-model="q" />
    </div>
    <ul class="c-sort flex space-between mid">
      <li :class="{ 'is-active': sort == key }"
          @click="selectSort(key)"
          v-for="(text, key) in sortOps"
          :key="'sort-type-' + key"
          class="flex mid"
      >
        {{ text }}
        <span v-if="sort == key">
          <div class="arrow-down" :style="`order: ${sort}`" v-if="sortAD=='0'"></div>
          <div class="arrow-up" :style="`order: ${sort}`" v-else></div>
        </span>
      </li>
    </ul>
    <div class="c-total">{{ dataResult.total }} {{ $t('10') }}</div>
    <ProductHorizontal03List :product-list="dataShow" />
    <button class="c-btn-more pos-rel w-full text-center p-0 mb-40" @click="loadMore" v-if="dataShow.length < dataResult.total">
      {{ $t('3') }}<i class="o-arrow-d pos-abs"></i>
    </button>
    <div style="min-height: 450px; margin-top: 20px; margin-bottom: 20px;" v-if="(rankingActive || {}).length">
      <BubbleChart02 :chart="rankingActive" />
    </div>
  </div>
</template>
<script>
import Search from '@@/../components/icons/Search.vue'
import ProductHorizontal03List from '@/components/product/ProductHorizontal03List.vue'
import i18n from '@@/lang/mobile/systemtrade-search.json'
import title from '@@/../common/pages'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'

function setQuery(query) {
  let result = {}
  for (let key in query) {
    result[key] = query[key]
  }
  result.isOnSale = query.isOnSale == undefined && (!Object.keys(query).length || query.name) ? true : (query.isOnSale == 'true' || false)
  result.isOperating = query.isOperating == undefined && (!Object.keys(query).length || query.name) ? false : (query.isOperating == 'true' || false)
  return result
}

function setParams(query) {
  let result = {}

  for (var key in query) {
    if (key == 'isOnSale' ||
      key == 'isOperating') {
      result[key] = query[key] == true || query[key] == 'true'
    } else if (
      key === 'platformId' ||
      key === 'categoryId' ||
      key === 'currencyPairs' ||
      key === 'tradingStyles' ||
      key === 'technicalIndicators'
    ) {
      result[key] = query[key].split(',')
    } else {
      result[key] = query[key]
    }
    if (key === 'q') {
      result['name'] = query[key]
    } else {
      result[key] = query[key]
    }
  }

  return result
}

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Search,
      ProductHorizontal03List,
      BubbleChart02,
    },
    data() {
      return {
        sortOps: {
          profitTotal: this.$t('4'),
          profitFactor: this.$t('5'),
          profitRate: this.$t('6'),
          riskReturnRate: this.$t('7'),
          winningRate: this.$t('8'),
          price: this.$t('9'),
        },
        q: null,
        sort: 'profitTotal',
        sortAD: '0',
        params: {},
        timer: null,
      }
    },
    computed: {
      titleChunk() {
        return this.params.name
          ? this.$t('14', { keyword: '「' + this.params.name + '」' })
          : this.$t('13')
      },
    },
    async asyncData({ app, query }) {
      let params = {
          name: null,
          status: null,
          minProfitRate: null,
          maxProfitRate: null,
          minProfitFactor: null,
          maxProfitFactor: null,
          minTotalTrades: null,
          maxTotalTrades: null,
          minPrice: null,
          maxPrice: null,
          minDrawdown: null,
          maxDrawdown: null,
          minPosition: null,
          maxPosition: null,
          currencyPairs: [],
          tradingStyles: [],
          technicalIndicators: [],
          platformId: [],
          month: 0,
          sort: '0profitTotal',
          page: 1,
          isOnSale: 1,
        },
        dataResult = await app.GoGoHTTP.post(
          '/api/v3/surface/systemtrade/search',
          setQuery(query)
        )

      return {
        dataResult: dataResult,
        dataShow: dataResult.data,
        rankingActive: dataResult.rankingActive,
        params: Object.assign(params, setParams(query)),
        sort: params.sort.substring(1),
        sortAD: params.sort.substring(0, 1),
        q: query.q,
        linkMeta: [
          {
            rel: 'canonical',
            href: query.name
              ? `${process.env.GOGO_URL}/systemtrade/search/?name=${query.name}`
              : `${process.env.GOGO_URL}/systemtrade/search`,
          },
        ],
      }
    },
    methods: {
      resetQ() {
        this.params.page = 1
        this.q = null
      },
      selectSort(_sort) {
        if (this.sort === _sort) {
          this.sortAD = this.sortAD === '0' ? '1' : '0'
        } else {
          this.sort = _sort
        }
        this.params.page = 1
        this.params.sort = this.sortAD + this.sort
        this.Search()
      },
      loadMore() {
        this.params.page = this.dataResult.currentPage + 1
        this.Search()
      },
      async Search() {
        let dataResult = await this.GoGoHTTP.post(
          '/api/v3/surface/systemtrade/search',
          this.params
        )
        this.dataResult = dataResult
        if (dataResult.currentPage == 1) {
          this.dataShow = dataResult.data
        } else {
          this.dataShow = this.dataShow.concat(dataResult.data)
        }
      },
      descriptionTemplate() {
        return this.params.name
          ? this.$t('16', { keyword: '「' + this.params.name + '」' })
          : this.$t('15')
      },
    },
    watch: {
      q: function(newQ) {
        this.params.name = newQ
        this.params.page = 1
        this.Search()
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
$color_01: #fff;
$color_02: rgb(197, 197, 197);
$color_03: rgb(255, 132, 0);
$color_05: rgb(102, 102, 102);
$color_06: rgb(240, 240, 240);
$color_08: rgb(230, 230, 230);
%border_radius_6 {
  border-radius: 6px;
}
%absolute {
  position: absolute;
}
%content_null {
  content: '';
}
%opacity_5 {
  opacity: 0.5;
}
%bottom_0 {
  bottom: 0;
}
%left_0 {
  left: 0;
}
.o-layout {
  margin: 4vw;
}
.c-nav {
  background: $color_06;
  @extend %border_radius_6;
  margin-top: 4vw;
  padding: 4vw;
  a {
    text-decoration: none;
    &:last-child {
      margin-top: 2vw;
    }
  }
}
.c-keyword {
  height: 10vw;
  margin: 4vw 0;
  .c-keyword__in {
    border: solid #aaa;
    border-width: 0 0 2px 0;
    height: 10vw;
    padding: 0 9vw;
    font-size: 3.5vw;
  }
  .o-icon {
    width: 8vw;
    height: 8vw;
    margin-bottom: 1vw;
    @extend %opacity_5;
    @extend %bottom_0;
    @extend %left_0;
  }
  .o-close {
    border: 0;
    background: none;
    outline: none;
    right: 0;
    @extend %opacity_5;
    @extend %bottom_0;
    &::before,
    &::after {
      height: 4vw;
      width: 0.7vw;
      bottom: 3vw;
      right: 4vw;
      background: #333;
      @extend %absolute;
      @extend %content_null;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }
  }
}
.c-btn {
  display: block;
  height: 15vw;
  line-height: 14vw;
  font-size: 4.5vw;
  color: $color_03;
  border: 2px solid $color_02;
  background: $color_01;
  @extend %border_radius_6;
  &::after {
    height: 3px;
    background: $color_08;
    @extend %absolute;
    @extend %content_null;
    @extend %bottom_0;
    @extend %left_0;
  }
}
.c-btn-more {
  display: block;
  border: 1px solid $color_02;
  border-radius: 6vw;
  height: 12vw;
  color: $color_05;
  line-height: 11vw;
  background: none;
  outline: none;
  font-size: 3.5vw;
}
.o-arrow-r {
  border: solid $color_03;
  border-width: 0 0.6vw 0.6vw 0;
  padding: 0.6vw;
  right: 2vw;
  top: 48%;
  transform: rotate(-45deg) translate(0, -50%);
}
.o-arrow-d {
  border: solid $color_05;
  border-width: 0 0.6vw 0.6vw 0;
  padding: 1vw;
  top: 40%;
  right: 5vw;
  transform: rotate(45deg) translate(0, -50%);
}
.c-sort {
  list-style: none;
  border: 2px solid #ddd;
  padding: 0 1vw;
  height: 12vw;
  box-shadow: 0 0 5px 1px #ddd;
  @extend %border_radius_6;
  li {
    padding: 0 3vw;
    color: #a0a0a0;
    font-size: 3.2vw;
    height: 11vw;
  }
  .is-active {
    border-bottom: 2px solid #04c;
    color: #000;
  }
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 1.2vw solid transparent;
  border-right: 1.2vw solid transparent;
  border-bottom: 2vw solid #333;
  margin-left: 1vw;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 1.2vw solid transparent;
  border-right: 1.2vw solid transparent;
  border-top: 2vw solid #333;
  margin-left: 1vw;
}
.c-total {
  text-align: right;
  margin: 3vw 0;
  font-size: 3.5vw;
}
@media only screen and (min-width: 600px) {
  .c-nav {
    flex-direction: row;
    padding: 3vw;
    a {
      width: 42vw;
      height: 10vw;
      line-height: 9.5vw;
      font-size: 3.2vw;
      &:last-child {
        margin-top: 0;
      }
    }
  }
  .o-arrow-r {
    border-width: 0 0.5vw 0.5vw 0;
    padding: 0.5vw;
  }
}
</style>
