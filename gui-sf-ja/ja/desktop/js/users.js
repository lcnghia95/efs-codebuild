function randomItems(arr = [], n) {
  if (arr === null) {
    return []
  }
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len) {
    return []
  }
  while (n--) {
    let x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

export async function getPrProduct(app) {
  let prProducts = await app.GoGoHTTP.get('/api/v3/pr')
  prProducts = prProducts.map(e => {
    e.price = (e.prices || [])[0]
    return e
  })
  return randomItems(prProducts, 5)
}
