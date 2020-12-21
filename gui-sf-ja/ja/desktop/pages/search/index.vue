<template>
  <div class="w-1000 flex layout-col" id="topctr" style="min-height: 1000px;">
    <div id="cse-search-results"></div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/search.json'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        params: this.$nuxt._route.query,
      }
    },
    async asyncData({ store, app, redirect, query }) {
      if (!Object.keys(query).length || !query.q) {
        redirect('/search', {
          cx: '012690000178031241993:kfgxqharxde',
          cof: 'FORID:10',
          ie: 'UTF-8',
          q: 'site:www.gogojungle.co.jp',
          isindex: true, // if isindex is no exist, q will be show at input search bar
        })
      }
      store.commit('pushBC', {
        name: i18n[app.i18n.locale][1],
        target: { path: '/search' },
      })
      return {
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/search`,
          },
        ],
      }
    },
    computed: {
      titleChunk() {
        return this.params.q && !this.params.isindex
          ? this.$t('4', { keyword: '「' + this.params.q + '」' })
          : this.$t('1')
      },
    },
    mounted() {
      let el1 = document.createElement('script'),
        el2 = document.createElement('script')
      el1.innerHTML = `var googleSearchIframeName = "cse-search-results";var googleSearchFormName = "cse-search-box";var googleSearchFrameWidth = 1000;var googleSearchFrameHeight = 2100;var googleSearchDomain = "www.google.co.jp";var googleSearchPath = "/cse";`
      el2.setAttribute(
        'src',
        'https://www.google.com/afsonline/show_afs_search.js'
      )

      $('#topctr').append(el1)
      $('#topctr').append(el2)
    },
    methods: {
      descriptionTemplate() {
        return this.params.q && !this.params.isindex
          ? this.$t('3', { keyword: '「' + this.params.q + '」' })
          : this.$t('2')
      },
    },
  },
  title
)
export default obj
</script>
