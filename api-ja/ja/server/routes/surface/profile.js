const profile = require('@controllers/surface/profile/profile')

module.exports = function(server) {
  let router = server.loopback.Router()

  //Profile
  router.get('/:id(\\d+)', profile.show)
  router.get('/:id(\\d+)/review', profile.review)
  router.get('/:id(\\d+)/product', profile.products)
  router.post('/:id(\\d+)/follow', profile.follow)
  router.post('/:id(\\d+)/unfollow', profile.unFollow)
  router.get('/:id(\\d+)/follows', profile.follows)
  router.get('/:id(\\d+)/followers', profile.followers)
  router.get('/:id(\\d+)/blog', profile.blog)
  router.get('/:id(\\d+)/realtrade', profile.realtrade)

  server.use('/api/v3/surface/profile', router)
}

