<template>
  <a :href="href" class="title02 flex mid" :class="[cStyle.fs || 'fs-12', { 'no-underlying': !href }]">
    <i
      :is="fa"
      class="flex mid center fa co-white border-radius-per-50"
      :class="fa"
      :style="innerStyle"
      aria-hidden="true"/>
    <img class="shadow" v-if="imageSrc && !imageSrc.includes('undefined')" :style="innerStyle" :src="imageSrc" alt="">
    <span>{{ title }}</span>
  </a>
</template>
<script>
import ClockO from '@@/../components/icons/ClockO.vue'
export default {
  components: {
    ClockO,
  },
  props: {
    href: String,
    title: String,
    fa: String,
    imageSrc: String,
    cStyle: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    innerStyle() {
      return Object.assign(
        {
          color: 'white',
          fontSize: '15px',
          background: '#039def',
          width: '30px',
          height: '30px',
          marginRight: '5px',
        },
        this.cStyle
      )
    },
  },
}
</script>
<style lang="scss" scoped>
$color20: #8b8b8b;
.title02 {
  color: $color20;
  text-decoration: none;
  cursor: pointer;
}
</style>
