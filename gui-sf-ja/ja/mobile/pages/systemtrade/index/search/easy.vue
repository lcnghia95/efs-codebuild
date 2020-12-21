<template>
  <div class="o-layout">
    <div class="c-nav text-center">
      <GogoLink target="/systemtrade/search/detail" class="c-btn pos-rel">
        {{ $t('1') }}<i class="o-arrow-r pos-abs"></i>
      </GogoLink>
    </div>
    <div class="c-tit flex mid">
      <search class="o-icon" />{{ $t('2') }}
    </div>
    <div class="c-tags flex space-between flex-wrap">
      <button class="c-btn u-30 mid pos-rel" :class="{ 'is-active': params.month == i }" @click="selectMonth(i)" v-for="(item, i) in periodOps" :key="i">{{ item }}</button>
    </div>
    <hr class="o-hr" />
    <div class="c-tags flex space-between flex-wrap">
      <button class="c-btn u-30 mid pos-rel" :class="{ 'is-active': params.tag == i }" @click="selectTag(i)" v-for="(item, i) in tagOps" :key="i">
        <i :is="tagOps[i].icon" :class="tagOps[i].class" />
        <span>{{ item.tag }}</span>
      </button>
    </div>
    <hr class="o-hr" />
    <div class="c-tags flex space-between flex-wrap">
      <button class="c-btn u-pf u-30 mid pos-rel" :class="{ 'is-active': params.platformId == i }" @click="selectPlatform(i)" v-if="i != 5" v-for="(item, i) in $t('platforms')" :key="i">
        <span>{{ item }}</span>
      </button>
    </div>
    <hr class="o-hr" />
    <div class="c-tags flex">
      <checkbox v-model="categoryId" :attrs="{ id: 'categoryId'+key, value: key }" :label="label" v-for="(label, key) in categories" :key="key" class="o-label mr-20" @input="selectCategory()" />
    </div>
    <ul class="c-sort flex space-between mid">
      <li :class="{ 'is-active': sort == i }" :style="`order:${i}`" @click="selectSort(i)" v-for="(item, i) in sortOps" :key="i" class="flex mid">
        {{ item[1] }}
      </li>
      <div class="arrow-down" :style="`order: ${sort}`" v-if="sortAD=='0'"></div>
      <div class="arrow-up" :style="`order: ${sort}`" v-else></div>
    </ul>
    <div class="c-total">{{ dataResult.totalItem }} {{ $t('3') }}</div>
    <ProductHorizontal03List :product-list="dataShow" class="c-result" />
    <button class="c-btn-more pos-rel text-center p-0" @click="loadMore">
      {{ $t('4') }}<i class="o-arrow-d pos-abs"></i>
    </button>
  </div>
