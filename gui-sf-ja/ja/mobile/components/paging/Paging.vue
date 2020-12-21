<template>
  <div class="paging-wrap" v-if="curPage && total > 1" :class="themeClass">
    <ul class="flex center">
      <li class="first-page" v-if="curPage > 1">
        <a href="javascript:void(0)" @click="pagingClick(1)">
          <AngleDoubleLeft />
        </a>
      </li>
      <li v-if="curPage > 1">
        <a href="javascript:void(0)" @click="pagingClick(curPage - 1 ? (curPage - 1) : 1)">
          <AngleLeft />
        </a>
      </li>
      <li v-for="i in (pageRange + 1)" :key="'Yj5V7'+i">
        <a :class="{active: (i - 1 + from) == curPage}" href="javascript:void(0)" @click="pagingClick(i - 1 + from)">
          {{ i - 1 + from }}
        </a>
      </li>
      <li v-if="curPage < total">
        <a href="javascript:void(0)" @click="pagingClick(curPage + 1)">
          <AngleRight />
        </a>
      </li>
      <li class="last-page" v-if="curPage < total">
        <a href="javascript:void(0)" @click="pagingClick(total)">
          <AngleDoubleRight />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import AngleDoubleLeft from '@@/../components/icons/AngleDoubleLeft.vue'
import AngleDoubleRight from '@@/../components/icons/AngleDoubleRight.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import { pushState } from '@/utils/client/common'

export default {
  components: {
    AngleDoubleLeft,
    AngleDoubleRight,
    AngleLeft,
    AngleRight,
  },
  props: {
    curPage: [Number, String],
    total: Number,
    from: Number,
    to: Number,
    hasScroll: Boolean,
    scrollOffset: {
      type: Number,
      default: 0,
    },
    scrollOffsetEl: String,
    /**
     * Have 4 themes: theme1, theme2, theme3 and theme4
     */
    themeClass: {
      type: String,
      default: 'theme1',
    },
    /**
     * In case you want to add param in URL. Ex: https://gogojungle.co.jp/tools?p=2
     */
    isAddUrlParam: Boolean,
    originUrl: String,
  },
  computed: {
    pageRange: function() {
      return this.to - this.from
    },
  },
  mounted() {
    if (this.isAddUrlParam) {
      window.onpopstate = evt => {
        if (evt.state.p) {
          this.$emit('pagingclick', evt.state.p)
        }
      }
    }
  },
  methods: {
    scrollToTop() {
      let offset = 0
      if (this.scrollOffsetEl) {
        offset = $(this.scrollOffsetEl).offset().top
      }
      if (this.scrollOffset) {
        offset += this.scrollOffset
      }
      $('html, body').animate({ scrollTop: offset }, 'slow')
    },
    pagingClick(index) {
      if (index === this.curPage) {
        return
      }
      this.isAddUrlParam && pushState({ p: index }, null, '', this.originUrl)
      this.$emit('pagingclick', index)
    },
  },
  watch: {
    curPage() {
      this.hasScroll && this.scrollToTop()
    },
  },
}
</script>

<style scoped lang="scss">
.paging-wrap {
  ul {
    padding: 0 3%;
    list-style: none;
    li {
      display: inline-block;
      width: 9.5vw;
      height: 12vw;
      line-height: 12vw;
      text-align: center;
      margin: 0 1vw;
      a {
        font-size: 3.5vw;
        display: block;
        color: #434343;
        text-decoration: none;
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
      }
    }
  }
}
.theme1 {
  ul {
    li {
      border: 1px solid #434343;
      background: white;
      a {
        color: #434343;
        &.active {
          background: #434343;
          color: white;
        }
      }
    }
  }
}
.icon-cls {
  width: 4vw;
  height: 4vw;
  vertical-align: middle;
}
</style>

<docs>
  ```vue
  <template>
    <paging :cur-page="paging.currentPage"
            :total="paging.lastPage"
            :from="paging.pagingFrom"
            :to="paging.pagingTo"
            @pagingclick="onGetDataPage"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        paging: {
          currentPage: 1,
          lastPage: 34,
          pagingFrom: 1,
          pagingTo: 5,
        },
      }
    },
    methods: {
      onGetDataPage() {
        console.log('onGetDataPage')
      },
    },
  }
  </script>
  ```

  ```vue
  <template>
    <paging :cur-page="paging.currentPage"
            :total="paging.lastPage"
            :from="paging.pagingFrom"
            :to="paging.pagingTo"
            @pagingclick="onGetDataPage"
            theme-class="theme2"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        paging: {
          currentPage: 1,
          lastPage: 34,
          pagingFrom: 1,
          pagingTo: 5,
        },
      }
    },
    methods: {
      onGetDataPage() {
        console.log('onGetDataPage')
      },
    },
  }
  </script>
  ```

  ```vue
  <template>
    <paging :cur-page="paging.currentPage"
            :total="paging.lastPage"
            :from="paging.pagingFrom"
            :to="paging.pagingTo"
            @pagingclick="onGetDataPage"
            theme-class="theme3"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        paging: {
          currentPage: 1,
          lastPage: 34,
          pagingFrom: 1,
          pagingTo: 5,
        },
      }
    },
    methods: {
      onGetDataPage() {
        console.log('onGetDataPage')
      },
    },
  }
  </script>
  ```

  ```vue
  <template>
    <paging :cur-page="paging.currentPage"
            :total="paging.lastPage"
            :from="paging.pagingFrom"
            :to="paging.pagingTo"
            @pagingclick="onGetDataPage"
            theme-class="theme4"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        paging: {
          currentPage: 1,
          lastPage: 34,
          pagingFrom: 1,
          pagingTo: 5,
        },
      }
    },
    methods: {
      onGetDataPage() {
        console.log('onGetDataPage')
      },
    },
  }
  </script>
  ```

</docs>
