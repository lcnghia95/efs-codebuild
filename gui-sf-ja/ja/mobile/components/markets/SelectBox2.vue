<template>
  <div class="dropdown sl-QFVuO" :style="{ 'width': width }">
    <div :id="uid" class="sl-area flex space-between mid w-full" @click="openDropdown">
      <div class="left">{{ displaySelected }}</div>
      <div class="right">
        <span class="caret"></span>
      </div>
    </div>
    <GogoModal class="c-modal" :show="isShowModal" :cancel-text="$t(1)" @close="onClose" @ok="onOK" :ok-text="'OK'" :width="'70vw'" :height="'auto'">
      <div slot="modal-body" class="g-modal-body">
        <ul class="g-dropdown">
          <li :class="{'selected': selectedIndex == index}" v-for="(item,index) in dataSource" :key="'35eZr'+index" @click="onSelect(item,index)">
            <span :class="{'hidden-item': selectedIndex !== index}" class="glyphicon glyphicon-ok fs-15 mr-20"></span>{{ displayVal(item) }}
          </li>
        </ul>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import GogoModal from '@@/../components/modals/GogoModal.vue'
import i18n from '@@/lang/components-mobile/select-box-02.json'

export default {
  i18n: {
    messages: i18n
  },
  components: {
    GogoModal,
  },
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    width: {
      type: String,
      default: 'auto',
    },
    display: String, // key name of display text
    idVal: String, // key name of value
    dataSource: { // list item
      type: Array,
      default() {
        return []
      },
    },
    selected: { // id selected
      type: [String, Number],
      default: 0,
    },
  },
  methods: {
    onClose() {
      let item = this.dataSource.find(item => item[this.idVal] == this.selected) || {}
      this.onSelect(item, this.selected)
      this.isShowModal = false
    },
    onOK() {
      if (!this.currItem) {
        this.onClose()
        return
      }
      let val
      if (this.idVal) {
        val = this.currItem[this.idVal]
      } else {
        val = this.selectedIndex
      }
      this.$emit('input', val)
      this.isShowModal = false
    },
    openDropdown() {
      this.isShowModal = true
    },
    displayVal(item) {
      if (this.display) {
        return item[this.display]
      }
      return item
    },
    onSelect(item, index) {
      this.selectedIndex = index
      this.currItem = item
      this.displaySelected = this.display
        ? (item || {})[this.display]
        : item
    },
  },
  data() {
    let selectedIndex = this.idVal
        ? this.dataSource.findIndex(item => item.id === this.selected)
        : this.selected,
      displaySelected = this.display
        ? this.dataSource[selectedIndex][this.display]
        : this.dataSource[selectedIndex]

    return {
      isShowModal: false,
      uid: this._uid + 'nfJBC',
      currItem: null,
      selectedIndex,
      displaySelected,
    }
  },
}
</script>

<style lang="scss" scoped>
$selectHeight: 40px;
.sl-QFVuO {
  box-shadow: 0 0 5px grey;
  border-radius: 5px;
  .sl-area {
    &:active .left {
      border-color: #434343;
    }
    .left {
      height: $selectHeight;
      padding-left: 5px;
      width: 100%;
      border: 1px solid #d4d4d4;
      background: #fff;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      line-height: $selectHeight;
    }
    .right {
      height: $selectHeight;
      width: $selectHeight;
      flex: 0 0 32px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      text-align: center;
      line-height: $selectHeight;
      background: #434343;
      color: #fff;
    }
  }
  .dd-item {
    margin: 2px 5px;
    padding: 2px 2px;
    border-radius: 4px;
    &:hover {
      background-color: #f0f0f0;
    }
  }
  .sl-area[aria-expanded='true'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.hidden-item {
  visibility: hidden;
}
.selected {
  pointer-events: none;
  color: #b5b5b5;
}
/deep/ .modal-header {
  display: none;
}
/deep/ .modal-content {
  border: initial;
  box-shadow: initial;
  border-radius: initial;
}
/deep/ .modal {
  background: #b2b2b2 !important;
  &.in {
    background: #b2b2b2;
  }
}
/deep/ .c-modal .modal-footer {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  background: #fff;
  padding: 0;
  button {
    flex: 0 0 50%;
    border-radius: 0;
    height: 100%;
    background: #fff;
    color: #333;
    border: 0;
    &:first-child {
      border-left: 1px solid #e5e5e5;
    }
  }
}
.g-modal-body {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-height: calc(90vh - 35px);
  overflow: auto;
}
.g-dropdown {
  width: 100%;
  padding: 0;
  margin: 0 0 18px 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  max-height: calc(70vh - 35px);
  li {
    padding: 12px 30px;
    &.selected {
      background: rgb(243, 240, 239);
    }
    &:first-child {
      background: transparent;
    }
  }
}
/deep/ .modal-footer {
  .btn:hover,
  .btn:focus {
    background: #f3f0ef;
    border: 0;
    outline: 0;
    box-shadow: none;
  }
}
</style>
