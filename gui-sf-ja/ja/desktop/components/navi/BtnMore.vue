<template>
  <a :href="target" class="btn-more--fi flex mid center fs-13 pos-rel">
    {{ $t('1') }}
    <ChevronRight class="pos-abs"/>
  </a>
</template>

<script>
import i18n from '@@/lang/components-desktop/button-navi.json'
import GogoLink from '@@/../components/link/GogoLink.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
/**
 * The button Read more.
 */
export default {
  props: {
    /**
     * The URL of target page.
     */
    target: {
      type: String,
      default: null,
    },
  },
  components: {
    GogoLink,
    ChevronRight,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.btn-more--fi {
  width: 320px;
  height: 40px;
  background: transparent;
  border: 2px solid #b2b2b2;
  color: #666;
  outline: none;
  text-decoration: none;
  .icon-cls {
    top: 10px;
    right: 5px;
    width: 14px;
    height: 16px;
    color: #979797;
  }
  &:hover {
    background: #b2b2b2;
    color: #fff;
    .icon-cls {
      color: #fff;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <btn-more :target="dataTarget"/>
  </template>
  <script>
  export default {
    data() {
      return {
        dataTarget: 'https://gogojungle.co.jp',
      }
    },
  }
  </script>
  ```
</docs>
