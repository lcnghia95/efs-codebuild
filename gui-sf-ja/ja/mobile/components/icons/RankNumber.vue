<template>
  <span v-if="number" :style="{fontSize}">
    {{ showNumber }}
  </span>
</template>
<script>
export default {
  props: { number: Number },
  computed: {
    showNumber() {
      return this.number < 10 ? '0' + this.number : this.number
    },
    fontSize() {
      if (this.number < 99) return '11vmin'
      else if (this.number < 999) return '9vmin'
      else return '7vmin'
    }
  },
}
</script>
