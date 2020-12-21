<template>
  <div class="w-full">
    <div class="area-header" @click="handleBack">
      {{ (currentItem || {}).name || $t(6) }}
    </div>
    <div style="min-height: 420px;">
      <transition-group name="area-item" class="flex flex-wrap">
        <div class="area-item flex space-between mid"
             :class="{ disabled: !isHaveEvent(item) }"
             v-for="(item, index) in dataShow"
             :key="index + mode"
             @click="itemClick(item)"
        >
          {{ item.name }}
          <AngleRight />
        </div>
      </transition-group>
    </div>
    <div @click="$emit('back')" class="back-btn">{{ $t(10) }}</div>
  </div>
</template>

<script>
import AngleRight from '@@/../components/icons/AngleRight.vue'
import i18n from '@@/lang/components-mobile/event-condition-search.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    AngleRight,
  },
  props: {
    eventCount: {
      type: Object,
      default() { 
        return {}
      },
    }
  },
  data() {
    return {
      currentItem: null,
      mode: 'large',
      mapData: {
        1: [1],
        2: [2, 3, 4, 5, 6, 7],
        3: [17, 18, 23],
        4: [8, 9, 10, 11, 12, 13, 14],
        5: [21, 22, 24],
        6: [15, 19, 20, 16],
        7: [25, 26, 27, 28, 29, 30],
        8: [31, 32, 33, 34, 35],
        9: [36, 37, 38, 39],
        10: [40, 41, 42, 43, 44, 45, 46],
        11: [47],
      }
    }
  },
  computed: {
    dataShow() {
      let larges = this.$t('large-areas'),
        mediums = this.$t('medium-areas')
      if(this.mode === 'large') {
        return Object.keys(larges).map(key => ({
          id: key,
          name: larges[key],
          mediums: this.mapData[key].map(item => ({name: mediums[item], id: item}) )
        }))
      }
      else {
        return this.currentItem.mediums
      }
    },
  },
  methods: {
    itemClick(item) {
      if(!this.isHaveEvent(item)) {
        return
      }
      if(this.mode === 'large') {
        this.mode = 'medium'
        this.currentItem = item
        return
      }
      // searching
      this.$emit('onSearch', { large: this.currentItem.id, small: item.id })
    },
    handleBack() {
      if(this.mode === 'large') {
        return
      }
      this.mode = 'large'
      this.currentItem = null
    },
    isHaveEvent(item) { // item is large area(region) or small area
      let flags = false
      if(this.mode == 'large') { // item is large area
        item.mediums.forEach(small => {
          if(this.eventCount[small.id]) {
            flags = true
          }
        })
        return flags
      }
      // item is small area
      return !!this.eventCount[item.id]
    }
  }
}
</script>

<style lang="scss" scoped>
.area-header {
  height: 50px;
  padding: 10px;
  background: #f0f0f0;
  font-weight: bold;
  line-height: 32px;
  font-size: 16px;
  color: #2d2d2d;
}
.area-item {
  height: 70px;
  border-bottom: 1px solid #bdbdbd;
  width: 50%;
  line-height: 50px;
  padding: 10px;
  color: #2d2d2d;
  .icon-cls {
    width: 20px;
    height: 20px;
    color: #ff8400;
  }
  &.disabled {
    color: #b2b2b2;
    .icon-cls {
      color: #d9d9d9;
    }
  }
  &:nth-child(odd) {
    border-right: 1px solid #bdbdbd;
  }
}
.back-btn {
  height: 60px;
  border-bottom: 1px solid #bdbdbd;
  text-align: center;
  line-height: 60px;
  font-size: 18px;
}
.area-item-enter-active {
  transition: opacity 0.8s ease;
}
.area-item-leave-active {
  transition: opacity 0.8s ease;
}
.area-item-enter-to {
  opacity: 1;
}
.area-item-enter {
  opacity: 0;
}
.area-item-leave {
  opacity: 0;
}
.area-item-leave-to {
  opacity: 1;
}
</style>