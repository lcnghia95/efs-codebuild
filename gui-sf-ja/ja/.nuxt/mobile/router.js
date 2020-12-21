import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _7a7e7a95 = () => import('../../mobile/pages/markets/index.vue' /* webpackChunkName: "pages/markets/index" */).then(m => m.default || m)
  const _6932c28b = () => import('../../mobile/pages/newcampaign.vue' /* webpackChunkName: "pages/newcampaign" */).then(m => m.default || m)
  const _daafd71a = () => import('../../mobile/pages/systemtrade/index.vue' /* webpackChunkName: "pages/systemtrade/index" */).then(m => m.default || m)
  const _6efb8e94 = () => import('../../mobile/pages/systemtrade/index/index.vue' /* webpackChunkName: "pages/systemtrade/index/index" */).then(m => m.default || m)
  const _2524e1a8 = () => import('../../mobile/pages/systemtrade/index/stocks/index.vue' /* webpackChunkName: "pages/systemtrade/index/stocks/index" */).then(m => m.default || m)
  const _63897c84 = () => import('../../mobile/pages/systemtrade/index/converter.vue' /* webpackChunkName: "pages/systemtrade/index/converter" */).then(m => m.default || m)
  const _b4845212 = () => import('../../mobile/pages/systemtrade/index/search/index.vue' /* webpackChunkName: "pages/systemtrade/index/search/index" */).then(m => m.default || m)
  const _db4ea810 = () => import('../../mobile/pages/systemtrade/index/developers/index.vue' /* webpackChunkName: "pages/systemtrade/index/developers/index" */).then(m => m.default || m)
  const _505f6414 = () => import('../../mobile/pages/systemtrade/index/realasset.vue' /* webpackChunkName: "pages/systemtrade/index/realasset" */).then(m => m.default || m)
  const _42db68be = () => import('../../mobile/pages/systemtrade/index/fx/index.vue' /* webpackChunkName: "pages/systemtrade/index/fx/index" */).then(m => m.default || m)
  const _ab5fd108 = () => import('../../mobile/pages/systemtrade/index/search/detail.vue' /* webpackChunkName: "pages/systemtrade/index/search/detail" */).then(m => m.default || m)
  const _7e204b6d = () => import('../../mobile/pages/systemtrade/index/search/easy.vue' /* webpackChunkName: "pages/systemtrade/index/search/easy" */).then(m => m.default || m)
  const _1e5031b9 = () => import('../../mobile/pages/systemtrade/index/economics/fx/_type.vue' /* webpackChunkName: "pages/systemtrade/index/economics/fx/_type" */).then(m => m.default || m)
  const _59a526d8 = () => import('../../mobile/pages/systemtrade/index/stocks/_id.vue' /* webpackChunkName: "pages/systemtrade/index/stocks/_id" */).then(m => m.default || m)
  const _33aaa3e8 = () => import('../../mobile/pages/systemtrade/index/fx/_id/index.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/index" */).then(m => m.default || m)
  const _006fcfe9 = () => import('../../mobile/pages/systemtrade/index/newproduct/_category.vue' /* webpackChunkName: "pages/systemtrade/index/newproduct/_category" */).then(m => m.default || m)
  const _393ac52f = () => import('../../mobile/pages/systemtrade/index/fx/_id/backtest.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/backtest" */).then(m => m.default || m)
  const _28cb0a2b = () => import('../../mobile/pages/systemtrade/index/fx/_id/real-trade.vue' /* webpackChunkName: "pages/systemtrade/index/fx/_id/real-trade" */).then(m => m.default || m)
  const _3f2bd7f7 = () => import('../../mobile/pages/systemtrade/index/_revenue/_category.vue' /* webpackChunkName: "pages/systemtrade/index/_revenue/_category" */).then(m => m.default || m)
  const _b8b18f0e = () => import('../../mobile/pages/tools/index.vue' /* webpackChunkName: "pages/tools/index" */).then(m => m.default || m)
  const _7bfbc03c = () => import('../../mobile/pages/tools/index/index.vue' /* webpackChunkName: "pages/tools/index/index" */).then(m => m.default || m)
  const _a189bea4 = () => import('../../mobile/pages/tools/index/search.vue' /* webpackChunkName: "pages/tools/index/search" */).then(m => m.default || m)
  const _74291bfd = () => import('../../mobile/pages/tools/index/popular/_sub.vue' /* webpackChunkName: "pages/tools/index/popular/_sub" */).then(m => m.default || m)
  const _57f2cfca = () => import('../../mobile/pages/tools/index/_showmore.vue' /* webpackChunkName: "pages/tools/index/_showmore" */).then(m => m.default || m)
  const _5edeb63a = () => import('../../mobile/pages/crowdsourcing/index.vue' /* webpackChunkName: "pages/crowdsourcing/index" */).then(m => m.default || m)
  const _3ff38310 = () => import('../../mobile/pages/event/index.vue' /* webpackChunkName: "pages/event/index" */).then(m => m.default || m)
  const _7755f6f9 = () => import('../../mobile/pages/companies/index.vue' /* webpackChunkName: "pages/companies/index" */).then(m => m.default || m)
  const _20e6444a = () => import('../../mobile/pages/register/index.vue' /* webpackChunkName: "pages/register/index" */).then(m => m.default || m)
  const _3dc348e0 = () => import('../../mobile/pages/review/index.vue' /* webpackChunkName: "pages/review/index" */).then(m => m.default || m)
  const _5f29f7a2 = () => import('../../mobile/pages/inquiry.vue' /* webpackChunkName: "pages/inquiry" */).then(m => m.default || m)
  const _84dddc24 = () => import('../../mobile/pages/kabu-api/index.vue' /* webpackChunkName: "pages/kabu-api/index" */).then(m => m.default || m)
  const _ee9a8eb4 = () => import('../../mobile/pages/info/index.vue' /* webpackChunkName: "pages/info/index" */).then(m => m.default || m)
  const _0e991399 = () => import('../../mobile/pages/products.vue' /* webpackChunkName: "pages/products" */).then(m => m.default || m)
  const _58c37210 = () => import('../../mobile/pages/finance/index.vue' /* webpackChunkName: "pages/finance/index" */).then(m => m.default || m)
  const _005841d0 = () => import('../../mobile/pages/password/reset.vue' /* webpackChunkName: "pages/password/reset" */).then(m => m.default || m)
  const _f65fb358 = () => import('../../mobile/pages/register/completed.vue' /* webpackChunkName: "pages/register/completed" */).then(m => m.default || m)
  const _3863d6de = () => import('../../mobile/pages/review/new.vue' /* webpackChunkName: "pages/review/new" */).then(m => m.default || m)
  const _502c3224 = () => import('../../mobile/pages/review/highscore.vue' /* webpackChunkName: "pages/review/highscore" */).then(m => m.default || m)
  const _296691b8 = () => import('../../mobile/pages/markets/economics/index.vue' /* webpackChunkName: "pages/markets/economics/index" */).then(m => m.default || m)
  const _68ffe11a = () => import('../../mobile/pages/finance/navi/index.vue' /* webpackChunkName: "pages/finance/navi/index" */).then(m => m.default || m)
  const _ff9c1894 = () => import('../../mobile/pages/finance/navi/index/index.vue' /* webpackChunkName: "pages/finance/navi/index/index" */).then(m => m.default || m)
  const _494bde06 = () => import('../../mobile/pages/finance/navi/index/series/index.vue' /* webpackChunkName: "pages/finance/navi/index/series/index" */).then(m => m.default || m)
  const _74d302af = () => import('../../mobile/pages/finance/navi/index/authors/index.vue' /* webpackChunkName: "pages/finance/navi/index/authors/index" */).then(m => m.default || m)
  const _6b85f911 = () => import('../../mobile/pages/finance/navi/index/searchresult.vue' /* webpackChunkName: "pages/finance/navi/index/searchresult" */).then(m => m.default || m)
  const _006db54c = () => import('../../mobile/pages/finance/navi/index/articles/index.vue' /* webpackChunkName: "pages/finance/navi/index/articles/index" */).then(m => m.default || m)
  const _2daed4c1 = () => import('../../mobile/pages/finance/navi/index/series/searchresult.vue' /* webpackChunkName: "pages/finance/navi/index/series/searchresult" */).then(m => m.default || m)
  const _38a13a8a = () => import('../../mobile/pages/finance/navi/index/articles/searchresult.vue' /* webpackChunkName: "pages/finance/navi/index/articles/searchresult" */).then(m => m.default || m)
  const _4a9aa07b = () => import('../../mobile/pages/finance/navi/index/articles/cat/_id.vue' /* webpackChunkName: "pages/finance/navi/index/articles/cat/_id" */).then(m => m.default || m)
  const _e7b4ac24 = () => import('../../mobile/pages/finance/navi/index/series/_id.vue' /* webpackChunkName: "pages/finance/navi/index/series/_id" */).then(m => m.default || m)
  const _594fe4d7 = () => import('../../mobile/pages/finance/navi/index/authors/_id.vue' /* webpackChunkName: "pages/finance/navi/index/authors/_id" */).then(m => m.default || m)
  const _5e409ab4 = () => import('../../mobile/pages/finance/navi/index/articles/_id.vue' /* webpackChunkName: "pages/finance/navi/index/articles/_id" */).then(m => m.default || m)
  const _77f56b9e = () => import('../../mobile/pages/finance/navi/index/_id.vue' /* webpackChunkName: "pages/finance/navi/index/_id" */).then(m => m.default || m)
  const _f23ed2b6 = () => import('../../mobile/pages/markets/charts/index.vue' /* webpackChunkName: "pages/markets/charts/index" */).then(m => m.default || m)
  const _18ed4174 = () => import('../../mobile/pages/crowdsourcing/guide1.vue' /* webpackChunkName: "pages/crowdsourcing/guide1" */).then(m => m.default || m)
  const _00ed01d8 = () => import('../../mobile/pages/finance/mailmagazine/index.vue' /* webpackChunkName: "pages/finance/mailmagazine/index" */).then(m => m.default || m)
  const _18fb58f5 = () => import('../../mobile/pages/crowdsourcing/guide2.vue' /* webpackChunkName: "pages/crowdsourcing/guide2" */).then(m => m.default || m)
  const _5e862cb4 = () => import('../../mobile/pages/markets/spreads/index.vue' /* webpackChunkName: "pages/markets/spreads/index" */).then(m => m.default || m)
  const _3cee5caa = () => import('../../mobile/pages/crowdsourcing/developers/index.vue' /* webpackChunkName: "pages/crowdsourcing/developers/index" */).then(m => m.default || m)
  const _da3f57b6 = () => import('../../mobile/pages/finance/videos/index.vue' /* webpackChunkName: "pages/finance/videos/index" */).then(m => m.default || m)
  const _77aa5123 = () => import('../../mobile/pages/finance/salons/index.vue' /* webpackChunkName: "pages/finance/salons/index" */).then(m => m.default || m)
  const _66ac1897 = () => import('../../mobile/pages/review/popular.vue' /* webpackChunkName: "pages/review/popular" */).then(m => m.default || m)
  const _19097076 = () => import('../../mobile/pages/crowdsourcing/guide3.vue' /* webpackChunkName: "pages/crowdsourcing/guide3" */).then(m => m.default || m)
  const _66ff2c1c = () => import('../../mobile/pages/event/search.vue' /* webpackChunkName: "pages/event/search" */).then(m => m.default || m)
  const _1f6983f4 = () => import('../../mobile/pages/review/highpost.vue' /* webpackChunkName: "pages/review/highpost" */).then(m => m.default || m)
  const _7ebdc5ec = () => import('../../mobile/pages/review/success/_id.vue' /* webpackChunkName: "pages/review/success/_id" */).then(m => m.default || m)
  const _a537cf9a = () => import('../../mobile/pages/review/input/_id.vue' /* webpackChunkName: "pages/review/input/_id" */).then(m => m.default || m)
  const _4fb0cad7 = () => import('../../mobile/pages/post/46/_id.vue' /* webpackChunkName: "pages/post/46/_id" */).then(m => m.default || m)
  const _2c26328c = () => import('../../mobile/pages/markets/economics/_id.vue' /* webpackChunkName: "pages/markets/economics/_id" */).then(m => m.default || m)
  const _8a5f7f6a = () => import('../../mobile/pages/finance/salons/_id.vue' /* webpackChunkName: "pages/finance/salons/_id" */).then(m => m.default || m)
  const _0567ba2e = () => import('../../mobile/pages/review/detail/_id.vue' /* webpackChunkName: "pages/review/detail/_id" */).then(m => m.default || m)
  const _276f27ab = () => import('../../mobile/pages/finance/mailmagazine/_salon/index.vue' /* webpackChunkName: "pages/finance/mailmagazine/_salon/index" */).then(m => m.default || m)
  const _8b61c866 = () => import('../../mobile/pages/finance/videos/_id.vue' /* webpackChunkName: "pages/finance/videos/_id" */).then(m => m.default || m)
  const _d4357a5a = () => import('../../mobile/pages/crowdsourcing/developers/_id.vue' /* webpackChunkName: "pages/crowdsourcing/developers/_id" */).then(m => m.default || m)
  const _5a022e10 = () => import('../../mobile/pages/markets/spreads/_id/_pair.vue' /* webpackChunkName: "pages/markets/spreads/_id/_pair" */).then(m => m.default || m)
  const _7c4528ae = () => import('../../mobile/pages/finance/navi/_sid/_id.vue' /* webpackChunkName: "pages/finance/navi/_sid/_id" */).then(m => m.default || m)
  const _540c13ae = () => import('../../mobile/pages/event/area/_large/_medium.vue' /* webpackChunkName: "pages/event/area/_large/_medium" */).then(m => m.default || m)
  const _a52dce5a = () => import('../../mobile/pages/finance/mailmagazine/_salon/_id.vue' /* webpackChunkName: "pages/finance/mailmagazine/_salon/_id" */).then(m => m.default || m)
  const _750b2a7a = () => import('../../mobile/pages/markets/charts/_s/_t.vue' /* webpackChunkName: "pages/markets/charts/_s/_t" */).then(m => m.default || m)
  const _587e4c4e = () => import('../../mobile/pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */).then(m => m.default || m)
  const _0d87e051 = () => import('../../mobile/pages/users/_id/index.vue' /* webpackChunkName: "pages/users/_id/index" */).then(m => m.default || m)
  const _08873ce9 = () => import('../../mobile/pages/users/_id/review.vue' /* webpackChunkName: "pages/users/_id/review" */).then(m => m.default || m)
  const _78675296 = () => import('../../mobile/pages/users/_id/products.vue' /* webpackChunkName: "pages/users/_id/products" */).then(m => m.default || m)
  const _1a278ca1 = () => import('../../mobile/pages/users/_id/follows.vue' /* webpackChunkName: "pages/users/_id/follows" */).then(m => m.default || m)
  const _2d12aa73 = () => import('../../mobile/pages/users/_id/blog.vue' /* webpackChunkName: "pages/users/_id/blog" */).then(m => m.default || m)
  const _84c212d8 = () => import('../../mobile/pages/users/_id/followers.vue' /* webpackChunkName: "pages/users/_id/followers" */).then(m => m.default || m)
  const _2aad5c85 = () => import('../../mobile/pages/users/_id/realtrade.vue' /* webpackChunkName: "pages/users/_id/realtrade" */).then(m => m.default || m)
  const _542b5d63 = () => import('../../mobile/pages/event/_id/index.vue' /* webpackChunkName: "pages/event/_id/index" */).then(m => m.default || m)
  const _da12d364 = () => import('../../mobile/pages/crowdsourcing/_id/index.vue' /* webpackChunkName: "pages/crowdsourcing/_id/index" */).then(m => m.default || m)
  const _9d219628 = () => import('../../mobile/pages/terms/_type.vue' /* webpackChunkName: "pages/terms/_type" */).then(m => m.default || m)
  const _30ef468c = () => import('../../mobile/pages/crowdsourcing/_id/review.vue' /* webpackChunkName: "pages/crowdsourcing/_id/review" */).then(m => m.default || m)
  const _8ed2ec2a = () => import('../../mobile/pages/tools/_type/_id.vue' /* webpackChunkName: "pages/tools/_type/_id" */).then(m => m.default || m)
  const _2e5c2b98 = () => import('../../mobile/pages/info/_type/_id.vue' /* webpackChunkName: "pages/info/_type/_id" */).then(m => m.default || m)
  const _a48b2a58 = () => import('../../mobile/pages/post/_cid/_id.vue' /* webpackChunkName: "pages/post/_cid/_id" */).then(m => m.default || m)
  const _560aeded = () => import('../../mobile/pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
  const _3e1f0dbc = () => import('../../mobile/pages/_auth.vue' /* webpackChunkName: "pages/_auth" */).then(m => m.default || m)
  


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
			path: "/markets",
			component: _7a7e7a95,
			name: "markets"
		},
		{
			path: "/newcampaign",
			component: _6932c28b,
			name: "newcampaign"
		},
		{
			path: "/systemtrade",
			component: _daafd71a,
			children: [
				{
					path: "",
					component: _6efb8e94,
					name: "systemtrade-index"
				},
				{
					path: "stocks",
					component: _2524e1a8,
					name: "systemtrade-index-stocks"
				},
				{
					path: "converter",
					component: _63897c84,
					name: "systemtrade-index-converter"
				},
				{
					path: "search",
					component: _b4845212,
					name: "systemtrade-index-search"
				},
				{
					path: "developers",
					component: _db4ea810,
					name: "systemtrade-index-developers"
				},
				{
					path: "developers/(p)?/:p(\\d+)?",
					component: _db4ea810,
					name: "systemtrade-index-developersdevelopers%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"developers"}
				},
				{
					path: "realasset",
					component: _505f6414,
					name: "systemtrade-index-realasset"
				},
				{
					path: "realasset/(p)?/:p(\\d+)?",
					component: _505f6414,
					name: "systemtrade-index-realassetrealasset%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"realasset"}
				},
				{
					path: "fx",
					component: _42db68be,
					name: "systemtrade-index-fx"
				},
				{
					path: "search/detail",
					component: _ab5fd108,
					name: "systemtrade-index-search-detail"
				},
				{
					path: "search/easy",
					component: _7e204b6d,
					name: "systemtrade-index-search-easy"
				},
				{
					path: "economics/fx/:type?",
					component: _1e5031b9,
					name: "systemtrade-index-economics-fx-type"
				},
				{
					path: "economics/fx/:type(1|2)/(p)?/:p(\\d+)?",
					component: _1e5031b9,
					name: "systemtrade-index-economics-fx-typeeconomics%2Ffx%2F%3Atype(1%7C2)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"economics/fx/:type?"}
				},
				{
					path: "stocks/:id?",
					component: _59a526d8,
					name: "systemtrade-index-stocks-id"
				},
				{
					path: "fx/:id?",
					component: _33aaa3e8,
					name: "systemtrade-index-fx-id"
				},
				{
					path: "newproduct/:category?",
					component: _006fcfe9,
					name: "systemtrade-index-newproduct-category"
				},
				{
					path: "newproduct/(p)?/:p(\\d+)?",
					component: _006fcfe9,
					name: "systemtrade-index-newproduct-categorynewproduct%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"newproduct/:category?"}
				},
				{
					path: "newproduct/:category(fx|stocks)/(p)?/:p(\\d+)?",
					component: _006fcfe9,
					name: "systemtrade-index-newproduct-categorynewproduct%2F%3Acategory(fx%7Cstocks)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"newproduct/:category?"}
				},
				{
					path: "fx/:id?/backtest",
					component: _393ac52f,
					name: "systemtrade-index-fx-id-backtest"
				},
				{
					path: "fx/:id?/real-trade",
					component: _28cb0a2b,
					name: "systemtrade-index-fx-id-real-trade"
				},
				{
					path: ":revenue/:category?",
					component: _3f2bd7f7,
					name: "systemtrade-index-revenue-category"
				},
				{
					path: ":revenue(profitrate|profit|profitfactor|riskreturn|sell)/(p)?/:p(\\d+)?",
					component: _3f2bd7f7,
					name: "systemtrade-index-revenue-category%3Arevenue(profitrate%7Cprofit%7Cprofitfactor%7Criskreturn%7Csell)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":revenue/:category?"}
				},
				{
					path: ":revenue(profitrate|profit|profitfactor|riskreturn|sell)/:category(fx|stocks)/(p)?/:p(\\d+)?",
					component: _3f2bd7f7,
					name: "systemtrade-index-revenue-category%3Arevenue(profitrate%7Cprofit%7Cprofitfactor%7Criskreturn%7Csell)%2F%3Acategory(fx%7Cstocks)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":revenue/:category?"}
				}
			]
		},
		{
			path: "/tools",
			component: _b8b18f0e,
			children: [
				{
					path: "",
					component: _7bfbc03c,
					name: "tools-index"
				},
				{
					path: ":type(free)/:subType(3m|1m|1w|all)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(free)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(pcount)/:subType(3m|1m|1w|all)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(pcount)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(osusume)/:subType(campaign|indicator|tool|ebook|set)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(osusume)%2F%3AsubType(campaign%7Cindicator%7Ctool%7Cebook%7Cset)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(psum)/:subType(3m|1m|1w|all)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(psum)%2F%3AsubType(3m%7C1m%7C1w%7Call)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(newproduct)/:subType(kabu|fx|other)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(newproduct)%2F%3AsubType(kabu%7Cfx%7Cother)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(sold)/:subType(fee|free)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(sold)%2F%3AsubType(fee%7Cfree)",
					meta: {"originalPath":""}
				},
				{
					path: ":type(productreview)/:subType(average|count)",
					component: _7bfbc03c,
					name: "tools-index%3Atype(productreview)%2F%3AsubType(average%7Ccount)",
					meta: {"originalPath":""}
				},
				{
					path: "search",
					component: _a189bea4,
					name: "tools-index-search"
				},
				{
					path: "popular/:sub?",
					component: _74291bfd,
					name: "tools-index-popular-sub"
				},
				{
					path: "popular/:sub(price|count|free)/(p)?/:p(\\d+)?",
					component: _74291bfd,
					name: "tools-index-popular-subpopular%2F%3Asub(price%7Ccount%7Cfree)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"popular/:sub?"}
				},
				{
					path: "popular/:sub(price)/:type(1m|1w|all)/(p)?/:p(\\d+)?",
					component: _74291bfd,
					name: "tools-index-popular-subpopular%2F%3Asub(price)%2F%3Atype(1m%7C1w%7Call)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"popular/:sub?"}
				},
				{
					path: "popular/:sub(count)/:type(1m|1w|all)/(p)?/:p(\\d+)?",
					component: _74291bfd,
					name: "tools-index-popular-subpopular%2F%3Asub(count)%2F%3Atype(1m%7C1w%7Call)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"popular/:sub?"}
				},
				{
					path: "popular/:sub(free)/:type(1m|1w|all)/(p)?/:p(\\d+)?",
					component: _74291bfd,
					name: "tools-index-popular-subpopular%2F%3Asub(free)%2F%3Atype(1m%7C1w%7Call)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"popular/:sub?"}
				},
				{
					path: ":showmore",
					component: _57f2cfca,
					name: "tools-index-showmore"
				},
				{
					path: ":showmore(recommend|new|recent|review)/(p)?/:p(\\d+)?",
					component: _57f2cfca,
					name: "tools-index-showmore%3Ashowmore(recommend%7Cnew%7Crecent%7Creview)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":showmore"}
				},
				{
					path: ":showmore(recommend)/:type(indicator|tool|ebook|set)/(p)?/:p(\\d+)?",
					component: _57f2cfca,
					name: "tools-index-showmore%3Ashowmore(recommend)%2F%3Atype(indicator%7Ctool%7Cebook%7Cset)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":showmore"}
				},
				{
					path: ":showmore(new)/:type(kabu|other)/(p)?/:p(\\d+)?",
					component: _57f2cfca,
					name: "tools-index-showmore%3Ashowmore(new)%2F%3Atype(kabu%7Cother)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":showmore"}
				},
				{
					path: ":showmore(recent)/:type(free)/(p)?/:p(\\d+)?",
					component: _57f2cfca,
					name: "tools-index-showmore%3Ashowmore(recent)%2F%3Atype(free)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":showmore"}
				},
				{
					path: ":showmore(review)/:type(count)/(p)?/:p(\\d+)?",
					component: _57f2cfca,
					name: "tools-index-showmore%3Ashowmore(review)%2F%3Atype(count)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":":showmore"}
				}
			]
		},
		{
			path: "/crowdsourcing",
			component: _5edeb63a,
			name: "crowdsourcing"
		},
		{
			path: "/crowdsourcing/:type(finish)/:isFinish(0|1)/:p(p)/:page(\\d+)",
			component: _5edeb63a,
			name: "crowdsourcing%3Atype(finish)%2F%3AisFinish(0%7C1)%2F%3Ap(p)%2F%3Apage(%5Cd%2B)",
			meta: {"originalPath":"/crowdsourcing"}
		},
		{
			path: "/event",
			component: _3ff38310,
			name: "event"
		},
		{
			path: "/companies",
			component: _7755f6f9,
			name: "companies"
		},
		{
			path: "/register",
			component: _20e6444a,
			name: "register"
		},
		{
			path: "/review",
			component: _3dc348e0,
			name: "review"
		},
		{
			path: "/inquiry",
			component: _5f29f7a2,
			name: "inquiry"
		},
		{
			path: "/kabu-api",
			component: _84dddc24,
			name: "kabu-api"
		},
		{
			path: "/info",
			component: _ee9a8eb4,
			name: "info"
		},
		{
			path: "/info/:type(seller|partner)?",
			component: _ee9a8eb4,
			name: "info%3Atype(seller%7Cpartner)%3F",
			meta: {"originalPath":"/info"}
		},
		{
			path: "/info/:type(seller|partner)?/y/:y(\\d+)?/(t)?/:t(1|2|1,2|1%2C2|2,1|2%2C1)?",
			component: _ee9a8eb4,
			name: "info%3Atype(seller%7Cpartner)%3F%2Fy%2F%3Ay(%5Cd%2B)%3F%2F(t)%3F%2F%3At(1%7C2%7C1%2C2%7C1%252C2%7C2%2C1%7C2%252C1)%3F",
			meta: {"originalPath":"/info"}
		},
		{
			path: "/info/y/:y(\\d+)?",
			component: _ee9a8eb4,
			name: "infoy%2F%3Ay(%5Cd%2B)%3F",
			meta: {"originalPath":"/info"}
		},
		{
			path: "/products",
			component: _0e991399,
			name: "products"
		},
		{
			path: "/finance",
			component: _58c37210,
			name: "finance"
		},
		{
			path: "/password/reset",
			component: _005841d0,
			name: "password-reset"
		},
		{
			path: "/register/completed",
			component: _f65fb358,
			name: "register-completed"
		},
		{
			path: "/review/new",
			component: _3863d6de,
			name: "review-new"
		},
		{
			path: "/review/highscore",
			component: _502c3224,
			name: "review-highscore"
		},
		{
			path: "/review/highscore/(p)/:p(\\d+)",
			component: _502c3224,
			name: "review-highscore(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)",
			component: _502c3224,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/(p)/:p(\\d+)",
			component: _502c3224,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)",
			component: _502c3224,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/review/highscore/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)/(p)/:p(\\d+)",
			component: _502c3224,
			name: "review-highscore%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highscore"}
		},
		{
			path: "/markets/economics",
			component: _296691b8,
			name: "markets-economics"
		},
		{
			path: "/markets/economics/y/:y(\\d+)/(m)?/:m(\\d+)?/(p)?/:p(\\d+)?",
			component: _296691b8,
			name: "markets-economicsy%2F%3Ay(%5Cd%2B)%2F(m)%3F%2F%3Am(%5Cd%2B)%3F%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
			meta: {"originalPath":"/markets/economics"}
		},
		{
			path: "/finance/navi",
			component: _68ffe11a,
			children: [
				{
					path: "",
					component: _ff9c1894,
					name: "finance-navi-index"
				},
				{
					path: "series",
					component: _494bde06,
					name: "finance-navi-index-series"
				},
				{
					path: "series/(ipc)?/:isPaidContent(0|1)/(pt)?/:periodType(0|1|2|3)/(p)?/:p(\\d+)?",
					component: _494bde06,
					name: "finance-navi-index-seriesseries%2F(ipc)%3F%2F%3AisPaidContent(0%7C1)%2F(pt)%3F%2F%3AperiodType(0%7C1%7C2%7C3)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"series"}
				},
				{
					path: "authors",
					component: _74d302af,
					name: "finance-navi-index-authors"
				},
				{
					path: "authors/(st)?/:sort(0|1|2|3)/(p)?/:p(\\d+)?/(w)?/:w?",
					component: _74d302af,
					name: "finance-navi-index-authorsauthors%2F(st)%3F%2F%3Asort(0%7C1%7C2%7C3)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(w)%3F%2F%3Aw%3F",
					meta: {"originalPath":"authors"}
				},
				{
					path: "searchresult",
					component: _6b85f911,
					name: "finance-navi-index-searchresult"
				},
				{
					path: "searchresult/(p)?/:p(\\d+)?/(ipc)?/:isPaidContent(\\d+)?/(pt)?/:periodType(\\d+)?/(t)?/:t?",
					component: _6b85f911,
					name: "finance-navi-index-searchresultsearchresult%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(ipc)%3F%2F%3AisPaidContent(%5Cd%2B)%3F%2F(pt)%3F%2F%3AperiodType(%5Cd%2B)%3F%2F(t)%3F%2F%3At%3F",
					meta: {"originalPath":"searchresult"}
				},
				{
					path: "articles",
					component: _006db54c,
					name: "finance-navi-index-articles"
				},
				{
					path: "articles/(ipc)?/:isPaidContent(0|1)/(pt)?/:periodType(0|1|2|3)/(p)?/:p(\\d+)?",
					component: _006db54c,
					name: "finance-navi-index-articlesarticles%2F(ipc)%3F%2F%3AisPaidContent(0%7C1)%2F(pt)%3F%2F%3AperiodType(0%7C1%7C2%7C3)%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F",
					meta: {"originalPath":"articles"}
				},
				{
					path: "series/searchresult",
					component: _2daed4c1,
					name: "finance-navi-index-series-searchresult"
				},
				{
					path: "series/searchresult/(p)?/:p(\\d+)?/(ipc)?/:isPaidContent(\\d+)?/(pt)?/:periodType(\\d+)?/(w)?/:w?",
					component: _2daed4c1,
					name: "finance-navi-index-series-searchresultseries%2Fsearchresult%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(ipc)%3F%2F%3AisPaidContent(%5Cd%2B)%3F%2F(pt)%3F%2F%3AperiodType(%5Cd%2B)%3F%2F(w)%3F%2F%3Aw%3F",
					meta: {"originalPath":"series/searchresult"}
				},
				{
					path: "articles/searchresult",
					component: _38a13a8a,
					name: "finance-navi-index-articles-searchresult"
				},
				{
					path: "articles/searchresult/(p)?/:p(\\d+)?/(ipc)?/:isPaidContent(\\d+)?/(pt)?/:periodType(\\d+)?/(w)?/:w?",
					component: _38a13a8a,
					name: "finance-navi-index-articles-searchresultarticles%2Fsearchresult%2F(p)%3F%2F%3Ap(%5Cd%2B)%3F%2F(ipc)%3F%2F%3AisPaidContent(%5Cd%2B)%3F%2F(pt)%3F%2F%3AperiodType(%5Cd%2B)%3F%2F(w)%3F%2F%3Aw%3F",
					meta: {"originalPath":"articles/searchresult"}
				},
				{
					path: "articles/cat/:id?",
					component: _4a9aa07b,
					name: "finance-navi-index-articles-cat-id"
				},
				{
					path: "series/:id?",
					component: _e7b4ac24,
					name: "finance-navi-index-series-id"
				},
				{
					path: "authors/:id?",
					component: _594fe4d7,
					name: "finance-navi-index-authors-id"
				},
				{
					path: "articles/:id?",
					component: _5e409ab4,
					name: "finance-navi-index-articles-id"
				},
				{
					path: ":id",
					component: _77f56b9e,
					name: "finance-navi-index-id"
				}
			]
		},
		{
			path: "/markets/charts",
			component: _f23ed2b6,
			name: "markets-charts"
		},
		{
			path: "/crowdsourcing/guide1",
			component: _18ed4174,
			name: "crowdsourcing-guide1"
		},
		{
			path: "/finance/mailmagazine",
			component: _00ed01d8,
			name: "finance-mailmagazine"
		},
		{
			path: "/finance/mailmagazine/(t)?/:t(1|2)",
			component: _00ed01d8,
			name: "finance-mailmagazine(t)%3F%2F%3At(1%7C2)",
			meta: {"originalPath":"/finance/mailmagazine"}
		},
		{
			path: "/crowdsourcing/guide2",
			component: _18fb58f5,
			name: "crowdsourcing-guide2"
		},
		{
			path: "/markets/spreads",
			component: _5e862cb4,
			name: "markets-spreads"
		},
		{
			path: "/crowdsourcing/developers",
			component: _3cee5caa,
			name: "crowdsourcing-developers"
		},
		{
			path: "/crowdsourcing/developers/:p(p)/:page(\\d+)",
			component: _3cee5caa,
			name: "crowdsourcing-developers%3Ap(p)%2F%3Apage(%5Cd%2B)",
			meta: {"originalPath":"/crowdsourcing/developers"}
		},
		{
			path: "/finance/videos",
			component: _da3f57b6,
			name: "finance-videos"
		},
		{
			path: "/finance/videos/:type(gogojungletv|new|premier|trend|searchresult)",
			component: _da3f57b6,
			name: "finance-videos%3Atype(gogojungletv%7Cnew%7Cpremier%7Ctrend%7Csearchresult)",
			meta: {"originalPath":"/finance/videos"}
		},
		{
			path: "/finance/videos/:type(searchresult)/w/:keyword",
			component: _da3f57b6,
			name: "finance-videos%3Atype(searchresult)%2Fw%2F%3Akeyword",
			meta: {"originalPath":"/finance/videos"}
		},
		{
			path: "/finance/salons",
			component: _77aa5123,
			name: "finance-salons"
		},
		{
			path: "/review/popular",
			component: _66ac1897,
			name: "review-popular"
		},
		{
			path: "/crowdsourcing/guide3",
			component: _19097076,
			name: "crowdsourcing-guide3"
		},
		{
			path: "/event/search",
			component: _66ff2c1c,
			name: "event-search"
		},
		{
			path: "/event/search/cat/:categories?/(p)?/:page(\\d+)?",
			component: _66ff2c1c,
			name: "event-searchcat%2F%3Acategories%3F%2F(p)%3F%2F%3Apage(%5Cd%2B)%3F",
			meta: {"originalPath":"/event/search"}
		},
		{
			path: "/event/search/(from)?/:from(\\d{4}-\\d{1,2}-\\d{1,2})?/(to)?/:to(\\d{4}-\\d{1,2}-\\d{1,2})?/(cat)?/:categories?/(p)?/:page(\\d+)?",
			component: _66ff2c1c,
			name: "event-search(from)%3F%2F%3Afrom(%5Cd%7B4%7D-%5Cd%7B1%2C2%7D-%5Cd%7B1%2C2%7D)%3F%2F(to)%3F%2F%3Ato(%5Cd%7B4%7D-%5Cd%7B1%2C2%7D-%5Cd%7B1%2C2%7D)%3F%2F(cat)%3F%2F%3Acategories%3F%2F(p)%3F%2F%3Apage(%5Cd%2B)%3F",
			meta: {"originalPath":"/event/search"}
		},
		{
			path: "/review/highpost",
			component: _1f6983f4,
			name: "review-highpost"
		},
		{
			path: "/review/highpost/(p)/:p(\\d+)",
			component: _1f6983f4,
			name: "review-highpost(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)",
			component: _1f6983f4,
			name: "review-highpost%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools|kabu|navi|salons|emagazine|others)/:month(12)/(p)/:p(\\d+)",
			component: _1f6983f4,
			name: "review-highpost%3Atype(systemtrade%7Ctools%7Ckabu%7Cnavi%7Csalons%7Cemagazine%7Cothers)%2F%3Amonth(12)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools)/:month(3)",
			component: _1f6983f4,
			name: "review-highpost%3Atype(systemtrade%7Ctools)%2F%3Amonth(3)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/highpost/:type(systemtrade|tools)/:month(3)/(p)/:p(\\d+)",
			component: _1f6983f4,
			name: "review-highpost%3Atype(systemtrade%7Ctools)%2F%3Amonth(3)%2F(p)%2F%3Ap(%5Cd%2B)",
			meta: {"originalPath":"/review/highpost"}
		},
		{
			path: "/review/success/:id?",
			component: _7ebdc5ec,
			name: "review-success-id"
		},
		{
			path: "/review/input/:id?",
			component: _a537cf9a,
			name: "review-input-id"
		},
		{
			path: "/post/46/:id?",
			component: _4fb0cad7,
			name: "post-46-id"
		},
		{
			path: "/markets/economics/:id",
			component: _2c26328c,
			name: "markets-economics-id"
		},
		{
			path: "/finance/salons/:id",
			component: _8a5f7f6a,
			name: "finance-salons-id"
		},
		{
			path: "/finance/salons/:id/t/:t(0|1|2|3)",
			component: _8a5f7f6a,
			name: "finance-salons-idt%2F%3At(0%7C1%7C2%7C3)",
			meta: {"originalPath":"/finance/salons/:id"}
		},
		{
			path: "/review/detail/:id?",
			component: _0567ba2e,
			name: "review-detail-id"
		},
		{
			path: "/finance/mailmagazine/:salon",
			component: _276f27ab,
			name: "finance-mailmagazine-salon"
		},
		{
			path: "/finance/mailmagazine/:salon/:t(law|community)",
			component: _276f27ab,
			name: "finance-mailmagazine-salon%3At(law%7Ccommunity)",
			meta: {"originalPath":"/finance/mailmagazine/:salon"}
		},
		{
			path: "/finance/videos/:id",
			component: _8b61c866,
			name: "finance-videos-id"
		},
		{
			path: "/crowdsourcing/developers/:id",
			component: _d4357a5a,
			name: "crowdsourcing-developers-id"
		},
		{
			path: "/markets/spreads/:id/:pair?",
			component: _5a022e10,
			name: "markets-spreads-id-pair"
		},
		{
			path: "/finance/navi/:sid/:id?",
			component: _7c4528ae,
			name: "finance-navi-sid-id"
		},
		{
			path: "/event/area/:large?/:medium?",
			component: _540c13ae,
			name: "event-area-large-medium"
		},
		{
			path: "/finance/mailmagazine/:salon/:id",
			component: _a52dce5a,
			name: "finance-mailmagazine-salon-id"
		},
		{
			path: "/markets/charts/:s/:t?",
			component: _750b2a7a,
			name: "markets-charts-s-t"
		},
		{
			path: "/users/:id?",
			component: _587e4c4e,
			children: [
				{
					path: "",
					component: _0d87e051,
					name: "users-id"
				},
				{
					path: "review",
					component: _08873ce9,
					name: "users-id-review"
				},
				{
					path: "products",
					component: _78675296,
					name: "users-id-products"
				},
				{
					path: "follows",
					component: _1a278ca1,
					name: "users-id-follows"
				},
				{
					path: "blog",
					component: _2d12aa73,
					name: "users-id-blog"
				},
				{
					path: "followers",
					component: _84c212d8,
					name: "users-id-followers"
				},
				{
					path: "realtrade",
					component: _2aad5c85,
					name: "users-id-realtrade"
				}
			]
		},
		{
			path: "/event/:id",
			component: _542b5d63,
			name: "event-id"
		},
		{
			path: "/crowdsourcing/:id",
			component: _da12d364,
			name: "crowdsourcing-id"
		},
		{
			path: "/terms/:type?",
			component: _9d219628,
			name: "terms-type"
		},
		{
			path: "/crowdsourcing/:id/review",
			component: _30ef468c,
			name: "crowdsourcing-id-review"
		},
		{
			path: "/tools/:type/:id?",
			component: _8ed2ec2a,
			name: "tools-type-id"
		},
		{
			path: "/info/:type/:id?",
			component: _2e5c2b98,
			name: "info-type-id"
		},
		{
			path: "/post/:cid?/:id?",
			component: _a48b2a58,
			name: "post-cid-id"
		},
		{
			path: "/",
			component: _560aeded,
			name: "index"
		},
		{
			path: "/:auth",
			component: _3e1f0dbc,
			name: "auth"
		}
],


  fallback: false
})
}
