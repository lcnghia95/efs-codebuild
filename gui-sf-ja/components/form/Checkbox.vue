<template>
  <label class="c-label" :for="attrs.id">
    <input type="checkbox" :checked="state" v-bind="attrs" @change="onChange">{{ label }}
    <span class="checkmark"/>
  </label>
</template>
<script>
/**
 * The checkbox button.
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
    checked: {
      type: Boolean,
      default: false,
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
      if (Array.isArray(this.mValue)) {
        return this.mValue.indexOf(this.attrs.value) > -1
      }
      return !!this.mValue
    },
  },
  methods: {
    onChange() {
      this.toggle()
    },
    toggle() {
      let value
      if (Array.isArray(this.mValue)) {
        value = this.mValue.slice(0)
        if (this.state) {
          value.splice(value.indexOf(this.attrs.value), 1)
        } else {
          value.push(this.attrs.value)
        }
      } else {
        value = !this.state
      }
      this.$emit('input', value)
    },
  },
  watch: {
    checked(newValue) {
      if (newValue !== this.state) {
        this.toggle()
      }
    },
  },
  mounted() {
    if (this.checked && !this.state) {
      this.toggle()
    }
  },
}
</script>
<style lang="scss" scoped>
$color_02: rgb(197, 197, 197);
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
  user-select: none;
  @extend %pointer;
  input {
    opacity: 0;
    @extend %absolute;
    @extend %pointer;
  }
  .checkmark {
    top: 0;
    left: 0;
    height: 14px;
    width: 14px;
    background-color: #fff;
    border: 1px solid $color_02;
    @extend %absolute;
  }
  .checkmark::after {
    display: none;
    @extend %content_null;
    @extend %absolute;
    left: 3px;
    top: 3px;
    width: 6px;
    height: 6px;
    border: solid #000;
  }
  input:checked ~ .checkmark::after {
    @extend %block;
  }
}
</style>
<docs>
  ```vue
  <template>
    <checkbox v-model="param_01" :attrs="{ id: id, value: value }" :label="label"/>
  </template>
  <script>
  export default {
    data() {
      return {
        id: 2,
        value: 1,
        label: '新着',
        param_01: 1
      }
    },
  }
  </script>
  ```
</docs>
