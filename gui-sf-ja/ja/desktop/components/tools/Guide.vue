<template>
  <div class="border-radius-5 pt-20 pb-20 pl-30 pr-30 guide">
    <h4 class="title flex space-between mid">
      <b>{{ $t('1') }}</b>
      <b class="sub-title">{{ $t('2') }}</b>
    </h4>
    <p class="guide-des pt-15 mb-30">{{ $t('3') }}</p>
    <div class="flex space-between mid ml-30 mr-30">
      <div class="flex layout-col mid">
        <div class="circle flex mid center mb-15">
          <b>01</b>
        </div>
        <div>
          <b>{{ $t('4') }}</b>
        </div>
      </div>
      <ArrowRight class="arrow"/>
      <div class="flex layout-col mid">
        <div class="circle flex mid center mb-15">
          <b>02</b>
        </div>
        <div>
          <b>{{ $t('5') }}</b>
        </div>
      </div>
      <ArrowRight class="arrow"/>
      <div class="flex layout-col mid">
        <div class="circle flex mid center mb-15">
          <b>03</b>
        </div>
        <div>
          <b>{{ $t('6') }}</b>
        </div>
      </div>
    </div>
    <div class="flex center">
      <button class="flex mid center btn-view mt-30" @click="onClickRegister">
        <Pencil02 class="mr-5"/>
        {{ $t('7') }}
      </button>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-guide.json'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import ArrowRight from '@@/../components/icons/ArrowRight.vue'
export default {
  components: {
    Pencil02,
    ArrowRight,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onClickRegister() {
      if (!this.$store.state.user.id) {
        location.href = '/register?u=' + encodeURIComponent(location.href)
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.guide {
  background-color: #77cdd5;
  border-radius: 7px;
  .title {
    font-size: 21px;
    color: white;
    .sub-title {
      font-size: 28px;
      color: #434a54;
    }
  }
  .guide-des {
    line-height: 2;
    color: #434a54;
    border-top: 2px solid white;
  }
}
.circle {
  width: 60px;
  height: 60px;
  background-color: white;
  font-size: 32px;
  color: #434a54;
  border-radius: 50%;
  ~ div {
    font-size: 16px;
    color: #434a54;
  }
}
.arrow {
  width: 65px;
  height: 100px;
  color: white;
}
.btn-view {
  width: 400px;
  height: 50px;
  background-color: #508f95;
  border: none;
  font-size: 20px;
  color: white;
  border-radius: 5px;
  letter-spacing: 3px;
  i {
    width: 25px;
    height: 25px;
  }
  &:hover {
    opacity: 0.9;
  }
}
</style>
