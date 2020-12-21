<template>
  <div class="line-share" ref="lineButton" @click="share">
    <LineSocial02 />
  </div>
</template>
<script>
import LineSocial02 from '@@/../components/icons/LineSocial02.vue'

export default {
  components: {
    LineSocial02
  },
  props: {
    svgFill: {
      type: String,
      default: "#444444"
    }
  },
  methods: {
    share() {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`)
    }
  }
}
</script>
<style lang="scss" scoped>
i.icon-cls {
  display: inline-block;
  cursor: pointer !important;
  width: 28px;
  height: 36px;
}
.line-share {
  position: relative;
  /deep/ iframe {
    left: 0 !important;
  }
}
</style>
