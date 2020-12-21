<template>
  <div class="w-1000 flex layout-col grow1 m-b-20 p-b-40">
    <a class="header no-underlying" href="/event">
      <img :src="'/img/assets/pc/events/UI_07.png'" alt="">
      <h2 class="m-tb-0 co-white text-center">
        <b>{{ $t('6') }}</b>
      </h2>
    </a>
    <div class="event-detail">
      <p class="fs-16 mt-20 m-b-20">{{ $t('7') }}({{ (data.data || []).length }}{{ $t('8') }})</p>
      <region v-for="(region,index) in data.data" :categories="$t('categories')" :region="region" :key="'regionedx'+index"/>
      <div class="flex center">
        <paging :cur-page="data.currentPage"
                :total="data.lastPage"
                :from="data.pagingFrom"
                :to="data.pagingTo"
                :has-scroll="true"
                theme-class="theme1"
                @pagingclick="onPagingClick" class="mt-15"/>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/event-index.json'
import region from '@/components/event/region.vue'
import Paging from '@@/../components/paging/Paging.vue'
export default {
  props: {
    data: {
      type: [Object, Array],
      default: () => {
        return {}
      },
    },
    onPagingClick: Function,
  },
  components: {
    region,
    Paging,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
$header-height: 180px;
.header {
  position: relative;
  height: $header-height;
  z-index: 1;
  h2 {
    height: $header-height;
    line-height: $header-height;
  }
  img {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
}
.event-detail {
  width: 800px;
  margin: 0 auto;
  .fs-16 {
    font-size: 16px;
  }
}
</style>
