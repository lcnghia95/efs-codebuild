<template>
  <button :class="`btn btn-default follow-YD28V p-0 flex center ${theme}`" @click="onClick">
    <div class="flex mid">
      <Check :class="{'active': followed}"/> <span>{{ text }}</span>
    </div>
  </button>
</template>

<script>
import Check from '@@/../components/icons/Check.vue'
import { gotoLogin } from '@/utils/client/common'
export default {
  components: {
    Check,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    id: [String, Number],
    followed: {
      type: Number,
      default: 0,
    },
    theme: {
      type: String,
      default: 'theme-1',
    },
  },
  methods: {
    onClick() {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.follow-YD28V {
  &.theme-1 {
    background: #fdfdfd;
    width: 85px;
    height: 25px;
    span {
      font-size: 13px;
      margin: 2px 0 0 1px;
    }
    .icon-cls {
      color: #c5c5c5;
      flex: 0 0 25px;
      width: 25px;
      height: 25px;
    }
    .active {
      color: #ffce06;
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
  &.theme-2 {
    background: linear-gradient(#fff, #e3e3e3 70%, #d2d1d2);
    width: 120px;
    height: 30px;
    span {
      margin: 2px 0 0 1px;
    }
    .icon-cls {
      width: 20px;
      height: 20px;
      color: #c5c5c5;
      &.active {
        color: #ffce06;
      }
    }
    &:hover {
      opacity: 0.85;
    }
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
