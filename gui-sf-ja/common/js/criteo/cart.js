// OAM-17509
import wrapper from './wrapper'

function criteo() {
  let bn = this.$store.state.cart01.data.buyNow, item = []
  bn.forEach(e => {
    let pro = e.priceId ? e.prices.find(e1 => e1.id == e.priceId) : e.product,
      pId = e.priceId ? pro.productId : pro.id
    item.push({
      quantity: e.count,
      price: pro.price || 0,
      id: `P${pId}`,
    })
  })
  if (!item.length) {
    return null
  }
  return { event: 'viewBasket', item }
}

export default function() {
  wrapper(criteo.bind(this))
}