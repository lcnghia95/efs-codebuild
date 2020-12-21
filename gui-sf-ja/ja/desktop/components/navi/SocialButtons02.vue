<template>
  <div class="flex">
    <TwitterButton class="btn--sb" v-if="!excludes[0]" :title="twitTit + '%0A'" />
    <FacebookButton class="btn--sb" v-if="!excludes[1]" />
    <MailButton class="btn--sb" v-if="!excludes[2]" />
    <HatenaButton class="btn--sb" />
    <ShareButton class="btn--sb" @click="onClickShare" v-if="!excludes[3]" />
    <LineButton class="btn--sb" :url="$route.fullPath" />
  </div>
</template>

<script>
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import ShareButton from '@@/../components/social/ShareButton.vue'
import LineButton from '@@/../components/social/LineButton.vue'
import MailButton from '@@/../components/social/MailButton.vue'
import HatenaButton from '@@/../components/social/HatenaButton.vue'
/**
 * The Social Buttons 02.
 */
export default {
  components: {
    TwitterButton,
    FacebookButton,
    ShareButton,
    MailButton,
    LineButton,
    HatenaButton,
  },
  props: {
    excludes: {
      type: Object,
      default() {
        return {}
      },
    },
    twitTit: String,
  },
  methods: {
    onClickShare() {
      this.$emit('shareclick')
    },
  },
}
</script>
<style lang="scss" scoped>
.btn--sb {
  margin-right: 5px;
}
.btn--sb:last-child {
  margin-right: 0;
}
.btn--sb /deep/ .share-btn {
  background-color: #9c3;
  border-radius: 3px;
  padding-left: 6px;
  padding-right: 6px;
}
/deep/ .icon-cls {
  margin-right: 5px;
  height: auto;
}
.btn--sb /deep/ .icon-mail {
  width: 16px;
  margin-top: 2px;
}
.btn--sb /deep/ .icon-share {
  width: 10px;
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
