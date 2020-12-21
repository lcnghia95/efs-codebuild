<template>
  <div class="card flex layout-col">
    <div class="flex mb-10">
      <div class="cate-ctn main-cate" :style="{background: (item.ofCategory || {}).color || 'black' }">{{ (item.ofCategory || {}).name }}</div>
      <div class="cate-ctn sub-cate" :style="{background: (item.ofSubCategory || {}).color || 'grey'}">{{ (item.ofSubCategory || {}).shortName }}</div>
    </div>
    <div class="card-title mb-5" v-wrap-lines="2" :title="item.title">
      {{ item.title }}
    </div>
    <div class="card-content" v-wrap-lines="7" :title="item.content">
      {{ item.content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  width: 47vw;
  border: 1px solid #a9c3d3;
  background: #f3f9ff;
  padding: 10px;
  height: 220px;
}
.card-title {
  color: #000;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  height: 40px;
  max-height: 40px;
}
.card-content {
  color: #000;
  font-size: 11px;
}
.cate-ctn {
  text-transform: uppercase;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  text-align: center;
  background: #c16161;
  &.main-cate {
    background: #c16161;
  }
  &.sub-cate {
    background: #6462bc;
  }
}
</style>
