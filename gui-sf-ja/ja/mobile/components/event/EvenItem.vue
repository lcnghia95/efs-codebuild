<template>
  <div class="event-item">
    <div class="item-header flex space-between mid">
      <div style="max-width: 80%; font-weight: bold;" class="wrap-text">{{ item.title }}</div>
      <div class="center flex item-header-icon mid"
           @click="onClickFav"
           :class="{'is-fav': item.like}"
      >
        <Star />
      </div>
    </div>
    <div class="p-15 item-content">
      <div class="content pb-10" style="height: 75px; overflow: hidden;" v-wrap-lines="3">{{ item.outline }}</div>
      <div class="pt-10">
        <div class="flex item-content-row">
          <CalendarAlt /><div v-html="item.date"></div>
        </div>
        <div class="flex item-content-row">
          <Tags />
          <div class="flex flex-wrap">
            <div class="mr-10" v-for="s in item.categories.map(i => $t('categories')[i])" :key="s">{{ s }}</div>
          </div>
        </div>
        <div class="flex item-content-row">
          <MapMarker />
          <div v-wrap-lines="3">{{ evtLocation }}</div>
        </div>
        <div class="flex item-content-row">
          <div class="jp-coin">￥</div>
          <div v-if="item.price">{{ formatNumber(item.price) }}{{ $t(1) }}</div>
          <span v-else>{{ $t(3) }}</span>
        </div>
        <div class="flex row-reverse mt-10">
          <a :href="'/event/' + item.id" class="item-content-link">{{ $t(2) }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Tags from '@@/../components/icons/Tags.vue'
import MapMarker from '@@/../components/icons/MapMarker.vue'
import Star from '@@/../components/icons/Star.vue'
import i18n from '@@/lang/components-mobile/event-condition-search.json'
import { gotoLogin } from '@/utils/client/common'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    CalendarAlt,
    Tags,
    MapMarker,
    Star,
  },
  computed: {
    evtLocation() {
      return this.item.location.replace(/<(.|\n)*?>/g, '')
    },
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    }
  },
  methods: {
    onClickFav() {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let url =
        `/api/v3/surface/favorite/` +
        this.item.pId +
        (this.item.like ? '/remove' : '')
      this.GoGoHTTP.post(url).then(
        this.$set(this.item, 'like', this.item.like ? 0 : 1)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.event-item {
  box-shadow: 0 1px 5px #c6c6c6;
  border-radius: 5px;
}
.item-header {
  height: 50px;
  padding: 0 10px;
  line-height: 50px;
  color: #fff;
  background: #ff8400;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  .item-header-icon {
    height: 30px;
    width: 30px;
    background: #fff;
    border-radius: 5px;
    .icon-cls {
      color: #d0d0d0;
      width: 23px;
      height: 23px;
    }
    &.is-fav .icon-cls {
      color: #f6cb00;
    }
  }
}
.item-content {
  border: 1px solid #d9d9d9;
  border-top-color: #ff8400;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  .content {
    border-bottom: 1px solid #d9d9d9;
  }
  .item-content-row {
    margin-bottom: 3px;
    .icon-cls {
      width: 22px;
      height: 22px;
      color: #ff8400;
      /deep/ svg {
        width: 22px;
        margin-top: -2px;
      }
    }
    .jp-coin {
      width: 22px;
      flex: 0 0 22px;
      text-align: center;
      color: #ff8400;
      font-weight: bold;
      font-size: 18px;
      margin-top: -2px;
    }
  }
  .item-content-link {
    min-width: 125px;
    height: 28px;
    text-align: center;
    line-height: 25px;
    border-radius: 15px;
    font-size: 15px;
    background: #fff;
    color: #ff8400;
    border: 2px solid #ff8400;
    padding: 0 15px;
    font-weight: bold;
    text-decoration: none;
    &:active {
      background: #ff8400;
      color: #fff;
    }
  }
}
</style>
