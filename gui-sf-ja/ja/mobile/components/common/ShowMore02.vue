<template>
  <a class="btn-loadmore flex mid content-end no-underlying" :href="target">
    {{ text || $t('1') }}
    <span class="flex mid center ml-5"><ArrowRight /></span>
  </a>
</template>
<script>
import ArrowRight from '@@/../components/icons/ArrowRight.vue'
import i18n from '@@/lang/components-mobile/show-more.json'
export default {
  components: {
    ArrowRight,
  },
  i18n: { messages: i18n },
  props: {
    text: {
      type: String,
      default: '',
    },
    target: {
      type: [String, Object],
      default: '/',
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-loadmore {
  color: #707070;
  font-size: 14px;
  span {
    width: 14px;
    height: 14px;
    background: #747474;
    border-radius: 50%;
    i.icon-cls {
      width: 12px;
      height: 12px;
      color: white;
    }
  }
}
.border {
  background: white;
  border: 1px #e0dedc solid;
  border-radius: 5px;
  justify-content: center;
  padding: 3px 6px;
  font-size: 14px;
}
@media only screen and (min-width: 600px) {
  .btn-loadmore {
    font-size: 14px;
    span {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
