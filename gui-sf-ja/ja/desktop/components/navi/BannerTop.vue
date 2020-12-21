<template>
  <div class="ban-t flex center mid">
    <img class="img--tb" :src="img" >
    <p class="p--tb pos-abs" v-html="par"/>
  </div>
</template>

<script>
/**
 * The static top banner.
 */
export default {
  props: {
    /**
     * The URL of banner image.
     */
    img: {
      type: String,
      default: null,
    },
    /**
     * The paragraph of banner.
     */
    par: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.ban-t {
  max-width: 1140px;
  height: 195px;
  margin: 0 auto;
  position: relative;
}
.img--tb {
  height: 100%;
}
.p--tb {
  color: #fff;
}
/deep/ .p--tb > strong {
  font-size: 20px;
  line-height: 40px;
  font-weight: normal;
}
@media only screen and (max-width: 1024px) {
  .img--tb {
    width: 100%;
  }
}
</style>

<docs>
  ```vue
  <template>
    <banner-top :img="dataImg" :par="dataPar"/>
  </template>
  <script>
  export default {
    data() {
      return {
        dataImg: 'https://dummyimage.com/700x400/000/fff',
        dataPar: 'システムトレード<br/>ランキング',
      }
    },
  }
  </script>
  ```
</docs>
