export async function getExternalRedirectLink(context, productId) {
  if (!productId){
    return ''
  }
  let redirectLink = ''
  const result = await context.GoGoHTTP.get(`/api/re/product/external/short-tag/${productId}`)
  if (result.length > 0){
    redirectLink = `/re/${result}/${productId}`
  }
  return redirectLink
}
export async function isMultiplePrice(context, productId) {
  if (!productId){
    return false
  }
  return await context.GoGoHTTP.get(`/api/re/product/external/is-multiple-price/${productId}`)
}