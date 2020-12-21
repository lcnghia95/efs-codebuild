<template>
  <div class="jp-map pos-rel text-center">
    <img class="map-img block" :src="'/img/assets/pc/events/jpmap.png'" alt="">
    <div v-for="item in regions" class="region border-radius-5 pos-abs fs-16"
         :style="calRegionPosition(item)" :key="'region-' + item.id">
      <span class="cursor-pointer" :class="{ 'active-region': checkActive(item) }" @click="onAreaClick('region', item.id)">{{ $t('large-areas.' + item.id) }}</span>
      <div class="flex flex-wrap">
        <div v-for="medium in item.mediums" :key="'region-medium-' + mediums[medium].id">
          <a @click="onAreaClick('medium',medium, item.id)"
             v-if="$t('medium-areas.' + mediums[medium].id) != $t('large-areas.' + item.id) && eventCount[medium]" class="ml-5 mr-5 sub-name cursor-pointer">
            {{ $t('medium-areas.' + mediums[medium].id) }}
          </a>
          <span class="ml-5 mr-5 sub-name1" v-if="$t('medium-areas.' + mediums[medium].id) != $t('large-areas.' + item.id) && !eventCount[medium]">{{ $t('medium-areas.' + mediums[medium].id) }}</span>
        </div>
      </div>
    </div>
    <div class="svg-wrap">
      <svg width="100%" height="100%">
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <template v-for="item in regions">
          <polyline fill="none" stroke="#A1A1A1" :points="item.lines.join(' ')" :key="'polyline-' + item.id"/>
          <circle fill="#AAA" :cx="item.lines[item.lines.length - 1][0]" :cy="item.lines[item.lines.length - 1][1]" r="4" :key="'circle-' + item.id"/>
        </template>
      </svg>
    </div>
  </div>
</template>

<script>
import regions from '@/js/event/large-areas.js'
import mediums from '@/js/event/medium-areas.js'
import i18n from '@@/lang/components-desktop/event-jpmap.json'
export default {
  props: {
    eventCount: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      mediums,
      regions,
    }
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onAreaClick(type, id, regionId) {
      if (type === 'medium' && this.eventCount[id]) {
        this.$emit(`${type}-click`, id, regionId)
      }
      if (type === 'region') {
        let _region = this.regions.filter(item => item.id === id)[0],
          sum = _region.mediums.reduce((result, value) => {
            result += this.eventCount[value] || 0
            return result
          }, 0)
        sum && this.$emit(`${type}-click`, id, regionId)
      }
    },
    calRegionPosition(item) {
      let point = item.lines[0],
        pos = item.pos,
        style = item.style || {}
      return Object.assign(style, {
        left: point[0] - pos.left + 'px',
        top: point[1] - pos.top + 'px',
      })
    },
    checkActive(item) {
      return item.mediums.length <= 1 && this.eventCount[item.mediums[0]]
    },
  },
}
</script>

<style lang="scss" scoped>
.map-img {
  margin: auto;
}
.jp-map {
  height: 470px;
  .sub-name {
    font-size: 14px;
    color: #39c;
    text-decoration: underline;
    display: inline-block;
  }
  .sub-name1 {
    font-size: 14px;
    color: #c5c5c5;
    text-decoration: underline;
    display: inline-block;
  }
}
.svg-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.region {
  // width: 80px;
  // height: 34px;
  padding: 5px 10px;
  max-width: 220px;
  text-align: center;
  background: #f9f7f7;
  border: 2px solid #c5c5c5;
  z-index: 2;
  // &:hover {
  //   border: 2px solid #7e7e7e;
  //   background: #7e7e7e;
  //   color: white;
  // }
}
.active-region {
  color: #1fc56c;
}
</style>
