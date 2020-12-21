<template>
  <label class="c-label" :for="attrs.id">
    <input type="radio" :checked="state" v-bind="attrs" @change="onChange">{{ label }}
    <span class="radiomark"/>
  </label>
</template>
<script>
/**
 * The radio button.
 */
export default {
  model: {
    prop: 'mValue',
    event: 'input',
  },
  props: {
    /**
     * Attributes of button.
     */
    attrs: {
      type: Object,
      default: function() {
        return {}
      },
    },
    /**
     * Model value of button.
     */
    mValue: {
      default: undefined,
    },
    /**
     * Label of button.
     */
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    state() {
      if (this.mValue === undefined) {
        return this.checked
      }
      return this.mValue == this.attrs.value
    },
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>
<style lang="scss" scoped>
$color_02: rgb(197, 197, 197);
$color_06: rgb(240, 240, 240);
%block {
  display: block;
}
%absolute {
  position: absolute;
}
%pointer {
  cursor: pointer;
}
%content_null {
  content: '';
}
.c-label {
  position: relative;
  padding-left: 22px;
  margin-bottom: 15px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  @extend %pointer;
  input {
    opacity: 0;
    @extend %absolute;
    @extend %pointer;
  }
  .radiomark {
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid $color_02;
    @extend %absolute;
  }
  input:checked ~ .radiomark {
    background-color: $color_06;
  }
  .radiomark::after {
    display: none;
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #000;
    @extend %content_null;
    @extend %absolute;
  }
  input:checked ~ .radiomark::after {
    @extend %block;
  }
}
</style>
<docs>
  ```vue
  <template>
    <radio v-model="param_01" :attrs="{ id: id, value: value }" :label="label"/>
  </template>
  <script>
  export default {
    data() {
      return {
        id: 1,
        value: 1,
        label: '新着',
        param_01: 1
      }
    },
  }
  </script>
  ```
</docs>
