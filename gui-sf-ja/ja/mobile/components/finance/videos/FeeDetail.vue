<template>
  <div class="video">
    <!-- header -->
    <div class="video-header flex space-between">
      <span class="video-header-title">{{ $t(11) }}</span>
      <span class="purchase-btn flex" @click="isShowModal = true">
        <DesktopAlt />
        <div style="min-width: 100px;">{{ $t(2, {count: purchased.length || 0}) }}</div>
      </span>
    </div>
    <div style="background: #2d2d2d;">
      <!-- video frame -->
      <div class="video-iframe-ctn">
        <iframe class="w-full h-full" :src="youtubeParser(dataVideo.watchUrl)" v-if="dataVideo.watchUrl" frameborder="0" allowfullscreen></iframe>
        <img v-else :src="dataVideo.thumbnailUrl" />
      </div>
      <!-- video name -->
      <template v-if="dataVideo.description">
        <div class="video-info p-10 flex space-between" @click="isShowDetail = !isShowDetail">
          <span class="video-name" v-wrap-lines="3">
            {{ dataVideo.title }}
          </span>
          <span>
            <AngleUp v-if="isShowDetail" />
            <AngleDown v-else />
          </span>
        </div>
      </template>
      <template v-else>
        <div class="video-info p-10 flex space-between">
          <span class="video-name" style="width: 100%;" v-wrap-lines="3">
            {{ dataVideo.title }}
          </span>
        </div>
      </template>
    </div>
    <!-- favorite -->
    <div class="video-others"
         v-if="isShowDetail"
    >
      <div class="flex space-between">
        <Rate :stars="(dataVideo.review || {}).stars"
              :number="(dataVideo.review || {}).count"
              :alway-show="true"
              :target="dataVideo.productId"
        />
        <button @click="onFavorite"
                class="favorite-btn flex"
                :class="{ 'active': info.isFavorite }"
        >
          {{ $t(3) }}<star />
        </button>
      </div>
      <div class="video-des mt-10" v-if="dataVideo.description" v-html="dataVideo.description"></div>
    </div>
    <!-- payment -->
    <Payment01 class="mt-15 mb-15" />
    <!-- tabs -->
    <div class="flex">
      <div class="tabs-item text-center flex mid"
           :class="{active: tab == 'outline'}"
           @click="tab = 'outline'"
      >
        <span style="margin: 0 auto;"> {{ $t(10) }} </span>
      </div>
      <div class="tabs-item text-center flex mid"
           :class="{active: tab == 'userIntroduction'}"
           @click="tab = 'userIntroduction'"
      >
        <span style="margin: 0 auto;"> {{ $t(9) }} </span>
      </div>
      <div class="tabs-item text-center flex mid"
           :class="{active: tab == 'community'}"
           @click="tab = 'community'"
      >
        <span style="margin: 0 auto;"> {{ $t(8, {total: dataVideo.commuTotal || 0}) }} </span>
      </div>
    </div>
    <div class="tabs-content">
      <div class="p-15 outline" v-if="tab == 'outline'" v-html="dataVideo.outline"></div>
      <div v-if="tab == 'userIntroduction'" class="user-intro mt-20 mb-30">
        <div class="flex border-bottom pt-5 pb-5">
          <div class="title">{{ $t('4') }}</div>
          <div>{{ dataVideo.userName || $t('11') }}</div>
        </div>
        <div class="flex border-bottom pt-5 pb-5">
          <div class="title">{{ $t('5') }}</div>
          <div class="pre-wrap">{{ dataVideo.userIntroduction }}</div>
        </div>
        <div class="flex pt-5 pb-5">
          <div class="title">{{ $t('6') }}</div>
          <a class="pre-wrap" :href="dataVideo.userUrl">{{ dataVideo.userUrl || '-' }}</a>
        </div>
      </div>
      <template v-if="tab == 'community'">
        <FinanceCommunity
          :get-data="getCommunityData"
          :id="dataVideo.productId"
          :commu-total="dataVideo.commuTotal || 0"
          @posted="onPosted"
          @update-total="onUpdateTotal"
          @delete-reply="onDeleteReply"
        />
      </template>
    </div>
    <!-- other + recommend -->
    <div class="pt-10 pl-10 mb-0 video-others-header">{{ $t(12) }}</div>
    <VideoHorizontal01 v-for="(item, index) in others" :item="item" :key="item.id + 'videoitem1' + index" />
    <!-- <div @click="calPaging('others')" v-if="!isLoading">
      <LoadMore class="mb-25" style="border-bottom: 1px solid #e0dedc;" />
    </div> -->
    <div class="pt-10 pl-10 mb-0 video-others-header">{{ $t(13) }}</div>
    <VideoHorizontal01 v-for="(item, index) in recommendShow" :item="item" :key="item.id + 'videoitem' + index" />
    <div @click="calPaging('recommend', ++page)" v-if="!isLoading && isShowRecommendShowMore">
      <LoadMore class="mb-25" style="border-bottom: 1px solid #e0dedc;" />
    </div>
    <Loading v-else-if="isShowRecommendShowMore" />
    <!-- modal -->
    <GogoModal class="c-modal"
               :show="isShowModal"
               @close="isShowModal = false"
               width="90vw"
               height="90vh"
    >
      <div slot="modal-body" class="modal-body">
        <a class="related-item wrap-text"
           v-for="(item, index) in purchased"
           :href="'/finance/videos/' + item.id"
           :key="item.id + index"
        >
          <DesktopAlt />
          {{ item.title }}
        </a>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import { youtubeParser, calPaging, gotoLogin } from '@/utils/client/common'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import DesktopAlt from '@@/../components/icons/DesktopAlt.vue'
