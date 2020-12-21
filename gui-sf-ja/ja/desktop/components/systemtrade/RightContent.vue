<template>
  <div class="right-content flex layout-col">
    <a v-if="this.$route.params.category == 'fx'" class="mb-10" :href="'/systemtrade/search'">
      <img :src="'/img/assets/pc/systemtrade/banner-search-ranking.png'" alt="" />
    </a>
    <a v-for="(item,idx) in list" :href="buildSrc(item)" v-if="item.show" :key="'right-link-' + idx" class="list">
      <div class="flex mid">
        <span class="category-29oa0 text-center no-underlying" :style="{ 'background': categoryColors[category], 'font-size': '12px' }" v-if="category">
          {{ $t(category) }}
        </span>
        <img v-if="item.flag" class="mr-5 ml-5" :src="'https://www.countryflags.io/' + item.flag + '/shiny/32.png'" alt=""
             width="30" height="26"
        />
        <span class="ml-5 text-color"><b>{{ item.text }}</b></span>
      </div>
      <div class="arrow-icon flex mid center">
        <ArrowRight class="icon-size" />
      </div>
    </a>
    <a v-for="(item,idx) in listIndex" :key="'right-link-index-' + idx" :href="item.url" class="list-index mt-10">
      <Lzimg :data-src="item.img" />
      <div class="flex mid space-between bg-dot">
        <span>
          <b>{{ item.title }}</b>
        </span>
        <div class="arrow-icon">
          <ArrowRight class="icon-size" />
        </div>
      </div>
    </a>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/system-right-content.json'
import ArrowRight from '@@/../components/icons/ArrowRight.vue'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  props: {
    category: String,
    economics: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  components: {
    ArrowRight,
    Lzimg,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      categoryColors: {
        fx: '#8fc31f',
        stocks: '#00b7ee',
        bitcoin: '#f19149',
      },
      list: [
        {
          url: '/systemtrade/newproduct',
          text: this.$t('1'),
          show: true,
        },
        {
          url: '/systemtrade/sell',
          text: this.$t('2'),
          show: true,
        },
        {
          url: '/systemtrade/realasset',
          text: this.$t('13'),
          show: true,
          noAdd: true,
        },
        {
          url: '/systemtrade/profitrate',
          text: this.$t('3'),
          show: true,
        },
        {
          url: '/systemtrade/profit',
          text: this.$t('4'),
          show: true,
        },
        {
          url: '/systemtrade/profitfactor',
          text: this.$t('5'),
          show: true,
        },
        {
          url: '/systemtrade/riskreturn',
          text: this.$t('6'),
          show: true,
        },
        {
          url: '/systemtrade/economics/fx/1',
          text: (this.economics[0] || { title: this.$t('7') }).title,
          show: this.category === 'fx',
          noAdd: true,
          flag: (this.economics[0] || {}).flag,
        },
        {
          url: '/systemtrade/economics/fx/2',
          text: (this.economics[1] || { title: this.$t('8') }).title,
          show: this.category === 'fx',
          noAdd: true,
          flag: (this.economics[1] || {}).flag,
        },
      ],
      listIndex: [
        {
          img: '/img/assets/pc/systemtrade/fx.png',
          url: '/systemtrade/fx',
          title: this.$t('9'),
        },
        {
          img: '/img/assets/pc/systemtrade/stock.png',
          url: '/systemtrade/stocks',
          title: this.$t('10'),
        },
      ],
    }
  },
  methods: {
    buildSrc(item) {
      if (!this.category || item.noAdd) {
        return item.url
      }
      return item.url + '/' + this.category
    },
  },
}
</script>
<style lang="scss" scoped>
.right-content {
  width: 300px;
  .list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: #dbdbdb 1px solid;
    padding: 15px;
    margin-bottom: 10px;
    .category-29oa0 {
      display: inline-block;
      font-size: 12px;
      width: 45px;
      flex: 0 0 45px;
      height: 15px;
      line-height: 16px;
      color: white;
      border-radius: 2px;
    }
    .text-color {
      color: #666;
      font-size: 15px;
    }
    &:hover {
      text-decoration: none;
      background: #f5f5f5;
    }
  }
  .list-index {
    border: #dbdbdb 1px solid;
    &:hover {
      text-decoration: none;
    }
    img {
      width: 100%;
    }
    .bg-dot {
      padding: 15px;
      background-repeat: repeat;
      background-image: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNEQ5OEE2RjhFNTAxMUU4QkZFNEE2RkUxNjUwQTZFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNEQ5OEE3MDhFNTAxMUU4QkZFNEE2RkUxNjUwQTZFNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0RDk4QTZEOEU1MDExRThCRkU0QTZGRTE2NTBBNkU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0RDk4QTZFOEU1MDExRThCRkU0QTZGRTE2NTBBNkU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABAAEAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A30/8u+x/6sv/AJMX94v7u/3d/wDP1/eX+Nf9P/B/00+/de6//9k=);
      span {
        font-size: 18px;
        color: #666;
      }
    }
  }
  .arrow-icon {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #a69a9a;
    color: white;
    .icon-size {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
