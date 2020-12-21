<template>
  <a :href="href" class="text-center pt-5 pb-5 cursor-pointer no-underlying">
    {{ text || $t('1') }}&nbsp;<ArrowCircleDown />
  </a>
</template>

<script>
import ArrowCircleDown from '@@/../components/icons/ArrowCircleDown.vue'
import i18n from '@@/lang/components-desktop/common-showmore.json'

export default {
  components: {
    ArrowCircleDown,
  },
  i18n: {messages: i18n},
  props: {
    text: String,
    href: String,
  },
}
</script>

<style lang="scss" scoped>
a {
  color: #f60;
  border: 2px solid #f60;
  display: block;
}
.icon-cls {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.no-underlying:hover,
.no-underlying:focus {
  color: #f60;
}
</style>
