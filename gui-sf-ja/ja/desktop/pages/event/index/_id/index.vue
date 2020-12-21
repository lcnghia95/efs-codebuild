<template>
  <div class="w-1000 flex layout-col grow1 mb-20 pb-40">
    <a class="header no-underlying" href="/event">
      <img src="/img/assets/pc/events/UI_07.png" alt="" />
      <h2 class="mt-0 mb-0 co-white text-center">
        <b>{{ $t('6') }}</b>
      </h2>
    </a>
    <div class="event-detail-show">
      <p class="fs-16 mt-20 mb-10">{{ $t('9') }}</p>
      <table v-if="Object.keys(event).length" class="detail-show">
        <tbody>
          <tr>
            <th colspan="2" class="text-center">
              <h3 class="flex mid">
                <b>{{ event.title }}</b>
                <i
                  :title="$t('24')"
                  class="cursor-pointer"
                  :is="event.like ? 'Star' : 'StarO'"
                  :class="{ 'star-like': event.like }"
                  @click.native="onClickFav"
                />
              </h3>
            </th>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <CalendarAlt /><b class="fs-16 ml-20">{{ $t('10') }}</b>
              </div>
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50" v-html="event.date"></td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <Tags /><b class="fs-16 ml-20">{{ $t('11') }}</b>
              </div>
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50">
              <span
                class="m-r-10"
                v-for="(category, i) in event.categories"
                :key="i"
              >
                {{ $t('categories.' + category) }} &nbsp;
              </span>
            </td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <MapMarker /><b class="fs-16 ml-20">{{ $t('12') }}</b>
              </div>
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50" v-html="event.location"></td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <!-- eslint-disable -->
              <div class="flex mid">
                <b class="fs-20 ml-5">￥</b><b class="fs-16 ml-20">{{ $t('13') }}</b>
              </div>
              <!-- eslint-enable -->
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50" v-if="event.price">
              {{ formatNumber(event.price) }}{{ $t('14') }}
            </td>
            <td class="pt-10 pb-10 pl-50 pr-50" v-else>{{ $t('15') }}</td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <HourGlass /><b class="fs-16 ml-20">{{ $t('16') }}</b>
              </div>
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50">
              {{ event.times || 0 }}{{ $t('17') }}
            </td>
          </tr>
          <tr v-if="event.limit">
            <th class="bdr-none p-25">
              <div class="flex mid">
                <Groups /><b class="fs-16 ml-20">{{ $t('18') }}</b>
              </div>
            </th>
            <td class="pt-40 pb-40 pl-50 pr-50">
              {{ event.limit || 0 }}{{ $t('19') }}
            </td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <File /><b class="fs-16 ml-20">{{ $t('20') }}</b>
              </div>
            </th>
            <td class="pt-10 pb-10 pl-50 pr-50" v-html="event.outline"></td>
          </tr>
          <tr>
            <th class="bdr-none p-25">
              <div class="flex mid">
                <Search /><b class="fs-16 ml-20">{{ $t('21') }}</b>
              </div>
            </th>
            <td class="pt-40 pb-40 pl-50 pr-50" v-html="event.content"></td>
          </tr>
        </tbody>
      </table>
      <a
        v-if="Object.keys(event).length && event.status === 1"
        @click="onAddEvent"
        class="cursor-pointer btn-apply co-white text-center border-radius-5"
      >
        {{ $t('22') }}
      </a>
      <div
        v-if="event.status === 2"
        class="cursor-pointer btn-pre-apply co-white text-center border-radius-5"
      >
        {{ $t('23') }}
      </div>
      <div
        v-if="event.status === 9"
        class="cursor-pointer btn-pre-apply disabled co-white text-center border-radius-5"
      >
        {{ $t('29') }}
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/event-index.json'
import title from '@@/../common/pages'
import { gotoLogin, filterInt } from '@/utils/client/common'
import Star from '@@/../components/icons/Star.vue'
import StarO from '@@/../components/icons/StarO.vue'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Tags from '@@/../components/icons/Tags.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import MapMarker from '@@/../components/icons/MapMarker.vue'
import File from '@@/../components/icons/File.vue'
import Search from '@@/../components/icons/Search.vue'
import Groups from '@@/../components/icons/Groups.vue'
import HourGlass from '@@/../components/icons/HourGlass.vue'
import {trackingEventView} from '@@/../common/js/ga/ecom-enhance'

