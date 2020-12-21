<template>
  <a @click="goto" class="load-more h-20 no-underlying fs-13 flex center mid" :class="{'cursor-pointer': href}">
    <span class="vertical-middle">{{ this.text || $t('1') }}</span>
    <div class="arrow-right"/>
  </a>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-loadmore.json'
export default {
  props: {
    text: {
      type: String,
      default: null,
    },
    href: String,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    goto() {
      if (this.href) {
        window.location.href = this.href
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$color66: #9c3;
.vertical-middle {
  vertical-align: middle;
}
.load-more {
  background: $color66;
  line-height: 20px;
  color: white;
  border-radius: 10px;
  padding: 0 10px;
}
.arrow-right {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #fff;
  transform: scale(0.8);
  margin-left: 3px;
}
</style>
