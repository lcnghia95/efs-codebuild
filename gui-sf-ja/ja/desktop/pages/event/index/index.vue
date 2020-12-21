<template>
  <div class="w-1000 pos-rel event-index">
    <div class="header mb-20">
      <div class="header-container pt-25">
        <h2 class="header-msg mt-25 mb-0 text-center"><b>{{ $t('2') }}</b></h2>
        <table class="table-full text-center-margin">
          <tbody>
            <tr>
              <td class="w-160">
                <input type="date" v-model="dateFrom" class="shadow border-radius-10" />
              </td>
              <td class="w-40 text-center">
                <svg class="mt-10" width="25px" height="13px">
                  <filter id="blur-filter" width="150%" height="150%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="2" dy="2" result="offsetblur" />
                  </filter>
                  <path class="svg-shadow" fill="rgba(0, 0, 0, .3)" d="M22 0c0 2.9-.6 5.1-1.7 6.6C19.2 8.2 17.6 9 15.6 9c-.9 0-1.7-.1-2.4-.4-.6-.3-1.2-.6-1.8-1.1-.5-.5-1.5-1.5-3-3.2-.7-.6-1.3-.9-1.9-.9-.9 0-1.6.4-2 1.1-.5.8-.7 2.3-.8 4.5H0c0-2.8.5-5.1 1.7-6.6S4.3 0 6.4 0c.9 0 1.8.2 2.6.5s1.8 1.1 2.9 2.3l1.6 1.7c.3.3.6.6 1 .8s.7.3 1 .3c.9 0 1.6-.4 2-1.1.5-.8.7-2.3.8-4.5H22z" />
                  <path fill="#FFF" d="M22 0c0 2.9-.6 5.1-1.7 6.6C19.2 8.2 17.6 9 15.6 9c-.9 0-1.7-.1-2.4-.4-.6-.3-1.2-.6-1.8-1.1-.5-.5-1.5-1.5-3-3.2-.7-.6-1.3-.9-1.9-.9-.9 0-1.6.4-2 1.1-.5.8-.7 2.3-.8 4.5H0c0-2.8.5-5.1 1.7-6.6S4.3 0 6.4 0c.9 0 1.8.2 2.6.5s1.8 1.1 2.9 2.3l1.6 1.7c.3.3.6.6 1 .8s.7.3 1 .3c.9 0 1.6-.4 2-1.1.5-.8.7-2.3.8-4.5H22z" />
                </svg>
              </td>
              <td class="w-160">
                <input type="date" v-model="dateTo" class="shadow border-radius-10" />
              </td>
              <td class="w-40 text-center">
                <svg width="22px" height="27px">
                  <path class="svg-shadow" fill="rgba(0, 0, 0, .3)" d="M18 9.1l-2.5-2.5L9 13.2 2.5 6.6 0 9.1l6.5 6.5L0 22.2l2.5 2.4L9 18.1l6.5 6.5 2.5-2.4-6.5-6.6z" />
                  <path fill="#FFF" d="M18 9.1l-2.5-2.5L9 13.2 2.5 6.6 0 9.1l6.5 6.5L0 22.2l2.5 2.4L9 18.1l6.5 6.5 2.5-2.4-6.5-6.6z" />
                </svg>
              </td>
              <td class="events-cls">
                <div class="cate-group shadow flex flex-wrap w-full p-10">
                  <a class="mr-5 event-item" v-for="(item,id) in events" @click="onSelectCate(id)" :key="'categories-' + id">
                    <span class="badge co-black border-all wrap-text cursor-pointer" :class="{ 'selected': item.selected }">{{ item.text }}</span>
                  </a>
                </div>
              </td>
              <td>
                <input class="form-control shadow w-100 text-center-margin keywords" v-model="search" :placeholder="$t('4')" />
              </td>
              <td class="w-50 text-right">
                <button type="button" class="btn co-white" @click="onSearch">{{ $t('3') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <img :src="'/img/assets/pc/events/UI_06.png'" alt="" />
    </div>
    <region v-for="(region,index) in data.data" :categories="$t('categories')" :region="region" :key="'regionedx'+index" />
    <div class="flex center">
      <paging :cur-page="data.currentPage"
              :total="data.lastPage"
              :from="data.pagingFrom"
              :to="data.pagingTo"
              :has-scroll="true"
              theme-class="theme1"
              @pagingclick="onPagingClick" class="mt-15"
      />
    </div>
    <div class="map-title mt-40">{{ $t('5') }}</div>
    <JPMap :event-count="eventCount" :chart="[]" @region-click="onRegionClick" @medium-click="onMediumClick" class="mt-20" />
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/event-index.json'
import JPMap from '@/components/event/JPMap.vue'
import region from '@/components/event/region.vue'
import Paging from '@@/../components/paging/Paging.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'

const obj = Object.assign(
  {
    components: {
      JPMap,
      region,
      Paging,
      GogoModal,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        events: Object.keys(this.$t('categories')).reduce((result, value) => {
          result[value] = {
            text: this.$t('categories')[value],
            selected: false,
          }
          return result
        }, {}),
        dateFrom: null,
        dateTo: null,
        search: null,
        isShowModal: false,
      }
    },
    computed: {
      categoriesQuery() {
        return Object.keys(this.events).filter(key => {
          return this.events[key].selected === true
        })
      },
    },
    methods: {
      getEventCount() {
        this.GoGoHTTP.get(`/api/v3/surface/event/counts`).then(data => {
          this.eventCount = data || {}
        })
      },
      setData(data) {
        this.regions = data.data || []
        this.curPage = data.currentPage
        this.total = data.lastPage
        this.from = data.pagingFrom
        this.to = data.pagingTo
      },
      onGetRegions(page) {
        this.GoGoHTTP.get(`/api/v3/surface/event?page=${page}`, {
          sfLoading: true,
        }).then(data => {
          this.setData(data)
        })
      },
      onSearch() {
        location.href = `/event/search${
          this.dateFrom ? `/from/${this.dateFrom}` : ''
        }${this.dateTo ? `/to/${this.dateTo}` : ''}
        ${this.categoriesQuery.length ? `/cat/${this.categoriesQuery}` : ''}${
          this.search ? `?w=${encodeURIComponent(this.search)}` : ''
        }`
      },
      onSelectCate(id) {
        this.events[id].selected = !this.events[id].selected
      },
      onMediumClick(id, regionId) {
        location.href = `/event/area/${regionId}/${id}`
      },
      onRegionClick(id) {
        location.href = '/event/area/' + id
      },
      async onPagingClick(_page) {
        location.href = `/event/p/${_page}`
      },
      descriptionTemplate() {
        return this.$t('25')
      },
    },
    async asyncData({ app, params }) {
      let [data, eventCount] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/event?page=${params.p || 1}`),
        app.GoGoHTTP.get('/api/v3/surface/event/counts'),
      ])

      return {
        data,
        eventCount,
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
.event-index {
  .header {
    position: relative;
    height: 350px;
    z-index: 1;
    img {
      position: absolute;
      top: 0;
      width: 100%;
      height: 350px;
      z-index: -1;
    }
    & + p {
      margin-left: 100px;
    }
    .header-container {
      height: 350px;
      opacity: 0.9;
      .header-msg {
        color: white;
      }
      .common-input {
        height: 50px !important;
      }
      /deep/ {
        input {
          @extend .common-input;
          border: none;
        }
        .gg-datetime-picker {
          margin-top: 0;
          margin-bottom: 0;
          width: 160px;
          &:hover,
          &:focus {
            input,
            .input-group-addon {
              background: #f9e2bf;
            }
          }
          input {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          span {
            background: #fff;
            opacity: 0.9;
            border: none;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }
      }
      button {
        @extend .common-input;
        background: #52b800;
      }
    }
  }
  .map-title {
    font-size: 16px;
    font-weight: bold;
  }
}
table {
  height: 260px;
  width: 90%;
  .svg-shadow {
    filter: url(#blur-filter);
  }
}
.table-full {
  .keywords {
    &:hover,
    &:focus {
      background: #f9e2bf;
    }
  }
  .w-40 {
    width: 40px;
  }
  .w-100 {
    width: 100px;
  }
  .w-160 {
    width: 160px;
  }
  .border-radius-10 {
    border-radius: 10px;
  }
}
.text-center-margin {
  margin: 0 auto;
}
.events-cls {
  width: 325px;
  &,
  div {
    min-width: 325px;
  }
  div {
    background: #fff;
    border-radius: 5px;
  }
  .event-item {
    display: inline-block;
    flex-grow: 1;
    width: calc(100% * (1 / 3) - 10px - 1px);
  }
  .badge {
    margin: 2px 0;
    background: white;
    color: #777;
    font-weight: normal;
    width: 100px;
    &:hover,
    &.selected {
      background: #7e7e7e;
      color: white;
    }
  }
}
</style>
