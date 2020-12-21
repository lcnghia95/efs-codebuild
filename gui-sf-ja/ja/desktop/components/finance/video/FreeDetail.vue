<template>
  <section>
    <section class="vid-d w-full">
      <div class="vid-d__main w-1000 flex space-between pt-30">
        <div class="vid-d__i">
          <iframe class="w-full h-full" :src="youtubeParser(dataVideo.watchUrl)" frameborder="0" allowfullscreen/>
        </div>
        <div class="vid-d__info pt-15 pb-15 pl-20 pr-15">
          <div class="vid-content-wrapp pb-10 pr-5">
            <h3 class="m-0 pb-10" v-html="dataVideo.title"/>
            <div v-html="dataVideo.content" class="vid-content pt-15" />
            <span class="tag--vd text-center" v-for="tag in dataVideo.tags" :key="'tag-' + tag">{{ $t('tags.' + tag) }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="sec__h01 mt-30">
      <div class="sec__head w-1000 flex mid space-between">
        <h5 class="sec__tit">{{ $t('1') }}</h5>
        <a href="/finance/videos/new">
          <button class="btn btn--vi pos-rel">{{ $t('2') }} <span class="btn__i pos-abs">〉</span></button>
        </a>
      </div>
      <div class="vid-l w-1000 flex space-between flex-wrap">
        <video-horizontal01 class="mb-20" v-for="(item, i) in related" :item="item" :key="i"/>
      </div>
    </section>
  </section>
</template>

<script>
import VideoHorizontal01 from '@/components/video/VideoHorizontal01.vue'
import { youtubeParser } from '@/utils/client/common'
import i18n from '@@/lang/desktop/video-id.json'
import AngleRight from '@@/../components/icons/AngleRight.vue'

export default {
  props: {
    dataVideo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    related: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  components: {
    VideoHorizontal01,
    AngleRight,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    youtubeParser,
  },
}
</script>

<style lang="scss" scoped>
.vid-d {
  background: #f3f0ee;
  &__main {
    padding-bottom: 55px;
  }
  &__i {
    width: 670px;
    height: 375px;
  }
  &__info {
    width: 296px;
    height: 375px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-top: 3px solid #9c3;
    overflow: hidden;
    .vid-content-wrapp {
      width: 261px;
      height: 335px;
      overflow-y: auto;
      word-break: break-word;
      &::-webkit-scrollbar {
        width: 6px;
        &-track {
          background: white;
        }
        &-thumb {
          background: rgba(45, 45, 45, 0.5);
          border-radius: 6px;
        }
      }
      h3 {
        font-size: 16px;
        line-height: 24px;
        font-weight: bold;
        border-bottom: 1px solid #d9d9d9;
      }
      .vid-content /deep/ {
        color: #2d2d2d;
        line-height: 22px;
        text-align: justify;
        * {
          max-width: 100%;
          height: auto;
        }
      }
      .tag--vd {
        display: inline-block;
        border: 1px solid #d9d9d9;
        padding: 2px 5px;
        color: #666;
        font-size: 12px;
        border-radius: 2px;
        margin-right: 5px;
        margin-top: 8px;
      }
    }
  }
}
.sec__head {
  margin-bottom: 15px;
  .sec__tit {
    font-size: 22px;
    color: #4d4539;
  }
  .btn--vi {
    border-radius: 0;
    background: #fff;
    border: 1px solid #b2b2b2;
    color: #666;
    width: 140px;
    height: 30px;
    outline: none;
    .btn__i {
      font-size: 10px;
      right: 3px;
      top: 8px;
    }
    &:hover {
      background: #b2b2b2;
      color: white;
    }
  }
}
/deep/ .vid-i {
  height: 240px;
}
.btn__i {
  width: 16px;
  height: 16px;
}
.sec__h01 {
  margin-top: 34px;
}
</style>
