<template>
  <div class="border-all main-dev p-10 no-underlying">
    <a v-if="item.userId" class="w-full" :href="'/crowdsourcing/developers/' + item.userId">
      <div class="text-center">
        <img class="user-avatar" :src="'/img/users/' + item.userId + '/small'" alt="">
      </div>
      <div class="fs-12 mb-5 text-center">{{ item.userName || $t('3') }}</div>
      <div>{{ $t('1') }}： {{ item.total }} {{ $t('2') }}</div>
    </a>
    <Rate class="mb-10" :stars="item.stars" :number="item.count" :target="'/crowdsourcing/developers/' + item.userId"/>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import i18n from '@@/lang/components-desktop/crowdsourcing-dev.json'
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    Rate,
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
.main-dev {
  min-height: 190px;
  width: 130px;
  .user-avatar {
    width: 90px;
    height: 90px;
    margin-top: 10px;
  }
  a {
    display: block;
    color: #2d2d2d;
  }
}
</style>
