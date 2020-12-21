<template>
  <div class="pos-abs l-line" :style="{ top: y+'px', left: x+'px' }">
    <div class="pos-rel">
      <svg :height="height" :width="width">
        <line :x1="l1.x1" :y1="l1.y1" :x2="l1.x2" :y2="l1.y2" style="stroke: black;"
              :style="{ 'stroke-width': strokeWidth }" />
        <line :x1="l2.x1" :y1="l2.y1" :x2="l2.x2" :y2="l2.y2" style="stroke: black;"
              :style="{ 'stroke-width': strokeWidth }" />
      </svg>
      <a ref="nLable" :href="lable.titleUrl" class="cursor-pointer pos-abs title fs-11"
         :style="{ top: (lable.y || textPos)+'px', left: (lable.x || (width + 5))+'px'}">
        {{ lable.title }}
      </a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hcKey: String,
    strokeWidth: {
      type: Number,
      default: 1,
    },
    height: Number,
    width: Number,
    type: String,
    x: Number,
    y: Number,
    lable: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      l1: {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      },
      l2: {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: this.height,
      },
      textPos: 10,
    }
  },
  mounted() {
    $(this.$refs.nLable).hover(() => {
      this.$emit('showarea', this.hcKey)
    })
    $(this.$refs.nLable).mouseout(() => {
      this.$emit('hidearea', this.hcKey)
    })
  },
  created() {
    // refactor => use tranform rotate
    if (this.type === 'l1') {
      this.textPos = 10 * -1
      this.l1.x1 = 0
      this.l1.y1 = 0
      this.l1.x2 = 0
      this.l1.y2 = this.height
      // ======================
      this.l2.x1 = 0
      this.l2.y1 = 0
      this.l2.x2 = this.width
      this.l2.y2 = 0
    } else if (this.type === 'l2') {
      this.textPos = 10
      this.l1.x1 = 0
      this.l1.y1 = 0
      this.l1.x2 = 0
      this.l1.y2 = this.height
      // ======================
      this.l2.x1 = 0
      this.l2.y1 = this.height
      this.l2.x2 = this.width
      this.l2.y2 = this.height
    } else if (this.type === 'l3') {
      this.textPos = 10
      this.l1.x1 = this.width
      this.l1.y1 = 0
      this.l1.x2 = this.width - 1
      this.l1.y2 = this.height
      // ======================
      this.l2.x1 = this.width
      this.l2.y1 = this.height
      this.l2.x2 = 0
      this.l2.y2 = this.height
    } else if (this.type === 'l4') {
      this.textPos = 10
      this.l1.x1 = 0
      this.l1.y1 = 0
      this.l1.x2 = this.width
      this.l1.y2 = 0
      // ======================
      this.l2.x1 = this.width - 1
      this.l2.y1 = 0
      this.l2.x2 = this.width
      this.l2.y2 = this.height
    } else if (this.type === 'l5') {
      this.l1.x1 = 0
      this.l1.y1 = 0
      this.l1.x2 = this.width
      this.l1.y2 = 0
      // ======================
      this.l2.x1 = 0
      this.l2.y1 = 0
      this.l2.x2 = 0
      this.l2.y2 = 0
    } else {
      this.l1.x1 = 0
      this.l1.y1 = 0
      this.l1.x2 = 0
      this.l1.y2 = this.height
      // ======================
      this.l2.x1 = 0
      this.l2.y1 = 0
      this.l2.x2 = 0
      this.l2.y2 = 0
    }
  },
}
</script>

<style lang="scss" scoped>
.l-line {
  top: 0;
  left: 0;
}
.title {
  text-decoration: none;
  width: 150px;
  color: #333;
  &:hover {
    color: #0078d4;
  }
}
.fs-11 {
  font-size: 11px;
}
</style>
<docs>
  ```vue
  <template>
  <div class="world-market pos-rel">
    <line @showarea="onShowarea" @hidearea="onHidearea" :hc-key="hcKey" :height="height" :width="width" :type="type" :x="x" :y="y" :lable="lable"/>
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
        hcKey:"gb",
        height:80,
        lable: {
          title:"8月 建設業購買担当者景気指数（ＰＭＩ）",
          titleUrl:"http://fx-on.com/economic/detail/?id=32126",
        },
        strokeWidth:1,
        type:"l1",
        width:25,
        x:20,
        y:30,
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
