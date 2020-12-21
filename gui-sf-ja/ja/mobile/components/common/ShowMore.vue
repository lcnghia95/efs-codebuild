<template>
  <GogoLink class="btn-loadmore flex mid content-end no-underlying" :target="target">
    {{ text }}
    <span class="flex mid center ml-5"><ArrowRight /></span>
  </GogoLink>
</template>
<script>
import ArrowRight from '@@/../components/icons/ArrowRight.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
export default {
  components: {
    ArrowRight,
    GogoLink,
  },
  props: {
    text: {
      type: String,
      default: 'もっと見る',
    },
    target: {
      type: [String, Object],
      default: '/',
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-loadmore {
  color: #707070;
  span {
    width: 15px;
    height: 15px;
    background: #747474;
    border-radius: 50%;
    i.icon-cls {
      width: 15px;
      height: 15px;
      color: white;
    }
  }
}
.border {
  background: white;
  border: 1px #e0dedc solid;
  border-radius: 5px;
  justify-content: center;
  padding: 1.5vw 3vw;
  font-size: 3.5vw;
}
@media only screen and (min-width: 600px) {
  .btn-loadmore {
    font-size: 3vw;
    span {
      width: 3.5vw;
      height: 3.5vw;
    }
  }
}
</style>
