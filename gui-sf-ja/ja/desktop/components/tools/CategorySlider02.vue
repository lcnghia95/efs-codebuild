<template>
  <div class="w-full ctn">
    <div :key="index + 'ct2q'" v-for="(ls, index) in list">
      <div class="mb-5 cate-header">
        {{ tabs[index] || 1 + index }}
      </div>
      <div class="ml-5 owl-carousel" :ref="'slider' + index">
        <ProductVertical02 v-for="(item, i) in ls" :key="item.id + 'oa01' + i" :product="item">
          <img class="pos-abs owl-lazy" :data-src="'/img/products/' + item.id + '/small'" />
        </ProductVertical02>
      </div>
    </div>
  </div>
</template>

<script>
import ProductVertical02 from '@/components/product/ProductVertical02.vue'

export default {
  components: {
    ProductVertical02,
  },
  props: {
    tabs: {
      type: Object,
      default() {
        return {
          1: 1
        }
      },
    },
    list: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  mounted() {
    let me = this
    me.$nextTick(() => {
      Object.keys(me.list).forEach((a, index) => {
        index = index + 1
        $(me.$refs['slider' + index]).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 3e3 + 2e3*index,
            items: 7,
            nav: true,
            loop: true,
            autoplay: true,
            dots: false,
            lazyLoad: true,
            slideBy: 6,
            smartSpeed: 500,
            autoplayHoverPause: true,
            autoWidth: true,
          })
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.ctn {
  border: 1px solid #d0d5dc;
  padding: 10px 10px 0 10px;
}
.product-vertical /deep/ {
  min-height: 200px !important;
}
.cate-header {
  height: 28px;
  width: 110px;
  background: #5f95eb;
  color: #fff;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
}
.w-570 {
  width: 570px;
}
.owl-carousel /deep/ {
  width: calc(100% - 45px) !important;
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      font-size: 40px !important;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 1;
      }
    }
    &.owl-prev {
      left: -23px;
    }
    &.owl-next {
      right: -23px;
    }
  }
}
</style>

<docs>
```vue
```vue
<template>
  <CategorySlider02
      :url-info="urlInfo"
      :list="apiData.recommend"
      :tabs="tabs.recommend"/>
</template>
<script>
  import CategorySlider02 from './CategorySlider02.vue';
  export default {
    components: {
      CategorySlider02,
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
          1: this.$t(6),
          2: this.$t(7),
          3: this.$t(8),
          4: this.$t(9),
          5: this.$t(10)
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