<template>
  <button class="btn btn-default fav-F7AR2 flex mid center p-0 flex center" @click="onFavorite">
    <Star :class="{'active': isFavorite}"/> <span>{{ text }}</span>
  </button>
</template>

<script>
import Star from '@@/../components/icons/Star.vue'
import { gotoLogin } from '@/utils/client/common'
export default {
  components: {
    Star,
  },
  props: {
    id: [String, Number],
    text: {
      type: String,
      default: '',
    },
    isFavorite: Number,
  },
  methods: {
    onFavorite() {
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
.fav-F7AR2 {
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
</style>

<docs>
  ```vue
  <template>
    <favorite-btn :info-obj="'serie'" :text="'abc'" :product-id="id"/>
  </template>
    <script>
  export default {
    methods: {
      onFollow() {}
    },
    data() {
      return {
        id: 1234
      }
    }
  }
  </script>
  ```
</docs>
