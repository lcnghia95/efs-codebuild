import Vue from 'vue'


import '../../mobile/assets/mobile.css'


let layouts = {

  "_cart": () => import('../../mobile/layouts/cart.vue'  /* webpackChunkName: "layouts/cart" */).then(m => m.default || m),

  "_common": () => import('../../mobile/layouts/common.vue'  /* webpackChunkName: "layouts/common" */).then(m => m.default || m),

  "_default": () => import('../../mobile/layouts/default.vue'  /* webpackChunkName: "layouts/default" */).then(m => m.default || m),

  "_empty": () => import('../../mobile/layouts/empty.vue'  /* webpackChunkName: "layouts/empty" */).then(m => m.default || m),

  "_errlay": () => import('../../mobile/layouts/errlay.vue'  /* webpackChunkName: "layouts/errlay" */).then(m => m.default || m),

  "_systemtrade": () => import('../../mobile/layouts/systemtrade.vue'  /* webpackChunkName: "layouts/systemtrade" */).then(m => m.default || m)

}

let resolvedLayouts = {}

export default {
  head: function() {
      return {
        htmlAttrs: {
          lang: 'ja',
        },
        meta: [
          {
            charset: 'utf-8',
          },
          {
            name: 'viewport',
            content: 'width=device-width',
          },
          {
            name: 'google-site-verification',
            content: 'q7zdlNKGLUmmGDm2p4o-UJ45Gld3VN-Tz0XMyZBFxRE',
          },
          {
            'http-equiv': 'X-UA-Compatible',
            content: 'IE=11',
          },
        ],
        link: [
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/img/assets/pc/common/favicon.ico',
          },
        ],
        script: [
          { src: 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver' },
        ]
      }
    },
  render(h, props) {
    
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      }
    }, [ templateEl ])

    return h('div',{
      domProps: {
        id: '__nuxt'
      }
    }, [
      
      transitionEl
    ])
  },
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },
  
  methods: {
    
    setLayout (layout) {
      if (!layout || !resolvedLayouts['_' + layout]) layout = 'default'
      this.layoutName = layout
      let _layout = '_' + layout
      this.layout = resolvedLayouts[_layout]
      return this.layout
    },
    loadLayout (layout) {
      if (!layout || !(layouts['_' + layout] || resolvedLayouts['_' + layout])) layout = 'default'
      let _layout = '_' + layout
      if (resolvedLayouts[_layout]) {
        return Promise.resolve(resolvedLayouts[_layout])
      }
      return layouts[_layout]()
      .then((Component) => {
        resolvedLayouts[_layout] = Component
        delete layouts[_layout]
        return resolvedLayouts[_layout]
      })
      .catch((e) => {
        if (this.$nuxt) {
          return this.$nuxt.error({ statusCode: 500, message: e.message })
        }
      })
    }
  },
  components: {
    
  }
}

