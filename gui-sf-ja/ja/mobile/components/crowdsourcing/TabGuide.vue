<template>
  <div class="mb-50">
    <div class="guide-header">{{ $t(4) }}</div>
    <div class="tab-guide flex space-around ctn mt-40">
      <div class="guide guide-1 flex layout-col mid text-center" @click="onTabChange('guide1')" :class="{ active: mCurrentTab === 'guide1' }">
        <HandShake fill-co="#fff" />
        {{ $t(1) }}
      </div>
      <div class="guide guide-2 flex layout-col mid text-center" @click="onTabChange('guide2')" :class="{ active: mCurrentTab === 'guide2' }">
        <PaperPlane />
        {{ $t(2) }}
      </div>
      <div class="guide guide-3 flex layout-col mid text-center" @click="onTabChange('guide3')" :class="{ active: mCurrentTab === 'guide3' }">
        <Cogs />
        {{ $t(3) }}
      </div>
      <span class="line"></span>
    </div>
    <transition-group name="guides" class="mt-5 pos-rel w-full" style="display: block; min-height: 100vh; overflow-x: hidden;">
      <Guide1 key="guide-1" style="width: 100vw;" v-if="mCurrentTab === 'guide1'" />
      <Guide2 key="guide-2" style="width: 100vw;" v-if="mCurrentTab === 'guide2'" />
      <Guide3 key="guide-3" style="width: 100vw;" v-if="mCurrentTab === 'guide3'" />
    </transition-group>
  </div>
</template>

<script>
import HandShake from '@@/../components/icons/HandShake.vue'
import PaperPlane from '@@/../components/icons/PaperPlane.vue'
import Cogs from '@@/../components/icons/Cogs.vue'
import Guide1 from '@/components/crowdsourcing/guide/Guide1.vue'
import Guide2 from '@/components/crowdsourcing/guide/Guide2.vue'
import Guide3 from '@/components/crowdsourcing/guide/Guide3.vue'
import i18n from '@@/lang/components-mobile/crowdsourcing-tab-guide.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    HandShake,
    PaperPlane,
    Cogs,
    Guide1,
    Guide2,
    Guide3,
  },
  props: {
    currentTab: {
      type: String,
      default: 'guide1',
      validator: function(value) {
        return ['guide1', 'guide2', 'guide3', ''].includes(value)
      },
    }
  },
  data() {
    return {
      mCurrentTab: this.currentTab
    }
  },
  methods: {
    onTabChange(s) {
      this.mCurrentTab = s
      this.$emit('onTabChange', s)
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-header {
  margin: 20px 0 -5px 0;
  text-align: center;
  color: #707070;
}
.tab-guide {
  height: 65px;
  position: relative;
  .line {
    position: absolute;
    bottom: -4px;
    width: 100%;
    height: 7px;
    background: #00b7ee;
    transition: all 0.8s;
  }
  .guide {
    width: 30%;
    height: 60px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-top: 1px solid #fff;
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
    transition: all 0.3s;
    color: #fff;
    position: relative;
    font-size: 13px;
    &.active {
      height: 80px;
      transform: translateY(-15px);
      z-index: 100;
      &::after {
        content: '\FE40';
        position: absolute;
        left: calc(50% - 7px);
        bottom: -4px;
        font-weight: bold;
      }
    }
  }
  .guide-1 {
    background: #9c3;
    box-shadow: 0 0 0 3px #9c3;
    &.active ~ .line {
      background: #9c3;
    }
  }
  .guide-2 {
    background: #00b7ee;
    box-shadow: 0 0 0 3px #00b7ee;
    &.active ~ .line {
      background: #00b7ee;
    }
  }
  .guide-3 {
    background: #f29c9f;
    box-shadow: 0 0 0 3px #f29c9f;
    &.active ~ .line {
      background: #f29c9f;
    }
  }
}
//
.guides-enter-active {
  transition: opacity 0.2s ease;
  transition-delay: 0.1s;
}
.guides-leave-active {
  transition: opacity 0.2s ease;
}
.guides-enter-to, .guides-leave-to {
  opacity: 1;
}
.guides-enter, .guides-leave {
  opacity: 0;
}
</style>