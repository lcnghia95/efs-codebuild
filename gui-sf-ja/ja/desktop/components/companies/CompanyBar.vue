<template>
  <ul class="pl-20 pr-20 fs-12 w-full">
    <li v-for="item in items" :key="'ZX2Nd'+item.id">
      <a :href="item.url">
        {{ item.text }}
        <i class="fa fa-chevron-down m-l-5"/>
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  display: inline-flex;
  line-height: 30px;
  border-radius: 15px;
  margin: 20px 0;
  background: linear-gradient(rgb(2, 89, 46), rgb(1, 38, 20));
  a {
    display: block;
    color: white;
    padding: 0 25px;
    text-decoration: none;
    i {
      font-size: 8px;
    }
    &:hover {
      background-color: rgb(1, 43, 22);
      cursor: pointer;
    }
    &.active {
      background-color: rgb(1, 43, 22);
    }
  }
}
</style>
