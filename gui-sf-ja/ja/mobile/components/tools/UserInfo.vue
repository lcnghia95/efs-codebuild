<template>
  <div>
    <div class="flex">
      <img :src="'/img/users/' + user.id || 0" class="user-info-img shadow" />
      <div class="user-info w-full ml-20">
        <div class="flex">
          <div class="title-info">{{ $t('1') }}</div>:&nbsp;
          <a :href="'/users/' + user.id">
            <b class="co-tools">{{ user.name || $t('4') }}</b>
          </a>
        </div>
        <div class="flex mt-10">
          <div class="title-info">{{ $t('2') }}</div>:&nbsp;
          <span class="grow11"><b class="co-tools" v-html="user.selfIntroduction || user.userSelfIntroduction"></b></span>
        </div>
        <div class="flex mt-10">
          <div class="title-info">{{ $t('3') }}</div>:&nbsp;
          <a :href="user.url" target="_blank" class="grow11"><b class="co-tools">{{ user.url || '-' }}</b></a>
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
  width: 20vw;
  height: 20vw;
  flex: 0 0 20vw;
}
.user-info {
  font-size: 14px;
  .title-info {
    width: 23vw;
    flex: 0 0 23vw;
    color: #707070;
  }
  .co-tools {
    line-height: 1.5;
    color: #3679b6;
    word-break: break-all;
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
