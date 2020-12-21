<template>
  <div class="spinner text-center">
    <div class="bounce1"/>
    <div class="bounce2"/>
    <div class="bounce3"/>
  </div>
</template>

<script>
export default {
  created() {
    if (process.browser) {
      $('body').css('overflow', 'hidden')
    }
  },
  beforeDestroy() {
    $('body').css('overflow', 'auto')
  },
}
</script>


<style lang="scss" scoped>
$color9: #eee;
$color42: #7e7e7e;
// @formatter:off
.spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $color9;
  z-index: 999;
  & > div {
    width: 18px;
    height: 18px;
    top: 50%;
    position: relative;
    background-color: $color42;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
}
@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}
@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
// @formatter:on
</style>
