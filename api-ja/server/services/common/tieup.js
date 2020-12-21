const arrayUtil = require('@ggj/utils/utils/array')
const TIE_UP_LIST = [
  [8287, 7650 ], // asp._ad_affiliate.id = 700 (トレイダーズ証券「みんなのＦＸ」✕志摩力男の実戦リアルトレード タイアップキャンペーン)
  [8537, 7650 ], // ??
  [8691, 7650 ], // ??
  [8709, 7650 ], // ??
  [9555, 7650 ], // asp._ad_affiliate.id = 744 (FOREX.com × 志摩力男の実戦リアルトレード 口座開設で選んでもらえるプレゼントキャンペーン)
  // [ 9588 , 7650,], // ??
  [9738, 7650 ], // asp._ad_affiliate.id = 733 (クリック証券×志摩力男タイアップキャンペーン)
  [10422, 7650 ], // ??
  [10515, 7650 ], // asp._ad_affiliate.id = 760 (セントラル短資FX × 志摩力男 タイアップキャンペーン)
  [10719, 7650 ], // ??
  [11666, 7650 ], // asp._ad_affiliate.id = 735 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ1ヶ月・タイアップキャンペーン（志摩力男氏）)
  [14990, 7650 ], // ひまわり証券 × 志摩力男タイアップキャンペーン
  [11667, 8592 ], // asp._ad_affiliate.id = 758 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ1ヶ月・タイアップキャンペーン（江守哲氏）)
  [12059, 8576 ], // asp._ad_affiliate.id = 799 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ6ヶ月・タイアップキャンペーン（阪谷直人氏）) (停止)
  [8179, 9002 ], // ??
  [9813, 9325 ], // asp._ad_affiliate.id = 749 (アヴァトレード × 資産運用ロボ・アドバイザーＡＩ巫かんなぎ) (停止)
  [10640, 8592 ], // ??
  [10641, 8697 ], // ??
  [13336, 10520 ], // asp._ad_affiliate.id = 828 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ1ヶ月・タイアップキャンペーン（YEN蔵氏）)
  [13335, 8276 ], // asp._ad_affiliate.id = 830 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ1ヶ月・タイアップキャンペーン（川合 美智子先生）)
  [13334, 9154 ], // asp._ad_affiliate.id = 827 (ドル円スプレッド0.2銭キャンペーン中マネックスFX×口座開設で選んでもらえるメルマガ1ヶ月・タイアップキャンペーン（井上哲男氏）)
  [13574, 10520 ], // asp._ad_affiliate.id = 852 (【アイネット証券】YEN蔵先生タイアップキャンペーン)
  [11809, 9154 ], // asp._ad_affiliate.id = 780 (eワラント(EVOLUTION JAPAN証券)新規口座開設タイアップ★井上哲男メルマガキャンペーン)
  [18725, 15153 ], // https://gogojungle.backlog.jp/view/OAM-14537
  [19688, 15153 ], // OAM-20609
]

/**
 * Get full list of product (include tieup product)
 *
 * @param {Array} productIds
 * @returns {Array}
 * @public
 */
function fullProductIds(productIds) {
  productIds = productIds.map(productId => parseInt(productId))
  TIE_UP_LIST.forEach(([tieUpProductId, mainProductId]) => {
    if (productIds.includes(mainProductId)) {
      productIds.push(tieUpProductId)
    } else if (productIds.includes(tieUpProductId)) {
      productIds.push(mainProductId)
    }
  })
  return arrayUtil.unique(productIds)
}

module.exports = {
  fullProductIds,
}
