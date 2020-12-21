<template>
  <div class="paging-wrap" v-if="curPage && total > 1" :class="themeClass">
    <ul class="p-0">
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
     * In case you want to add param in URL. Ex: https://gogojungle.co.jp/tools/p/2
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
      if (this.isAddUrlParam) {
        let res = pushState({ p: index }, null, '', this.originUrl)
        this.sendPageView(res)
      }
      if (this.isAddUrlParam01) {
        pushState({ p: index }, null, '', this.urlParam, '/')
      }
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
    list-style: none;
    li {
      display: inline-block;
      width: 30px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      margin: 0 5px;
      border-radius: 3px;
      a {
        display: block;
        text-decoration: none;
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
      }
    }
    .last-page,
    .first-page {
      width: 80px;
    }
  }
}
.theme1 {
  ul {
    li {
      border: 1px solid #b2b2b2;
      background: white;
      border-radius: 3px;
      a {
        color: #039cef;
        &.active {
          color: #2d2d2d;
        }
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
        > a {
          color: #2d2d2d;
        }
      }
    }
  }
}
.theme2 {
  ul {
    li {
      background: #ccc;
      border-radius: 3px;
      border: none;
      a {
        color: #707070;
        &.active {
          color: white;
          background: #f6ba44;
          border-radius: 3px;
        }
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
        > a {
          color: white;
          background: #f6ba44;
          border-radius: 3px;
        }
      }
    }
  }
}
.theme3 {
  ul {
    li {
      background: #ccc;
      border-radius: 3px;
      border: none;
      a {
        color: #707070;
        &.active {
          color: white;
          background: #337ab7;
          border-radius: 3px;
        }
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
        > a {
          color: white;
          background: #337ab7;
          border-radius: 3px;
        }
      }
    }
  }
}
.theme4 {
  ul {
    li {
      border: 1px solid #b2b2b2;
      background: white;
      border-radius: 3px;
      a {
        color: #656565;
        &.active {
          color: #039cef;
        }
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
        > a {
          color: #039cef;
        }
      }
    }
  }
}
.theme5 {
  ul {
    li {
      background: #ccc;
      border-radius: 3px;
      border: none;
      a {
        color: #707070;
        &.active {
          color: white;
          background: #ff8500;
          border-radius: 3px;
        }
      }
      &:hover {
        background: transparent;
        transition: all 0.3s;
        > a {
          color: white;
          background: #ff8500;
          border-radius: 3px;
        }
      }
    }
  }
}
@media only screen and (max-width: 768px),
only screen
and (max-width : 896px) 
and (max-height : 414px) {
  .theme5 {
    display: none;
  }
}
.icon-cls {
  width: 18px;
  height: 20px;
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
