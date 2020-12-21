<template>
  <div class="aside_content_title">
    <div class="aside_content_title_left">
      <p class="new fs-14"><b>{{ data.title }}</b></p>
      <p class="shinchaku">{{ data.subtitle }}</p>
    </div>
    <div class="triangle"></div>
    <div class="aside_content_title_right">{{ data.rightTitle }}&nbsp;{{ formatTime(data.time, 21) }}</div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  }
}
</script>
<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
.triangle {
  width: 0;
  height: 0;
  border-top: 56px solid #e0f22f;
  border-right: 60px solid transparent;
  display: inline-block;
  position: absolute;
}
.aside_content_title {
  margin-bottom: 10px;
  min-width: 170px;
  width: 100%;
}
.aside_content_title_left {
  width: 110px;
  background: #e0f22f;
  height: 56px;
  display: inline-block;
  padding: 10px;
  color: #2e4f00;
}
.aside_content_title_left .new {
  font-family: "Yantramanav", sans-serif;
}
.aside_content_title_left .shinchaku {
  font-size: 12px;
}
.aside_content_title_right {
  font-size: 10px;
  color: #ccc;
  text-align: right;
}
</style>