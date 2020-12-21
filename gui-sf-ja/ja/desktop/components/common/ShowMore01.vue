<template>
  <GogoLink class="btn-loadmore no-underlying" :target="target">
    {{ label }}
    <span class="flex mid center ml-5"><AngleDoubleRight/></span>
  </GogoLink>
</template>
<script>
import AngleDoubleRight from '@@/../components/icons/AngleDoubleRight.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import i18n from '@@/lang/components-desktop/common-showmore.json'
export default {
  components: {
    AngleDoubleRight,
    GogoLink,
  },
  props: {
    text: {
      type: String,
    },
    target: {
      type: [String, Object],
      default: '/',
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /deep/ a {
    display: flex;
    color: #424a54;
    &:hover {
      text-decoration: underline;
    }
  }
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