import VideoHorizontal01 from '@/components/finance/videos/VideoHorizontal01.vue'
import Payment01 from '@/components/payment/Payment01.vue'
import LoadMore from "@/components/common/LoadMore.vue"
import i18n from '@@/lang/components-mobile/finance-video-detail.json'
import Rate from '@@/../components/product/Rate.vue'
import Star from '@@/../components/icons/Star.vue'
import FinanceCommunity from '@/components/finance/FinanceCommunity.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'
export default {
  components: {
    AngleUp,
    AngleDown,
    DesktopAlt,
    VideoHorizontal01,
    LoadMore,
    Payment01,
    Rate,
    Star,
    FinanceCommunity,
    GogoModal,
    Loading,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    dataVideo: {
      type: Object,
      default() { 
        return {}
      },
    },
    purchased: {
      type: Array,
      default() {
        return []
      },
    },
    others: {
      type: Array,
      default() {
        return []
      },
    },
    recommend: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      isShowDetail: true,
      page: 1,
      tab: 'outline',
      recommendShow: [],
      isShowRecommendShowMore: true,
      isShowModal: false,
      isLoading: false,
    }
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
  mounted() {
    this.calPaging('recommend', 1)
  },
  methods: {
    youtubeParser,
    onFavorite() {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      this.$store.dispatch('cart/favorite', this)
    },
    getCommunityData(cb, needRefresh = false) {
      if (!this.communities || needRefresh) {
        this.GoGoHTTP.get(
          `/api/v3/surface/communities?productId=${this.dataVideo.productId}`
        )
          .then(data => {
            if (!data.comments) {
              data.comments = []
            }
            this.communities = data
            cb(data)
          })
          .catch(() => {
            cb({ comments: [] })
          })
      } else {
        cb(this.communities)
      }
    },
    calPaging(type, page) {
      if(type == 'recommend') {
        let data = calPaging(this.recommend, page, 10, 4)['data']
        if(data.length) {
          this.recommendShow = this.recommendShow.concat(data)
        } else {
          this.isShowRecommendShowMore = false
        }
        if(this.recommend.length == this.recommendShow.length) {
          this.isShowRecommendShowMore = false
        }
      }
    },
    onUpdateTotal(number) {
      this.dataVideo.commuTotal = number
    },
    onDeleteReply() {
      this.dataVideo.commuTotal = this.dataVideo.commuTotal - 1
    },
    onPosted() {
      this.dataVideo.commuTotal = this.dataVideo.commuTotal + 1
    },
  }, 
}
</script>