let replaceLinkUrl = function(content = '') {
  /* eslint-disable */
  let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm,
    imgEtx = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|svg)/g
  /* eslint-enable */
  content = content.slice().replace(regex, function(match) {
    if (imgEtx.test(match) || match.includes('img.gogojungle.co.jp')) {
      return match
    }
    return `<a href="${match}" target="_blank" class="cursor-pointer">${match}</a>`
  })
  return content
}
const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      Star,
      StarO,
      CalendarAlt,
      Tags,
      AngleRight,
      MapMarker,
      File,
      Search,
      Groups,
      HourGlass,
    },
    mounted() {
      window.productId = this.event.pId
      trackingEventView(this.event)
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        event: {},
        cartProcesssing: false,
      }
    },
    async asyncData({ app, params, store, error }) {
      let event = await app.GoGoHTTP.get(`/api/v3/surface/event/${params.id}`)
      if (!event || !Object.keys(event).length) {
        return error({ statusCode: 404 })
      }
      event.location = replaceLinkUrl(event.location)
      event.outline = replaceLinkUrl(event.outline)
      store.commit('pushBC', {
        name: event.title,
        path: `/event/${params.id}`,
      })
      const category = (event.categories || []).sort((a, b) => {
        return a - b
      })[0] || undefined
      store.commit('cart/setInfo', {
        info: {
          price: event.price,
          productId: event.pId,
          isFavorite: event.like,
          name: event.title,
          devId: event.devId,
          category,
          type: 19,
        },
      })
      return {
        event,
        titleChunk: event.title,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/event/${params.id}`,
          },
        ],
      }
    },
    methods: {
      onClickFav() {
        if (!this.$store.state.user.id) {
          gotoLogin(`u=${location.pathname}`)
          return
        }
        let url =
          `/api/v3/surface/favorite/${this.event.pId}` +
          (this.event.like ? '/remove' : '')
        this.GoGoHTTP.post(url)
          .then(this.$set(this.event, 'like', this.event.like ? 0 : 1))
          .catch(error => {
            console.log(error)
          })
      },
      onAddEvent() {
        if (this.cartProcesssing) {
          return
        }
        this.cartProcesssing = true
        this.$store.dispatch('cart/addToCart', {
          productId: this.event.pId,
        })
      },
      descriptionTemplate() {
        return this.event.outline ? this.event.outline.substr(0, 300) : ''
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
$header-height: 180px;
.header {
  position: relative;
  height: $header-height;
  z-index: 1;
  h2 {
    height: $header-height;
    line-height: $header-height;
  }
  img {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
}
.fs-16 {
  font-size: 16px;
}
.fs-20 {
  font-size: 20px;
}
.co-white {
  color: white;
}
.border-radius-5 {
  border-radius: 5px;
}
.star-like {
  color: #fff462;
}
.event-detail-show {
  width: 800px;
  margin: 0 auto;
  table,
  tr,
  th,
  td {
    border: 4px solid #eee;
  }
  th {
    .icon-cls {
      width: 26px;
      height: 26px;
    }
    &.bdr-none {
      border: none;
    }
  }
  table.detail-show {
    width: 100%;
    h3 {
      position: relative;
      font-size: 20px;
      line-height: 28px;
      padding: 40px 80px;
      .icon-cls {
        position: absolute;
        top: 0;
        right: 30px;
        font-size: 30px;
      }
    }
    tr {
      height: 80px;
    }
    th {
      background: #f9f7f7;
      i {
        min-width: 24px;
        font-size: 24px;
      }
    }
    td {
      max-width: 500px;
      /deep/ img {
        width: 100%;
      }
      /deep/ iframe {
        width: 100%;
      }
    }
  }
  .btn-apply {
    display: block;
    width: 400px;
    height: 60px;
    line-height: 65px;
    margin: 45px auto;
    background: #ff7d00;
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: none;
      color: White;
      opacity: 0.9;
    }
  }
  .btn-pre-apply {
    display: block;
    width: 400px;
    height: 60px;
    line-height: 65px;
    margin: 45px auto;
    background: #7e7e7e;
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: none;
      color: white;
      opacity: 0.9;
    }
    &.disabled {
      pointer-events: none;
      background: #707070;
    }
  }
}
</style>
