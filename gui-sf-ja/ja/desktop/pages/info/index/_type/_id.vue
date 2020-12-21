<template>
  <div class="w-1000 info-detail">
    <div class="p-30">
      <div class="mt-20 mb-20 back-content co-19 fs-15 lh-20">
        <div @click="onBack" class="cursor-pointer">
          <b>{{ $t('3') }}</b>
        </div>
      </div>
      <Info :product="item" :detail="false" class="detail-info" />
      <div class="mt-50 mb-50" v-html="content" v-if="item"></div>
    </div>
  </div>
</template>

<script>
import { replaceLinkUrl } from '@/utils/client/common'
import HeaderBrownLine from '@/components/common/HeaderBrownLine.vue'
import Info from '@/components/info/Info.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/info.json'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    components: {
      HeaderBrownLine,
      Info,
    },
    validate({ params }) {
      if (filterInt(params.type) && params.id === undefined) {
        return true
      }
      return ~['seller', 'partner'].indexOf(params.type) && filterInt(params.id)
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      content() {
        return replaceLinkUrl(this.item.content)
      },
    },
    async asyncData({ app, store, params, error }) {
      let type = params.type || null,
        id =
          filterInt(params.type) && params.id === undefined
            ? params.type
            : params.id,
        data = await app.GoGoHTTP.get('/api/v3/surface/info' + '/' + id)
      if (!data || !data.content) {
        return error({ statusCode: 404 })
      }
      store.commit('pushBC', {
        name: data.title,
        target: { path: `/info/${id}` },
      })
      return {
        item: data,
        type,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/info${
              type ? '/' + type : ''
            }/${id}`,
          },
        ],
      }
    },
    methods: {
      onBack() {
        if (document.referrer.includes('mypage')) {
          location.href = `/info/${
            !filterInt(this.type) ? this.type + '/' : ''
          }`
        } else {
          window.history.back()
        }
      },
      titleTemplate(titleL) {
        return `${this.item.title} - ${this.$t(this.type) || this.$t('1')} : ${
          titleL.title
        }`
      },
      descriptionTemplate() {
        let cnt = this.item.content.substr(0, 300).replace(/<(.|\n)*?>/g, '')
        return this.type ? `${this.$t(this.type)}：${cnt}` : cnt
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.info-detail {
  margin: 0 auto;
}
.grow120 {
  flex: 0 0 120px;
}
.grow80 {
  flex: 0 0 80px;
}
.col1,
.col2 {
  display: block;
  width: 82px;
  padding: 3px 0 2px;
}
.col1 {
  background-color: #aaefcd;
}
.col2 {
  background-color: #99cdff;
}
.fs-15 {
  font-size: 15px;
}
.lh-20 {
  line-height: 20px;
}
.co-19 {
  color: #bcb5b9;
}
.no-underlying {
  color: inherit;
  &:hover,
  &:focus {
    text-decoration: none;
    color: inherit;
  }
}
.info-title {
  /deep/ {
    b {
      color: #666;
    }
  }
}
.detail-info /deep/ {
  .title,
  .date {
    font-weight: bold;
  }
}
</style>
