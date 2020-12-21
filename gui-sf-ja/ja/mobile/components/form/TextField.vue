<template>
  <div class=" text-feild flex">
    <input class="no-border input-size" ref="input" type="text" v-bind="inputAttr" @focus="handleFocus(true)" @blur="handleFocus(false)" />
    <i v-if="leftIcon" class="mr-10" :is="leftIcon" @click.native="iconClick" />
  </div>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    leftIcon: {
      type: Object,
      default() {
        return null
      },
    },
    inputAttr: {
      type: Object,
      default() {
        return {}
      },
    },
    iconClick: {
      type: Function,
      default: void 0,
    },
  },
  methods: {
    handleFocus(isAddFocus) {
      if (isAddFocus) {
        this.$el.classList.add('input-form--focus')
      } else {
        this.$el.classList.remove('input-form--focus')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
i {
  color: #a0a0a0;
}
input {
  height: 35px;
}
.text-feild {
  border: solid 1.5px #bebebe;
  padding: 5px 0 5px 20px;
  border-radius: 10px;
}
.input-size {
  width: calc(100% - 46px);
}
</style>
