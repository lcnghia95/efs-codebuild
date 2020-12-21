<template>
  <div class="info-detail">
    <div class="mt-20 mb-20 back-content">
      <a @click="onBack" class="cursor-pointer">
        {{ $t('6') }}
      </a>
    </div>
    <div class="flex mid space-between p-10">
      <span class="time-color">{{ $t('1') }}&nbsp;{{ formatTime(item.date, 8) }}</span>
      <div class="text-center" :class="'col' + item.type">
        {{ $t(item.type) }}
      </div>
    </div>
    <div class="info-title p-10">
      <b>{{ item.title }}</b>
    </div>
    <div class="mt-20 mb-50 p-10 info-content" v-html="content" v-if="item"></div>
  </div>
</template>

<script>
import { replaceLinkUrl } from '@/utils/client/common'
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/info.json'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
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
    async asyncData({ app, params, error }) {
      let type = params.type || null,
        id =
          filterInt(params.type) && params.id === undefined
            ? params.type
            : params.id,
        data = await app.GoGoHTTP.get('/api/v3/surface/info' + '/' + id)
      if (!data || !data.content) {
        return error({ statusCode: 404 })
      }
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
  .back-content {
    background: #f3f0ef;
    padding: 10px;
    a {
      color: #434343;
      font-size: 16px;
      background-color: #f3f0ef;
      text-decoration: underline;
    }
  }
  .time-color {
    color: #a0a0a0;
  }
  .col1 {
    background-color: #aaefcd;
  }
  .col2 {
    background-color: #99cdff;
  }
  .col1,
  .col2 {
    padding: 2px 10px;
    border-radius: 18px;
  }
  .info-title {
    color: #2d2d2d;
    display: block;
    border-bottom: 1px solid #e0e0e0;
  }
  .info-content {
    white-space: pre-line;
    word-break: break-all;
  }
}
</style>
