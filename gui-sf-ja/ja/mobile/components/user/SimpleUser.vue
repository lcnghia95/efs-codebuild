<template>
  <div class="user flex mb-0">
    <a class="block w-40 no-underlying">
      <Lzimg width="40" height="40" :data-src="'/img/users/'+user.id+'/small'" alt />
    </a>
    <p class="mt-10 mb-10 break-word text-overflow wrap-text" :href="'/users/' + user.id">
      <a class="no-underlying" :href="'/users/' + user.id">{{ user.nickName || $t('31') }}</a>
    </p>
    <a :href="'/users/' + user.id">
      <ChevronRight class="custom-chevron" :href="'/users/' + user.id" />
    </a>
  </div>
</template>

<script>
import Lzimg from "@@/../components/Lzimg.vue"
import i18n from "@@/lang/mobile/users-id.json"
import ChevronRight from "@@/../components/icons/ChevronRight.vue"
export default {
  i18n: {
    messages: i18n
  },
  components: {
    Lzimg,
    ChevronRight
  },
  props: {
    user: {
      type: [Object, Array],
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="" scoped>
.custom-chevron {
  color: #b2b2b2;
  width: 24px;
  align-items: center;
  display: flex;
}
.user {
  border-bottom: 1px solid #e0dedc;
  flex-direction: row;
  padding: 5px 10px;
  align-items: center;
}
.text-overflow {
  width: calc(100% - 66px);
  padding: 0 5px;
}
</style>