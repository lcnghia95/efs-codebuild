<template>
  <div class="header-blue-z flex space-between"
       :style="{ backgroundImage: `url(/img/assets/pc/common/headline-bl_${this.imgIndex || 1}.png)`}">
    <h2>{{ leftText }}</h2>
    <a class="cursor-pointer gogo-link" :href="rightUrl || ''">{{ rightText }}</a>
  </div>
</template>

<script>
export default {
  props: ['leftText', 'rightText', 'rightUrl', 'imgIndex'],
}
</script>

<style lang="scss" scoped>
.header-blue-z {
  background-color: white;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  padding: 3px 0;
  h2 {
    font-size: 19px;
    color: #079ee3;
    margin: 0;
    line-height: inherit;
    font-weight: 700;
  }
  /deep/ .gogo-link {
    margin: 15px 35px 0 0;
    font-size: 14px;
    color: #079ee3;
  }
}
</style>
