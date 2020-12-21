<template>
  <div v-if="isLoading" class="icn-load flex mid center w-full">
    <loading style="width: 8vw; height: 8vw;" />
  </div>
  <div v-else class="btn-loadmore flex mid center w-full">
    {{ text || $t('1') }}
    <AngleDown class="ml-5" />
  </div>
</template>
<script>
import AngleDown from '@@/../components/icons/AngleDown.vue'
import i18n from '@@/lang/components-mobile/show-more.json'
import Loading from '@@/../components/icons/Loading.vue'

export default {
  i18n: { messages: i18n },
  components: {
    AngleDown,
    Loading,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-loadmore {
  color: #fff;
  padding: 3vw 0;
  border-top: solid 1px #777777;
  .icon-cls {
    width: 15px;
    height: 15px;
  }
}
.icn-load {
  padding: 3vw 0;
}
.icn-load,
.btn-loadmore {
  &.border-bottom {
    border-bottom: 1px solid #dfdedc;
  }
}
</style>
