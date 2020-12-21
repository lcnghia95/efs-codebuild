<template>
  <a :href="item.url">
    <div class="flex center">
      <div class="item flex mid center"
           :style="{'width': width + 'vw', 'height': height + 'vw', 'background-color': item.bgColor ||
             '#f19149'}"
      >
        <slot></slot>
      </div>
    </div>
    <h2 class="flex center title fs-12 text-center mt-5 mb-0" v-html="$t(item.type) || item.type"></h2>
  </a>
</template>
<script>
import i18n from '@@/lang/components-mobile/system-icon-header.json'

export default {
  props: {
    width: {
      type: Number,
      default: 16,
    },
    height: {
      type: Number,
      default: 16,
    },
    item: {
      type: Object,
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
.item {
  border-radius: 50%;
  color: white;
  font-size: 5vw;
  i.icon-cls {
    width: 13vw;
    height: 13vw;
  }
}
.title {
  font-size: 5vw;
  font-weight: bold;
  color: #707070;
  line-height: 6vw;
}
@media only screen and (min-width: 600px) {
  .title {
    font-size: 3.5vw;
  }
  .item {
    width: 11vw;
    height: 11vw;
    i.icon-cls {
      width: 8vw;
      height: 8vw;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <IconHeader :item="item"/>
  </template>
  <script>
    export default {
      data() {
        return {
          item: {
            type: 'string',
            icon: 'LineChart',
            bgColor: '#f19149',
            url: '/systemtrade/fx',
          }
        }
      }
    }
  </script>
  ```
</docs>
