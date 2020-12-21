<template>
  <button class="btn btn-default follow-jLq2u flex mid center p-0" @click="onFollow">
    <Check :class="{'active': followed}"/> <span>{{ text }}</span>
  </button>
</template>

<script>
import { gotoLogin } from '@/utils/client/common'
import Check from '@@/../components/icons/Check.vue'
export default {
  components: {
    Check,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    productId: [String, Number],
    followed: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    onFollow() {
      if (this.loading) {
        return
      }
      this.loading = true
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      this.GoGoHTTP.post(`/api/surface/navi/follow`, {
        seriesId: this.productId,
      })
        .then(() => {
          this.$emit('onfollowed', this.followed ? 0 : 1)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.follow-jLq2u {
  background: linear-gradient(#fff, #e3e3e3 70%, #d2d1d2);
  width: 120px;
  height: 30px;
  .icon-cls {
    width: 20px;
    height: 20px;
    color: #c5c5c5;
    &.active {
      color: #ffce06;
    }
  }
  span {
    margin: 2px 0 0 1px;
  }
  &:active,
  &:focus {
    border-color: #ccc;
    box-shadow: none;
    outline: none;
    background: #fdfdfd;
  }
  &:hover {
    opacity: 0.85;
  }
}
</style>

<docs>
  ```vue
  <template>
    <follow-btn :followed="1" :text="'abc'" @onfollowed="onFollow"/>
  </template>
    <script>
  export default {
    methods: {
      onFollow() {}
    }
  }
  </script>
  ```
</docs>
