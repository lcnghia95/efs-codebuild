<template>
  <div class="p-20 mb-30">
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
      <div class="mt-10 term-content" v-html="term.content">
      </div>
    </div>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/terms.json'

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
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        
      }
    },
    async asyncData({ app, params, error }) {
      const type = params.type
      const data = await app.GoGoHTTP.get(`/api/v3/terms/${type}`)
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      return {
        data,
        type,
        titleChunk: i18n[app.i18n.locale || 'ja'][type],
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

<style lang="scss" scoped>
.term-content {
  font-size: 15px;
}
</style>