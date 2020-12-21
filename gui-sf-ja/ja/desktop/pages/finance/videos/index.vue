<template>
  <div>
    <!-- <banner-top :img="'/img/assets/pc/navi/navitv.png'" :par="$t('2')"/> -->
    <top-menu />
    <SearchBox
      v-model="params.keyword"
      @enter="onSearch"
      @search="onSearch"
      :placeholder="$t('10')"
      class="search_box flex mid w-1000"
    />
    <section class="sec__h01 mt-30">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t('3') }}</h5>
          <span class="lbl lbl--fee flex center mid ml-10">{{ $t('4') }}</span>
        </div>
        <a :href="'/finance/videos/premier'">
          <button class="btn btn--vi pos-rel">
            {{ $t('5') }} <span class="btn__i pos-abs">〉</span>
          </button>
        </a>
      </div>
      <div class="vid-l vid-premier w-1000 flex mt-15">
        <video-horizontal01
          class="mr-20"
          v-for="(item, i) in dataVideoFee"
          :item="item"
          :key="i"
        />
      </div>
    </section>
    <section class="sec__h02 w-full mt-40 pt-15 pb-40">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t('6') }}</h5>
          <span class="lbl lbl--free flex center mid ml-10">{{ $t('7') }}</span>
        </div>
        <a href="/finance/videos/gogojungletv">
          <button class="btn btn--vi pos-rel">
            {{ $t('5') }} <span class="btn__i pos-abs">〉</span>
          </button>
        </a>
      </div>
      <div class="vid-l w-1000 flex mt-15">
        <video-horizontal01
          class="mr-20"
          v-for="(item, i) in dataVideoFree"
          :item="item"
          :key="i"
        />
      </div>
    </section>
    <section class="sec__h01 mt-20">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t('8') }}</h5>
        </div>
        <a href="/finance/videos/new">
          <button class="btn btn--vi pos-rel">
            {{ $t('5') }} <span class="btn__i pos-abs">〉</span>
          </button>
        </a>
      </div>
      <div class="vid-l w-1000 flex mt-15">
        <video-horizontal01
          class="mr-20"
          v-for="(item, i) in dataVideoNew"
          :item="item"
          :key="i"
        />
      </div>
    </section>
    <section class="sec__h02 w-full mt-40 pt-15 pb-40">
      <div class="sec__head w-1000 flex mid space-between">
        <div class="sec__tit flex mid">
          <h5>{{ $t('9') }}</h5>
        </div>
        <a href="/finance/videos/trend">
          <button class="btn btn--vi pos-rel">
            {{ $t('5') }} <span class="btn__i pos-abs">〉</span>
          </button>
        </a>
      </div>
      <div class="vid-l w-1000 flex mt-15">
        <video-horizontal01
          class="mr-20"
          v-for="(item, i) in dataVideoTrend"
          :item="item"
          :key="i"
        />
      </div>
    </section>
  </div>
</template>

<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import VideoHorizontal01 from '@/components/video/VideoHorizontal01.vue'
import title from '@@/../common/pages'
import SearchBox from '@/components/SearchBox.vue'
import i18n from '@@/lang/desktop/video-index.json'

const obj = Object.assign(
  {
    components: {
      TopMenu,
      VideoHorizontal01,
      SearchBox,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        params: {},
      }
    },
    methods: {
      onSearch() {
        let query = this.params.keyword
          ? `/${encodeURIComponent(this.params.keyword)}`
          : ''
        location.href = `/finance/videos/searchresult/w${query}`
      },
      descriptionTemplate() {
        return this.$t('11')
      },
    },
    async asyncData({ app }) {
      let [
        dataVideoFee,
        dataVideoFree,
        dataVideoNew,
        dataVideoTrend,
      ] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/premier?limit=5'),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/free?limit=5'),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/new?limit=5'),
        app.GoGoHTTP.get('/api/v3/surface/ggjtv/popular?limit=5'),
      ])
      return {
        dataVideoFee: dataVideoFee,
        dataVideoFree: dataVideoFree,
        dataVideoNew: dataVideoNew,
        dataVideoTrend: dataVideoTrend,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/videos`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.search_box {
  &.search-X9ikc {
    width: 1000px;
    border: 12px solid #dbdbdb;
    height: 70px;
    border-radius: 0;
    margin: 30px auto;
  }
}
.sec__tit {
  h5 {
    font-size: 22px;
    color: #4d4539;
  }
  .lbl {
    padding: 0 10px;
    height: 22px;
    color: #fff;
    font-size: 14px;
    border-radius: 3px;
    padding-top: 1px;
    &--fee {
      background: #f60;
    }
    &--free {
      background: #9c3;
    }
  }
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
.sec__head {
  margin-bottom: 13px !important;
}
.sec__h02 {
  background: #f2f0ed;
}
/deep/ .ban-t {
  max-width: 1400px !important;
  height: 200px !important;
  justify-content: flex-start;
  align-items: normal;
}
/deep/ .p--tb {
  font-size: 14px;
  line-height: 24px;
  margin-top: 18px;
  margin-left: 200px;
  text-align: left !important;
}
.vid-l {
  .vid-i:last-child {
    margin-right: 0;
  }
}
.vid-premier /deep/ {
  p.vid-i__desc {
    max-height: 30px;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>