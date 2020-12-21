<template>
  <div class="img-wrapp pos-rel" @click="onClick">
    <Lzimg ref="img" :data-src="src" :alt="alt" class="pos-abs" />
  </div>
</template>

<script>
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  watch: {
    src(val) {
      this.$refs.img.$el.src = val
    },
  },
  props: {
    src: {
      type: String,
    },
    alt: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: 'javascript:;',
    },
  },
  components: {
    Lzimg,
  },
  methods: {
    onClick() {
      location.href = this.href
    },
  },
}
</script>

<style lang="scss" scoped>
.img-wrapp {
  background-color: #e6e9ec;
  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
