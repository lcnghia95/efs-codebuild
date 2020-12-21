<template>
  <div class="header-blue-line w-full fs-19"
       :style="{ backgroundImage: `url(/img/assets/pc/common/headline-bl_${this.imgIndex || 2}.png)`}">
    <h2 v-if="title" class="pb-5" :class="classes"> {{ title }}</h2>
    <b v-html="titleHtml" v-if="titleHtml" class="pb-5" :class="classes" />
  </div>
</template>

<script>
export default {
  props: ['title', 'titleHtml', 'imgIndex', 'classes'],
}
</script>

<style lang="scss" scoped>
.header-blue-line {
  font-weight: bold;
  background-color: white;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  h2 {
    display: block;
    font-size: inherit;
    line-height: inherit;
    margin: inherit;
    font-weight: 700;
  }
}
.co-44 {
  color: #079ee3;
}
.fs-19 {
  font-size: 19px;
}
.pb-5 {
  padding-bottom: 5px;
}
</style>
<docs>
  ```vue
  <template>
    <HeaderBlueLine :title="'header blue title'" :img-index="3" />
  </template>
  <script>
  export default {
    data() {
      return {}
    },
  }
  </script>
  ```
</docs>
