<template>
  <div class="w-1000">
    <YearSlider :year="year" @year="onSelectYear" />
    <nuxt-child />
  </div>
</template>

<script>
import YearSlider from '@/components/info/YearSlider.vue'
import i18n from '@@/lang/desktop/info.json'
import { filterInt } from '@/utils/client/common'

// default type is 'normal'
const typeList = ['seller', 'partner']

export default {
  components: {
    YearSlider,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onSelectYear(year) {
      location.href = `/info/${typeList.includes(this.type) ? this.type + '/' : ''}y/${year}/p/1`
    },
  },
  async asyncData({ params }) {
    let year = filterInt(params.y) || new Date().getFullYear(),
      type = params.type || null
    return {
      year,
      type,
    }
  },
}
</script>

<style lang="scss" scoped>
.info-title {
  /deep/ {
    b {
      color: #666;
    }
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