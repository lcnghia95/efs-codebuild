<template>
  <table class="table table-striped w-full" :class="{'table-fix': options.isScrollable}">
    <thead>
      <tr>
        <th class="text-center fs-13" v-for="(header, i) in headers" :class="header.classes"
            :style="{width: options.widths[i]}" :key="'table01-header-' + i">
          <div v-if="!header.sortList">
            <span v-html="header.title"/>
          </div>
          <div v-else>
            <a class="co-white cursor-pointer no-underlying" @click="onChangeSortType(sortType == header.sortList[1] ? header.sortList[0] : header.sortList[1])">
              <div class="flex mid center">
                <div v-html="header.title"/>&nbsp;
                <div>
                  <AngleDown v-if="sortType == header.sortList[0]" />
                  <AngleUp v-if="sortType == header.sortList[1]"/>
                </div>
                <div v-if="sortType != header.sortList[0] && sortType != header.sortList[1]" class="flex layout-col h-20">
                  <AngleUp />
                  <AngleDown />
                </div>
              </div>
            </a>
          </div>
        </th>
      </tr>
    </thead>
    <tbody :style="{height: options.isScrollable ? options.height + 'px' : null}">
      <slot/>
    </tbody>
  </table>
</template>

<script>
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
export default {
  props: {
    hasData: {
      type: Boolean,
      default: true,
    },
    headers: Array,
    options: {
      type: Object,
      default: () => ({
        isScrollable: false,
        widths: [],
        height: null,
      }),
    },
    sortType: {
      type: Number,
      default: 0,
    },
  },
  components: {
    AngleUp,
    AngleDown,
  },
  created() {
    if (!this.options.isScrollable) {
      return
    }
    $(window).on('resize', this.onResize)
  },
  activated() {
    if (!this.options.isScrollable) {
      return
    }
    $(window).on('resize', this.onResize)
  },
  updated() {
    if (!this.options.isScrollable) {
      return
    }
    this.$nextTick(() => {
      let el = $(this.$el),
        bodyHeight = el.find('tbody tr').length * 37
      if (bodyHeight > this.options.height) {
        el.find('thead tr').width(el.width() - 17)
      } else {
        el.find('tbody').height(bodyHeight)
      }
    })
  },
  methods: {
    onResize() {
      let el = $(this.$el)
      el.find('thead tr').width(el.width() - 17)
    },
    onChangeSortType(_type) {
      this.$emit('onchangesorttype', _type)
    },
  },
  destroyed() {
    $(window).off('resize', this.onResize)
  },
  deactivated() {
    $(window).off('resize', this.onResize)
  },
}
</script>

<style lang="scss" scoped>
.icon-cls {
  width: 10px;
  height: 8px;
  line-height: 4pt;
}
.fs-11 {
  font-size: 11px;
}
.co-white {
  color: white;
}
table {
  background: white;
  border-collapse: separate;
  border: 1px solid #dadada;
  border: none;
  overflow: hidden;
  margin: 0;
  table-layout: fixed;
  /deep/ tbody > tr > td,
  /deep/ tbody > tr > th,
  /deep/ tfoot > tr > td,
  /deep/ tfoot > tr > th,
  /deep/ thead > tr > td,
  /deep/ thead > tr > th {
    border-top: 0;
  }
  thead {
    background: #bdb3b3;
    th {
      height: 50px;
      vertical-align: middle;
      border-bottom: none;
      padding: 0;
    }
  }
  tbody {
    tr {
      font-size: 11px;
      &:nth-child(odd) {
        background-color: white;
      }
      &:nth-child(even) {
        background-color: #f7f6f5;
      }
    }
  }
}
.table-fix {
  min-width: 900px;
  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }
  thead th {
    line-height: 29px;
  }
  tbody {
    overflow-y: auto;
    td {
      height: 37px;
    }
  }
  tbody td,
  thead th {
    float: left;
  }
  tr::after {
    clear: both;
    content: ' ';
    display: block;
    visibility: hidden;
  }
}
// @formatter:on
.no-sort {
  height: 6px;
}
.w-40 {
  width: 40px;
}
.w-50 {
  width: 50px;
}
.w-60 {
  width: 60px;
}
.w-70 {
  width: 70px;
}
.w-80 {
  width: 80px;
}
.w-90 {
  width: 90px;
}
.w-100 {
  width: 100px;
}
.w-110 {
  width: 110px;
}
.w-120 {
  width: 120px;
}
.w-140 {
  width: 140px;
}
</style>
<docs>
  ```vue
  <template>
    <table01 :headers="headers" class="border-all">
      <tr class="row-middle-all border-all" v-for="(item,i) in data" :key="i">
        <td class="text-center">{{item.key1}}</td>
        <td class="text-center">{{item.key2}}</td>
      </tr>
    </table01>
  </template>
  <script>
    export default {
      data() {
        return {
          headers: [
            {
              title: 'title header 1',
              classes: ['w-100']
            }, {
              title: 'title header 2',
              classes: ['w-120']
            }
          ],
          data: [
          {
            key1: 'item 1',
            key2: 'item 2'
          },
          {
            key1: 'item 3',
            key2: 'item 4'
          }
          ]
        }
      }
    }
  </script>
  ```
</docs>
