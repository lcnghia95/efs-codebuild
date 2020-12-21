<template>
  <section>
    <component :is="'ForwardTest' + platform" :forward="forward" />
    <div class="text-center mt-10">
      <paging :cur-page="forward.currentPage"
              :total="forward.lastPage"
              :from="forward.pagingFrom"
              :to="forward.pagingTo"
              theme-class="theme1"
              @pagingclick="innerGetData" />
    </div>
  </section>
</template>
<script>
import ForwardTest2 from './stock/stockForwardTest2.vue'
import ForwardTest3 from './stock/stockForwardTest3.vue'
import ForwardTest4 from './stock/stockForwardTest4.vue'
import Paging from '@/components/paging/Paging.vue'
import { scollToOffest } from '@/utils/client/common'
export default {
  components: {
    ForwardTest2,
    ForwardTest3,
    ForwardTest4,
    Paging,
  },
  props: {
    forward: {
      type: Object,
      default: () => {
        return []
      },
    },
    platform: {
      type: Number,
      default: 2,
    },
    onGetDataPage: Function,
  },
  methods: {
    innerGetData(page) {
      scollToOffest('#lz-forward', 100)
      this.onGetDataPage(page)
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .forward-table {
  thead {
    background: #bdb3b3;
    th {
      font-size: 3vw;
      line-height: 3.5vw;
      color: white;
      font-weight: normal;
    }
  }
  tbody {
    tr {
      font-size: 3.2vw;
      td {
        padding: 2vw 0;
      }
      &:nth-child(odd) {
        background: #f3f0ef;
      }
      &:nth-child(even) {
        background: white;
      }
    }
  }
}
</style>
