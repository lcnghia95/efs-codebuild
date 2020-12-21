<template>
  <div class="flex space-around">
    <TwitterButton />
    <FacebookButton />
    <LineButton />
    <HatenaButton />
    <ShareButton class="share-button" @click="onClickShare" v-if="$store.state.user.isaff" />
    <MailButton class="share-button" />
  </div>
</template>

<script>
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import HatenaButton from '@@/../components/social/HatenaButton.vue'
import LineButton from '@@/../components/social/LineButton.vue'
import ShareButton from '@@/../components/social/ShareButton.vue'
import MailButton from '@@/../components/social/MailButton.vue'

export default {
  components: {
    TwitterButton,
    FacebookButton,
    HatenaButton,
    LineButton,
    ShareButton,
    MailButton,
  },
  methods: {
    onClickShare() {
      this.$emit('shareclick')
    },
  },
}
</script>

<style lang="scss" scoped>
.share-button /deep/ .share-btn {
  background-color: #9c3;
  border-radius: 3px;
  padding-left: 6px;
  padding-right: 6px;
}
/deep/ .icon-cls {
  margin-right: 5px;
  height: auto;
}
.share-button /deep/ .icon-mail {
  width: 16px;
  margin-top: 2px;
}
.share-button /deep/ .icon-share {
  width: 10px;
}
</style>
