<template>
  <div class="o-layout flex space-between w-1000">
    <div class="o-layout__i u-670">
      <div class="c-head-01 flex mid space-between">
        <span class="flex mid">
          <search class="c-icon-02" />
          <h2>{{ $t('1') }}</h2>
        </span>
        <span v-html="pagingMsg" v-if="(dataResult.data || []).length"></span>
      </div>
      <p class="c-sub-01 mt-5">
        {{ $t('2') }}：{{ params.name }}&nbsp;
        {{ $t('4') }}{{ params.minProfitRate == 'null' ? '' : params.minProfitRate }}％～{{ params.maxProfitRate == 'null' ? '' : params.maxProfitRate }}％&nbsp;
        {{ $t('5') }}：{{ params.minPrice == 'null' ? '' : params.minPrice }}
        {{ $t('currencies.1') }}
        ～
        {{ params.maxPrice == 'null' ? '' : params.maxPrice }}
        {{ $t('currencies.1') }}
        &nbsp;
        {{ $t('6') }}：{{ reversedInfo(params.currencyPairs, $t('pairs'), ', ') }}&nbsp;
        {{ $t('7') }}{{ reversedInfo(params.tradingStyles, $t('trading-types'), '/') }}&nbsp;
        {{ $t('8') }}：{{ reversedInfo(params.technicalIndicators, $t('indicators'), '/') }}&nbsp;
        {{ $t('9') }}：{{ reversedInfo(params.month, periods) }}
      </p>
      <ul class="c-list-01 flex space-between mt-30 mb-25 pl-35 pr-35">
        <li class="c-list-01__i flex mid"
            v-for="(text,type) in sortTypes"
            :class="{ 'is-active': sort === type }"
            @click="selectSort(type)"
            :key="'sort-type-' + type"
        >
          {{ text }}
          <span v-if="sort === type">
            <sort-down class="o-icon-sort" v-if="sortAD=='0'" />
            <sort-up class="o-icon-sort u-up" v-if="sortAD=='1'" />
          </span>
        </li>
      </ul>
      <ProductRankHorizontal05 class="mb-10" v-for="(item, i) in dataResult.data" :index="i" :product="item" :key="i" />
      <div class="text-center mt-20 mb-20" style="font-size: 16px;" v-if="!((dataResult || {}).data || []).length">{{ $t('64') }}</div>
      <div class="text-center mt-20 mb-50">
        <paging :cur-page="dataResult.currentPage"
                :total="dataResult.lastPage"
                :from="dataResult.pagingFrom"
                :to="dataResult.pagingTo"
                :has-scroll="true"
                theme-class="theme4"
                @pagingclick="getPage"
        />
      </div>
      <div class="c-head-01 flex mid space-between">
        <span class="flex mid">
          <h2>{{ $t('56') }}</h2>
          <h3 style="margin-left: 20px;">{{ $t('61') }}</h3>
        </span>
      </div>
      <div style="min-height: 450px; margin-top: 20px; margin-bottom: 20px;" v-if="(rankingActive || {}).length">
        <BubbleChart02 :chart="rankingActive" />
      </div>
      <div class="c-head-01 flex mid space-between">
        <span class="flex mid">
          <h2>{{ $t('62') }}</h2>
        </span>
      </div>
      <div class="w-full h-400 ml-20" v-if="(scatterChartData || []).length">
        <Scatter3d :chart="scatterChartData" />
      </div>
    </div>
    <div class="o-layout__i u-300">
      <div class="o-cond flex layout-col mid mb-20 pb-20">
        <div class="o-cond__h flex mid w-full">
          <search-plus class="c-icon-03" />
          <h2 class="mt-10 mb-10">{{ $t('18') }}</h2>
        </div>
        <input type="text" class="c-keyword mt-20 mb-5" :placeholder="$t('2')" v-model="params.name" @keyup.enter="Search(true)" />
        <button class="c-btn-01 pos-rel" @click="Search(true)">{{ $t('25') }}</button>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('9') }}</label>
          <div class="c-row-05 flex flex-wrap">
            <radio v-model="params.month" :attrs="{ id: 'month'+key, value: key }" :label="label" v-for="(label, key) in periods" :key="key" />
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('43') }}</label>
          <div class="c-row-01 flex mid">
            <checkbox v-model="params.categoryId" :attrs="{ id: 'categoryId1'+key, value: key }" :label="label" v-for="(label, key) in categories" :key="key" />
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('56') }}</label>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('57') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minOperatingMonths">
                <option value="null">{{ $t('21') }}</option>
                <option value="12">1{{ $t('58') }}</option>
                <option value="24">2{{ $t('58') }}</option>
                <option value="36">3{{ $t('58') }}</option>
                <option value="60">5{{ $t('58') }}</option>
                <option value="84">7{{ $t('58') }}</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxOperatingMonths">
                <option value="null">{{ $t('21') }}</option>
                <option value="12">1{{ $t('58') }}</option>
                <option value="24">2{{ $t('58') }}</option>
                <option value="36">3{{ $t('58') }}</option>
                <option value="60">5{{ $t('58') }}</option>
                <option value="84">7{{ $t('58') }}</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('59') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minActiveCount">
                <option value="null">{{ $t('21') }}</option>
                <option value="20">20{{ $t('63') }}</option>
                <option value="50">50{{ $t('63') }}</option>
                <option value="100">100{{ $t('63') }}</option>
                <option value="200">200{{ $t('63') }}</option>
                <option value="500">500{{ $t('63') }}</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxActiveCount">
                <option value="null">{{ $t('21') }}</option>
                <option value="20">20{{ $t('63') }}</option>
                <option value="50">50{{ $t('63') }}</option>
                <option value="100">100{{ $t('63') }}</option>
                <option value="200">200{{ $t('63') }}</option>
                <option value="500">500{{ $t('63') }}</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('60') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minActiveRate">
                <option value="null">{{ $t('21') }}</option>
                <option value="20">20%</option>
                <option value="40">40%</option>
                <option value="60">60%</option>
                <option value="80">80%</option>
                <option value="100">100%</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxActiveRate">
                <option value="null">{{ $t('21') }}</option>
                <option value="20">20%</option>
                <option value="40">40%</option>
                <option value="60">60%</option>
                <option value="80">80%</option>
                <option value="100">100%</option>
              </select>
            </div>
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('53') }}</label>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('4') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minProfitRate">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxProfitRate">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('15') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minProfitFactor">
                <option value="null">{{ $t('21') }}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxProfitFactor">
                <option value="null">{{ $t('21') }}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('46') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minTotalTrades">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxTotalTrades">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('19') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minDrawdown">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxDrawdown">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
        </div>
        <!-- NEWWWWWWWWWWWW -->
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('54') }}</label>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('65') }}</label>
            <div class="flex mid w-270">
              <checkbox v-model="params.isOnSale" :attrs="{ value: true }" :label="$t('66')" />
              <checkbox v-model="params.isOperating" :attrs="{ value: true }" :label="$t('67')" class="ml-10" />
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('20') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minPosition">
                <option value="null">{{ $t('21') }}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxPosition">
                <option value="null">{{ $t('21') }}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div class="c-row-02">
            <label class="c-label-02">{{ $t('5') }}</label>
            <div class="flex mid w-270 space-between">
              <select v-model="params.minPrice">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="10000">10000</option>
                <option value="30000">30000</option>
                <option value="50000">50000</option>
                <option value="100000">100000</option>
              </select>
              <span class="c-span-01">~</span>
              <select v-model="params.maxPrice">
                <option value="null">{{ $t('21') }}</option>
                <option value="0">0</option>
                <option value="10000">10000</option>
                <option value="30000">30000</option>
                <option value="50000">50000</option>
                <option value="100000">100000</option>
              </select>
            </div>
          </div>
        </div>
        <div class="c-row-02">
          <label class="c-label-02">{{ $t('6') }}</label>
          <button class="c-btn-02 flex mid center" @click="openCurrencyBox"><external-link class="mr-5" />{{ $t('26') }}</button>
          <GogoModal :show="isShowModal" :cancel-text="null" @update:show="val => isShowModal = val" class="c-modal" :width="960" :height="550">
            <div slot="title" class="c-modal__t">
              ┃{{ $t('27') }}
            </div>
            <div slot="modal-body" class="c-modal__b flex flex-wrap">
              <checkbox v-model="params.currencyPairs" :attrs="{ id: 'currencyPairs'+key, value: key }" :label="label" v-for="(label, key) in $t('pairs')" :key="key" />
            </div>
          </GogoModal>
        </div>
        <hr class="c-hr-01 w-full" />
        <button class="c-btn-01 pos-rel" @click="Search(true)">{{ $t('25') }}</button>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('47') }}</label>
          <div class="c-row-03 flex flex-wrap">
            <!-- eslint-disable -->
            <checkbox v-model="params.platformId" :attrs="{ id: 'platformId'+item[0], value: item[0] }" :label="item[1]" v-if="item[0] != 5" v-for="item in platforms" :key="item[0]" />
            <!-- eslint-enable -->
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('7') }}</label>
          <div class="c-row-03 flex flex-wrap">
            <checkbox v-model="params.tradingStyles" :attrs="{ id: 'tradingStyles'+key, value: key }" :label="label" v-for="(label, key) in $t('trading-types')" :key="key" />
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <div>
          <label class="c-label-01 mb-10">{{ $t('8') }}</label>
          <div class="c-row-04 flex flex-wrap">
            <checkbox v-model="params.technicalIndicators" :attrs="{ id: 'technicalIndicators'+key, value: key }" :label="label" v-for="(label, key) in $t('indicators')" :key="key" />
          </div>
        </div>
        <hr class="c-hr-01 w-full" />
        <button class="c-btn-01 pos-rel" @click="Search(true)">{{ $t('25') }}</button>
      </div>
      <div class="o-cond flex layout-col mid">
        <div class="o-cond__h flex mid w-full">
          <search class="c-icon-04 ml-10" />
          <h2 class="mt-10 mb-10">{{ $t('55') }}</h2>
        </div>
        <div class="o-tags flex flex-wrap space-between pt-10 pb-20">
          <div class="c-row-06 flex flex-wrap space-between mt-10">
            <radio-tag v-model="params.month" :attrs="{ id: 'month2'+key, value: key }" :label="label" v-for="(label, key) in periods" :key="key" />
          </div>
          <hr class="c-hr-01 w-full mt-5" />
          <div class="c-row-07 flex flex-wrap space-between">
            <radio-tag v-model="params.tags" :attrs="{ id: 'tag'+key, value: key}" :icon="ezList[key].icon" :label="ezList[key].tag" v-for="(tag, key) in ezList" :key="'tag-' + key" />
          </div>
          <hr class="c-hr-01 w-full mt-5" />
          <button class="c-btn-01 pos-rel" @click="Search(true)">{{ $t('25') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-search.json'
import Search from '@@/../components/icons/Search.vue'
import SearchPlus from '@@/../components/icons/SearchPlus.vue'
import SortDown from '@@/../components/icons/SortDown.vue'
import SortUp from '@@/../components/icons/SortUp.vue'
import Edit from '@@/../components/icons/Edit.vue'
import ExternalLink from '@@/../components/icons/ExternalLink.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ProductRankHorizontal05 from '@@/../components/product/ProductRankHorizontal05.vue'
import Radio from '@@/../components/form/Radio.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import RadioTag from '@@/../components/form/RadioTag.vue'
import Paging from '@@/../components/paging/Paging.vue'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'
import Scatter3d from '@/components/charts/Scatter3d.vue'
import title from '@@/../common/pages'
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
  for (let key in query) {
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
  }
  return result
}
function serialize(params) {
  let result = []
  for (let key in params) {
    if (
      params.hasOwnProperty(key) &&
      params[key] != null &&
      params[key] != 'null' &&
      params[key] != '' ||
      key == 'isOnSale' ||
      key == 'isOperating'
    ) {
      result.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      )
    }
  }
  return result.join('&')
}
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Search,
      SearchPlus,
      SortDown,
      SortUp,
      Edit,
      ExternalLink,
      GogoModal,
      ProductRankHorizontal05,
      Paging,
      Radio,
      Checkbox,
      RadioTag,
      BubbleChart02,
      Scatter3d,
    },
    data() {
      return {
        dataResult: {
          data: [],
        },
        isShowModal: false,
        params: {},
        sort: 'profitTotal',
        sortAD: '0',
        categories: {
          1: this.$t('44'),
          3: this.$t('45'),
        },
        periods: {
          1: this.$t('37'),
          3: this.$t('38'),
          6: this.$t('39'),
          12: this.$t('40'),
          24: this.$t('41'),
          0: this.$t('42'),
        },
        ezList: {
          1: {
            tag: this.$t('29'),
            icon: 'Star',
          },
          2: {
            tag: this.$t('3'),
            icon: 'Bell',
          },
          3: {
            tag: this.$t('30'),
            icon: 'ArrowUp',
          },
          4: {
            tag: this.$t('31'),
            icon: 'ChartLine02',
          },
          5: {
            tag: this.$t('32'),
            icon: 'ShoePrints',
          },
          6: {
            tag: this.$t('33'),
            icon: 'Bomb',
          },
          7: {
            tag: this.$t('34'),
            icon: 'Sync',
          },
          8: {
            tag: this.$t('35'),
            icon: 'Line01',
          },
          9: {
            tag: this.$t('36'),
            icon: 'Flag',
          },
        },
        sortTypes: {
          profitTotal: this.$t('14'),
          profitFactor: this.$t('15'),
          profitRate: this.$t('4'),
          riskReturnRate: this.$t('16'),
          winningRate: this.$t('17'),
          salesCount: this.$t('48'),
        },
      }
    },
    async asyncData({ app, query, req, store, route, redirect }) {
      if (
        req.originalUrl.includes('/search/detail') ||
        req.originalUrl.includes('/search/easy')
      ) {
        redirect(301, '/systemtrade/search')
        return
      }
      let params = {
          name: null,
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
          categoryId: [],
          platformId: [],
          currencyPairs: [],
          tradingStyles: [],
          technicalIndicators: [],
          month: 0,
          sort: '0profitTotal',
          page: 1,
          minOperatingMonths: null,
          maxOperatingMonths: null,
          minActiveCount: null,
          maxActiveCount: null,
          minActiveRate: null,
          maxActiveRate: null,
          isOnSale: query.isOnSale == undefined && (!Object.keys(query).length || query.name) ? true : (query.isOnSale == true || false),
          isOperating: query.isOperating == undefined && (!Object.keys(query).length || query.name) ? false : (query.isOperating == true || false),
        },
        name = query.name || undefined,
        [dataResult, scatterChartData] = await Promise.all([
          app.GoGoHTTP.post(
            '/api/v3/surface/systemtrade/search',
            setQuery(query)
          ),
          app.GoGoHTTP.get('/api/v3/surface/top/charts/scatter'),
        ])
      if (name) {
        store.commit('pushBC', {
          name: name,
          target: { path: route.fullPath },
        })
      } else {
        store.commit('pushBC', {
          path: '/systemtrade/search',
        })
      }
      return {
        dataResult,
        rankingActive: dataResult.rankingActive,
        scatterChartData,
        params: Object.assign(params, setParams(query)),
        sort: params.sort.substring(1),
        sortAD: params.sort.substring(0, 1),
        linkMeta: [
          {
            rel: 'canonical',
            href: query.name
              ? `${process.env.GOGO_URL}/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/systemtrade/search`,
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: query.name
              ? `${process.env.GOGO_URL}/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/systemtrade/search`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: query.name
              ? `${process.env.GOGO_URL}/en/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/en/systemtrade/search`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: query.name
              ? `${process.env.GOGO_URL}/th/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/th/systemtrade/search`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: query.name
              ? `${process.env.GOGO_URL}/vi/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/vi/systemtrade/search`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: query.name
              ? `${process.env.GOGO_URL}/systemtrade/search/?name=${name}`
              : `${process.env.GOGO_URL}/systemtrade/search`,
          }
        ],
      }
    },
    methods: {
      getPage(_page) {
        this.params.page = _page
        this.Search()
      },
      Search(resetPage = false) {
        if (resetPage) {
          this.params.page = 1
        }
        let query = serialize(this.params)
        location.href = `/systemtrade/search/?${query}`
      },
      openCurrencyBox() {
        this.isShowModal = true
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
      reversedInfo(inp, data, sep = null) {
        if (sep == null) {
          return data[inp]
        } else {
          let res = []
          inp.forEach(function(item) {
            res.push(data[item])
          })
          return res.join(sep)
        }
      },
      descriptionTemplate() {
        return this.params.name
          ? this.$t('52', { keyword: '「' + this.params.name + '」' })
          : this.$t('51')
      },
    },
    computed: {
      pagingMsg() {
        return `${this.dataResult.pagingFrom}～${
          this.dataResult.lastPage
        }${this.$t('11')} ${this.$t('12', {
          page: this.dataResult.currentPage,
        })} / ${this.$t('13').replace('%s', this.dataResult.total)}`
      },
      titleChunk() {
        return this.params.name
          ? this.$t('50', { keyword: '「' + this.params.name + '」' })
          : this.$t('49')
      },
      platforms() {
        const platforms = Object.keys(this.$t('platforms'))
        // Move the position of MT5 nearby MT4
        const mt5Position = 14 // position of MT5 in i18n (common/platforms)
        return platforms.slice(0,1)
                .concat(platforms[mt5Position])
                .concat(platforms.slice(1, mt5Position))
                .concat(platforms.slice(mt5Position + 1)).map(key => [key, this.$t('platforms')[key]])
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
$font_size_01: 16px;
$color_01: #fff;
$color_02: rgb(197, 197, 197);
$color_03: rgb(255, 132, 0);
$color_04: rgb(217, 217, 217);
$color_05: rgb(102, 102, 102);
$color_06: rgb(240, 240, 240);
$color_07: rgb(125, 125, 125);
$width_01: 270px;
$height_01: 40px;
%border_01 {
  border: 1px solid $color_02;
}
%border_radius_01 {
  border-radius: 5px;
}
%strong {
  font-weight: bold;
}
%absolute {
  position: absolute;
}
%pointer {
  cursor: pointer;
}
%content_null {
  content: '';
}
h3 {
  font-size: 20px;
  line-height: 20px;
  margin: 2px 0 0 4px;
  @extend %strong;
}
label {
  font-size: 13px;
  font-weight: normal;
  word-break: keep-all;
}
select {
  width: 120px;
  height: 30px;
  border-radius: 4px;
  background: rgb(186, 186, 186);
  color: $color_01;
  border: 1px solid rgb(166, 166, 166);
  cursor: pointer;
  outline: none;
}
button:focus {
  outline: none;
}
.c-row-01 {
  width: $width_01;
  height: $height_01;
  label {
    margin-right: 15px;
  }
}
.c-row-02 {
  margin-bottom: 7px;
}
.o-layout__i {
  &.u-670 {
    width: 670px;
  }
  &.u-300 {
    width: 300px;
  }
}
.o-cond__h {
  color: $color_01;
  background: $color_05;
  padding: 3px 0;
  height: 45px;
  h2 {
    font-size: 18px;
  }
}
.o-cond {
  border-top: 5px solid $color_03;
  background: $color_06;
  @extend %border_radius_01;
}
.o-tags {
  width: $width_01;
}
.c-label-01 {
  font-size: $font_size_01;
  @extend %strong;
}
.c-label-02 {
  margin-left: -4px;
}
.c-row-03,
.c-row-04,
.c-row-05 {
  width: $width_01;
}
.c-row-03 > label {
  flex: 0 0 48%;
  padding-left: 18px;
}
.c-row-04 > label {
  flex: 0 0 50%;
  padding-left: 16px;
}
.c-row-05 > label {
  flex: 0 0 33.33%;
}
.c-row-06 > label {
  width: 85px;
  height: 40px;
}
.c-row-07 > label {
  width: 125px;
  height: 40px;
}
.c-btn-01 {
  width: $width_01;
  height: 50px;
  font-size: $font_size_01;
  color: $color_03;
  border: 2px solid $color_02;
  background: $color_01;
  @extend %strong;
  @extend %border_radius_01;
  &::after {
    width: 100%;
    height: 3px;
    left: 0;
    bottom: 0;
    background: rgb(230, 230, 230);
    @extend %absolute;
    @extend %content_null;
  }
  &:hover {
    background: #f9f9f9;
  }
}
.c-btn-02 {
  width: 260px;
  height: $height_01;
  font-size: 14px;
  background: $color_01;
  @extend %border_01;
  @extend %border_radius_01;
  i.icon-cls {
    width: 19px;
    height: auto;
  }
  &:hover {
    background: #f9f9f9;
  }
}
.c-keyword {
  border: 1px solid $color_04;
  padding: 14px;
  width: $width_01;
  height: $height_01;
  @extend %border_radius_01;
  &::placeholder {
    color: $color_04;
  }
}
.c-span-01 {
  font-size: 21px;
  margin-left: 2px;
  margin-right: 2px;
}
.c-hr-01 {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #fff;
}
.o-icon-sort {
  cursor: pointer;
  width: 15px;
  height: 15px;
  padding: 2px 0 0 2px;
  /deep/ svg {
    width: 12px;
    height: 12px;
    color: $color_05;
  }
  /deep/ &.u-up svg {
    margin-top: 3px;
  }
}
.c-icon-02 {
  width: 28px;
  height: 28px;
  padding: 3px;
  color: $color_01;
  background: $color_07;
  border-radius: 50%;
}
.c-icon-03 {
  color: $color_01;
  width: 20px;
  height: auto;
  margin: -2px 3px 0 10px;
}
.c-icon-04 {
  color: $color_01;
  width: 29px;
  height: auto;
}
.c-list-01 {
  list-style: none;
  height: 40px;
  border-radius: 5px 5px 0 0;
  background: $color_06;
  font-size: 14px;
}
.c-list-01__i {
  @extend %pointer;
  color: #a0a0a0;
  &.is-active {
    color: $color_07;
    @extend %strong;
  }
}
.c-head-01 {
  border-bottom: 1px solid #ddd;
  padding-bottom: 16px;
  color: $color_07;
  h2 {
    font-size: 18px;
    line-height: 18px;
    margin: 2px 0 0 4px;
  }
  h3 {
    font-size: 14px;
    line-height: 14px;
    margin: 2px 0 0 4px;
    font-weight: normal;
  }
}
.c-sub-01 {
  font-size: 11px;
  line-height: 16px;
  color: $color_07;
}
.c-modal /deep/ {
  .modal-dialog {
    display: flex;
    align-items: center;
  }
  .modal-content {
    width: 100%;
  }
  .close {
    margin-right: 5px;
  }
  .c-modal__b {
    height: calc(550px - 105px);
    overflow-y: auto;
    padding: 40px 0 10px 60px;
    label {
      font-size: 14px;
      flex: 0 0 17%;
      margin-bottom: 15px;
      box-sizing: content-box;
    }
  }
  .c-modal__t {
    padding-left: 38px;
  }
}
</style>
