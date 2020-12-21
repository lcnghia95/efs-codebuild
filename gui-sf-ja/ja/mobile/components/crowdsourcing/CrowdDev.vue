<template>
  <div class="dev-item flex layout-col mb-10 mid space-between">
    <a class="flex item-img layout-col" :href="'/crowdsourcing/developers/' + item.userId">
      <Lzimg class="user-avatar" :data-src="'/img/users/' + item.userId + '/small'" alt="" />
    </a>
    <div class="flex layout-col mid w-full">
      <div class="mt-10 wrap-text item-link w-full" :href="'/crowdsourcing/developers/' + item.userId">{{ item.userName }}</div>
      <a class="total item-link" :href="'/crowdsourcing/developers/' + item.userId">{{ $t('1') }}:{{ item.total }}{{ $t('2') }}</a>
      <Rate :alway-show="true"
            :stars="item.stars"
            :number="item.count"
            :target="'/crowdsourcing/developers/' + item.userId"
      />
    </div>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import i18n from '@@/lang/components-mobile/crowdsourcing-dev.json'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    Lzimg,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  }
}
</script>

<style lang="scss" scoped>
.dev-item {
  height: 220px;
  border: 1px solid #d2d2d2;
  padding: 8px;
  text-align: center;
  color: #707070;
  &:active {
    opacity: 0.7;
  }
  .total {
    line-height: 21px;
  }
  .item-img {
    height: calc(100% - 70px);
    width: 100%;
    display: block;
    text-decoration: none;
    color: #707070;
    img {
      object-fit: contain;
      height: auto;
      width: auto;
      max-width: 100%;
      min-width: 80%;
      max-height: 100%;
    }
  }
  .item-link {
    display: block;
    text-decoration: none;
    color: #707070;
    line-height: 24px;
  }
}
@media only screen and (max-width: 400px) {
  .dev-item {
    width: calc(50% - 5px);
    &:nth-child(even) {
      margin-left: 10px;
    }
  }
}
@media only screen and (min-width: 401px) and (max-width: 750px) {
  .dev-item {
    width: calc(33.333% - 8px);
    &:nth-child(3n - 1) {
      margin: 0 8px;
    }
  }
}
@media only screen and (min-width: 751px) {
  .dev-item {
    width: calc(25% - 15px);
    &:nth-child(4n - 1) {
      margin: 0 20px;
    }
    &:nth-child(4n - 2) {
      margin-left: 20px;
    }
  }
}
</style>