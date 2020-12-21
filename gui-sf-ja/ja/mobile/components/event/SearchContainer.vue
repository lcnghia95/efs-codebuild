<template>
  <div class="pos-rel" style="transition: all 0.2s;" :style="{'min-height': mMode ? '630px' : '275px' }">
    <transition-group
      name="container" 
    >
      <div class="top-header" v-if="!mMode" key="c1">
        <div class="top-header-title">{{ $t(1) }}</div>
        <div class="top-header-img"></div>
        <div class="top-header-search">
          <div class="top-header-search-btn mb-10" @click="modeChanged('condition')">
            {{ $t(2) }}
          </div>
          <div class="top-header-search-btn mb-20" @click="modeChanged('area')">
            {{ $t(3) }}
          </div>
        </div>
      </div>
      <div key="c2" v-else style="min-height: 630px; overflow-x: hidden;" class="pos-rel w-full">
        <div style="background: #ff8400;">
          <div class="condition-header">{{ mMode == 'area' ? $t(3) : $t(1) }}</div>
        </div>
        <transition name="search-condition">
          <ConditionSearch v-if="mMode === 'condition'"
                           :selected-condition="selectedCondition"
                           @back="mMode = 'area'"
                           @onSearch="obj=>$emit('onConditionSearch', obj)"
          />
        </transition>
        <transition name="search-area">
          <AreaSearch v-if="mMode === 'area'"
                      :event-count="eventCount"
                      @back="mMode = 'condition'" 
                      @onSearch="obj=>$emit('onAreaSearch', obj)"
          />
        </transition>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ConditionSearch from '@/components/event/ConditionSearch.vue'
import AreaSearch from '@/components/event/AreaSearch.vue'
import i18n from '@@/lang/components-mobile/event-search-container.json'

export default {
  model: {
    props: 'mode',
    event: 'modeChanged'
  },
  i18n: {
    messages: i18n,
  },
  components: {
    ConditionSearch,
    AreaSearch,
  },
  props: {
    mode: {
      type: [String, Object],
      default: null,
      validator: function(value) {
        return ['condition', 'area', null].includes(value)
      },
    },
    selectedCondition: {
      type: Object,
      default() { return {} },
    },
  },
  mounted() {
    this.GoGoHTTP.get(`/api/v3/surface/event/counts`).then(data => {
      this.eventCount = data || {}
    })
  },
  data() {
    return {
      mMode: this.mode,
      eventCount: {},
    }
  },
  methods: {
    modeChanged(mode) {
      this.mMode = mode
      this.$emit('modeChanged', mode)
    },
  },
}
</script>

<style lang="scss" scoped>
.top-header {
  background: #ff8400;
  .top-header-title {
    text-align: center;
    color: #fff;
    font-size: 23px;
    font-weight: bold;
    padding: 10px;
  }
  .top-header-img {
    background-repeat: no-repeat;
    background-image: url(/img/assets/mobile/event/UI_01.png);
    background-size: 100%;
    height: 100px;
    width: 270px;
    margin-bottom: -20px;
    margin-left: auto;
    margin-right: auto;
  }
  .top-header-search {
    padding: 10px;
    .top-header-search-btn {
      height: 45px;
      background: #fff;
      color: #ff8400;
      text-align: center;
      line-height: 44px;
      border-radius: 5px;
      font-size: 18px;
      font-weight: bold;
      box-shadow: inset 0 -3px 5px 0 #dcdcdc;
      border: 2px solid #c5c5c5;
      transition: 0.3s;
      position: relative;
      &:active {
        box-shadow: inset 0 -3px 25px 0 #272727;
      }
      &::after {
        content: '>';
        position: absolute;
        right: 10px;
        top: 0;
        transform: scale(0.5, 1);
        font-weight: bold;
      }
    }
  }
}
.condition-header {
  height: 100px;
  background-image: url(/img/assets/mobile/event/UI_02.png);
  background-size: 100% 100px;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 100px;
  font-size: 25px;
  color: #fff;
  font-weight: bold;
}
// css for vue transiton
//
.search-area-enter-active {
  transition: opacity 0.2s ease;
  transition: left 0.2s ease;
  transition-delay: 0.1s;
}
.search-area-leave-active {
  transition: opacity 0.2s ease;
  transition: left 0.2s ease;
}
.search-area-enter-to {
  position: absolute;
  left: 0;
  opacity: 1;
}
.search-area-enter {
  position: absolute;
  left: -100%;
  opacity: 0;
}
.search-area-leave {
  position: absolute;
  left: 0;
  opacity: 0;
}
.search-area-leave-to {
  position: absolute;
  left: -100%;
  opacity: 1;
}
//
.search-condition-enter-active {
  transition: opacity 0.2s ease;
  transition: right 0.2s ease;
  transition-delay: 0.1s;
}
.search-condition-leave-active {
  transition: opacity 0.2s ease;
  transition: right 0.2s ease;
}
.search-condition-enter-to {
  position: absolute;
  right: 0;
  opacity: 1;
}
.search-condition-enter {
  position: absolute;
  right: -100%;
  opacity: 0;
}
.search-condition-leave {
  position: absolute;
  right: 0;
  opacity: 0;
}
.search-condition-leave-to {
  position: absolute;
  right: -100%;
  opacity: 1;
}
//
.container-enter-active {
  transition: opacity 0.2s ease;
  transition-delay: 0.3s;
}
.container-leave-active {
  transition: opacity 0.4s ease;
}
.container-enter-to {
  position: absolute;
  top: 0;
  opacity: 1;
}
.container-enter {
  position: absolute;
  top: 0;
  opacity: 0;
}
.container-leave {
  opacity: 1;
}
.container-leave-to {
  opacity: 0;
}
</style>
