<template>
  <div class="crowd-item pb-10" @click="handleFocus">
    <div class="crowd-item-header wrap-text" :class="['title-' + (item.templateId || 0), { 'grey-title': !Object.keys(item.user).length }]">
      {{ $t('crowd-templates.' + (item.templateId || 0)) }}
    </div>
    <div class="crowd-item-img text-center pl-10 pr-10 mt-5">
      <Lzimg :data-src="'/img/users/' + ((item.user || {}).id || 0) + '/small'" alt="" />
      <div class="wrap-text pt-5 fs-12" :title="(item.user || {}).name || $t('4')">{{ (item.user || {}).name || $t('4') }}</div>
    </div>
    <div class="pl-5 pr-5" v-if="Object.keys(item.user).length">
      <div class="crowd-item-title mb-5" v-wrap-lines="2">
        <b v-if="Object.keys(item.user).length">{{ item.title }}</b>
      </div>
      <div class="flex info-row">
        <div class="mr-5 row-icon"><ClockO /> </div>
        <div class="row-content flex flex-wrap"><div>{{ $t('1') }}:</div> <div>{{ formatTime(item.createdAt, 1) }}</div> </div>
      </div>
      <div class="flex info-row">
        <div class="mr-5 row-icon"><ClockO /> </div>
        <div class="row-content flex flex-wrap">
          <div>{{ $t('2') }}:</div>
          <div>{{ formatTime(item.bidEndAt, 1) }}</div>
        </div>
      </div>
      <div class="flex info-row co-pink" style="font-weight: bold;">
        <div class="row-icon mr-5"><div class="yen-icon">￥</div></div>
        <div class="row-content flex flex-wrap">
          <div>{{ $t('3') }}:</div>
          <div>{{ formatNumber(item.reward, 0) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowdsourcing-item.json'
import ClockO from '@@/../components/icons/ClockO.vue'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ClockO,
    Lzimg,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleFocus() {
      location.href = `/crowdsourcing/${this.item.id}`
    },
  },
}
</script>

<style lang="scss" scoped>
.crowd-item {
  background: #fff;
  margin-bottom: 1px;
  box-shadow: 0 0 0 0.5px #e0dedc;
  margin-top: 1px;
  margin-right: 1px;
  .crowd-item-header {
    color: #fff;
    font-size: 1.2rem;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding: 0 5px;
  }
  &:active {
    opacity: 0.8;
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
  .crowd-item-img {
    height: 80px;
    img {
      margin: auto;
      height: 57px;
    }
  }
  .crowd-item-title {
    height: 38px;
    overflow: hidden;
    color: #2d2d2d;
    text-align: center;
  }
  .row-icon {
    padding-top: 2px;
  }
  .row-content {
    word-break: break-word;
  }
  .yen-icon {
    border-radius: 50%;
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    background: #dc1c39;
    color: white;
    font-size: 10px;
    text-align: center;
    margin-top: 1px;
    line-height: 16px;
  }
  .icon-cls {
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
  }
  .co-pink {
    color: #e5455d;
  }
  .info-row {
    min-height: 20px;
  }

  /* &:nth-child(3n - 1) {
    border-right: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
  } */
}
@media only screen and (max-width: 321px) {
  .crowd-item {
    width: calc(50% - 1px);
    .info-row {
      min-height: 20px;
      font-size: 15px;
    }
    &:nth-child(odd) {
      width: 50%;
      margin-right: 0;
    }
  }
}
@media only screen and (min-width: 321px) and (max-width: 700px) {
  .crowd-item {
    width: calc(100% / 3 - 1px);
    &:nth-child(3n) {
      width: calc(100% / 3);
      margin-right: 0;
    }
  }
}
@media only screen and (min-width: 701px) {
  .crowd-item {
    width: calc(25% - 1px);
    &:nth-child(4n) {
      width: 25%;
      margin-right: 0;
    }
  }
}
</style>