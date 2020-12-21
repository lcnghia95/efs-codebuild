<template>
  <div class="border-bottom fs-14 flex pt-10 mid pb-10">
    <div class="grow120 date">
      {{ formatTime(product.date, 8) }}
    </div>
    <div class="grow80 text-center ml-5 mr-5" :class="'col' + product.type">
      {{ this.$t(product.type) }}
    </div>
    <div class="ml-10 wrap-text l-h-20 title">
      <div @click="gotoDetail" class="cursor-pointer">
        {{ product.title }}
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie } from '@/utils/client/common'
import i18n from '@@/lang/desktop/info.json'
export default {
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    detail: {
      type: Boolean,
      default: true,
    },
    year: [String, Number],
    type: String,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    gotoDetail() {
      if (!this.detail) {
        return
      }
      setCookie('infoyear', this.year, 1 / 6, '/info')
      location.href = `/info/${this.product.id}`
    },
  },
}
</script>

<style lang="scss" scoped>
.grow120 {
  flex: 0 0 120px;
}
.grow80 {
  flex: 0 0 82px;
}
.col1 {
  background-color: #aaefcd;
}
.col2 {
  background-color: #99cdff;
}
.col1,
.col2 {
  padding: 3px 0 2px;
  border-radius: 5px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.bg-co-59 {
  background: #ededed;
}
.l-h-20 {
  line-height: 20px;
}
.fs-14 {
  font-size: 14px;
}
</style>
