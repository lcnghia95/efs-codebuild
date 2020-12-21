<template>
  <div class="crowd-investment m-t-30">
    <Header />
    <TabGuide current-tab="guide2" @onTabChange="onTabChange" />
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/crowdsourcing-guide.json'
import title from '@@/../common/pages'
import { pushState } from '@/utils/client/common'
import TabGuide from '@/components/crowdsourcing/TabGuide.vue'
import Header from '@/components/crowdsourcing/Header.vue'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      TabGuide,
      Header,
    },
    data() {
      return {
        titleChunk: `${this.$t('g2')} - ${this.$t(1)}`,
        keywordsChunk: this.$t('g2'),
        descriptionChunk: this.$t('g2'),
      }
    },
    async asyncData({ app }) {
      let isCrowdsourcing = await app.GoGoHTTP.get(
        '/api/v3/surface/crowdsourcing/user'
      )
      return {
        isCrowdsourcing,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/guide2`,
          },
        ],
      }
    },
    methods: {
      onTabChange(s) {
        pushState(
          `crowdsourcing/${s}`,
          null,
          '',
          location.protocol + '//' + location.host
        )

        let metaObj = {
          guide1: {
            titleChunk: `${this.$t('g1')} - ${this.$t(1)}`,
            keywordsChunk: this.$t('g1'),
            descriptionChunk: this.$t('g1'),
          },
          guide2: {
            titleChunk: `${this.$t('g2')} - ${this.$t(1)}`,
            keywordsChunk: this.$t('g2'),
            descriptionChunk: this.$t('g2'),
          },
          guide3: {
            titleChunk: `${this.$t('g3')} - ${this.$t(1)}`,
            keywordsChunk: this.$t('g3'),
            descriptionChunk: this.$t('g3'),
          },
        },
        obj = metaObj[s]

        this.titleChunk = obj.titleChunk
        this.keywordsChunk = obj.keywordsChunk
        this.descriptionChunk = obj.descriptionChunk
        this.linkMeta = [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/${s}`
          }
        ]
      },
    },
  },
  title
)
export default obj
</script>
