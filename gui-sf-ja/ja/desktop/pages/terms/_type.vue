<template>
  <div class="w-1000 p-20">
    <div v-for="term in data" :key="'term-FcvTy'+term.id">
      <template v-if="type == 'privacy'">
        <div>
          <b> {{ term.title }} </b>
        </div>
        <br />
        <div class="mt-10" v-if="term.published_at">
          {{ $t(1) }}: {{ formatTime(term.published_at, 8) }}
        </div>
      </template>
      <div class="mt-10" style="font-size: 14px;">
        <span v-html="term.content"></span>
      </div>
    </div>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/terms.json'

const terms = [
  'service',
  'display',
  'affiliate',
  'crowdsourcing',
  'operation',
  'privacy',
]
const obj = Object.assign(
  {
    validate({ params }) {
      return terms.includes(params.type)
    },
    data() {
      return {
        titleChunk: this.$t(this.type)
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, error, store }) {
      const type = params.type
      const data = await app.GoGoHTTP.get(`/api/v3/terms/${type}`)
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      const titleChunk = i18n[app.i18n.locale || 'ja'][type]
      store.commit('pushBC', {
        name: titleChunk,
        target: { name: 'terms-type', params },
      })
      return {
        data,
        type,
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/terms/${type}`,
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('2', {type: this.$t(this.type)})
      },
    }
  },
  title
)
export default obj
</script>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>