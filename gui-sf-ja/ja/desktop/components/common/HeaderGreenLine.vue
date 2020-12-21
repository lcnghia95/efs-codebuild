<template>
  <div class="header-green-line w-full" :style="{ 'background-image': bgImg}">
    <GogoLink :target="targetUrl" class="link-header">
      <b v-if="title" class="pb-5 co-66"> {{ title }}</b>
      <b v-html="titleHtml" v-if="titleHtml" class="pb-5"/>
    </GogoLink>
  </div>
</template>

<script>
import GogoLink from '@@/../components/link/GogoLink.vue'
export default {
  components: { GogoLink },
  props: {
    title: String,
    titleHtml: String,
    imgIndex: Number,
    targetUrl: {
      type: String,
      default: '/',
    },
  },
  computed: {
    bgImg() {
      return `url(/img/assets/pc/common/headline-green_${this.imgIndex ||
        1}.jpg)`
    },
  },
}
</script>

<style lang="scss" scoped>
.header-green-line {
  font-weight: bold;
  background-color: white;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  font-size: 19px;
  b {
    display: block;
  }
}
.co-66 {
  color: #9c3;
}
.link-header {
  /deep/ a {
    text-decoration: none;
  }
}
</style>
