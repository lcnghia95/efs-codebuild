<template>
  <div class="flex flex-wrap center info-ctn">
    <div class="info-item-ctn" :key="idx" v-for="(item, idx) in symbolRealTime" @click="onClick(item)">
      <div class="info-item flex flex-wrap space-between">
        <div>
          <template v-if="symbols[item.symbol]"
                    class="fs-14 co-white"
          >
            {{ $t(symbols[item.symbol]+'-Info') }}
          </template>
          <span v-else class="fs-14 co-white">-</span>
        </div>
        <div class="flex space-between w-full" 
             :class="'col-'+(item.status)"
             style="height: 1.3rem;"
        >
          <div>
            <template v-if="item.vary > 0">▲</template> 
            <template v-else-if="item.vary < 0">▼</template>
            <template>{{ formatPercent(item.vary) }}</template>
          </div>
          <div>{{ formatMoney(item.bid, item.symbol+1) || '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/martket-charts-top-info.json'
export default {
  props: ['symbolRealTime', 'symbols'],
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      ditgits: {
        1: 3,
        2: 3,
        3: 5,
        4: 3,
        5: 3,
        6: 3,
        7: 3,
        8: 3,
        9: 3,
        10: 5,
        11: 5,
        12: 3,
        13: 5,
        14: 5,
        15: 5,
        16: 3,
        17: 3,
        18: 5,
        19: 5,
        20: 5,
        21: 5,
        22: 5,
        23: 0,
        24: 1,
        25: 1,
        26: 1,
        27: 2,
        28: 3,
        29: 1,
        30: 2,
        31: 0,
        32: 0,
        33: 2,
        default: 5,
      },
    }
  },
  methods: {
    onClick(item) {
      location.href = `/markets/charts/${item.symbol + 1}/1`
    },
    formatMoney(n, pair) {
      let s = n
        ? n
            .toFixed(this.ditgits[pair || 'default'] || 2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        : 0
      if (!this.ditgits[pair]) {
        s = s.toString().slice(0, s.length - 3)
      }
      return s
    },
    formatPercent(n) {
      if (!n) {
        return '-'
      }
      n = parseFloat(n)
      if (n.toFixed(2) != 0) {
        return n.toFixed(2) + '%'
      }
      if (n.toFixed(3) != 0) {
        return n.toFixed(3) + '%'
      }
      if (n.toFixed(4) != 0) {
        return n.toFixed(4) + '%'
      }
      if (n.toFixed(5) != 0) {
        return n.toFixed(5) + '%'
      }
      return n.toFixed(2) + '%'
    },
  },
}
</script>
<style lang="scss" scoped>
.info-ctn {
  background: repeating-linear-gradient(-45deg, #4d4d4d 3px, #232323 2px, #000 4px);
  .info-item-ctn {
    border-bottom: 1px solid #3f3f3f;
    flex: 0 0 calc(50% - 10px);
    &:last-child {
      border-bottom: none;
      flex: 0 0 calc(50% - 10px);
      .info-item {
        margin-left: -1px;
      }
    }
    &:nth-child(even) .info-item {
      border-left: 1px solid #3f3f3f;
    }
    &:nth-child(odd) .info-item {
      margin-left: -1px;
    }
  }
}
.info-item {
  height: 50px;
  padding: 0 5px;
  margin: 5px 0;
  color: #fff;
  font-size: 14px;
  overflow: hidden;
  &:active {
    background: #c5c5c56e;
  }
}
.col-1 {
  color: rgb(229, 69, 93);
}
.col-2 {
  color: #e1e3e4;
}
.col-3 {
  color: #39f;
}
</style>

<docs>
  ```vue
  <template>
    <TopInfo :option="{ symbolRealTime: symbolRealTime }" :symbols="symbols" />
  </template>
  <script>
  export default {
    data() {
      return {
          symbols: {
            0: 'USDJPY',
            1: 'EURJPY',
            2: 'EURUSD',
            3: 'AUDJPY',
            4: 'GBPJPY',
            5: 'NZDJPY',
            6: 'CADJPY',
          },
          symbolRealTime: [ // with 6 item
            {
              symbol: 1,
              ask: 1,
              bid: 1,
              oldBid: 1,
              status: 2,
              vary: 0,
            },
          ],
      }
    },
  }
  </script>
  ```
</docs>
