const { isLocal, hasSourceMap, isAnalyze } = require('../utils/dev')
const webpack = require('webpack')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const path = require('path')

process.env.LANG = 'ja'

module.exports = function(envType, purgecssPaths, extCss = []) {
  let modules = [
    '@@/../bin/configs.js',
    ['@@/../common/modules/hook-render.js', envType],
  ]
  return {
    srcDir: `${__dirname}/${envType}`,
    buildDir: `.nuxt/${envType}`,
    dev: isLocal(),
    /*
     ** Headers of the page
     */
    head() {
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
    /*
     ** Disable the progress bar color
     */
    loading: false,
    /*
     ** Build configuration
     */
    build: {
      // include third library at once
      vendor: [
        'jquery',
        'bootstrap',
        'vue-i18n',
        'axios',
        'jquery.dotdotdot',
        'highcharts',
        'babel-polyfill',
      ],
      publicPath: '/surface/',
      /*
       ** Run ESLint on production/staging build
       */
      extend(config, { isClient }) {
        // only add config if is's client config
        if (isClient) {
          config.entry.vendor = config.entry.vendor.filter(
            v => !['highcharts'].includes(v)
          )
          config.plugins.unshift(
            new webpack.optimize.CommonsChunkPlugin({
              name: 'app',
              children: true,
              async: 'vendor1',
              minChunks(module) {
                return /(highcharts)/.test(module.context)
              },
            })
          )
          // if (!isDev) {
            // for productivity reason, we don't run Eslint when developing
            // only running in two cases: build staging/production or commit code
            // TODO: hieunt temp comment code
            // config.module.rules.push({
            //   enforce: 'pre',
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   exclude: /(node_modules)/,
            // })
            config.plugins.push(
              // clean css that we don't use anymore
              new PurgecssPlugin({
                paths: glob.sync(purgecssPaths.concat([
                  path.join(__dirname, './../common/**/*.vue'),
                  path.join(__dirname, './../components/**/*.vue'),
                  path.join(
                    __dirname,
                    './node_modules/bootstrap/dist/css/bootstrap.css',
                  )],
                )),
                whitelist: ['html', 'body'],
              })
            )
          // }
        }

        // reset devtool for building staging
        if (hasSourceMap()) {
          config.devtool = 'source-map'
        }
      },
      plugins: [
        // set shortcuts as global for bootstrap
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          moment: '@@/../common/plugins/moment-tz',
          'window.moment': '@@/../common/plugins/moment-tz',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /node_modules.+(moment)/),
      ],
      extractCSS: true,
      analyze: isAnalyze()
        ? {
            analyzerMode: 'static',
          }
        : false,
      cssSourceMap: false,
    },
    // include bootstrap css
    css: extCss,
    plugins: [
      '@@/../common/plugins/vue-i18n',
      '@@/../common/plugins/http-proxy',
      '@@/../common/plugins/common',
      {
        src: '@@/../common/plugins/directives',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/gtag.js',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/yjtag.js',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/yjtag-display.js',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/lt.js',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/fb-pixel.js',
        ssr: false,
      },
      {
        src: '@@/../common/plugins/chatlio.js',
        ssr: false,
      },
    ],
    render: {
      resourceHints: false,
    },
    modules,
  }
}
