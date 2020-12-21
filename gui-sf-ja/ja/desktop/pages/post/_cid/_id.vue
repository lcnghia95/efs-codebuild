<template>
  <div class="w-1000 duty pb-40" v-if="cid != 46">
    <div class="flex mid title">
      <Bookmark />
      <h4>{{ data.Title }}</h4>
    </div>
    <div v-html="data.Content" class="pre-wrap mt-20 post-IbBKtrbLMt"></div>
    <div class="mt-30 mb-30 flex mid content-end">
      <TwitterButton class="mr-10" />
      <FacebookButton class="mr-10" />
      <LineButton class="mr-10" />
      <HatenaButton class="mr-10" />
      <MailButton class="share-button" />
    </div>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import { editCss, filterInt } from '@/utils/client/common'
import Bookmark from '@@/../components/icons/Bookmark.vue'
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import HatenaButton from '@@/../components/social/HatenaButton.vue'
import LineButton from '@@/../components/social/LineButton.vue'
import MailButton from '@@/../components/social/MailButton.vue'
import anchorLink from '@@/../common/pages/post'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.cid)) && !isNaN(filterInt(params.id))
    },
    components: {
      Bookmark,
      TwitterButton,
      FacebookButton,
      HatenaButton,
      LineButton,
      MailButton,
    },
    mounted() {
      anchorLink.call(this)
    },
    async asyncData({ app, params, error, store }) {
      let data = await app.GoGoHTTP.get(
        `/api/v3/surface/lecture/${params.cid}/${params.id}`
      )
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      if (data.code) {
        return error({ statusCode: 404, exists: data.exists })
      }
      if (params.id != 15356 && (data.Content || '').indexOf('<style type="text/css">') !== -1) {
        data.Content = editCss(data.Content, '.post-IbBKtrbLMt')
      }
      store.commit('pushBC', {
        name: data.Title,
        target: { name: 'post-cid-id', params: params },
      })
      return {
        data,
        titleChunk: data.Title,
        cid: params.cid,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/post/${params.cid}/${
              params.id
            }`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>
<style type="text/css">
@import '@@/../common/assets/post-content.css';
</style>
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
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>