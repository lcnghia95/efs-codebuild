<template>
  <div class="flex">
    <TwitterButton class="btn--sb" v-if="!excludes[0]" />
    <FacebookButton class="btn--sb" v-if="!excludes[1]" />
    <MailButton class="btn--sb" v-if="!excludes[2]" />
  </div>
</template>

<script>
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import MailButton from '@@/../components/social/MailButton.vue'
/**
 * The Social Buttons 02.
 */
export default {
  components: {
    TwitterButton,
    FacebookButton,
    MailButton,
  },
  props: {
    excludes: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.btn--sb {
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
}
/deep/ .icon-cls {
  margin-right: 5px;
  height: auto;
}
.btn--sb /deep/ {
  .icon-mail {
    width: 16px;
    margin-top: 2px;
  }
  .icon-share {
    width: 10px;
  }
  .share-btn {
    background-color: #9c3;
    border-radius: 3px;
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <social-buttons02 class="c-social-btn"/>
  </template>
  <script>
  export default {}
  </script>
  ```
</docs>
