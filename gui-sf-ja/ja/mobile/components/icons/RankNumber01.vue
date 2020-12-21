<template>
  <span
    v-if="number"
    :style="{
      'color': colors[number - 1 > 4 ? 4 : number -1][1],
      'background': background,
      'width': size + 'px',
      'height': size + 'px',
      'font-size': parseInt(size / 3 * 2) + 'px'
    }"
    class="number flex mid center" :class="{ 'border': (type === 1 && number > 3) }"
  >
    {{ number }}
  </span>
</template>

<script>
export default {
  props: {
    number: Number,
    size: {
      type: Number,
      default: 19,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    background() {
      let index = this.number - 1 > 4 ? 4 : this.number - 1,
        color = this.colors[index][0]
      if (!this.type) {
        return color[0]
      }
      return color[this.type] || color[0]
    },
  },
  data() {
    return {
      colors: [
        [['#ffcc00', '#ff0001'], 'white'],
        [['#3a98f3', '#ff8f02'], 'white'],
        [['#e2594e', '#ffdc03'], 'white'],
        [['#5bc870', '#f5f7f9'], 'white'],
        [['#e1dede', '#f5f7f9'], '#666666'],
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.number {
  border-radius: 4px;
  font-weight: bold;
}
.border {
  border: 2px solid #b5bcc9;
}
</style>