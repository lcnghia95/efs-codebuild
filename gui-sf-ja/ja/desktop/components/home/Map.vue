<template>
  <div class="world-market pos-rel">
    <Lzimg class="w-full h-full" :data-src="'/img/assets/pc/systemtrade/world_market.png'" alt=""/>
    <Lzimg v-for="(area, idx) in hlAreas" class="w-full h-full pos-abs high-light" v-show="area.display"
           :data-src="'/img/' + area.url" alt="" :key="'img-map-' + idx"/>
    <l-line v-for="(item,index) in data" @showarea="onShowarea" @hidearea="onHidearea" :key="'gg-line'+index"
            :hc-key="item['hc-key']" :height="item.height" :width="item.width" :type="item.type" :x="item.x" :y="item.y"
            :lable="item.lable" />
  </div>
</template>

<script>
import LLine from './LLine.vue'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  components: {
    LLine,
    Lzimg,
  },
  props: {
    data: Array,
  },
  methods: {
    onShowarea(id) {
      this.hlAreas[id].display = true
    },
    onHidearea(id) {
      this.hlAreas[id].display = false
    },
  },
  data() {
    return {
      hlAreas: {
        gb: {
          url: 'assets/pc/map-area/01.png',
          display: false,
        },
        za: {
          url: 'assets/pc/map-area/02.png',
          display: false,
        },
        au: {
          url: 'assets/pc/map-area/03.png',
          display: false,
        },
        jp: {
          url: 'assets/pc/map-area/04.png',
          display: false,
        },
        us: {
          url: 'assets/pc/map-area/05.png',
          display: false,
        },
        ca: {
          url: 'assets/pc/map-area/06.png',
          display: false,
        },
        nz: {
          url: 'assets/pc/map-area/08.png',
          display: false,
        },
        ch: {
          url: 'assets/pc/map-area/07.png',
          display: false,
        },
      },
    }
  },
}
</script>


<style lang="scss" scoped>
.world-market {
  width: 430px;
  height: 315px;
}
.high-light {
  top: 0;
  left: 0;
}
</style>
<docs>
  ```vue
  <template>
  <div class="world-market pos-rel">
    <Map :data="data"/>
  </div>
  </template>
  <script>
  export default {
    methods: {
      onShowarea(id) {
        this.hlAreas[id].display = true
      },
      onHidearea(id) {
        this.hlAreas[id].display = false
      },
    },
    data() {
      return {
        data: [
          {
            countryEn:"Australia",
            countryJp:"オーストラリア",
            hcKey:"au",
            height:35,
            lable:{
              title:"豪準備銀行（中央銀行）、政策金利発表",
              titleUrl:"http://fx-on.com/economic/detail/?id=32124"
            },
            x:-30,
            y:35,
            width:15,
            x:190,
            y:240,
          },
          {
            countryEn:"Switzerland",
            countryJp:"スイス",
            hcKey:"ch",
            height:40,
            lable:{
              title:"8月 消費者物価指数（ＣＰＩ） [前月比]",
              titleUrl:"http://fx-on.com/economic/detail/?id=32125"
            },
            type:"l1",
            width:15,
            x:32,
            y:85,
          }
        ],
        hlAreas: {
          gb: {
            url: 'assets/pc/map-area/01.png',
            display: false,
          },
          za: {
            url: 'assets/pc/map-area/02.png',
            display: false,
          },
          au: {
            url: 'assets/pc/map-area/03.png',
            display: false,
          },
          jp: {
            url: 'assets/pc/map-area/04.png',
            display: false,
          },
          us: {
            url: 'assets/pc/map-area/05.png',
            display: false,
          },
          ca: {
            url: 'assets/pc/map-area/06.png',
            display: false,
          },
          nz: {
            url: 'assets/pc/map-area/08.png',
            display: false,
          },
          ch: {
            url: 'assets/pc/map-area/07.png',
            display: false,
          },
        },
      }
    },
  }
  </script>
```
</docs>
