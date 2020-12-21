/**
 * Remove company name from strategy backtest in MT4 & MT5
 *
 * @param content
 * @returns {String}
 */
function removeRedundantInfo(content) {
  const arr = [
    /<div style="font: 10pt Times New Roman"><b>.*<\/b><\/div>/,  // mt4CompanyPattern
    /<td colspan="13"><div style="font: 10pt Tahoma"><b>.*<\/b><br><\/div><\/td>/,  // mt5CompanyPattern
    /<tr align="right">\s*<td nowrap colspan="3" >.*<\/td>\s*<td nowrap colspan="10" align="left"><b>.*<\/b><\/td>\s*<\/tr>/, // mt5BrokerPattern
    /<meta name="server" content=.*>/,  // redundantMetaTag
    /<div style="font: 20pt Times New Roman"><b>FXDD<\/b><\/div><br>/,  // OAM-36538
  ]

  return arr.reduce((acc, cur) => {
    return acc.replace(cur, '')
  }, content)
}

module.exports = {
  removeRedundantInfo,
}
