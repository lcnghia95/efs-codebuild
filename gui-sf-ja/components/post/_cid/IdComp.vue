<template>
  <div class="w-1000 duty pb-40" v-if="cid != 46">
    <div class="flex mid title">
      <Bookmark />
      <h4>{{ data.Title }}</h4>
    </div>
    <div v-html="data.Content" class="pre-wrap mt-20 post-IbBKtrbLMt"/>
    <div class="mt-30 mb-30 flex mid content-end">
      <twitter-button class="mr-10" />
      <facebook-button class="mr-10" />
    </div>
  </div>
</template>
<script>
import Bookmark from '@@/../components/icons/Bookmark.vue'
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    cid: {
      type: [Number, String],
      default() {
        return 0
      },
    },
  },
  components: {
    Bookmark,
    TwitterButton,
    FacebookButton,
  },
}
</script>
<style lang="scss" scoped>
.duty {
  .title {
    border-bottom: double #d9d9d9;
    .icon-cls {
      width: 33px;
      height: 33px;
      color: #9c3;
    }
  }
  .pre-wrap {
    white-space: pre-line;
    word-break: break-all;
  }
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
}
</style>
