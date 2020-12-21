<template>
  <div class="bg-10 w-1000">
    <div class="flex flex-wrap info-container">
      <div class="info-item h-80" v-for="(item, idx) in symbolRealTime" :key='idx'>
        <a style="text-decoration: none;" :href="`/markets/charts/${item.symbol+1}/1`">
          <div :class="'pl-5 pr-5 offset-'+idx%3">
            <div class="divHover">
              <div>
                <span class="fs-14 co-white" v-if="symbols[item.symbol]">{{ $t(symbols[item.symbol]+'-Info') }}</span> <span v-else class="fs-14 co-white">-</span>
                <!-- <span class="fs-12 co-white fl-r">{{ formatMoney(item.ask, item.symbol+1) || '-' }}</span> -->
              </div>
              <div class="info-content" v-if='item'>
                <div class="fs-28 flex space-between" :class="'col-'+(item.status)"> 
                  <div>
                    <span v-if="item.vary > 0">▲</span> 
                    <span v-else-if="item.vary < 0">▼</span>
                    <span>{{ formatPercent(item.vary) }}</span>
                  </div>
                  <span>{{ formatMoney(item.bid, item.symbol+1) || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/charts.json'
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
.info-title {
  order: 1;
}
.info-container {
  width: 96%;
  margin: 0 auto;
}
.info-content {
  order: 2;
  p {
    margin: 5px 0 0 0;
    transition: all 1s ease;
  }
}
.bg-10 {
  background: repeating-linear-gradient(
    -45deg,
    rgb(56, 51, 51),
    rgb(29, 29, 29) 1%,
    white 1%
  );
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
.co-white {
  color: white;
}
.fs-12 {
  font-size: 12px;
}
.fs-14 {
  font-size: 14px;
}
.fs-20 {
  font-size: 20px;
}
.fs-28 {
  font-size: 28px;
}
.fl-r {
  float: right;
}
.info-item {
  padding: 6px 0;
  border-bottom: 0.5px solid grey;
  flex-direction: column;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 33%;
  .divHover {
    padding: 5px 15px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      background: rgba(179, 179, 179, 0.17);
    }
  }
  min-width: 320px;
  .offset-0 {
    border: none;
    height: 100%;
  }
  .offset-1 {
    border-left: 1px solid grey;
    border-right: 1px solid grey;
    height: 100%;
  }
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
