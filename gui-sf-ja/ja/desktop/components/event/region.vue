<template>
  <div class="region-list-a mb-10 p-15">
    <div class="flex mid space-between">
      <div class="region-title wrap-text" :title="region.title || 'Title'">{{ region.title || 'Title' }}</div>
      <i :title="$t('24')" class="cursor-pointer" :is="region.like ? 'Star' : 'StarO'" :class="{'star-like': region.like}" @click.native="onClickFav"/>
    </div>
    <p class="mt-5">{{ region.outline }}</p>
    <ul class="region-list-detail p-0 mb-0 flex flex-wrap">
      <li><p class="mb-5 pr-10 flex mid"><CalendarAlt class="table-middle" /><span v-html="region.date"/></p></li>
      <li><p class="mb-5 flex"><Tags class="mr-5 table-middle"/><span class="mr-10" v-for="(category,i) in region.categories" :key="i">{{ categories[category] }} &nbsp;</span></p></li>
      <li>
        <p class="mb-0 pr-10 flex mid">
          <MapMarker class="mr-5 table-middle"/>
          <span class="wrap-text" :title="evtLocation">{{ evtLocation }}</span>
        </p>
      </li>
      <li>
        <p class="mb-0 flex mid">
          <span><b class="mr-5">￥</b></span>
          <span v-if="region.price">{{ formatNumber(region.price) }}{{ $t('14') }}</span>
          <span v-else>{{ $t('15') }}</span>
        </p>
      </li>
    </ul>
    <a :href="'/event/' + region.id" class="btn-detail pl-20 pr-10 cursor-pointer flex mid space-between">
      <span>{{ $t('21') }}</span>
      <AngleRight class="table-middle"/>
    </a>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/event-index.json'
import Star from '@@/../components/icons/Star.vue'
import StarO from '@@/../components/icons/StarO.vue'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Tags from '@@/../components/icons/Tags.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import MapMarker from '@@/../components/icons/MapMarker.vue'
import { gotoLogin } from '@/utils/client/common'

export default {
  components: {
    Star,
    StarO,
    CalendarAlt,
    Tags,
    AngleRight,
    MapMarker,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    categories: {
      type: Object,
      default() {
        return {}
      },
    },
    region: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    evtLocation() {
      return this.region.location.replace(/<(.|\n)*?>/g, '')
    },
  },
  methods: {
    onClickFav() {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let url =
        `/api/v3/surface/favorite/` +
        this.region.pId +
        (this.region.like ? '/remove' : '')
      this.GoGoHTTP.post(url).then(
        this.$set(this.region, 'like', this.region.like ? 0 : 1)
      )
    },
  },
}
</script>


<style lang="scss" scoped>
.region-list-a {
  position: relative;
  border-radius: 5px;
  border: 4px solid #eee;
  &:hover {
    border: 4px solid #d9d9d9;
  }
  .region-title {
    width: 90%;
    flex: 0 0 90%;
    font-size: 16px;
    font-weight: bold;
    color: #ff7d00;
  }
  .star-like {
    color: #fff462;
  }
  ul.region-list-detail {
    list-style: none;
    li {
      display: inline-block;
      &:nth-child(odd) {
        width: 58%;
      }
      &:nth-child(even) {
        width: 40%;
      }
      p {
        i {
          min-width: 18px;
          font-size: 18px;
        }
        span {
          display: block;
        }
      }
      b {
        font-size: 16px;
        padding: 0 2.5px;
      }
    }
    .table-middle {
      width: 22px;
      flex: 0 0 22px;
      height: 22px;
    }
  }
  .btn-detail {
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 18px;
    background: #777;
    text-decoration: none;
    border-radius: 15px;
    color: white;
    .icon-cls {
      width: 24px;
      height: 24px;
    }
    &:hover {
      background: #ff7d00;
      color: white;
    }
  }
}
</style>