<style lang="scss" scoped>
.video {
  .video-header {
    background: #2d2d2d;
    height: 50px;
    color: #fff;
    line-height: 50px;
    padding: 0 5px;
    .video-header-title {
      font-size: 16px;
      font-weight: 800;
    }
    .purchase-btn {
      text-align: right;
      white-space: nowrap;
      font-size: 12px;
    }
    .icon-cls {
      width: 13px;
      /deep/ svg {
        height: 48px;
      }
    }
  }
  .video-info {
    color: #fff;
    background: #2d2d2d;
    .video-name {
      width: 90%;
      font-weight: bold;
    }
    .icon-cls {
      width: 20px;
      height: 20px;
    }
  }
  .video-others-header {
    font-size: 16px;
    border-top: 1px solid #e0dedc;
    color: #434343;
    padding-top: 19px;
  }
  .video-others {
    word-wrap: break-word;
    background: #2d2d2d;
    padding: 10px 10px 25px 10px;
  }
  .video-des {
    color: #fff;
  }
  .video-iframe-ctn {
    width: 100%;
    height: 220px;
    background: #2d2d2d;
    display: inline-block;
    text-align: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .favorite-btn {
    line-height: 24px;
    height: 25px;
    border-radius: 15px;
    background: transparent;
    font-size: 12px;
    border: 1px solid #fff;
    padding: 0 15px;
    color: #fff;
    outline: none;
    margin-left: auto;
    .icon-cls {
      width: 15px;
      height: 23px;
      /deep/ svg {
        height: 22px;
        path {
          fill: #fff;
        }
      }
    }
    &.active {
      color: #fcd605;
      border-color: #fcd605;
      .icon-cls /deep/ svg path {
        fill: #fcd605;
      }
    }
  }
  /deep/ .gg-rating {
    font-size: 16px;
    .rate-num {
      font-size: 12px;
      line-height: 23px;
      color: #fff;
    }
  }
}
.tabs-item {
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  border-top: 1px solid #d0d0d0;
  border-right: 1px solid #d0d0d0;
  font-size: 15px;
  background: #f3f0ef;
  color: #bdbdbd;
  padding: 0 5px;
  &.active {
    background: #fff;
    border-bottom: none;
    color: #434343;
  }
}
.tabs-content {
  word-break: break-all;
  .outline {
    white-space: pre-wrap;
    /deep/ > * {
      overflow-x: auto;
    }
    /deep/ * {
      max-width: 100% !important;
      img {
        height: auto;
        &.ext-content {
          height: 0 !important;
        }
      }
    }
  }
}
.user-intro {
  color: #333;
  padding: 10px;
  .pre-wrap {
    word-break: break-word;
  }
  .title {
    min-width: 100px;
    font-weight: bold;
  }
  .border-bottom {
    border-bottom: 1px solid #ddd;
  }
  /deep/ .modal-content {
    overflow: hidden;
  }
}
.related-item {
  white-space: nowrap;
  font-size: 12px;
  border-bottom: 1px solid #707070;
  height: 50px;
  line-height: 50px;
  padding: 0 17px;
  display: block;
  color: #337ab7;
  .icon-cls {
    width: 13px;
    height: 16px;
    /deep/ svg {
      height: 22px;
    }
  }
}
.modal-body {
  overflow: auto;
  height: 100% !important;
}
/deep/ .btn-loadmore .icon-cls {
  width: 20px !important;
  height: 22px !important;
}
</style>