<template>
  <div>
    <div class="top-header">
      <div class="txt-ctn">
        <div class="txt-1 wrap-text">{{ $t(1) }}</div>
        <div class="txt-2 wrap-text">{{ $t(2) }}</div>
        <div class="txt-3 wrap-text">{{ $t(3) }}</div>
      </div>
      <a class="green-btn" :href="$store.state.user.id ? '/mypage/crowdsourcing/input' : '/login?u=/mypage/crowdsourcing/input'">{{ $t(4) }}</a>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/crowdsourcing-header.json'
export default {
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
@media (max-width: 350px) {
  .top-header {
    background-size: auto 100% !important;
    .text-1 {
      white-space: pre-wrap;
    }
    .txt-2 {
      font-size: 21px !important;
      line-height: 39px;
      margin-bottom: 5px;
    }
  }
}
.top-header {
  min-height: 160px;
  background-image: url(/img/assets/mobile/crowdsourcing/UI_01.jpg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center 0;
  padding-top: 25px;
  .green-btn {
    width: 80%;
    margin: 12px auto 0 auto;
    text-align: center;
    height: 40px;
    background: #00a300;
    color: #fff;
    line-height: 40px;
    border-radius: 5px;
    position: relative;
    display: block;
    &:active {
      opacity: 0.8;
    }
    &::after {
      content: '>';
      position: absolute;
      right: 12px;
    }
  }
  .txt-ctn {
    min-width: 300px;
    color: #fff;
    text-align: center;
  }
  .txt-1 {
    font-size: 9px;
  }
  .txt-2 {
    font-size: 25px;
    font-weight: bold;
  }
  .txt-3 {
    font-size: 13px;
    margin-top: -8px;
    font-weight: bold;
  }
}
</style>