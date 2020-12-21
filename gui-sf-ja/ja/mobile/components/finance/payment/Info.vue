<template>
  <div class="info-1lDFf">
    <div class="info-box p-5 mb-10">
      {{ typeText }}：<span v-html="displayPrice"/>
    </div>
    <ActiveCartBtn :btn-text="btnText" :product-id="info.productId"/>
  </div>
</template>

<script>
import ActiveCartBtn from './ActiveCartBtn.vue'
import i18n from '@@/lang/components-desktop/finance-info.json'
export default {
  components: {
    ActiveCartBtn,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      },
    },
    btnText: String,
    type: [String, Number],
  },
  data() {
    return {
      text: {
        1: this.$t('1'),
        2: this.$t('2'),
      },
    }
  },
  computed: {
    typeText() {
      return this.text[this.type]
    },
    displayPrice() {
      if (!this.info.oldPrice) {
        return `<span>${
          this.info.price
            ? this.formatNumber(this.info.price) + '円'
            : this.$t('4')
        }</span>`
      }
      return `<span style="text-decoration: line-through;">${this.formatNumber(
        this.info.oldPrice
      )}円</span> → ${
        this.info.price
          ? this.formatNumber(this.info.price) + '円'
          : this.$t('4')
      } (${this.formatTime(this.info.discountEnd, 6)}) ${this.$t('3')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.info-1lDFf {
  width: 340px;
}
.info-box {
  color: white;
  border-radius: 4px;
  background: #5b5b5b;
}
</style>
