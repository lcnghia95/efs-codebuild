<template>
  <a class="crowd-box shadow mt-20 mb-20 pb-20 mr-20" :href="'/crowdsourcing/' + item.id">
    <div class="crowd-tit w-full fs-13 text-center" :class="['title-' + (item.templateId || 0), { 'grey-title': !Object.keys(item.user).length }]">
      <b v-show="Object.keys(item.user).length">{{ $t('crowd-templates.' + (item.templateId || 0)) }}</b>
    </div>
    <div class="w-full text-center" v-show="Object.keys(item.user).length">
      <img class="user-avatar" :src="'/img/users/' + ((item.user || {}).id || 0) + '/small'" alt="" />
      <div class="fs-12 mb-10 mt-10 wrap-text pl-10 pb-10" :title="(item.user || {}).name || $t('4')">
        {{ (item.user || {}).name || $t('4') }}
      </div>
    </div>
    <div class="pl-10 pr-10 fs-12" v-show="Object.keys(item.user).length">
      <div class="crowd-item-title mb-10">
        <b v-if="Object.keys(item.user).length" v-wrap-lines="2" :title="item.title">{{ item.title }}</b>
      </div>
      <div class="flex mid">
        <ClockO />&nbsp;<span>{{ $t('1') }}: {{ formatTime(item.createdAt, 5) }}</span>
      </div>
      <div class="flex mid">
        <ClockO />&nbsp;<span>{{ $t('2') }}: {{ formatTime(item.bidEndAt, 5) }}</span>
      </div>
      <div class="flex">
        <div class="yen-icon flex mid center">￥</div> <span class="co-pink">&nbsp;{{ $t('3') }} {{ formatNumber(item.reward, 0) }}</span>
      </div>
    </div>
  </a>
</template>
<script>
import ClockO from '@@/../components/icons/ClockO.vue'
import i18n from '@@/lang/components-desktop/crowdsourcing-item.json'
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ClockO,
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
.crowd-box {
  background: white;
  text-decoration: none;
  width: 184px;
  color: #2d2d2d;
  &:nth-child(5n + 0) {
    margin-right: 0;
  }
  .crowd-tit {
    color: white;
    height: 30px;
    line-height: 31px;
  }
  .title-0 {
    background-color: #7dcbf0;
  }
  .title-1 {
    background-color: #9c3;
  }
  .title-2 {
    background-color: #f8b650;
  }
  .title-3 {
    background-color: #f19149;
  }
  .title-4 {
    background-color: #ccbd39;
  }
  .title-5 {
    background-color: #996c33;
  }
  .title-6 {
    background-color: #f29c9f;
  }
  .title-7 {
    background-color: #748fc7;
  }
  .grey-title {
    background-color: grey;
  }
  .user-avatar {
    width: 90px;
    height: 90px;
    margin-top: 10px;
  }
  .crowd-item-title {
    min-height: 35px;
    a {
      color: #2d2d2d;
    }
  }
  .yen-icon {
    border-radius: 50%;
    width: 14px;
    height: 14px;
    background: #dc1c39;
    color: white;
    font-size: 11px;
  }
  .icon-cls {
    width: 14px;
    height: 14px;
  }
  .co-pink {
    color: #dc1c39;
  }
}
</style>
