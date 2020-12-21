import titleI18n from '@@/lang/common/title.json'
import { editCss } from '@/utils/client/common'
import { getExternalRedirectLink, isMultiplePrice } from '@@/../common/js/product/externalProduct'
import generateLDJson from '@@/../common/js/generateLDJson'

export async function getData(
  app,
  params,
  error,
  req,
  route,
  store,
  titlePrefix = ''
) {
  let id = params.id,
    locale = app.i18n.locale,
    suffixDes = titleI18n[locale].suffixDes,
    title = titleI18n[locale].title,
    category = route.fullPath.split('/')[2],
    [detail, externalUrl, isRangePrice, hatenaCount] = await Promise.all([
      app.GoGoHTTP.get(`/api/v3/surface/systemtrade/${category}/${id}`),
      getExternalRedirectLink(app, id),
      isMultiplePrice(app, id),
      app.GoGoHTTP.get(
        `https://bookmark.hatenaapis.com/count/entry?url=https://www.gogojungle.co.jp${route.fullPath}`
      ),
    ]),
    descriptionChunk,
    titleChunk,
    currentUrl
  if (!detail || !Object.keys(detail).length) {
    return error({ statusCode: 404 })
  }
  store.commit('systemtrade/setHatenaCount', hatenaCount)
  store.commit('cart/setInfo', {
    // OAM-27672
    info: Object.assign({},
      { externalUrl, isRangePrice },
      detail.cartInfo),
    productStatus: detail.status,
    isPassword: detail.isPassword,
  })
  if (process.browser) {
    currentUrl = window.location.href
  } else {
    currentUrl = process.env.GOGO_URL + req.originalUrl
  }
  descriptionChunk = `${detail.name} ${suffixDes}`
  titleChunk = titlePrefix ? `${detail.name} - ${titlePrefix}` : detail.name
  if (
    (detail.outline || {}).outline &&
    detail.outline.outline.indexOf('<style type="text/css">') !== -1
  ) {
    detail.outline.outline = editCss(
      detail.outline.outline,
      '.outline-IbBKtrbLMt'
    )
  }
  const {
    cartInfo: { price, status } = {},
    review: { count, stars } = {},
    isPassword,
  } = detail
  return {
    id,
    detail,
    titleChunk,
    descriptionChunk,
    keywordsChunk: detail.name,
    meta: [
      {
        name: 'og:site_name',
        content: 'GogoJungle',
        hid: 'og:site_name',
      },
      {
        name: 'og:type',
        content: 'website',
        hid: 'og:type',
      },
      {
        name: 'og:title',
        content: `${titleChunk} - ${title}`,
        hid: 'og:title',
      },
      {
        name: 'og:description',
        content: detail.description || detail.name,
        hid: 'og:description',
      },
      {
        name: 'og:url',
        content: currentUrl,
        hid: 'og:url',
      },
      {
        name: 'og:image',
        content: `${process.env.GOGO_URL}/img/products/${id}`,
        hid: 'og:image',
      },
    ],
    linkMeta: [
      {
        rel: 'canonical',
        href: `https://www.gogojungle.co.jp/systemtrade/${category}/${id}`,
      },
    ],
    jsonLDTemplate: generateLDJson({
      title: detail.name,
      id,
      description: detail.description || detail.name,
      url: `https://www.gogojungle.co.jp/systemtrade/${category}/${id}`,
      image_link: `${process.env.GOGO_URL}/img/${category}/${id}`,
      product_type: 1,
      status: isPassword ? 3 : status,
      price,
      count,
      rate: stars,
    }),
  }
}
