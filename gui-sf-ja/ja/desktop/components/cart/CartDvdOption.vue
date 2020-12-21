<template>
  <div class="options-wrapp flex mid flex-wrap">
    <b class="mr-20 mb-5 mt-5">{{ $t('1') }}</b>
    <div class="flex flex-wrap">
      <label class="c-label flex mid cursor-pointer">
        <input type="radio" v-model.number="opt" value="0" /><div class="t-label flex mid p-5" v-html="$t('2')"></div>
      </label>
      <label class="c-label flex mid cursor-pointer" v-if="hasDvd[0]">
        <input type="radio" v-model.number="opt" value="1" /><div class="t-label flex mid p-5" v-html="$t('3')"></div>
      </label>
      <label class="c-label flex mid cursor-pointer" v-if="hasDvd[1]">
        <input type="radio" v-model.number="opt" value="2" /><div class="t-label flex mid p-5" v-html="$t('4')"></div>
      </label>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/cart-dvd-options.json'
export default {
  model: {
    prop: 'mValue',
    event: 'input',
  },
  i18n: {
    messages: i18n,
  },
  props: {
    mValue: Number,
  },
  computed: {
    opt: {
      get() {
        return this.$store.getters['cart01/dvdOpt']
      },
      set(val) {
        this.$store.commit('cart01/setDvd', {
          dvdOpt: val,
        })
      },
    },
    hasDvd: {
      get() {
        return this.$store.getters['cart01/hasDvd']
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.options-wrapp {
  width: 600px;
  color: #2d2d2d;
  .c-label {
    margin-bottom: 0;
    font-size: 9px;
    padding: 5px;
    .t-label {
      width: 140px;
      height: 34px;
      margin-left: 5px;
      background: #ddd;
      border-radius: 3px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <CartDvdOption v-model.number="opt"/>
  </template>
  <script>
  export default {
    data() {
      return {
        opt: undefined
      }
    },
  }
  </script>
  ```
</docs>
