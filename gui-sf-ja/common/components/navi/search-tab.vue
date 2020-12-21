<template>
  <div class="status-list inline-flex">
    <span @click="focusedTab(0)" :class="{'active': this.currentTab === this.tabIndex.all}" class="fi-tab">{{ $t('13') }}</span>
    <span @click="focusedTab(1)" :class="{'active': this.currentTab === this.tabIndex.price}" class="fi-tab">{{ $t('14') }}</span>
    <span @click="focusedTab(2)" :class="{'active': this.currentTab === this.tabIndex.free}" class="fi-tab">{{ $t('15') }}</span>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-tab.json'

const tabIndex = {
  all: 0,
  price: 1,
  free: 2
}
export default {
  i18n: {
    messages: i18n,
  },
  mounted() {
    let vm = this
    $(this.$refs.category).popover({
      placement: 'bottom',
      html: true,
      trigger: 'focus',
      delay: { show: 0, hide: 1500 },
      template:
        '<div class="popover" style="width: 300px;border-radius: 0;" role="tooltip"><div class="arrow"></div><div class="popover-content" style="padding: 10px;"></div></div>',
      content: function() {
        return $(vm.$refs.catList).html()
      },
    })
    $(this.$refs.category).on('shown.bs.popover', function() {
      $(vm.$refs.category).addClass('bg')
    })
    $(this.$refs.category).on('hidden.bs.popover', function() {
      $(vm.$refs.category).removeClass('bg')
    })
  },
  props: {
    tabSelected: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      tabIndex: tabIndex,
      currentTab: this.tabSelected || tabIndex.all,
    }
  },
  methods: {
    focusedTab(index) {
      this.currentTab = index
      this.$emit('onFilterTab', index)
    },
  },
}
</script>


<style lang="scss" scoped>
.fi-tab {
  // margin: 0 10px;
  height: 36px;
  cursor: pointer;

  // width: 54px;
  // height: 21px;
  background: #ffffff;
  color: #bfbfbf;
  font-size: 15px;
  cursor: pointer;
  transition-duration: 0.8s;
  // &:first-child {
  //   margin-left: 20px;
  // }
  &:hover {
    color: #2a2a2a;
    text-decoration: none;
  }
}
.category-btn {
  outline: none;
  &.bg {
    background: #d4d4d4;
    color: white;
  }
}
.block {
  display: block;
}
.cat-item {
  padding: 2px 5px;
  &:hover {
    background: #f1f0f1;
  }
}
.active {
  font-weight: bold;
  text-decoration: none;
  color:    #2a2a2a;
  border: none;
}
/deep/ .arrow {
  left: 103px !important;
}
.status-list {
  span {
    // margin-right: 30px;
    height: 36px;
    cursor: pointer;
    width: 52px;
    text-align: center;
    &:hover {
      color: #2C2C2C;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
@media only screen and (max-width: 768px),
only screen
and (max-width : 896px) 
and (max-height : 414px) {
  .fi-tab {
    height: 30px;
  }
}
@media screen and (max-width: 1023px) {
  .status-list {
    margin-right: 20px;

    span {
      line-height: 38px;
      margin: 0;
      padding: 0 10px;
      width: 68px !important;

      &.selected {
        background-color: #A9A9A9;
        color: white;
        font-weight: normal;
      }

      border-bottom: 1px solid #a9a9a9;
      border-top: 1px solid #a9a9a9;
      border-right: 1px solid #a9a9a9;

      &:first-child {
        border-left: 1px solid #a9a9a9;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      &:last-child {
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .left-menu {
    margin-bottom: 4em !important;

    .filters {
      .status-list, .category, .series-period {
        margin-top: 15px !important;
      }

      .series-period {
        width: 50% !important;
        margin-right: 0 !important;
      }

      .category {
        margin-right: 0 !important;
        width: 50% !important;
      }
    }
  }
}
</style>
