import typeI18n from '@@/lang/common/types.json'
import categories from '@@/lang/common/categories.json'

const getAvailabilitySchema = (status = 0) => {
  switch (status) {
    case 0:
    case 4:
    case 9:
      return 'https://schema.org/Discontinued'
    case 3:
      return 'https://schema.org/LimitedAvailability'
    case 2:
      return 'https://schema.org/PreSale'
    default:
      return 'https://schema.org/InStock'
  }
}

/**
 *
 * @param {string} product_type : `Home > Women > Dresses > Maxi Dresses`
 */
export default function generateLDJson({
  type = 'Product',
  // images = [],
  id = '',
  title = '',
  description = '',
  url = '',
  image_link = '',
  product_type = 1, // Reference: http://trial-api.gogojungle.net/v2/types
  locale = 'ja',
  // brand = 'GogoJungle',
  status,
  price,
  count = 0,
  rate = 0,
  cate = ''
}) {
  const cateI18n = categories[locale]
  let categoryName = (cate && cateI18n[cate]) ? (typeI18n[locale][product_type] + cateI18n[cate]) : typeI18n[locale][product_type]
  if (product_type == 4) {
    if (cate == 'salons') {
      categoryName = '投資サロン'
    } else {
      categoryName = 'サロン'
    }
  }
  return Object.assign(
    {
      '@context': 'https://schema.org/',
      '@type': type,
      name: title,
      description,
      // brand,
      id,
      url,
      image: image_link,
      category: { '@type': 'Thing', name: categoryName },
      productTypes: [ categoryName ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'JPY', // google ads only accept US unit currency
        url,
        price: price || 0,
        availability: getAvailabilitySchema(status),
      },
    },
    count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rate,
            bestRating: 5,
            ratingCount: count,
          },
        }
      : {},
  )
}
