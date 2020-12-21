<template>
  <div>
    <!-- header -->
    <SearchContainer @onConditionSearch="onConditionSearch"
                     @onAreaSearch="onAreaSearch"
                     v-model="mode"
    />
    <!-- list item of result -->
    <transition name="list-event">
      <div class="p-10" v-if="!mode">
        <EvenItem class="mt-15" v-for="item in data" :key="item.id" :item="item" />
        <Loading v-if="isLoading" />
        <div v-else @click="handleShowMore">
          <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" v-if="!isEndOfPaging" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/event-index.json'
import EvenItem from '@/components/event/EvenItem.vue'
import SearchContainer from '@/components/event/SearchContainer.vue'
import Loading from '@@/../components/icons/Loading.vue'
import LoadMore from "@/components/common/LoadMore.vue"

const obj = Object.assign(
  {
    components: {
      EvenItem,
      SearchContainer,
      Loading,
      LoadMore
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        searchMode: null, // (null || condition || area)
        titleChunk: this.$t('1'),
        isLoading: false,
        mode: null,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('25')
      },
      onConditionSearch(obj) {
        location.href = `/event/search${
          obj.dateFrom ? `/from/${obj.dateFrom}` : ''
        }${obj.dateTo ? `/to/${obj.dateTo}` : ''}${
          obj.cat.length ? `/cat/${obj.cat.toString()
        }` : ''}${
          obj.w ? `?w=${encodeURIComponent(obj.w)}` : ''
        }`
      },
      onAreaSearch(obj) {
        location.href = `/event/area/${obj.large}/${obj.small}`
      },
      async handleShowMore() {
        if (this.isEndOfPaging || this.isLoading) {
          return
        }
        this.isLoading = true
        let data = await this.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            page: this.page + 1,
            limit: this.limit,
          }
        })
        data = data.data || []
        if (data && data.length) {
          this.data = (this.data || []).concat(data)
          this.page = this.page + 1
        }
        if (data && !data.length || data.length < this.limit) {
          this.isEndOfPaging = true
        }
        this.isLoading = false
      },
    },
    async asyncData({ app }) {
      let limit = 10,
        data = await app.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            limit,
          }
        }),
        isEndOfPaging = false
      data = data.data || []
      if (data.length < limit) {
        isEndOfPaging = true
      }
      return {
        data,
        isEndOfPaging,
        page: 1,
        limit,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/event`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.list-event-enter-active {
  transition: opacity 0.8s ease;
}
.list-event-leave-active {
  transition: opacity 0.8s ease;
}
.list-event-enter-to {
  opacity: 1;
}
.list-event-enter {
  opacity: 0;
}
.list-event-leave {
  opacity: 0;
}
.list-event-leave-to {
  opacity: 1;
}
</style>
