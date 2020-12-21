<template>
  <div class="header-brow-z fs-12 h-50 flex space-between" :class="contentClass"
       :style="{ 'background-image': bgImg}">
    <div class="mt-5 ml-5 title-systemtrade">
      <router-link :to="leftUrl" v-if="leftUrl">
        {{ leftText }}
      </router-link>
      <span v-else v-html="leftText"/>
    </div>
    <div class="pt-20 pr-20" v-if="rightText">
      <router-link :to="rightUrl || ''">
        {{ rightText }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'leftText',
    'rightText',
    'leftUrl',
    'rightUrl',
    'contentClass',
    'imgIndex',
  ],
  computed: {
    bgImg() {
      return `url(/img/assets/pc/common/headline_brown_${this.imgIndex ||
        1}.png)`
    },
  },
}
</script>

<style lang="scss" scoped>
.header-brow-z {
  font-weight: bold;
  background-color: white;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  padding-top: 5px;
}
.h-50 {
  height: 50px;
}
</style>
