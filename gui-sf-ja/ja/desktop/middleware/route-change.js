import bcRoutes from '@@/../utils/bcRoutes'

export default function({ store, route }) {
  let routes = route.path.split('/'),
    bcArr = [],
    checkRoutes = bcRoutes
  if (route.fullPath !== '/') {
    bcArr.push(bcRoutes['/'])
  }

  for (let i = 0; i < routes.length; i++) {
    if (checkRoutes[routes[i]] && checkRoutes[routes[i]].index) {
      bcArr.push(checkRoutes[routes[i]].index)
      checkRoutes = checkRoutes[routes[i]]
    }
  }
  store.commit('setBC', bcArr)
}
