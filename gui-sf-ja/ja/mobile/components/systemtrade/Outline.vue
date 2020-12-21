<template>
  <div class="system-outline">
    <component :is="category + 'Outline'" :data="data" />
    <div class="outline-zQpLHqa1KZ pre-wrap" v-html="data.outline" />
    <div class="mt-20 last-outline" v-if="listOutline.length">
      [{{ formatTime(listOutline[0]['createdDate']) }}]{{ $t('14') }}
    </div>
    <div class="mt-10 flex layout-col">
      <div class="flex mid cursor-pointer mb-5" v-for="(d,i) in listOutline" :key="'outline-' + i" v-if="i > 0">
        <span class="close-icon">
          <Plus class="plus-size"/>
        </span>
        <a class="ml-5">{{ formatTime(d.createdDate) }}&nbsp;{{ $t('15') }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/system-outline.json'
import Plus from '@@/../components/icons/Plus.vue'
import fxOutline from '@/components/systemtrade/fxOutline.vue'
import stocksOutline from '@/components/systemtrade/stocksOutline.vue'

export default {
  components: { Plus, fxOutline, stocksOutline, bitcoinOutline: fxOutline },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    listOutline: {
      type: Array,
      default: () => {
        return []
      },
    },
    category: {
      type: String,
      default: 'fx',
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
.system-outline {
  color: #666;
  overflow: hidden;
  .pre-wrap {
    white-space: pre-line;
    color: #666;
    line-height: 22px;
  }
  .last-outline {
    color: #f055cb;
  }
  .close-icon {
    width: 18px;
    height: 18px;
    border: #62a963 1px solid;
    background: #f2f2f2;
    .plus-size {
      width: 16px;
      height: 16px;
      color: #62a963;
    }
  }
  .outline-zQpLHqa1KZ {
    width: 92%;
    margin: 4vw auto;
    /deep/ * {
      max-width: 100% !important;
      width: auto !important;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <Outline :data="outline" />
  </template>
  <script>
    export default {
      data() {
        return {
          outline: {
            currencyPairs: "9",
            tradingStyles: "1,2",
            maxPositions: 1,
            maxPositionsOther: "",
            operativeType: 1,
            maxLots: 10,
            maxLotsOther: "",
            period: 15,
            maxStopLoss: 46,
            maxStopLossOther: "自動で決済する場合があります。",
            maxTakeProfit: 78,
            maxTakeProfitOther: "自動で決済する場合があります。",
            isHedge: 0,
            isSignalOnly: 0,
            isUsingExternalFiles: 0,
            specialInstructions: "",
            outline: '☆ＥＡの特徴 1.GBPUSDで取引します。時間足は、15分を使用してください。その他の通貨及び時間足では 動作しません。 2.バックテストは、2008年～から現在まで約１0年実施。 3.１ポジションで取引します。 4.できるだけスプレッドの小さいブローカー（ECN口座等）を推奨します。 5.スプレッドチェック機能を搭載しています。 6.朝方のスプレッドが広がる時間帯では取引を行いません。また 週末金曜日に決済を行い週をまたいでポジションは持ちません。 7.バックテスト分析 左側は、2008～2018年までの利益とＰＦ及び取引回数と勝率です。。 右上は、月曜から金曜までの取引推移です。 右下は、時間別の取引推移です。 <img src="https://www.gogojungle.co.jp/img/products/14662/outlines/2" alt="TMSgu20082.JPG" /> ☆パラメータ <img src="https://www.gogojungle.co.jp/img/products/14662/outlines/1" alt="TMSGUP.JPG" /> TakeProfit-------リミットの設定 StopLoss--------ストップの設定 MainLots--------ここで取引するロットを指定してください。 デフォルトでは１ロット(MainLots)になってますので好みのロットに変更してください。 ☆パラメータの時間の設定は夏時間：GMT＋3／冬時間：＋2で設定してあります。その他の時間たとえばＧＭＴ0やＧＭＴ+9では使用できません。 ☆ＥＡ導入方法及びバックテスト実施方法 http://fx-on.com/lecture/duty.php?c=1&i=495 ☆注意）パラメータはデフォルトで使用してください。変更した場合は、必ずバックテストで動作を確認してください！！(ただし 円口座での使用を推奨します。ドル口座でバックテストを行うと破産するブローカーがあります。）また このEAは、将来の利益を保証するものでは有りません。必ず自己責任でお願いします。 2018 07/28 Ｖ1 ',
            createdDate: 1534164537,
            listOutline: [ ]
          }
        }
      }
    }
  </script>
  ```
</docs>
