<template>
  <p class="flex mb-20">
    <b class="w-100 block">{{ title }}</b>
    <a v-if="info" class="w-100 ml-40 text-right">{{ info }}</a>
  </p>
</template>
<script>
export default {
  props: {
    title: String,
    info: String,
  },
}
</script>
<style lang="scss" scoped>
.w-100 {
  flex: 0 0 100px;
}
.block {
  color: #707070;
}
a:hover {
  text-decoration: none;
  color: #337ab7;
}
</style>

<docs>
  ```vue
  <template>
      <product-info :title="title" :info="info"/>
  </template>
  <script>
    export default {
      data() {
        return {
          info:"2018/08/12",
          title:"販売開始日"
        }
      }
    }
  </script>
  ```
</docs>
