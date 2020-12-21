<template>
  <div>
    <table class="spread-table">
      <thead>
        <tr>
          <th width="20" rowspan="2">#</th>
          <th class="cursor-pointer pos-rel"
              @click="$emit('onChangeSortType', 0)"
              style="font-size: 1.6rem; min-width: 70px;"
              rowspan="2"
          >
            <span>
              {{ $t('7') }}
              <span class="sort-icon">
                <SortDown v-if="data.sortType==999" />
                <SortUp class="up" v-if="data.sortType==-999" />
              </span>
            </span>
          </th>
          <th v-for="(_pair, id) in data.pairs[0]"
              class="pos-rel pair-header"
              @click="$emit('onChangeSortType', id)"
              :key="id"
          >
            <span>
              {{ _pair }}
            </span>
            <span class="sort-icon">
              <SortDown v-if="data.sortType==id" />
              <SortUp class="up" v-if="data.sortType==-id" />
            </span>
          </th>
        </tr>
        <tr>
          <th v-for="(_pair, id) in data.pairs[1]"
              class="pos-rel"
              @click="$emit('onChangeSortType', id)"
              :key="id"
          >
            <span>
              {{ _pair }}
            </span>
            <span class="sort-icon">
              <SortDown v-if="data.sortType==id" />
              <SortUp class="up" v-if="data.sortType==-id" />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(broker, brokerIndex) in data.brokers">
          <template v-if="broker.id !== 265">
            <tr :key="broker.id + 'ao912x'">
              <td rowspan="2">{{ brokerIndex + 1 }}</td>
              <td rowspan="2">
                <div v-wrap-lines="2" style="min-height: 45px;">
                  <a style="color: #000;" :href="broker.newUrl || '/companies/' + broker.id" v-if="broker.url">{{ broker.name }}</a>
                  <div class="w-100 wrap-text" v-else :title="broker.name">{{ broker.name }}</div>
                </div>
                <div v-if="broker.id != 114" class="flex" style="font-size: 1rem; line-height: 20px;">
                  <!-- business, hide company id 114 -->
                  <span class="real wrap-text fs-11 mr-5" v-if="broker.real">{{ $t('9') }}</span>
                  <a class="foreing wrap-text" v-if="broker.newUrl" :href="broker.newUrl" target="_blank">{{ $t('10') }}</a>
                </div>
                <div v-else style="min-height: 20px;"></div>
              </td>
              <td v-for="(item, pairIndex) in (data.realtimeData[broker.id] || []).slice(0, 5)" 
                  :id="broker.id + '_' + item.Symbol + '_td'" 
                  :key="pairIndex"
              >
                <a :href="`/markets/spreads/${broker.id}/${item.Symbol}`"
                   :id="broker.id + '_' + item.Symbol + '_a'"
                >
                  {{ item.Spread }}
                </a>
              </td>
            </tr>
            <tr :key="broker.id + 'ujkl21'">
              <td v-for="(item, pairIndex) in (data.realtimeData[broker.id] || []).slice(5, 10)"
                  :id="broker.id + '_' + item.Symbol + '_td'" 
                  :key="pairIndex"
              >
                <a :href="`/markets/spreads/${broker.id}/${item.Symbol}`"
                   :id="broker.id + '_' + item.Symbol + '_a'"
                >
                  {{ item.Spread }}
                </a>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/spread-brokers.json'
import SortDown from '@@/../components/icons/SortDown.vue'
import SortUp from '@@/../components/icons/SortUp.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    SortDown,
    SortUp,
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    brokers: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      pairs: [
        'USD/JPY',
        'GBP/JPY',
        'EUR/JPY',
        'AUD/USD',
        'CHF/JPY',
        'CAD/JPY',
        'NZD/JPY',
        'EUR/USD',
        'GBP/USD',
        'AUD/JPY',
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.spread-table {
  table-layout: fixed;
  word-break: break-word;
  width: 100%;
  thead {
    font-size: 1.3rem;
    color: #fff;
    text-align: center;
    tr:first-child {
      th:first-child {
        border-top-left-radius: 5px;
        border-left: none;
        padding: 0;
        text-align: center;
      }
      th:nth-child(2) {
        text-align: center;
      }
      th:last-child {
        border-top-right-radius: 5px;
      }
    }
    th {
      font-weight: normal;
      font-size: 1rem;
      padding: 5px 10px 5px 3px;
      border-bottom: 1px solid #e65c00;
      border-left: 1px solid #e65c00;
      background: #f60;
    }
  }
  tbody {
    border: 1px solid #dfdfdf;
    td {
      border-bottom: 1px solid #dfdfdf;
      padding: 5px 0;
      text-align: center;
    }
    tr {
      td:first-child {
        border-left: none;
      }
      td:last-child {
        border-right: none;
      }
    }
    tr:nth-child(odd) {
      td:nth-child(1), td:nth-child(2) {
        border-right: 1px solid #dfdfdf;
        text-align: left;
        padding: 5px;
      }
    }
    @for $i from 1 through  8 {
      @if $i%2 == 0 {
        tr:nth-child(#{$i*2}) {
          background: #fff;
        }
        tr:nth-child(#{$i*2 - 1}) {
          background: #fff;
        }
      }
      @else {
        tr:nth-child(#{$i*2}) {
          background: #eee;
        }
        tr:nth-child(#{$i*2 + 1}) {
          background: #eee;
        }
      }
    }
  }
}
.sort-icon {
  position: absolute;
  top: 30%;
  right: 3px;
  .icon-cls {
    cursor: pointer;
    width: 10px;
    height: 10px;
    margin-top: 2px;
    /deep/ svg {
      width: 10px;
      height: 10px;
      color: #fff;
    }
    /deep/ &.uup svg {
      margin-top: 3px;
    }
  }
}
.pair-header {
  width: 40px;
}
.real {
  background: #00623d;
  border-radius: 3px;
  padding: 0 5px;
  color: white;
}
.foreing {
  background: #156fe2;
  border-radius: 3px;
  padding: 0 5px;
  color: white;
}
@media only screen and (min-width: 600px) {
  .pair-header {
    width: 65px;
  }
  th {
    height: 40px;
  }
}
</style>