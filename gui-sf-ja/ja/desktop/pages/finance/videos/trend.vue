<template>
  <ShowMore :data-video-show="dataVideoShow" :on-paging-click="onPagingClick" />
</template>

<script>
import ShowMore from '@/components/finance/video/ShowMore.vue'
import i18n from '@@/lang/desktop/video-trend.json'
import title from '@@/../common/pages'
import { calPaging } from '@/utils/client/common'

const obj = Object.assign(
  {
    components: {
      ShowMore,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        dataVideoShow: [],
        titleChunk: this.$t('tChunk'),
      }
    },
    async asyncData({ app, params }) {
      let dataVideo = await app.GoGoHTTP.get(
          '/api/v3/surface/ggjtv/popular?limit=0'
        ),
        dataVideoShow = calPaging(dataVideo, params.p || 1, 30)
      return {
        dataVideo: dataVideo,
        dataVideoShow: dataVideoShow,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/videos/trend`,
          },
        ],
      }
    },
    methods: {
      onPagingClick(page) {
        this.dataVideoShow = calPaging(this.dataVideo, page, 30)
      },
      descriptionTemplate() {
        return this.$t('2')
      },
    },
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