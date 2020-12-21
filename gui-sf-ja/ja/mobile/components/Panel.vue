<template>
  <div class="panel panel-default">
    <!-- TODO - Hung: remove `if` statement when all panels was refactor to h2 -->
    <h2 class="panel-heading text-center m-0" v-if="isImportant">{{ title }}</h2>
    <div class="panel-heading text-center" v-else>{{ title }}</div>
    <div class="panel-body">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
}
</script>


<style lang="scss" scoped>
.panel {
  border: none;
  margin: 0;
}
.panel-heading {
  font-size: 4vw;
  color: white;
  background: #ccc;
  padding: 2vw 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.panel-body {
  padding: 4vw;
  background: #f5f5f5;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
h2 {
  line-height: 1.4;
}
</style>
