<template>
  <component :is="tag" v-wrap-lines="lines" :title="content">{{ content }}</component>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    lines: {
      type: Number,
      default: 2,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
}
</script>