</template>
<script>
import Search from '@@/../components/icons/Search.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import Star from '@@/../components/icons/Star.vue'
import Bell from '@@/../components/icons/Bell.vue'
import ArrowUp from '@@/../components/icons/ArrowUp.vue'
import ChartLine02 from '@@/../components/icons/ChartLine02.vue'
import ShoePrints from '@@/../components/icons/ShoePrints.vue'
import Bomb from '@@/../components/icons/Bomb.vue'
import Sync from '@@/../components/icons/Sync.vue'
import Flag from '@@/../components/icons/Flag.vue'
import Line01 from '@@/../components/icons/Line01.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import ProductHorizontal03List from '@/components/product/ProductHorizontal03List.vue'
import i18n from '@@/lang/mobile/systemtrade-search-easy.json'
import title from '@@/../common/pages'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Search,
      GogoLink,
      Star,
      Bell,
      ArrowUp,
      ChartLine02,
      ShoePrints,
      Bomb,
      Sync,
      Flag,
      Line01,
      ProductHorizontal03List,
      Checkbox,
    },
    data() {
      return {
        categories: {
          1: this.$t('28'),
          3: this.$t('29'),
        },
        sortOps: {
          1: ['profitTotal', this.$t('5')],
          2: ['profitFactor', this.$t('6')],
          3: ['profitRate', this.$t('7')],
          4: ['riskReturnRate', this.$t('8')],
          5: ['winningRate', this.$t('9')],
          6: ['price', this.$t('10')],
        },
        periodOps: {
          1: this.$t('11'),
          3: this.$t('12'),
          6: this.$t('13'),
          12: this.$t('14'),
          24: this.$t('15'),
          0: this.$t('16'),
        },
        tagOps: {
          1: {
            tag: this.$t('17'),
            icon: 'Star',
          },
          2: {
            tag: this.$t('18'),
            icon: 'Bell',
          },
          3: {
            tag: this.$t('19'),
            icon: 'Flag',
          },
          4: {
            tag: this.$t('20'),
            icon: 'ArrowUp',
          },
          5: {
            tag: this.$t('21'),
            icon: 'ChartLine02',
          },
          6: {
            tag: this.$t('22'),
            icon: 'ShoePrints',
          },
          7: {
            tag: this.$t('23'),
            icon: 'Bomb',
          },
          8: {
            tag: this.$t('24'),
            icon: 'Sync',
          },
          9: {
            tag: this.$t('25'),
            icon: 'Line01',
          },
        },
        sort: 1,
        sortAD: '0',
        categoryId: [],
        params: {
          categoryId: null,
          month: 0,
          tag: null,
        },
        dataShow: {},
      }
    },
    async asyncData({ app }) {
      let dataResult = await app.GoGoHTTP.post(
        '/api/v3/surface/systemtrade/search'
      )

      return {
        dataResult: dataResult,
        dataShow: dataResult.data,
      }
    },
    methods: {
      selectSort(_sort) {
        if (this.sort === _sort) {
          this.sortAD = this.sortAD === '0' ? '1' : '0'
        } else {
          this.sort = _sort
        }
        this.params.page = 1
        this.params.sort = this.sortAD + this.sortOps[this.sort][0]
        this.Search()
      },
      selectMonth(_month) {
        this.params.page = 1
        this.params.month = _month
        this.Search()
      },
      selectTag(_tag) {
        this.params.page = 1
        this.params.tag = _tag
        this.Search()
      },
      selectPlatform(_platformId) {
        this.params.page = 1
        this.params.platformId = _platformId
        this.Search()
      },
      selectCategory() {
        this.params.page = 1
        this.params.categoryId = this.categoryId.join(',') || null
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
%border_radius_5 {
  border-radius: 5px;
}
%strong {
  font-weight: bold;
}
%absolute {
  position: absolute;
}
%content_null {
  content: '';
}
%display_block {
  display: block;
}
%width_full {
  width: 100%;
}
.c-nav {
  padding: 4vw;
  a {
    text-decoration: none;
  }
}
.c-tit {
  color: $color_01;
  background: $color_05;
  border-top: 4px solid $color_03;
  height: 12vw;
  padding: 0 4vw;
  font-size: 3.5vw;
  .o-icon {
    width: 6.5vw;
    height: auto;
  }
}
.c-tags {
  background: #f0f0f0;
  padding: 4vw 4vw 1vw 4vw;
}
.o-hr {
  margin: 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #fff;
}
.c-btn {
  height: 14vw;
  line-height: 13vw;
  font-size: 4.5vw;
  color: $color_03;
  border: 2px solid $color_02;
  outline: none;
  background: $color_01;
  @extend %strong;
  @extend %border_radius_5;
  @extend %display_block;
  @extend %width_full;
  &::after {
    height: 3px;
    left: 0;
    bottom: 0;
    background: rgb(230, 230, 230);
    @extend %absolute;
    @extend %content_null;
    @extend %width_full;
  }
  &.u-30 {
    display: flex;
    width: 30%;
    height: 10vw;
    line-height: inherit;
    font-size: 3.5vw;
    text-align: left;
    margin-bottom: 4vw;
    padding: 0 3vw;
  }
  &.u-pf {
    width: 47.5%;
  }
  &.u-pf:nth-child(4) {
    font-size: 3.3vw;
  }
  &.is-active {
    color: $color_01;
    background: $color_03;
  }
  &.is-active::after {
    height: 0;
  }
}
i.icon-cls {
  width: 5vw;
  height: auto;
  margin-right: 1vw;
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
  margin: 4vw 4vw 8vw 4vw;
  width: 92vw;
}
.o-arrow-r {
  border: solid $color_03;
  border-width: 0 2px 2px 0;
  padding: 2px;
  transform: rotate(-45deg);
  position: absolute;
  right: 13px;
  top: 20px;
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
  border-radius: 6px;
  margin: 4vw 4vw 0 4vw;
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
  margin-left: -3.5vw;
  margin-bottom: 1vw;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 1.2vw solid transparent;
  border-right: 1.2vw solid transparent;
  border-top: 2vw solid #333;
  margin-left: -3.5vw;
  margin-bottom: 1vw;
}
.c-total {
  text-align: right;
  margin: 3vw 4vw;
  font-size: 3.5vw;
}
.c-result {
  margin: 4vw;
}
@media only screen and (min-width: 600px) {
  .c-nav {
    padding: 3vw;
    a {
      width: 60vw;
      height: 9vw;
      line-height: 9vw;
      font-size: 3vw;
      margin: 0 auto;
      &:last-child {
        margin-top: 0;
      }
    }
  }
  .c-btn.u-30 {
    height: 8vw;
    font-size: 3vw;
    margin-bottom: 2.5vw;
  }
}
</style>
