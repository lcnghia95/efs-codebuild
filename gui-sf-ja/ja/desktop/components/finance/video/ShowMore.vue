<template>
  <div>
    <top-menu class="border-top" />
    <section class="sec__h01 mt-30">
      <div class="sec__head w-1000 flex mid">
        <h5 class="sec__tit">{{ $t(type) }}</h5>
        <span class="lbl flex center mid ml-10" :class="'lbl-' + type" v-if="type == 'premier' || type == 'gogojungletv'">
          {{ $t('lbl-' + type) }}
        </span>
      </div>
      <div class="vid-l w-1000 flex mt-15 flex-wrap">
        <video-horizontal01 class="mr-20 mb-20" v-for="item in dataVideoShow.data" :item="item" :key="'video-' + item.id" />
        <paging :cur-page="dataVideoShow.currentPage"
                :total="dataVideoShow.lastPage"
                :from="dataVideoShow.pagingFrom"
                :to="dataVideoShow.pagingTo"
                :has-scroll="true"
                :is-add-url-param="true"
                :origin-url="'/finance/videos/' + type"
                theme-class="theme1"
                @pagingclick="onPagingClick" class="w-full mt-10 text-center"
        />
      </div>
    </section>
  </div>
</template>

<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import VideoHorizontal01 from '@/components/video/VideoHorizontal01.vue'
import Paging from '@@/../components/paging/Paging.vue'
import i18n from '@@/lang/components-desktop/video-showmore.json'

export default {
  components: {
    TopMenu,
    VideoHorizontal01,
    Paging,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    dataVideoShow: {
      type: Object,
      default: () => {
        return {}
      },
    },
    onPagingClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      type: this.$route.path.split('/')[3],
    }
  },
}
</script>

<style lang="scss" scoped>
.sec__head {
  margin-bottom: 13px !important;
  .sec__tit {
    font-size: 22px;
    color: #4d4539;
  }
  .lbl {
    min-width: 40px;
    height: 22px;
    color: #fff;
    font-size: 14px;
    border-radius: 3px;
    padding-top: 1px;
    padding-left: 2px;
    padding-right: 2px;
    &-premier {
      background: #f60;
    }
    &-gogojungletv {
      background: #9c3;
    }
  }
}
.vid-l {
  .vid-i:nth-child(5n) {
    margin-right: 0;
  }
}
</style>
