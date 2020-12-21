<template>
  <div class="scroll-btn flex">
    <div class="btn-top flex layout-col mid center" @click="onClick">
      <ChevronLeft class="up-icon" />
      <span class="text-center">PAGE<br />TOP</span>
    </div>
  </div>
</template>

<script>
import ChevronLeft from '@@/../components/icons/ChevronLeft.vue'
export default {
  components: { ChevronLeft },
  methods: {
    onClick() {
      $('html, body').animate({ scrollTop: 0 }, 'slow')
    },
  },
  created() {
    $(window).on('scroll', function() {
      let scroll = document.body.scrollTop || document.documentElement.scrollTop
      $('.scroll-btn').css('display', scroll > 20 ? 'flex' : 'none')
    })
  },
}
</script>
<style lang="scss" scoped>
.scroll-btn {
  display: none;
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 9999999999;
  border: none;
  outline: none;
  div {
    border-radius: 50%;
    background: #00012d;
    color: white;
    border: 2px solid white;
    width: 70px;
    height: 70px;
    user-select: none;
    i.icon-cls {
      width: 20px;
      height: 20px;
    }
    &.btn-top {
      .up-icon {
        transform: rotate(90deg);
      }
      span {
        line-height: 14px;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
