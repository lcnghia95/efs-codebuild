<template>
  <div class="pos-rel" v-if="imgs.length == 2">
    <img :src="'/img/assets/pc/common/flags/' + gifs[imgs[0]]" alt="" width="15" height="15" />
    <img :src="'/img/assets/pc/common/flags/' + gifs[imgs[1]]" alt="" class="img2" width="15" height="15" />
  </div>
  <div class="pos-rel" v-else>
    <div class="div-coin"></div>
  </div>
</template>

<script>
export default {
  props: ['pair'],
  data() {
    return {
      pairs: {
        0: 'USD/JPY',
        1: 'EUR/JPY',
        2: 'EUR/USD',
        3: 'AUD/JPY',
        4: 'GBP/JPY',
        5: 'NZD/JPY',
        6: 'CAD/JPY',
        7: 'CHF/JPY',
        8: 'HKD/JPY',
        9: 'GBP/USD',
        10: 'USD/CHF',
        11: 'ZAR/JPY',
        12: 'AUD/USD',
        13: 'NZD/USD',
        14: 'EUR/AUD',
        15: 'TRY/JPY',
        16: 'SGD/JPY',
        17: 'EUR/GBP',
        18: 'EUR/CHF',
        19: 'GBP/CHF',
        20: 'USD/HKD',
        21: 'EUR/DKK',
        22: 'JP225Cash',
        23: 'US30Cash',
        24: 'US100Cash',
        25: 'US500Cash',
        26: 'GOLD',
        27: 'SILVER',
        28: 'GER30Cash',
        29: 'UK100Cash',
        30: 'HK50Cash',
        31: 'BTCJPY',
        32: 'WTI',
      },
      gifs: {
        JPY: 'JPY.gif',
        GBP: 'GBP.gif',
        USD: 'USD.gif',
        AUD: 'AUD.gif',
        CHF: 'CHF.gif',
        EUR: 'EUR.gif',
        NZD: 'NZD.gif',
        ZAR: 'ZAR.gif',
        CAD: 'CAD.gif',
        HKD: 'HKD.gif',
        SGD: 'SGD.gif',
        TRY: 'TRY.gif',
        DKK: 'DKK.gif',
      },
    }
  },
  computed: {
    imgs() {
      if (this.pair >= 0 && this.pair < Object.keys(this.pairs).length) {
        let array = this.pairs[this.pair].split('/')
        return array
      }
      return []
    },
  },
}
</script>

<style lang="scss" scoped>
.img2 {
  position: absolute;
  top: 5px;
  left: 7px;
}
.div-coin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #b7a457;
  background: linear-gradient(-40deg, #efbc41, #f9e082, #dead58, #debb54);
}
</style>
