<template>
  <div class="header-blue-line w-full fs-19" :style="{ 'background-image': bgImg}">
    <b v-if="title" class="pb-5" :class="classes"> {{ title }}</b>
    <b v-html="titleHtml" v-if="titleHtml" class="pb-5" :class="classes"></b>
  </div>
</template>

<script>
export default {
  props: ['title', 'titleHtml', 'imgIndex', 'classes'],
  computed: {
    bgImg() {
      return `url(/img/assets/pc/common/headline_brown_${this.imgIndex ||
        2}.png)`
    },
  },
}
</script>

<style lang="scss" scoped>
.header-blue-line {
  font-weight: bold;
  background-color: white;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  b {
    display: block;
  }
}
.co-44 {
  color: #079ee3;
}
.fs-19 {
  font-size: 19px;
}
.pb-5 {
  padding-bottom: 5px;
}
</style>
