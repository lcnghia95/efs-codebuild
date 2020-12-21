<template>
  <button :style="style" class="btn btn-default" @click="onClick">
    <b>{{ text }}</b>
  </button>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: '#ff8400',
    },
    color: {
      type: String,
      default: 'white',
    },
    validate: {
      type: Function,
    },
    text: String,
  },
  computed: {
    style() {
      return {
        'background-color': this.background,
        color: this.color,
      }
    },
  },
  data() {
    return {}
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>


<style lang="scss" scoped>
.btn {
  border: none;
  outline: none;
  &:hover,
  &:active,
  &:focus,
  &:active:hover,
  &:active:focus {
    outline: none;
  }
}
</style>
