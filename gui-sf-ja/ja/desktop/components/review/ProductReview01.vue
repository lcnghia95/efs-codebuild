<template>
  <div class="product-review01 flex w-full">
    <a :href="'/users/'+userId+'/review'">
      <img :width="size" v-if="showTitleImg" :src="imgSrc" class="shadow" :style="{ 'flex': '0 0 '+ size + 'px' }" :height="size || 40" alt="" />
    </a>
    <div class="right-content" :class="{ 'ml-15': showTitleImg }">
      <p class="short-des m-b-5 fs-16" :title="reviewTitle"><b>{{ reviewTitle }}</b></p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: Number,
    showTitleImg: {
      type: Boolean,
      default: true,
    },
    reviewTitle: String,
    stars: {
      type: Number,
      default: 0,
    },
    imgSrc: {
      type: String,
      default: '',
    },
    userId: [String, Number],
  },
}
</script>

<style lang="scss" scoped>
.product-review01 {
  text-decoration: none;
}
.short-des {
  color: #2d2d2d;
  word-break: break-all;
}
.fs-16 {
  font-size: 16px;
}
.right-content {
  width: calc(100% - 65px);
}
</style>
