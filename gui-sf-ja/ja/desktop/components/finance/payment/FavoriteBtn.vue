<template>
  <button class="btn btn-default fav-GbWjM flex mid center p-0" @click="onFavorite">
    <Star :class="{'active': isFavorite}"/> <span>{{ text }}</span>
  </button>
</template>

<script>
import Star from '@@/../components/icons/Star.vue'
export default {
  components: {
    Star,
  },
  props: {
    productId: [String, Number],
    infoObj: String,
    text: {
      type: String,
      default: '',
    },
    isFavorite: Number,
  },
  methods: {
    onFavorite() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.fav-GbWjM {
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
