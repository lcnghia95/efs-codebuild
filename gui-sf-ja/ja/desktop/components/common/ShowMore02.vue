<template>
  <div class="btn-loadmore flex mid center" @click="onShowMore">
    {{ label }}
    <span class="flex mid center ml-5"><AngleDoubleDown /></span>
  </div>
</template>
<script>
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import i18n from '@@/lang/components-desktop/common-showmore.json'
export default {
  components: {
    AngleDoubleDown,
  },
  props: {
    text: {
      type: String,
    },
    onShowMore: {
      type: Function,
      default: () => {},
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      label: this.text || this.$t('1'),
    }
  },
}
</script>
<style lang="scss" scoped>
.btn-loadmore {
  cursor: pointer;
  span {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    i.icon-cls {
      width: 16px;
      height: 16px;
      margin-left: 1px;
    }
  }
}
</style>
