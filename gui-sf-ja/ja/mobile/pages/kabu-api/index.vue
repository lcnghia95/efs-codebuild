<template>
  <div class="kabu-page">
    <div class="kabu-heading flex mid">
      <div class="kabu-title">{{ titleChunk }}</div>
      <div class="title-sub">
        <p class="mb-0">{{ $t('1') }}</p>
      </div>
    </div>
    <div class="title-sub2">{{ $t('2') }}</div>
    <div class="content-title">
      <b>{{ $t('11') }}</b>
    </div>
    <no-ssr style="min-height: 75vmin;">
      <div class="owl-carousel slider-top owl-loaded owl-drag">
        <a v-for="item in relatedArticles" :href="item.detailUrl" :key="'related-articles-' + item.id">
          <ImgWrapper class="articles-img" :src="`/img/articles/${item.id}/small`" :alt="'banner ' + item.id" />
          <div class="item-title-howto">{{ item.title }}</div>
        </a>
      </div>
    </no-ssr>
    <div class="content-title">
      <b>{{ $t('3') }}</b>
    </div>
    <div class="flex flex-wrap large-item">
      <PlatformHorizontal
        v-for="item in (platformData || [])"
        :data="item"
        :key="'platform_tools-' + item.id"
      />
    </div>
    <div @click="onPlatformShowMore" v-if="(platformData || []).length < (platform || []).length">
      <LoadMore />
    </div>
    <div class="content-title mt-20">
      <b>{{ $t('4') }}</b>
    </div>
    <div class="owl-carousel slider owl-loaded owl-drag">
      <StrategyItem
        v-for="item in newArrival"
        :item="item"
        :key="'strategy-new-arrival-'+item.id"
      />
    </div>
    <!-- <div class="flex content-end pr-10">
      <ShowMore02 target="#" />
    </div> -->
    <div class="content-title mt-20">
      <b>{{ $t('5') }}</b>
    </div>
    <div class="labo-sub1">{{ $t('6') }}</div>
    <div class="text-center mt-20">
      <img src="/img/assets/mobile/kabu/Labo.png" class="img-labo" />  
    </div>
    <div class="labo-sub2">{{ $t('7') }}</div>
    <div class="owl-carousel slider owl-loaded owl-drag">
      <a
        :href="'https://labo.gogojungle.co.jp/articles/' + item.id"
        v-for="item in laboArticles"
        :key="'labo-article-' + item.id"
      >
        <LaboArticle :item="item" />
      </a>
    </div>
    <div class="flex content-end pr-10">
      <ShowMore02 target="https://labo.gogojungle.co.jp" />
    </div>
    <div class="content-title mt-20">
      <b>{{ $t('8') }}</b>
    </div>
    <div class="labo-sub1">{{ $t('9') }}</div>
    <div class="text-center mt-20">
      <img src="/img/assets/mobile/kabu/Crowdsourcing.png" class="img-labo" />  
    </div>
    <div class="labo-sub2">{{ $t('10') }}</div>
    <div class="text-center p-10 mb-40">
      <img src="/img/assets/mobile/kabu/sample_crowd.png" class="img-crowd-item" />
      <div class="flex content-end pr-10 mt-20">
        <ShowMore02 target="/crowdsourcing" />
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/kabu.json'
import title from '@@/../common/pages'
import PlatformHorizontal from '@/components/kabu/PlatformHorizontal.vue'
import StrategyItem from '@/components/kabu/StrategyItem.vue'
import ShowMore02 from '@/components/common/ShowMore02.vue'
import LaboArticle from '@/components/kabu/LaboArticle.vue'
import LoadMore from '@/components/common/LoadMore.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default Object.assign(
  {
    components: {
      PlatformHorizontal,
      StrategyItem,
      ShowMore02,
      LaboArticle,
      LoadMore,
      ImgWrapper,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('title'),
        curIdx: 1,
      }
    },
    mounted() {
      this.$nextTick(() => {
        $('.slider-top').owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          items: 1,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          center: true,
          lazyLoad: true,
          slideBy: 1,
          margin: 25,
          dots: true,
        })
        $('.slider').owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          items: 2,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          center: false,
          lazyLoad: true,
          slideBy: 2,
        })
      })
    },
    async asyncData({ app }) {
      let [platform, relatedArticles, newArrival, laboArticles] = await Promise.all([
        app.GoGoHTTP.get('/api/kabu/platform'),
        app.GoGoHTTP.get('/api/kabu/related/articles'),
        app.GoGoHTTP.get('/api/kabu/strategy/new-arrival'),
        app.GoGoHTTP.get('/api/v3/labo/articles/top?limit=4')
      ]),
        platformData = (platform || []).slice(0, 6)
      return {
        platform,
        platformData,
        relatedArticles,
        newArrival,
        laboArticles,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/kabu-api`,
          },
        ],
      }
    },
    methods: {
      onPlatformShowMore() {
        let from = this.curIdx * 6,
          to = from + 6
        this.curIdx += 1
        this.platformData = this.platformData.concat((this.platform || []).slice(from, to))
      },
      descriptionTemplate() {
        return this.$t('description')
      }
    },
  },
  title
)
</script>
<style lang="scss" scoped>
.kabu-page {
  .kabu-heading {
    background: url(/img/assets/mobile/kabu/heading.jpg);
    background-repeat: no-repeat;
    background-size: 140% 220px;
    text-shadow: 2px 2px 1px #000;
    color: #ebfffe;
    height: 220px;
    margin-top: 20px;
    .kabu-title {
      font-size: 20px;
      font-weight: 700;
      text-shadow: 2px 2px 1px #000;
      padding-left: 20px;
      width: 48%;
      flex: 0 0 48%;
    }
    .title-sub {
      font-size: 14px;
      text-shadow: 2px 2px 1px #000;
      letter-spacing: 1.3px;
      line-height: 16px;
      padding-right: 0 20px;
    }
  }
  .title-sub2 {
    font-size: 12px;
    padding: 15px 20px;
    line-height: 16px;
  }
  .content-title {
    background: #f2f2f2;
    padding: 10px 20px;
    margin-bottom: 20px;
    color: #333;
    font-size: 16px;
  }
  .slider-top {
    a {
      display: block;
      width: 100%;
      .articles-img {
        width: 100%;
        max-width: 90vw;
        height: 36vw;
      }
      .item-title-howto {
        margin-top: 10px;
        font-size: 15px;
        font-weight: bold;
        color: #333;
      }
    }
    /deep/ {
      .owl-dots {
        display: flex;
        justify-content: center;
      }
      .owl-dot {
        margin: 10px 0;
        outline: none;
        &.active span,
        &:hover span {
          background: #7ecef4;
        }
        span {
          background: none repeat scroll 0 0 #869791;
          border-radius: 20px;
          display: block;
          height: 12px;
          margin: 5px 7px;
          opacity: 0.5;
          width: 12px;
        }
      }
    }
  }
  .slider {
    margin: 0 3.5%;
    width: 95%;
  }
  .slider /deep/ {
    .owl-dots {
      display: flex;
      justify-content: center;
    }
    .owl-dot {
      margin: 10px 0;
      outline: none;
      &.active span,
      &:hover span {
        background: #7ecef4;
      }
      span {
        background: none repeat scroll 0 0 #869791;
        border-radius: 20px;
        display: block;
        height: 12px;
        margin: 5px 7px;
        opacity: 0.5;
        width: 12px;
      }
    }
  }
  .large-item {
    > div:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }
  }
  .labo-sub1 {
    font-size: 16px;
    font-weight: 550;
    line-height: 26px;
    text-align: center;
    padding: 10px 35px;
    letter-spacing: 1.5px;
    color: #666;
  }
  .img-labo {
    width: 100%;
    height: auto;
  }
  .labo-sub2 {
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    padding: 10px 15px;
    color: #666;
  }
  .img-crowd-item {
    width: 100%;
    height: auto;
  }
}
</style>