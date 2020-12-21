<template>
  <div class="w-1000">
    <div class="dev-title mt-10">
      {{ $t('1') }}
    </div>
    <div class="developer-wrapp w-full flex flex-wrap">
      <CrowdsourcingDev
        v-for="item in dataDisplay.data"
        :key="'kBNIh'+item.userId"
        class="mr-15 mt-15"
        :item="item"
      />
    </div>
    <div class="text-center mt-25">
      <paging :analytic="true"
              :cur-page="dataDisplay.currentPage"
              :total="dataDisplay.lastPage"
              :from="dataDisplay.pagingFrom"
              :to="dataDisplay.pagingTo"
              :has-scroll="true"
              @pagingclick="onPaging"
      />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-devs.json'
import Paging from '@@/../components/paging/Paging.vue'
import CrowdsourcingDev from '@/components/crowdsourcing/CrowdsourcingDev.vue'
import title from '@@/../common/pages'
import { calPaging, pushState } from '@/utils/client/common'
const obj = Object.assign(
  {
    components: {
      CrowdsourcingDev,
      Paging,
    },
    data() {
      return {
        titleChunk: `${this.$t('1')} - ${this.$t('21')}`,
        keywordsChunk: this.$t('1'),
        descriptionChunk: `${this.$t('1')} - ${this.$t('21')}`,
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params }) {
      let page = params.page || 1,
        developers = await app.GoGoHTTP.get(
          '/api/v3/surface/crowdsourcing/developers'
        ),
        dataDisplay = calPaging(developers || [], page, 42)
      return {
        developers,
        dataDisplay,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/developers`,
          },
        ],
      }
    },
    methods: {
      onPaging(page) {
        let sufUrl = page > 1 ? `/p/${page}` : ''
        pushState(
          `crowdsourcing/developers${sufUrl}`,
          null,
          '',
          location.protocol + '//' + location.host
        )
        this.dataDisplay = calPaging(this.developers || [], page, 42)
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.dev-title {
  color: #4d4539;
  font-size: 22px;
}
.developer-wrapp {
  > div:nth-child(7n) {
    margin-right: 0;
  }
}
.main-dev {
  min-height: 190px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>

