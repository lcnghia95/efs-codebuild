import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _711fab12 = () => import('../../desktop/pages/register/index.vue' /* webpackChunkName: "pages/register/index" */).then(m => m.default || m)
const _63981b6f = () => import('../../desktop/pages/newcampaign.vue' /* webpackChunkName: "pages/newcampaign" */).then(m => m.default || m)
const _c8478446 = () => import('../../desktop/pages/companies/index.vue' /* webpackChunkName: "pages/companies/index" */).then(m => m.default || m)
const _f3043998 = () => import('../../desktop/pages/cart/index.vue' /* webpackChunkName: "pages/cart/index" */).then(m => m.default || m)
const _244f9a92 = () => import('../../desktop/pages/cart/index/index.vue' /* webpackChunkName: "pages/cart/index/index" */).then(m => m.default || m)
const _48032b36 = () => import('../../desktop/pages/cart/index/confirm.vue' /* webpackChunkName: "pages/cart/index/confirm" */).then(m => m.default || m)
const _13d80d65 = () => import('../../desktop/pages/cart/index/cancel.vue' /* webpackChunkName: "pages/cart/index/cancel" */).then(m => m.default || m)
const _10fc8fe4 = () => import('../../desktop/pages/cart/index/complete.vue' /* webpackChunkName: "pages/cart/index/complete" */).then(m => m.default || m)
const _319e50ed = () => import('../../desktop/pages/cart/index/error.vue' /* webpackChunkName: "pages/cart/index/error" */).then(m => m.default || m)
const _d51742ec = () => import('../../desktop/pages/kabu-api/index.vue' /* webpackChunkName: "pages/kabu-api/index" */).then(m => m.default || m)
const _70f12a79 = () => import('../../desktop/pages/markets/index.vue' /* webpackChunkName: "pages/markets/index" */).then(m => m.default || m)
const _33a90535 = () => import('../../desktop/pages/products.vue' /* webpackChunkName: "pages/products" */).then(m => m.default || m)
const _ace6997c = () => import('../../desktop/pages/info/index.vue' /* webpackChunkName: "pages/info/index" */).then(m => m.default || m)
const _03224045 = () => import('../../desktop/pages/info/index/index.vue' /* webpackChunkName: "pages/info/index/index" */).then(m => m.default || m)
const _5070cbb7 = () => import('../../desktop/pages/info/index/_type/_id.vue' /* webpackChunkName: "pages/info/index/_type/_id" */).then(m => m.default || m)
const _a28f9b52 = () => import('../../desktop/pages/systemtrade/index.vue' /* webpackChunkName: "pages/systemtrade/index" */).then(m => m.default || m)
const _6b5548cc = () => import('../../desktop/pages/systemtrade/index/index.vue' /* webpackChunkName: "pages/systemtrade/index/index" */).then(m => m.default || m)
const _34bc23c8 = () => import('../../desktop/pages/systemtrade/index/stocks/index.vue' /* webpackChunkName: "pages/systemtrade/index/stocks/index" */).then(m => m.default || m)
const _9e58dad8 = () => import('../../desktop/pages/systemtrade/index/developers/index.vue' /* webpackChunkName: "pages/systemtrade/index/developers/index" */).then(m => m.default || m)
const _25e728da = () => import('../../desktop/pages/systemtrade/index/search/index.vue' /* webpackChunkName: "pages/systemtrade/index/search/index" */).then(m => m.default || m)
const _b861424c = () => import('../../desktop/pages/systemtrade/index/realasset.vue' /* webpackChunkName: "pages/systemtrade/index/realasset" */).then(m => m.default || m)
const _2f888d68 = () => import('../../desktop/pages/systemtrade/index/converter.vue' /* webpackChunkName: "pages/systemtrade/index/converter" */).then(m => m.default || m)
const _37bb8e3d = () => import('../../desktop/pages/systemtrade/index/fx/index.vue' /* webpackChunkName: "pages/systemtrade/index/fx/index" */).then(m => m.default || m)
const _eca83d56 = () => import('../../desktop/pages/systemtrade/index/economics/fx/_type.vue' /* webpackChunkName: "pages/systemtrade/index/economics/fx/_type" */).then(m => m.default || m)
const _2d7942a8 = () => import('../../desktop/pages/systemtrade/index/fx/_id/index.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/index" */).then(m => m.default || m)
const _f1df0fa0 = () => import('../../desktop/pages/systemtrade/index/stocks/_id.vue' /* webpackChunkName: "pages/systemtrade/index/stocks/_id" */).then(m => m.default || m)
const _039e0885 = () => import('../../desktop/pages/systemtrade/index/newproduct/_category.vue' /* webpackChunkName: "pages/systemtrade/index/newproduct/_category" */).then(m => m.default || m)
const _4aba9b13 = () => import('../../desktop/pages/systemtrade/index/fx/_id/backtest.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/backtest" */).then(m => m.default || m)
const _4ca611e2 = () => import('../../desktop/pages/systemtrade/index/fx/_id/real-trade.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/real-trade" */).then(m => m.default || m)
const _aaf0f0da = () => import('../../desktop/pages/systemtrade/index/_revenue/_category.vue' /* webpackChunkName: "pages/systemtrade/index/_revenue/_category" */).then(m => m.default || m)
const _c3e6dd46 = () => import('../../desktop/pages/tools/index.vue' /* webpackChunkName: "pages/tools/index" */).then(m => m.default || m)
const _6bde1248 = () => import('../../desktop/pages/finance/index.vue' /* webpackChunkName: "pages/finance/index" */).then(m => m.default || m)
const _33641f2c = () => import('../../desktop/pages/review/index.vue' /* webpackChunkName: "pages/review/index" */).then(m => m.default || m)
const _4b28d148 = () => import('../../desktop/pages/event/index.vue' /* webpackChunkName: "pages/event/index" */).then(m => m.default || m)
const _01a828df = () => import('../../desktop/pages/event/index/index.vue' /* webpackChunkName: "pages/event/index/index" */).then(m => m.default || m)
const _41c8672a = () => import('../../desktop/pages/event/index/search.vue' /* webpackChunkName: "pages/event/index/search" */).then(m => m.default || m)
const _7f7bbf60 = () => import('../../desktop/pages/event/index/area/_large/_medium.vue' /* webpackChunkName: "pages/event/index/area/_large/_medium" */).then(m => m.default || m)
const _b718876c = () => import('../../desktop/pages/event/index/_id/index.vue' /* webpackChunkName: "pages/event/index/_id/index" */).then(m => m.default || m)
const _2795e97c = () => import('../../desktop/pages/search/index.vue' /* webpackChunkName: "pages/search/index" */).then(m => m.default || m)
const _43856c89 = () => import('../../desktop/pages/inquiry/index.vue' /* webpackChunkName: "pages/inquiry/index" */).then(m => m.default || m)
const _2910d9c7 = () => import('../../desktop/pages/crowdsourcing/index.vue' /* webpackChunkName: "pages/crowdsourcing/index" */).then(m => m.default || m)
const _05ca1d7c = () => import('../../desktop/pages/withdrawal/completed.vue' /* webpackChunkName: "pages/withdrawal/completed" */).then(m => m.default || m)
const _4f88e328 = () => import('../../desktop/pages/password/reset.vue' /* webpackChunkName: "pages/password/reset" */).then(m => m.default || m)
const _43efcad8 = () => import('../../desktop/pages/review/highpost.vue' /* webpackChunkName: "pages/review/highpost" */).then(m => m.default || m)
const _28d76647 = () => import('../../desktop/pages/crowdsourcing/developers/index.vue' /* webpackChunkName: "pages/crowdsourcing/developers/index" */).then(m => m.default || m)
const _4a66bbc1 = () => import('../../desktop/pages/finance/videos/index.vue' /* webpackChunkName: "pages/finance/videos/index" */).then(m => m.default || m)
const _2a787620 = () => import('../../desktop/pages/register/completed.vue' /* webpackChunkName: "pages/register/completed" */).then(m => m.default || m)
const _3e8f6533 = () => import('../../desktop/pages/review/popular.vue' /* webpackChunkName: "pages/review/popular" */).then(m => m.default || m)
const _5a164474 = () => import('../../desktop/pages/finance/mailmagazine/index.vue' /* webpackChunkName: "pages/finance/mailmagazine/index" */).then(m => m.default || m)
const _5efc7ede = () => import('../../desktop/pages/crowdsourcing/guide2.vue' /* webpackChunkName: "pages/crowdsourcing/guide2" */).then(m => m.default || m)
const _2f30b8bf = () => import('../../desktop/pages/finance/salons/index.vue' /* webpackChunkName: "pages/finance/salons/index" */).then(m => m.default || m)
const _442c7c8a = () => import('../../desktop/pages/review/highscore.vue' /* webpackChunkName: "pages/review/highscore" */).then(m => m.default || m)
const _617718a6 = () => import('../../desktop/pages/tools/search.vue' /* webpackChunkName: "pages/tools/search" */).then(m => m.default || m)
const _5f18ade0 = () => import('../../desktop/pages/crowdsourcing/guide1.vue' /* webpackChunkName: "pages/crowdsourcing/guide1" */).then(m => m.default || m)
const _5ee04fdc = () => import('../../desktop/pages/crowdsourcing/guide3.vue' /* webpackChunkName: "pages/crowdsourcing/guide3" */).then(m => m.default || m)
const _3173ae0f = () => import('../../desktop/pages/finance/navi/index.vue' /* webpackChunkName: "pages/finance/navi/index" */).then(m => m.default || m)
const _8e79a55c = () => import('../../desktop/pages/finance/navi/index/index.vue' /* webpackChunkName: "pages/finance/navi/index/index" */).then(m => m.default || m)
const _2860462c = () => import('../../desktop/pages/finance/navi/index/series/index.vue' /* webpackChunkName: "pages/finance/navi/index/series/index" */).then(m => m.default || m)
const _11ed8b30 = () => import('../../desktop/pages/finance/navi/index/articles/index.vue' /* webpackChunkName: "pages/finance/navi/index/articles/index" */).then(m => m.default || m)
const _22cee04b = () => import('../../desktop/pages/finance/navi/index/authors/index.vue' /* webpackChunkName: "pages/finance/navi/index/authors/index" */).then(m => m.default || m)
const _bec30d1a = () => import('../../desktop/pages/finance/navi/index/authors/_id.vue' /* webpackChunkName: "pages/finance/navi/index/authors/_id" */).then(m => m.default || m)
const _00c49998 = () => import('../../desktop/pages/finance/navi/index/articles/_id.vue' /* webpackChunkName: "pages/finance/navi/index/articles/_id" */).then(m => m.default || m)
const _54a411d2 = () => import('../../desktop/pages/finance/navi/index/series/_id.vue' /* webpackChunkName: "pages/finance/navi/index/series/_id" */).then(m => m.default || m)
const _e563d5aa = () => import('../../desktop/pages/finance/navi/index/_type/searchresult.vue' /* webpackChunkName: "pages/finance/navi/index/_type/searchresult" */).then(m => m.default || m)
const _0a03758a = () => import('../../desktop/pages/markets/spreads/index.vue' /* webpackChunkName: "pages/markets/spreads/index" */).then(m => m.default || m)
const _25c04bf0 = () => import('../../desktop/pages/markets/economics/index.vue' /* webpackChunkName: "pages/markets/economics/index" */).then(m => m.default || m)
const _593dd17a = () => import('../../desktop/pages/review/new.vue' /* webpackChunkName: "pages/review/new" */).then(m => m.default || m)
const _3e66fe41 = () => import('../../desktop/pages/markets/charts/index.vue' /* webpackChunkName: "pages/markets/charts/index" */).then(m => m.default || m)
const _4660089b = () => import('../../desktop/pages/finance/videos/premier.vue' /* webpackChunkName: "pages/finance/videos/premier" */).then(m => m.default || m)
const _55053db0 = () => import('../../desktop/pages/finance/videos/gogojungletv.vue' /* webpackChunkName: "pages/finance/videos/gogojungletv" */).then(m => m.default || m)
const _3ee5c2b4 = () => import('../../desktop/pages/finance/videos/searchresult.vue' /* webpackChunkName: "pages/finance/videos/searchresult" */).then(m => m.default || m)
const _33f88f4f = () => import('../../desktop/pages/finance/videos/new.vue' /* webpackChunkName: "pages/finance/videos/new" */).then(m => m.default || m)
const _e7f791e8 = () => import('../../desktop/pages/finance/videos/trend.vue' /* webpackChunkName: "pages/finance/videos/trend" */).then(m => m.default || m)
const _12be47a8 = () => import('../../desktop/pages/finance/navi/article/preview.vue' /* webpackChunkName: "pages/finance/navi/article/preview" */).then(m => m.default || m)
const _369d36f0 = () => import('../../desktop/pages/review/success/_id.vue' /* webpackChunkName: "pages/review/success/_id" */).then(m => m.default || m)
const _0dd026f4 = () => import('../../desktop/pages/tools/indicators/_id.vue' /* webpackChunkName: "pages/tools/indicators/_id" */).then(m => m.default || m)
const _656cbe70 = () => import('../../desktop/pages/markets/economics/_id.vue' /* webpackChunkName: "pages/markets/economics/_id" */).then(m => m.default || m)
const _2ae3e837 = () => import('../../desktop/pages/finance/navi/_id.vue' /* webpackChunkName: "pages/finance/navi/_id" */).then(m => m.default || m)
const _49c84e6f = () => import('../../desktop/pages/crowdsourcing/developers/_id.vue' /* webpackChunkName: "pages/crowdsourcing/developers/_id" */).then(m => m.default || m)
const _38eefd8f = () => import('../../desktop/pages/finance/mailmagazine/_salon/index.vue' /* webpackChunkName: "pages/finance/mailmagazine/_salon/index" */).then(m => m.default || m)
const _4a1623bb = () => import('../../desktop/pages/post/46/_id.vue' /* webpackChunkName: "pages/post/46/_id" */).then(m => m.default || m)
const _4f5e56a4 = () => import('../../desktop/pages/tools/rooms/_id.vue' /* webpackChunkName: "pages/tools/rooms/_id" */).then(m => m.default || m)
const _19a6adcf = () => import('../../desktop/pages/review/input/_id.vue' /* webpackChunkName: "pages/review/input/_id" */).then(m => m.default || m)
const _06b44995 = () => import('../../desktop/pages/tools/ebooks/_id.vue' /* webpackChunkName: "pages/tools/ebooks/_id" */).then(m => m.default || m)
const _19c1f3bc = () => import('../../desktop/pages/tools/popular/_sub.vue' /* webpackChunkName: "pages/tools/popular/_sub" */).then(m => m.default || m)
const _2042ba69 = () => import('../../desktop/pages/finance/videos/_id.vue' /* webpackChunkName: "pages/finance/videos/_id" */).then(m => m.default || m)
const _2177d812 = () => import('../../desktop/pages/review/detail/_id.vue' /* webpackChunkName: "pages/review/detail/_id" */).then(m => m.default || m)
const _07ba1ba4 = () => import('../../desktop/pages/cart/add/_id.vue' /* webpackChunkName: "pages/cart/add/_id" */).then(m => m.default || m)
const _20c3dee7 = () => import('../../desktop/pages/finance/salons/_id.vue' /* webpackChunkName: "pages/finance/salons/_id" */).then(m => m.default || m)
const _4fed17b7 = () => import('../../desktop/pages/finance/mailmagazine/_salon/_id.vue' /* webpackChunkName: "pages/finance/mailmagazine/_salon/_id" */).then(m => m.default || m)
const _09b810e6 = () => import('../../desktop/pages/finance/navi/_sid/_id.vue' /* webpackChunkName: "pages/finance/navi/_sid/_id" */).then(m => m.default || m)
const _a6d63a48 = () => import('../../desktop/pages/markets/spreads/_id/_pair.vue' /* webpackChunkName: "pages/markets/spreads/_id/_pair" */).then(m => m.default || m)
const _7d00d25f = () => import('../../desktop/pages/markets/charts/_s/_t.vue' /* webpackChunkName: "pages/markets/charts/_s/_t" */).then(m => m.default || m)
const _1dd01e88 = () => import('../../desktop/pages/tools/_showmore.vue' /* webpackChunkName: "pages/tools/_showmore" */).then(m => m.default || m)
const _d66c8d9c = () => import('../../desktop/pages/crowdsourcing/_id/index.vue' /* webpackChunkName: "pages/crowdsourcing/_id/index" */).then(m => m.default || m)
const _a856e460 = () => import('../../desktop/pages/terms/_type.vue' /* webpackChunkName: "pages/terms/_type" */).then(m => m.default || m)
const _5526e39c = () => import('../../desktop/pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */).then(m => m.default || m)
const _320e2735 = () => import('../../desktop/pages/users/_id/index.vue' /* webpackChunkName: "pages/users/_id/index" */).then(m => m.default || m)
const _74c9d285 = () => import('../../desktop/pages/users/_id/review.vue' /* webpackChunkName: "pages/users/_id/review" */).then(m => m.default || m)
const _29bff551 = () => import('../../desktop/pages/users/_id/products.vue' /* webpackChunkName: "pages/users/_id/products" */).then(m => m.default || m)
const _3637aa85 = () => import('../../desktop/pages/users/_id/follows.vue' /* webpackChunkName: "pages/users/_id/follows" */).then(m => m.default || m)
const _04f5f70f = () => import('../../desktop/pages/users/_id/blog.vue' /* webpackChunkName: "pages/users/_id/blog" */).then(m => m.default || m)
const _161f2b78 = () => import('../../desktop/pages/users/_id/followers.vue' /* webpackChunkName: "pages/users/_id/followers" */).then(m => m.default || m)
const _f9a4dd2e = () => import('../../desktop/pages/users/_id/realtrade.vue' /* webpackChunkName: "pages/users/_id/realtrade" */).then(m => m.default || m)
const _69808028 = () => import('../../desktop/pages/crowdsourcing/_id/review.vue' /* webpackChunkName: "pages/crowdsourcing/_id/review" */).then(m => m.default || m)
const _45c65e62 = () => import('../../desktop/pages/tools/_type/_id.vue' /* webpackChunkName: "pages/tools/_type/_id" */).then(m => m.default || m)
const _b7a5ca90 = () => import('../../desktop/pages/post/_cid/_id.vue' /* webpackChunkName: "pages/post/_cid/_id" */).then(m => m.default || m)
const _0be47c5e = () => import('../../desktop/pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _f61965f4 = () => import('../../desktop/pages/_auth.vue' /* webpackChunkName: "pages/_auth" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/register",
			component: _711fab12,
			name: "register"
		},
		{
			path: "/newcampaign",
			component: _63981b6f,
			name: "newcampaign"
		},
		{
			path: "/companies",
			component: _c8478446,
			name: "companies"
		},
		{
			path: "/cart",
			component: _f3043998,
			children: [
				{
					path: "",
					component: _244f9a92,
					name: "cart-index"
				},
				{
					path: "confirm",
					component: _48032b36,
					name: "cart-index-confirm"
				},
				{
					path: "cancel",
					component: _13d80d65,
					name: "cart-index-cancel"
				},
				{
					path: "complete",
					component: _10fc8fe4,
					name: "cart-index-complete"
				},
				{
					path: "error",
					component: _319e50ed,
					name: "cart-index-error"
				}
			]
		},
		{
			path: "/kabu-api",
			component: _d51742ec,
			name: "kabu-api"
		},
		{
			path: "/markets",
			component: _70f12a79,
			name: "markets"
		},
		{
			path: "/products",
			component: _33a90535,
			name: "products"
		},
		{
			path: "/products/(p)?/:p(\\d+)?",
			component: _33a90535,
			name: "products(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/products"}
		},
		{
			path: "/info",
			component: _ace6997c,
			children: [
				{
					path: "",
					component: _03224045,
					name: "info-index"
				},
				{
					path: ":type(seller|partner)",
					component: _03224045,
					name: "info-index%3Atype(seller%7Cpartner)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(seller|partner)/y/:y(\\d+)?/(p)?/:p(\\d+)?/(t)?/:t(1|2|1,2|1%2C2|2,1|2%2C1)?",
					component: _03224045,
					name: "info-index%3Atype(seller%7Cpartner)%2Fy%2F%3Ay(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(t)%3F%2F%3At(1%7C2%7C1%2C2%7C1%252C2%7C2%2C1%7C2%252C1)%3F",
					meta: {"originalPath":""}
				},
				{
					path: "y/:y(\\d+)?/(p)?/:p(\\d+)?/(t)?/:t(1|2|1,2|1%2C2|2,1|2%2C1)?",
					component: _03224045,
					name: "info-indexy%2F%3Ay(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(t)%3F%2F%3At(1%7C2%7C1%2C2%7C1%252C2%7C2%2C1%7C2%252C1)%3F",
					meta: {"originalPath":""}
				},
				{
					path: ":type/:id?",
					component: _5070cbb7,
					name: "info-index-type-id"
				}
			]
		},
		{
			path: "/systemtrade",
			component: _a28f9b52,
			children: [
				{
					path: "",
					component: _6b5548cc,
					name: "systemtrade-index"
				},
				{
					path: "stocks",
					component: _34bc23c8,
					name: "systemtrade-index-stocks"
				},
				{
					path: "developers",
					component: _9e58dad8,
					name: "systemtrade-index-developers"
				},
				{
					path: "developers/(p)?/:p(\\d+)?",
					component: _9e58dad8,
					name: "systemtrade-index-developersdevelopers%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"developers"}
				},
				{
					path: "search",
					component: _25e728da,
					name: "systemtrade-index-search"
				},
				{
					path: "search/(detail|easy)",
					component: _25e728da,
					name: "systemtrade-index-searchsearch%2F(detail%7Ceasy)",
					meta: {"originalPath":"search"}
				},
				{
					path: "realasset",
					component: _b861424c,
					name: "systemtrade-index-realasset"
				},
				{
					path: "realasset/(p)?/:p(\\d+)?",
					component: _b861424c,
					name: "systemtrade-index-realassetrealasset%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"realasset"}
				},
				{
					path: "converter",
					component: _2f888d68,
					name: "systemtrade-index-converter"
				},
				{
					path: "fx",
					component: _37bb8e3d,
					name: "systemtrade-index-fx"
				},
				{
					path: "economics/fx/:type?",
					component: _eca83d56,
					name: "systemtrade-index-economics-fx-type"
				},
				{
					path: "economics/fx/:type(1|2)/(p)?/:p(\\d+)?",
					component: _eca83d56,
					name: "systemtrade-index-economics-fx-typeeconomics%2Ffx%2F%3Atype(1%7C2)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"economics/fx/:type?"}
				},
				{
					path: "fx/:id?",
					component: _2d7942a8,
					name: "systemtrade-index-fx-id"
				},
				{
					path: "stocks/:id?",
					component: _f1df0fa0,
					name: "systemtrade-index-stocks-id"
				},
				{
					path: "newproduct/:category?",
					component: _039e0885,
					name: "systemtrade-index-newproduct-category"
				},
				{
					path: "newproduct/(p)?/:p(\\d+)?",
					component: _039e0885,
					name: "systemtrade-index-newproduct-categorynewproduct%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"newproduct/:category?"}
				},
				{
					path: "newproduct/:category(fx|stocks)/(p)?/:p(\\d+)?",
					component: _039e0885,
					name: "systemtrade-index-newproduct-categorynewproduct%2F%3Acategory(fx%7Cstocks)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"newproduct/:category?"}
				},
				{
					path: "fx/:id?/backtest",
					component: _4aba9b13,
					name: "systemtrade-index-fx-id-backtest"
				},
				{
					path: "fx/:id?/backtest/(p)?/:p(\\d+)?",
					component: _4aba9b13,
					name: "systemtrade-index-fx-id-backtestfx%2F%3Aid%3F%2Fbacktest%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"fx/:id?/backtest"}
				},
				{
					path: "fx/:id?/real-trade",
					component: _4ca611e2,
					name: "systemtrade-index-fx-id-real-trade"
				},
				{
					path: ":revenue/:category?",
					component: _aaf0f0da,
					name: "systemtrade-index-revenue-category"
				},
				{
					path: ":revenue(profitrate|profit|profitfactor|riskreturn|sell)/(p)?/:p(\\d+)?",
					component: _aaf0f0da,
					name: "systemtrade-index-revenue-category%3Arevenue(profitrate%7Cprofit%7Cprofitfactor%7Criskreturn%7Csell)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":revenue/:category?"}
				},
				{
					path: ":revenue(profitrate|profit|profitfactor|riskreturn|sell)/:category(fx|stocks)/(p)?/:p(\\d+)?",
					component: _aaf0f0da,
					name: "systemtrade-index-revenue-category%3Arevenue(profitrate%7Cprofit%7Cprofitfactor%7Criskreturn%7Csell)%2F%3Acategory(fx%7Cstocks)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":revenue/:category?"}
				}
			]
		},
		{
			path: "/tools",
			component: _c3e6dd46,
			name: "tools"
		},
		{
			path: "/tools/:type(free)/:subType(3m|1m|1w|all)",
			component: _c3e6dd46,
			name: "tools%3Atype(free)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(pcount)/:subType(3m|1m|1w|all)",
			component: _c3e6dd46,
			name: "tools%3Atype(pcount)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(osusume)/:subType(campaign|indicator|tool|ebook|set)",
			component: _c3e6dd46,
			name: "tools%3Atype(osusume)%2F%3AsubType(campaign%7Cindicator%7Ctool%7Cebook%7Cset)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(psum)/:subType(3m|1m|1w|all)",
			component: _c3e6dd46,
			name: "tools%3Atype(psum)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(newproduct)/:subType(kabu|fx|other)",
			component: _c3e6dd46,
			name: "tools%3Atype(newproduct)%2F%3AsubType(kabu%7Cfx%7Cother)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(sold)/:subType(fee|free)",
			component: _c3e6dd46,
			name: "tools%3Atype(sold)%2F%3AsubType(fee%7Cfree)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/tools/:type(productreview)/:subType(average|count)",
			component: _c3e6dd46,
			name: "tools%3Atype(productreview)%2F%3AsubType(average%7Ccount)",
			meta: {"originalPath":"/tools"}
		},
		{
			path: "/finance",
			component: _6bde1248,
			name: "finance"
		},
		{
			path: "/review",
			component: _33641f2c,
			name: "review"
		},
		{
			path: "/event",
			component: _4b28d148,
			children: [
				{
					path: "",
					component: _01a828df,
					name: "event-index"
				},
				{
					path: "p/:p(\\d+)",
					component: _01a828df,
					name: "event-indexp%2F%3Ap(%5Cd%2B)",
					meta: {"originalPath":""}
				},
				{
					path: "search",
					component: _41c8672a,
					name: "event-index-search"
				},
				{
					path: "search/cat/:categories?/(p)?/:page(\\d+)?",
					component: _41c8672a,
					name: "event-index-searchsearch%2Fcat%2F%3Acategories%3F%2F(p)%3F%2F%3Apage(%5Cd%2B)%3F",
					meta: {"originalPath":"search"}
				},
				{
					path: "search/(from)?/:from(\\d{4}-\\d{1,2}-\\d{1,2})?/(to)?/:to(\\d{4}-\\d{1,2}-\\d{1,2})?/(cat)?/:categories?/(p)?/:page(\\d+)?",
					component: _41c8672a,
					name: "event-index-searchsearch%2F(from)%3F%2F%3Afrom(%5Cd%7B4%7D-%5Cd%7B1%2C2%7D-%5Cd%7B1%2C2%7D)%3F%2F(to)%3F%2F%3Ato(%5Cd%7B4%7D-%5Cd%7B1%2C2%7D-%5Cd%7B1%2C2%7D)%3F%2F(cat)%3F%2F%3Acategories%3F%2F(p)%3F%2F%3Apage(%5Cd%2B)%3F",
					meta: {"originalPath":"search"}
				},
				{
					path: "area/:large?/:medium?",
					component: _7f7bbf60,
					name: "event-index-area-large-medium"
				},
				{
					path: "area/:large(\\d+)/:medium(\\d+)?/(p)?/:p(\\d+)",
					component: _7f7bbf60,
					name: "event-index-area-large-mediumarea%2F%3Alarge(%5Cd%2B)%2F%3Amedium(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)",
					meta: {"originalPath":"area/:large?/:medium?"}
				},
				{
					path: ":id",
					component: _b718876c,
					name: "event-index-id"
				}
			]
		},
		{
			path: "/search",
			component: _2795e97c,
			name: "search"
		},
		{
			path: "/inquiry",
			component: _43856c89,
			name: "inquiry"
		},
		{
			path: "/crowdsourcing",
			component: _2910d9c7,
			name: "crowdsourcing"
		},
		{
			path: "/crowdsourcing/:type(finish)/:isFinish(0|1)/:p(p)/:page(\\d+)",
			component: _2910d9c7,
			name: "crowdsourcing%3Atype(finish)%2F%3AisFinish(0%7C1)%2F%3Ap(p)%2F%3Apage(%5Cd%2B)",
			meta: {"originalPath":"/crowdsourcing"}
		},
		{
			path: "/withdrawal/completed",
			component: _05ca1d7c,
			name: "withdrawal-completed"
		},
		{
			path: "/password/reset",
			component: _4f88e328,
			name: "password-reset"
		},
		{
			path: "/review/highpost",
			component: _43efcad8,
			name: "review-highpost"
		},
		{
			path: "/review/highpost/(p)/:p(\\d+)",
			component: _43efcad8,
			name: "review-highpost(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)",
			component: _43efcad8,
			name: "review-highpost%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)/(p)/:p(\\d+)",
			component: _43efcad8,
			name: "review-highpost%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools)/:month(3)",
			component: _43efcad8,
			name: "review-highpost%3Atype(systemtrade%7Ctools)%2F%3Amonth(3)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools)/:month(3)/(p)/:p(\\d+)",
			component: _43efcad8,
			name: "review-highpost%3Atype(systemtrade%7Ctools)%2F%3Amonth(3)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/crowdsourcing/developers",
			component: _28d76647,
			name: "crowdsourcing-developers"
		},
		{
			path: "/crowdsourcing/developers/:p(p)/:page(\\d+)",
			component: _28d76647,
			name: "crowdsourcing-developers%3Ap(p)%2F%3Apage(%5Cd%2B)",
			meta: {"originalPath":"/crowdsourcing/developers"}
		},
		{
			path: "/finance/videos",
			component: _4a66bbc1,
			name: "finance-videos"
		},
		{
			path: "/register/completed",
			component: _2a787620,
			name: "register-completed"
		},
		{
			path: "/review/popular",
			component: _3e8f6533,
			name: "review-popular"
		},
		{
			path: "/review/popular/(p)/:p(\\d+)",
			component: _3e8f6533,
			name: "review-popular(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/popular"}
		},
		{
			path: "/finance/mailmagazine",
			component: _5a164474,
			name: "finance-mailmagazine"
		},
		{
			path: "/finance/mailmagazine/(t)?/:t(1|2)",
			component: _5a164474,
			name: "finance-mailmagazine(t)%3F%2F%3At(1%7C2)",
			meta: {"originalPath":"/finance/mailmagazine"}
		},
		{
			path: "/crowdsourcing/guide2",
			component: _5efc7ede,
			name: "crowdsourcing-guide2"
		},
		{
			path: "/finance/salons",
			component: _2f30b8bf,
			name: "finance-salons"
		},
		{
			path: "/review/highscore",
			component: _442c7c8a,
			name: "review-highscore"
		},
		{
			path: "/review/highscore/(p)/:p(\\d+)",
			component: _442c7c8a,
			name: "review-highscore(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)",
			component: _442c7c8a,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/(p)/:p(\\d+)",
			component: _442c7c8a,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)",
			component: _442c7c8a,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)/(p)/:p(\\d+)",
			component: _442c7c8a,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/tools/search",
			component: _617718a6,
			name: "tools-search"
		},
		{
			path: "/crowdsourcing/guide1",
			component: _5f18ade0,
			name: "crowdsourcing-guide1"
		},
		{
			path: "/crowdsourcing/guide3",
			component: _5ee04fdc,
			name: "crowdsourcing-guide3"
		},
		{
			path: "/finance/navi",
			component: _3173ae0f,
			children: [
				{
					path: "",
					component: _8e79a55c,
					name: "finance-navi-index"
				},
				{
					path: "series",
					component: _2860462c,
					name: "finance-navi-index-series"
				},
				{
					path: "series/(ipc)?/:isPaidContent(0|1)/(pt)?/:periodType(0|1|2|3)/(so)?/:sort(0|1)/(p)?/:p(\\d+)?",
					component: _2860462c,
					name: "finance-navi-index-seriesseries%2F(ipc)%3F%2F%3AisPaidContent(0%7C1)%2F(pt)%3F%2F%3AperiodType(0%7C1%7C2%7C3)%2F(so)%3F%2F%3Asort(0%7C1)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"series"}
				},
				{
					path: "articles",
					component: _11ed8b30,
					name: "finance-navi-index-articles"
				},
				{
					path: "articles/(ipc)?/:isPaidContent(0|1)/(pt)?/:periodType(0|1|2|3)/(cat)?/:cat(\\d+)?/(p)?/:p(\\d+)?",
					component: _11ed8b30,
					name: "finance-navi-index-articlesarticles%2F(ipc)%3F%2F%3AisPaidContent(0%7C1)%2F(pt)%3F%2F%3AperiodType(0%7C1%7C2%7C3)%2F(cat)%3F%2F%3Acat(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"articles"}
				},
				{
					path: "authors",
					component: _22cee04b,
					name: "finance-navi-index-authors"
				},
				{
					path: "authors/(st)?/:sort(0|1|2|3)/(p)?/:p(\\d+)?/(w)?/:w?",
					component: _22cee04b,
					name: "finance-navi-index-authorsauthors%2F(st)%3F%2F%3Asort(0%7C1%7C2%7C3)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(w)%3F%2F%3Aw%3F",
					meta: {"originalPath":"authors"}
				},
				{
					path: "authors/:id?",
					component: _bec30d1a,
					name: "finance-navi-index-authors-id"
				},
				{
					path: "authors/:id(\\d+)?/(p)?/:p(\\d+)?",
					component: _bec30d1a,
					name: "finance-navi-index-authors-idauthors%2F%3Aid(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"authors/:id?"}
				},
				{
					path: "articles/:id?",
					component: _00c49998,
					name: "finance-navi-index-articles-id"
				},
				{
					path: "series/:id?",
					component: _54a411d2,
					name: "finance-navi-index-series-id"
				},
				{
					path: "series/:id(\\d+)?/(p)?/:p(\\d+)?/(s)?/:s(\\d+)?",
					component: _54a411d2,
					name: "finance-navi-index-series-idseries%2F%3Aid(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(s)%3F%2F%3As(%5Cd%2B)%3F",
					meta: {"originalPath":"series/:id?"}
				},
				{
					path: ":type/searchresult",
					component: _e563d5aa,
					name: "finance-navi-index-type-searchresult"
				},
				{
					path: ":type/searchresult/(p)?/:p(\\d+)?/(ipc)?/:isPaidContent(\\d+)?/(pt)?/:periodType(\\d+)?/:searchType(w|t)?/:wt?",
					component: _e563d5aa,
					name: "finance-navi-index-type-searchresult%3Atype%2Fsearchresult%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(ipc)%3F%2F%3AisPaidContent(%5Cd%2B)%3F%2F(pt)%3F%2F%3AperiodType(%5Cd%2B)%3F%2F%3AsearchType(w%7Ct)%3F%2F%3Awt%3F",
					meta: {"originalPath":":type/searchresult"}
				}
			]
		},
		{
			path: "/markets/spreads",
			component: _0a03758a,
			name: "markets-spreads"
		},
		{
			path: "/markets/economics",
			component: _25c04bf0,
			name: "markets-economics"
		},
		{
			path: "/markets/economics/y/:y(\\d+)/(m)?/:m(\\d+)?/(p)?/:p(\\d+)?",
			component: _25c04bf0,
			name: "markets-economicsy%2F%3Ay(%5Cd%2B)%2F(m)%3F%2F%3Am(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/markets/economics"}
		},
		{
			path: "/review/new",
			component: _593dd17a,
			name: "review-new"
		},
		{
			path: "/review/new/(p)/:p(\\d+)",
			component: _593dd17a,
			name: "review-new(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/new"}
		},
		{
			path: "/markets/charts",
			component: _3e66fe41,
			name: "markets-charts"
		},
		{
			path: "/finance/videos/premier",
			component: _4660089b,
			name: "finance-videos-premier"
		},
		{
			path: "/finance/videos/premier/(p)?/:p(\\d+)?",
			component: _4660089b,
			name: "finance-videos-premier(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/finance/videos/premier"}
		},
		{
			path: "/finance/videos/gogojungletv",
			component: _55053db0,
			name: "finance-videos-gogojungletv"
		},
		{
			path: "/finance/videos/gogojungletv/(p)?/:p(\\d+)?",
			component: _55053db0,
			name: "finance-videos-gogojungletv(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/finance/videos/gogojungletv"}
		},
		{
			path: "/finance/videos/searchresult",
			component: _3ee5c2b4,
			name: "finance-videos-searchresult"
		},
		{
			path: "/finance/videos/searchresult/(p)?/:p(\\d+)?/:searchType(w|t)?/:wt?",
			component: _3ee5c2b4,
			name: "finance-videos-searchresult(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F%3AsearchType(w%7Ct)%3F%2F%3Awt%3F",
			meta: {"originalPath":"/finance/videos/searchresult"}
		},
		{
			path: "/finance/videos/new",
			component: _33f88f4f,
			name: "finance-videos-new"
		},
		{
			path: "/finance/videos/new/(p)?/:p(\\d+)?",
			component: _33f88f4f,
			name: "finance-videos-new(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/finance/videos/new"}
		},
		{
			path: "/finance/videos/trend",
			component: _e7f791e8,
			name: "finance-videos-trend"
		},
		{
			path: "/finance/videos/trend/(p)?/:p(\\d+)?",
			component: _e7f791e8,
			name: "finance-videos-trend(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/finance/videos/trend"}
		},
		{
			path: "/finance/navi/article/preview",
			component: _12be47a8,
			name: "finance-navi-article-preview"
		},
		{
			path: "/review/success/:id?",
			component: _369d36f0,
			name: "review-success-id"
		},
		{
			path: "/tools/indicators/:id?",
			component: _0dd026f4,
			name: "tools-indicators-id"
		},
		{
			path: "/markets/economics/:id",
			component: _656cbe70,
			name: "markets-economics-id"
		},
		{
			path: "/finance/navi/:id",
			component: _2ae3e837,
			name: "finance-navi-id"
		},
		{
			path: "/crowdsourcing/developers/:id",
			component: _49c84e6f,
			name: "crowdsourcing-developers-id"
		},
		{
			path: "/finance/mailmagazine/:salon",
			component: _38eefd8f,
			name: "finance-mailmagazine-salon"
		},
		{
			path: "/finance/mailmagazine/:salon/:t(law|community)",
			component: _38eefd8f,
			name: "finance-mailmagazine-salon%3At(law%7Ccommunity)",
			meta: {"originalPath":"/finance/mailmagazine/:salon"}
		},
		{
			path: "/post/46/:id?",
			component: _4a1623bb,
			name: "post-46-id"
		},
		{
			path: "/tools/rooms/:id?",
			component: _4f5e56a4,
			name: "tools-rooms-id"
		},
		{
			path: "/review/input/:id?",
			component: _19a6adcf,
			name: "review-input-id"
		},
		{
			path: "/tools/ebooks/:id?",
			component: _06b44995,
			name: "tools-ebooks-id"
		},
		{
			path: "/tools/popular/:sub?",
			component: _19c1f3bc,
			name: "tools-popular-sub"
		},
		{
			path: "/tools/popular/:sub?/(p)?/:p(\\d+)?",
			component: _19c1f3bc,
			name: "tools-popular-sub(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/tools/popular/:sub?"}
		},
		{
			path: "/tools/popular/:sub?/:type(1m|1w|all)/(p)?/:p(\\d+)?",
			component: _19c1f3bc,
			name: "tools-popular-sub%3Atype(1m%7C1w%7Call)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/tools/popular/:sub?"}
		},
		{
			path: "/finance/videos/:id",
			component: _2042ba69,
			name: "finance-videos-id"
		},
		{
			path: "/review/detail/:id?",
			component: _2177d812,
			name: "review-detail-id"
		},
		{
			path: "/review/detail/:id?/(p)/:p(\\d+)",
			component: _2177d812,
			name: "review-detail-id(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/detail/:id?"}
		},
		{
			path: "/cart/add/:id?",
			component: _07ba1ba4,
			name: "cart-add-id"
		},
		{
			path: "/finance/salons/:id",
			component: _20c3dee7,
			name: "finance-salons-id"
		},
		{
			path: "/finance/salons/:id/t/:t(0|1|2|3)",
			component: _20c3dee7,
			name: "finance-salons-idt%2F%3At(0%7C1%7C2%7C3)",
			meta: {"originalPath":"/finance/salons/:id"}
		},
		{
			path: "/finance/mailmagazine/:salon/:id",
			component: _4fed17b7,
			name: "finance-mailmagazine-salon-id"
		},
		{
			path: "/finance/navi/:sid/:id?",
			component: _09b810e6,
			name: "finance-navi-sid-id"
		},
		{
			path: "/markets/spreads/:id/:pair?",
			component: _a6d63a48,
			name: "markets-spreads-id-pair"
		},
		{
			path: "/markets/charts/:s/:t?",
			component: _7d00d25f,
			name: "markets-charts-s-t"
		},
		{
			path: "/tools/:showmore",
			component: _1dd01e88,
			name: "tools-showmore"
		},
		{
			path: "/tools/:showmore/(p)?/:p(\\d+)?",
			component: _1dd01e88,
			name: "tools-showmore(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/tools/:showmore"}
		},
		{
			path: "/tools/:showmore/:type(indicator|tool|ebook|set|count|free|kabu|other)/(p)?/:p(\\d+)?",
			component: _1dd01e88,
			name: "tools-showmore%3Atype(indicator%7Ctool%7Cebook%7Cset%7Ccount%7Cfree%7Ckabu%7Cother)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/tools/:showmore"}
		},
		{
			path: "/crowdsourcing/:id",
			component: _d66c8d9c,
			name: "crowdsourcing-id"
		},
		{
			path: "/terms/:type?",
			component: _a856e460,
			name: "terms-type"
		},
		{
			path: "/users/:id?",
			component: _5526e39c,
			children: [
				{
					path: "",
					component: _320e2735,
					name: "users-id"
				},
				{
					path: "review",
					component: _74c9d285,
					name: "users-id-review"
				},
				{
					path: "review/p/:p(\\d+)?",
					component: _74c9d285,
					name: "users-id-reviewreview%2Fp%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"review"}
				},
				{
					path: "products",
					component: _29bff551,
					name: "users-id-products"
				},
				{
					path: "follows",
					component: _3637aa85,
					name: "users-id-follows"
				},
				{
					path: "follows/p/:p(\\d+)?",
					component: _3637aa85,
					name: "users-id-followsfollows%2Fp%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"follows"}
				},
				{
					path: "blog",
					component: _04f5f70f,
					name: "users-id-blog"
				},
				{
					path: "blog/p/:p(\\d+)?",
					component: _04f5f70f,
					name: "users-id-blogblog%2Fp%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"blog"}
				},
				{
					path: "followers",
					component: _161f2b78,
					name: "users-id-followers"
				},
				{
					path: "followers/p/:p(\\d+)?",
					component: _161f2b78,
					name: "users-id-followersfollowers%2Fp%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"followers"}
				},
				{
					path: "realtrade",
					component: _f9a4dd2e,
					name: "users-id-realtrade"
				}
			]
		},
		{
			path: "/crowdsourcing/:id/review",
			component: _69808028,
			name: "crowdsourcing-id-review"
		},
		{
			path: "/tools/:type/:id?",
			component: _45c65e62,
			name: "tools-type-id"
		},
		{
			path: "/post/:cid?/:id?",
			component: _b7a5ca90,
			name: "post-cid-id"
		},
		{
			path: "/",
			component: _0be47c5e,
			name: "index"
		},
		{
			path: "/:auth",
			component: _f61965f4,
			name: "auth"
		}
    ],
    
    
    fallback: false
  })
}
