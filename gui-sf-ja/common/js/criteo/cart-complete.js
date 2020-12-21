// OAM-17509
import wrapper from './wrapper'

function criteo() {
  let bn = this.data.trackTransaction || [], item = []
  bn.forEach(e => {
    item.push({
      quantity: e.quantity,
      price: e.price || 0,
      id: e.id,
    })
  })
  if (!item.length) {
    return null
  }
  return { event: 'trackTransaction', id: this.data.sessionId,  item }
}

export default function() {
  wrapper(criteo.bind(this))
}