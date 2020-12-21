<template>
  <div class="video">
    <!-- header -->
    <div class="video-header flex space-between">
      <span class="video-header-title">{{ $t(1) }}</span>
      <span class="purchase-btn flex" @click="isShowModal = true">
        <DesktopAlt />
        <div style="min-width: 115px;">{{ $t(2, {count: purchased.length || 0}) }}</div>
      </span>
    </div>
    <!-- video frame -->
    <div class="video-iframe-ctn">
      <iframe class="w-full h-full" :src="youtubeParser(dataVideo.watchUrl)" frameborder="0" allowfullscreen></iframe>
    </div>
    <!-- video name + content -->
    <template v-if="dataVideo.content">
      <div class="video-info p-10 flex space-between" @click="isShowDetail = !isShowDetail">
        <span class="video-name">
          {{ dataVideo.title }}
        </span>
        <span>
          <AngleUp v-if="isShowDetail" />
          <AngleDown v-else />
        </span>
      </div>
      <div class="video-related p-10" 
           v-html="dataVideo.content" 
           v-if="isShowDetail && dataVideo.content"
      >
      </div>
    </template>
    <template v-else>
      <div class="video-info p-10 flex space-between" @click="isShowDetail = !isShowDetail">
        <span class="video-name" style="width: 100%;">
          {{ dataVideo.title }}
        </span>
      </div>
    </template>
    <!-- related videos + load more -->
    <div style="border-top: 1px solid #e0dedc;" class="pl-10 pr-10 mb-0 video-related-header">関連動画</div>
    <VideoHorizontal01 v-for="(item, index) in related" :item="item" :key="item.id + 'freevideo' + index" />
    <div @click="$emit('onLoadMore', 'related', page++)" v-if="!isLoading">
      <LoadMore class="mb-25" style="border-bottom: 1px solid #e0dedc;" />
    </div>
    <Loading v-else />
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
import { youtubeParser } from '@/utils/client/common'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import DesktopAlt from '@@/../components/icons/DesktopAlt.vue'
import VideoHorizontal01 from '@/components/finance/videos/VideoHorizontal01.vue'
import LoadMore from "@/components/common/LoadMore.vue"
import Loading from '@@/../components/icons/Loading.vue'
import i18n from '@@/lang/components-mobile/finance-video-detail.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
export default {
  components: {
    AngleUp,
    AngleDown,
    DesktopAlt,
    VideoHorizontal01,
    GogoModal,
    LoadMore,
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
    related: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      isShowDetail: false,
      page: 1,
      isShowModal: false,
      isLoading: false,
    }
  },
  methods: {
    youtubeParser,
  }, 
}
</script>

<style lang="scss" scoped>
.video {
  .video-header {
    background: #f3f0ef;
    height: 50px;
    color: #707070;
    line-height: 50px;
    padding: 0 5px;
    .video-header-title {
      font-size: 16px;
      font-weight: bold;
    }
    .purchase-btn {
      text-align: right;
      white-space: nowrap;
    }
    .icon-cls {
      width: 13px;
      /deep/ svg {
        height: 48px;
      }
    }
  }
  .video-info {
    color: #434343;
    .video-name {
      width: 90%;
      font-weight: bold;
      word-break: break-word;
    }
    .icon-cls {
      width: 20px;
      height: 20px;
    }
  }
  .video-related-header {
    font-size: 16px;
    color: #434343;
    padding-top: 19px;
  }
  .video-related {
    border-top: 1px solid #e0dedc;
    word-wrap: break-word;
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
  .video-iframe-ctn {
    width: 100%;
    height: 220px;
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
  /deep/ .modal-content {
    overflow: hidden;
  }
  .modal-body {
    overflow: auto;
    height: 100%;
  }
}
</style>