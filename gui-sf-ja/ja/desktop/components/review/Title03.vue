<template>
  <div class="o-com title03 flex mid" :class="cStyle.fs || 'fs-12'">
    <i class="flex mid center fa co-white border-radius-per-50"
       :class="fa"
       :is="fa"
       :style="innerStyle"
       aria-hidden="true"/>
    <span class="o-com__tit">{{ title }}</span>
  </div>
</template>
<script>
import Edit from '@@/../components/icons/Edit.vue'
import ChartArea from '@@/../components/icons/ChartArea.vue'
import Book from '@@/../components/icons/Book.vue'
import Glass from '@@/../components/icons/Glass.vue'
export default {
  components: {
    Edit,
    ChartArea,
    Book,
    Glass,
  },
  props: {
    title: String,
    fa: String,
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
.title03 {
  color: $color20;
}
</style>
