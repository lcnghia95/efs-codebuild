<template>
  <label :class="`${theme} c-label ${classMobile} ${state ? 'is-checked' : ''} flex mid pos-rel`" :for="attrs.id">
    <i :is="icon" />
    <input type="radio" :checked="state" v-bind="attrs" @change="onChange" />{{ label }}
  </label>
</template>
<script>
import Star from '@@/../components/icons/Star.vue'
import Bell from '@@/../components/icons/Bell.vue'
import ArrowUp from '@@/../components/icons/ArrowUp.vue'
import ChartLine02 from '@@/../components/icons/ChartLine02.vue'
import ShoePrints from '@@/../components/icons/ShoePrints.vue'
import Bomb from '@@/../components/icons/Bomb.vue'
import Sync from '@@/../components/icons/Sync.vue'
import Flag from '@@/../components/icons/Flag.vue'
import Line01 from '@@/../components/icons/Line01.vue'
/**
 * The radio button.
 */
export default {
  components: {
    Star,
    Bell,
    ArrowUp,
    ChartLine02,
    ShoePrints,
    Bomb,
    Sync,
    Flag,
    Line01,
  },
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
    theme: {
      type: String,
      default: 'theme-1',
    },
    classMobile: {
      type: String,
      default: '',
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
    /**
     * Icon of button.
     */
    icon: {
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
%absolute {
  position: absolute;
}
%pointer {
  cursor: pointer;
}
.theme-1 {
  &.c-label {
    padding-left: 12px;
    margin-bottom: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid $color_02;
    background: #fff;
    border-radius: 5px;
    font-size: 14px;
    color: rgb(128, 128, 128);
    @extend %pointer;
    i.icon-cls {
      width: 22px;
      height: 22px;
      margin-right: 3px;
      margin-top: -3px;
    }
    &.is-checked {
      color: #fff;
      background: #ff8400;
      box-shadow: inset 3px 3px 5px rgba($color: #000, $alpha: 0.2);
    }
    input {
      opacity: 0;
      @extend %absolute;
      @extend %pointer;
    }
  }
}
.theme-2 {
  &.c-label-mobile {
    width: auto !important;
  }
  &.c-label {
    justify-content: center;
    width: 52px;
    padding: 4px 5px;
    margin-bottom: 0;
    color: rgb(128, 128, 128);
    background: #fff;
    font-size: 14px;
    font-weight: normal;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    @extend %pointer;
    &.is-checked {
      color: #fff;
      background: rgb(217, 215, 212);
    }
    input {
      opacity: 0;
      @extend %absolute;
      @extend %pointer;
    }
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
