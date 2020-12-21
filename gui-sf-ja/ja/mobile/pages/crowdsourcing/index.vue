<template>
  <div>
    <!-- header -->
    <Header />
    <!-- links -->
    <div class="mb-10">
      <a href="/crowdsourcing/guide1" class="link wrap-text">{{ $t(2) }}</a>
      <a href="/crowdsourcing/developers" class="link wrap-text">{{ $t(3) }}</a>
    </div>
    <!-- list -->
    <div class="list-header mt-25 wrap-text">{{ $t(4) }}</div>
    <div v-if="!(crowdsourcings.data || []).length" class="empty-box">
      {{ $t(6) }}
    </div>
    <div class="list-ctn flex flex-wrap" v-else>
      <CrowdItem v-for="item in crowdsourcings.data" :key="'sKLuW'+item.id" :item="item" />
    </div>
    <div class="list-header mt-25 wrap-text">{{ $t(5) }}</div>
    <div v-if="!(finishedCrowdsourcings.data || []).length" class="empty-box">
      {{ $t(6) }}
    </div>
    <div class="list-ctn flex flex-wrap" v-else>
      <CrowdItem v-for="item in finishedCrowdsourcings.data" 
                 :key="'sKLuW'+item.id" :item="item"
      />
    </div>
    <Loading v-if="isLoading" />
    <div v-else @click="loadMoreFinishJob">
      <LoadMore class="mb-50" />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/crowdsourcing-index.json'
import title from '@@/../common/pages'
import CrowdItem from '@/components/crowdsourcing/CrowdItem.vue'
import Header from '@/components/crowdsourcing/Header.vue'
import Loading from '@@/../components/icons/Loading.vue'
import LoadMore from '@/components/common/LoadMore.vue'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      CrowdItem,
      Header,
      Loading,
      LoadMore,
    },
    data() {
      return {
        titleChunk: this.$t(8),
        keywordsChunk: this.$t(8),
        descriptionChunk: this.$t(8),
        isLoading: false,
      }
    },
    async asyncData({ app }) {
      let [
          crowdsourcings,
          // developers,
          finishedCrowdsourcings,
          isCrowdsourcing,
        ] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing`, {
            params: {
              page: 1,
            },
          }),
          // app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/developers?limit=7'),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing`, {
            params: {
              page: 1,
              isFinish: 1,
              limit: 12,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/user'),
        ])
      return {
        crowdsourcings,
        // developers,
        finishedCrowdsourcings,
        isCrowdsourcing,
        page: 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing`,
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(7)
      },
      loadMoreFinishJob() {
        this.isLoading = true
        this.GoGoHTTP.get(`/api/v3/surface/crowdsourcing`, {
          params: {
            page: ++this.page,
            isFinish: 1,
            limit: 12,
          },
        }).then((res)=> {
          this.finishedCrowdsourcings.data = (this.finishedCrowdsourcings.data || []).concat(res.data || [])
          this.isLoading = false
        })
      }
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.link {
  padding: 5px 40px 5px 10px;
  position: relative;
  border-bottom: 1px solid #eaeaea;
  height: 50px;
  line-height: 40px;
  display: block;
  color: #707070;
  &::after {
    content: '›';
    position: absolute;
    right: 10px;
    top: 5px;
  }
}
.list-ctn {
  box-shadow: 0 0 0 1px #e0dedc;
}
.list-header {
  height: 40px;
  line-height: 30px;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #434343;
  background-color: #f3f0ef;
  border: 1px solid #e0dedc;
}
.empty-box {
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid #e0dedc;
  width: 100%;
  color: red;
}
</style>