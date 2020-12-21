<template>
  <div class="pos-rel">
    <img :src="'/img/assets/pc/common/flags/' + (pair && gifs[imgs[0]])" alt="" width="20" height="20" />
    <img :src="'/img/assets/pc/common/flags/' + (pair && gifs[imgs[1]])" alt="" class="img2" width="20" height="20" />
  </div>
</template>

<script>
export default {
  props: ['pair'],
  data() {
    return {
      pairs: {
        1: 'USD/JPY',
        3: 'EUR/JPY',
        8: 'EUR/USD',
        2: 'GBP/JPY',
        9: 'GBP/USD',
        4: 'AUD/JPY',
        11: 'AUD/USD',
        7: 'NZD/JPY',
        6: 'CAD/JPY',
        5: 'CHF/JPY',
        12: 'USD/CHF',
        36: 'ZAR/JPY',
        10: 'NZD/USD',
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
      return this.pairs[this.pair].split('/')
    },
  },
}
</script>

<style lang="scss" scoped>
.img2 {
  position: absolute;
  top: 7px;
  left: 12px;
}
</style>
