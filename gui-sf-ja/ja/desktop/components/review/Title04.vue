<template>
  <div class="title pb-10">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
}
</script>

<style lang="scss" scoped>
.title {
  border-bottom: 1px solid #f60;
  font-weight: bold;
  font-size: 16px;
}
</style>
