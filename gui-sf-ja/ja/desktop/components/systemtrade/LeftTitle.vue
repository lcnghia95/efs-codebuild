<template>
  <h2 class="title pt-5 pb-5 pl-10 m-0">{{ text }}</h2>
</template>
<script>
export default {
  props: {
    text: String,
  },
}
</script>
<style lang="scss" scoped>
.title {
  border-left: 3px solid #cacaca;
  color: #666;
  font-size: 20px;
  line-height: 1.4;
}
</style>
<docs>
  ```vue
  <template>
    <LeftTitle :text="text" />
  </template>
  <script>
    export default {
      data() {
        return {
          text: 'tttttttttt'
        }
      }
    }
  </script>
  ```
</docs>
