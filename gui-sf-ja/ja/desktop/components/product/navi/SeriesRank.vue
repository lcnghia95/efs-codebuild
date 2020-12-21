<template>
  <section class="c-com">
    <div class="c-com__inner">
      <serie-item v-for="(item, i) in data" :data="item" :rank="i+1" :key="i"/>
    </div>
  </section>
</template>
<script>
import SerieItem from '@/components/product/navi/serie-item/Item.vue'
/**
 * The Series Rank.
 */
export default {
  components: {
    SerieItem,
  },
  props: ['data'],
}
</script>
<style lang="scss" scoped>
.c-com {
  border: 1px solid #ddd;
}
.c-com__inner {
  width: 100%;
}
/deep/ .o-item {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  position: relative;
  width: 160px;
  height: 170px;
  margin: 9px auto 20px auto;
  padding: 0 10px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDdGQkFBNzlBRDAwMTFFODg0N0Q5RTk0QUM0NDVCOUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDdGQkFBN0FBRDAwMTFFODg0N0Q5RTk0QUM0NDVCOUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEN0ZCQUE3N0FEMDAxMUU4ODQ3RDlFOTRBQzQ0NUI5QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEN0ZCQUE3OEFEMDAxMUU4ODQ3RDlFOTRBQzQ0NUI5QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjRqVwUAAAAbSURBVHjaYvgPBnfu3GGAUECS4S6YAgKAAAMAgSwZrHgRB6QAAAAASUVORK5CYII=')
    repeat;
  .o-item__img {
    width: 80px;
    height: 80px;
    margin-top: 20px;
    align-self: center;
  }
  .o-item__rank {
    position: absolute;
    left: 0;
    width: 25px;
    height: 25px;
    text-align: center;
    color: #d9d9d9;
    background: #fff;
    font-size: 20px;
    font-weight: bold;
  }
  .o-item__tit {
    margin: 10px auto 0 auto;
    font-weight: bold;
  }
  .o-item__au {
    display: block;
    color: #676767;
  }
  .o-item__icon {
    width: 16px;
    height: auto;
    margin-bottom: -4px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <series-rank :data="dataSeriesRank"/>
  </template>
  <script>
  export default {
    data() {
      return {
        dataSeriesRank: [
          {
            "id": 4224,
            "title": "1740【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "author": "3422シンプリフィ"
          },
          {
            "id": 3288,
            "title": "4031【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "author": "3274シンプリフィ"
          }
        ]
      }
    },
  }
  </script>
  ```
</docs>
