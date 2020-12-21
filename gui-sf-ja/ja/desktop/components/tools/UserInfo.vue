<template>
  <div>
    <div class="flex">
      <img :src="'/img/users/' + user.id || 0" class="user-info-img" />
      <div class="user-info w-full ml-40">
        <div class="flex">
          <div class="title-info mr-30">{{ $t('1') }}</div>
          <a :href="'/users/' + user.id">
            <b class="co-tools">{{ user.name || $t('4') }}</b>
          </a>
        </div>
        <div class="flex mt-20">
          <div class="title-info mr-30">{{ $t('2') }}</div>
          <b class="co-tools" v-html="user.selfIntroduction || user.userSelfIntroduction"></b>
        </div>
        <div class="flex mt-20">
          <div class="title-info mr-30">{{ $t('3') }}</div>
          <a :href="user.url" target="_blank"><b class="co-tools">{{ user.url }}</b></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/tools-userinfo.json'
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.user-info-img {
  width: 120px;
  height: 120px;
  flex: 0 0 120px;
}
.user-info {
  font-size: 18px;
  .title-info {
    width: 120px;
    flex: 0 0 120px;
    color: #707070;
  }
  .co-tools {
    line-height: 1.5;
    color: #3679b6;
  }
}
</style>

<docs>
  ```vue
  <template>
    <UserInfo :user="user"/>
  </template>
  <script>
  export default {
    data() {
      return {
        user: {
          "id": 111363,
          "name": "CY",
          "transaction": "＊＊＊＊＊＊＊＊＊＊6247"
        }
      }
    },
  }
  </script>
  ```
</docs>
