<template>
  <div class="wrapper flex">
    <div ref="carousel" class="owl-carousel owl-theme">
      <div v-for="(e, index) in slider" :key="index" class="w-full h-full"
           v-html="e.content"/>
    </div>
    <div v-if="!youtubeBanner" class="thumb-wrap" @mouseenter="onThumbHover(true)" @mouseleave="onThumbHover(false)">
      <div class="thumb" v-for="(e, i) in slider" :key="'t' + i" @click="onThumbClick(i)">
        <img class="mr-10" :src="'/img/top_sliders/' + e.id" width="90" height="43" :alt="tagRemoved(e.title)">
        <span class="wrap-text flex" v-html="e.title" />
      </div>
    </div>
    <div v-else class="banner-slider">
      <a class="cursor-pointer" :href="youtubeBanner.landingPageUrl" target="_blank"
         v-if="youtubeBanner.bannerType == 1">
        <img :src="youtubeBanner.bannerUrl" alt="">
      </a>
      <a class="cursor-pointer no-underlying" :href="youtubeBanner.landingPageUrl" target="_blank"
         v-if="youtubeBanner.bannerType == 2">
        <iframe :src="youtubeParser(youtubeBanner.bannerUrl) + '?autoplay=1&mute=1'" frameborder="0" autoplay="true" />
        <div class="catch-copy p-10 mt-10">
          {{ youtubeBanner.description }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { youtubeParser, tagRemoved } from '@/utils/client/common'

export default {
  mounted() {
    this.$nextTick(() => {
      this.owl = $(this.$refs.carousel).owlCarousel({
        autoplayTimeout: 6e3,
        loop: true,
        autoplay: true,
        dots: true,
        items: 1,
        lazyLoad: true,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        slideTransition: 'ease',
        onChanged: function(e) {
          $('.thumb-wrap div.active').removeClass('active')
          // index + 1
          $(`.thumb-wrap div:nth-child(${-~e.page.index})`).addClass('active')
        },
      })
    })
  },
  computed: {
    youtubeBanner() {
      return (this.$store.state.advertisements.banners || [])[4]
    },
    slider() {
      return this.$store.state.advertisements.topSliders || []
    },
  },
  methods: {
    onThumbClick(i) {
      this.owl.trigger('to.owl.carousel', [i])
    },
    youtubeParser,
    tagRemoved,
    onThumbHover(isEnter) {
      if (isEnter) {
        this.owl.trigger('stop.owl.autoplay')
      } else {
        this.owl.trigger('play.owl.autoplay')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 1000px;
  height: 337px;
  border: 1px #d9d9d9 solid;
  > div:first-child {
    display: block;
    width: 700px;
    height: 335px;
    overflow: hidden;
    border-right: 1px #d9d9d9 solid;
  }
  > div:last-child {
    flex: 0 0 299px;
    width: 299px;
    height: 335px;
    > div {
      &:not(:last-child) {
        border-bottom: 1px #d9d9d9 solid;
      }
      &:hover {
        cursor: pointer;
        background-color: #f5f5f5;
      }
    }
  }
  .thumb {
    padding: 6px 5px 6px 22px;
    width: 299px;
    height: 55.83333px;
    display: flex;
    span {
      line-height: 20px;
      align-items: center;
    }
    &.active {
      background-color: #f5f5f5;
    }
  }
}
.banner-slider {
  position: relative;
  a {
    position: absolute;
    width: 300px;
    height: 337px;
    z-index: 999;
    right: 0;
    background: black;
  }
  iframe {
    height: 222px;
  }
  .catch-copy {
    background: black;
    color: white;
    font-size: 28px;
    height: 100px;
    overflow-y: hidden;
  }
}
</style>
