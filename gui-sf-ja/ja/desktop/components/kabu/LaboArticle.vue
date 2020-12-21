<template>
  <div class="card flex layout-col">
    <div class="flex mb-15">
      <div class="cate-ctn main-cate" :style="{background: (item.ofCategory || {}).color || 'black' }">{{ (item.ofCategory || {}).name }}</div>
      <div class="cate-ctn sub-cate" :style="{background: (item.ofSubCategory || {}).color || 'grey'}">{{ (item.ofSubCategory || {}).shortName }}</div>
    </div>
    <div class="card-title mb-10" v-wrap-lines="2" :title="item.title">
      {{ item.title }}
    </div>
    <div class="card-content text-wrap" v-wrap-lines="6" :title="item.content">
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
  width: 100%;
  max-width: 248px;
  height: 258px;
  border: 1px solid #a9c3d3;
  background: #f3f9ff;
  padding: 20px;
  &:hover {
    background: #e6f4ff;
    text-decoration: none;
  }
}
.card-title {
  color: #000;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  height: 40px;
  max-height: 40px;
}
.card-content {
  color: #000;
  font-size: 12px;
}
.cate-ctn {
  text-transform: uppercase;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 12px;
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
