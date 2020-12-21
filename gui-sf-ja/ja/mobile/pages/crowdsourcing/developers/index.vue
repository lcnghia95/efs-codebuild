<template>
  <div>
    <!-- header -->
    <Header />
    <!-- list -->
    <div class="list-header">{{ $t('1') }}</div>
    <div class="list-ctn flex flex-wrap p-10">
      <CrowdDev v-for="(item, index) in dataDisplay"
                :key="'sKLuW'+item.id+index"
                class="mb-10"
                :item="item"
      />
    </div>
    <div @click="handleShowMore" v-if="!isEndOfPaging">
      <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/crowdsourcing-devs.json'
import title from '@@/../common/pages'
import { calPaging } from '@/utils/client/common'
import Header from '@/components/crowdsourcing/Header.vue'
import CrowdDev from '@/components/crowdsourcing/CrowdDev.vue'
import LoadMore from "@/components/common/LoadMore.vue"

const obj = Object.assign(
  {
    components: {
      Header,
      CrowdDev,
      LoadMore
    },
    data() {
      return {
        titleChunk: `${this.$t(1)} - ${this.$t(2)}`,
        keywordsChunk: this.$t(1),
        descriptionChunk: `${this.$t(1)} - ${this.$t(2)}`,
        isEndOfPaging: false
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app }) {
      let page = 1,
        developers = await app.GoGoHTTP.get(
          '/api/v3/surface/crowdsourcing/developers'
        ),
        dataDisplay = calPaging(developers || [], page, 12)
      dataDisplay = dataDisplay.data
      return {
        developers,
        dataDisplay,
        page,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/developers`,
          },
        ],
      }
    },
    methods: {
      handleShowMore() {
        let dataDisplay = calPaging(this.developers || [], ++this.page, 12)
        if(!(dataDisplay.data || []).length) {
          this.isEndOfPaging = true
        } else {
          this.dataDisplay = this.dataDisplay.concat(dataDisplay.data)
        }
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.list-header {
  line-height: 30px;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #434343;
  background-color: #f3f0ef;
}
</style>