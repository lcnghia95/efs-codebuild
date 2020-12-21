<template>
  <div class="category-29oa0 flex mid center" :style="{ 'background': categoryColors[type], 'font-size': type == 18 ? '9px' : '12px' }">
    {{ $t('c' + (type || 1)) }}
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/product-productvert.json'
export default {
  i18n: { messages: i18n },
  props: {
    type: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {
      categoryColors: {
        1: '#8fc31f',
        3: '#00b7ee',
        18: '#f19149',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.category-29oa0 {
  flex: 0 0 40px;
  width: 40px;
  height: 14px;
  color: white;
  border-radius: 2px;
}
</style>
