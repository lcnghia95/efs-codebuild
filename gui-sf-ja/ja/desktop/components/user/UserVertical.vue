<template>
  <GogoLink class="user-vertical p-10" :target="'/users/' + user.id">
    <div class="user-img pos-rel">
      <img class="pos-abs" :src="'/img/users/' + user.id" :alt="alt">
    </div>
    <div class="user-name mt-5 text-center" v-wrap-lines="2" :title="user.name">{{ user.name }}</div>
  </GogoLink>
</template>
<script>
import GogoLink from '@@/../components/link/GogoLink.vue'
export default {
  components: { GogoLink },
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      },
    },
    alt: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang="scss" scoped>
.user-vertical {
  width: 90px;
  box-sizing: content-box;
  position: relative;
  &:hover {
    background: #f5f5f5;
  }
  .user-img {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border: 1px solid #bdbdbd;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user-name {
    min-height: 38px;
    line-height: 17px;
    overflow: hidden;
    color: #666;
  }
}
</style>

<docs>
  ```vue
  <template>
    <user-vertical :user="user"/>
  </template>
  <script>
  export default {
    data() {
      return {
        user: {
          "id": 19078,
          "name": "米倉 大"
        }
      }
    },
  }
  </script>
  ```
</docs>
