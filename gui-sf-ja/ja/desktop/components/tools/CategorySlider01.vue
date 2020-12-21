<template>
  <div class="flex ctn"
       ref="slider"
       :class="{ 'owl-carousel': isSlide }"
  >
    <div class="cate-col w-full"
         :style="{ 'margin-right': (!isSlide && i + 1 == Object.keys(componentsList).length) ? '0px' : null }"
         v-for="(ls, index, i) in componentsList"
         :key="index + 'ct2oia'"
    >
      <div class="cate-header mb-5">
        {{ tabs[index] || 1 + index }}
      </div>
      <ToolHorizontal class="mb-5" :rank="showRank ? index + 1 : null" v-for="(item, index) in ls" :key="item.id + 'oa01kxaaa' + index" :item="item" />
      <a :href="(urlInfo.showmoreUrls || {})[index - 1]" class="mb-5 cate-link-btn">
        {{ $t('1') }}
        <ChevronRight />
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/common-showmore.json'
import ToolHorizontal from '@/components/tools/ToolHorizontal.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'

export default {
  components: {
    ToolHorizontal,
    ChevronRight,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    tabs: {
      type: Object,
      default() {
        return {}
      },
    },
    showRank: {
      type: Boolean,
      default() {
        return false
      },
    },
    list: {
      type: Object,
      default() {
        return {}
      },
    },
    urlInfo: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      componentsList: {},
      limit_columns: 2,
    }
  },
  computed: {
    isSlide() {
      return Object.keys(this.componentsList).length > this.limit_columns
    }
  },
  mounted() {
    let me = this
    me.componentsList = me.list
    if(Object.keys(this.componentsList).length > this.limit_columns) {
      me.$nextTick(() => {
        const nextArrow = '<i style="width: 35px; color: #fff; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M31.3 45.2l22.1-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L46.9 48l15.8 15.7c1.5 1.5 1.5 4 0 5.5L59 72.9c-1.5 1.5-4 1.5-5.5 0L31.3 50.8c-1.6-1.6-1.6-4 0-5.6z"></path></svg></i>'
        const prewArrow = '<i style="width: 35px; color: #fff; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M64.7 50.8L42.6 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L49.1 48 33.3 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0l22.2 22.1c1.6 1.6 1.6 4 0 5.6z"></path></svg></i>'
        $(me.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 4e3,
          items: this.limit_columns,
          nav: true,
          dots: false,
          lazyLoad: true,
          loop: true,
          autoplay: true,
          slideBy: 1,
          smartSpeed: 500,
          autoplayHoverPause: true,
          autoWidth: true,
          navText: [nextArrow, prewArrow],
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.icon-cls {
  width: 40px;
  height: 40px;
}
.cate-col {
  height: 100%;
  width: 183px;
  margin-right: 9px;
  flex: 1;
  /deep/ .tool-item {
    border: 1px solid #d0d5dc;
  }
}
.cate-header {
  height: 28px;
  width: 100%;
  background: #5f95eb;
  color: #fff;
  line-height: 28px;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}
.cate-link-btn {
  height: 28px;
  width: 100%;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
  background: #fff;
  border: 1px solid #5f95eb;
  border-radius: 5px;
  color: #5f95eb;
  position: relative;
  display: block;
  text-decoration: none;
  .icon-cls {
    height: 16px;
    width: 16px;
    border: 1px solid #fff;
    border-radius: 25px;
    background: #5f95eb;
    color: #fff;
    position: absolute;
    top: calc(50% - 8px);
    right: 10px;
  }
  &:hover {
    color: #fff;
    background: #5f95eb;
    .icon-cls {
      border-color: #fff;
    }
  }
}
.owl-carousel /deep/ {
  width: 100%;
  margin: 0;
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      position: absolute;
      top: calc(50% - 20px);
      opacity: 0.8;
      font-size: 2em !important;
      font-weight: bold;
      height: 35px;
      background: rgba(80, 80, 80, 0.7);
      width: 35px;
      line-height: 35px;
      border-radius: 35px;
      text-align: center;
      &:hover {
        opacity: 0.9;
      }
      &:active {
        opacity: 1;
        background: #424242;
      }
    }
    &.owl-prev {
      left: -5px;
    }
    &.owl-next {
      right: -5px;
    }
  }
}

</style>

<docs>
```vue
<template>
  <CategorySlider01
      :url-info="urlInfo"
      :showRank="true"
      :list="apiData.recommend"
      :tabs="tabs.recommend"/>
</template>
<script>
  import CategorySlider01 from './CategorySlider01.vue';
  export default {
    components: {
      CategorySlider01,
    },
    data() {
      return {
        urlInfo: {
          urls: [
            'tools/osusume/campaign',
            'tools/osusume/indicator',
            'tools/osusume/tool',
            'tools/osusume/ebook',
            'tools/osusume/set',
          ],
          showmoreUrls: ['/tools/recommend', '/tools/recommend/indicator', '/tools/recommend/tool', '/tools/recommend/ebook', '/tools/recommend/set'],
        }, 
        tabs: {
          1: '3months',
          2: '1months',
          3: '1week',
          4: '1day',
          5: 'all',
        },
        list: {
            "1":[
                {
                  "id":15799,
                  "name":"MT4 チャート検証用インジケーター【ShiftChart】",
                  "typeId":2,
                  "detailUrl":"/tools/indicators/15799",
                  "prices":[
                      {
                        "price":2000
                      }
                  ]
                }
            ],
            "2":[
                {
                  "id":15799,
                  "name":"MT4 チャート検証用インジケーター【ShiftChart】",
                  "typeId":2,
                  "detailUrl":"/tools/indicators/15799",
                  "prices":[
                      {
                        "price":2000
                      }
                  ]
                }
            ],
          }
      }
    },
  }
</script>
```
</docs>