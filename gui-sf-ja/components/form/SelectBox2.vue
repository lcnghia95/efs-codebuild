<template>
  <div class="dropdown sl-QFVuO" :style="{ 'width': width }">
    <button :id="uid" type="button" class="sl-area flex space-between mid w-full" @click="openDropdown">
      {{ displaySelected }}
      <span class="caret"/>
    </button>
    <GogoModal class="c-modal" :show="isShowModal" :cancel-text="'キャンセル'" @close="onClose" @ok="onOK" :ok-text="'OK'" :width="'70vw'" :height="'auto'">
      <div slot="modal-body" class="g-modal-body">
        <ul class="g-dropdown">
          <li :class="{'selected': selectedIndex == index}" v-for="(item,index) in dataSource" :key="'35eZr'+index" @click="onSelect(item,index)">
            <span :class="{'hidden-item': selectedIndex !== index}" class="glyphicon glyphicon-ok fs-15 mr-20"/>{{ displayVal(item) }}
          </li>
        </ul>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import GogoModal from '@@/../components/modals/GogoModal.vue'

export default {
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
    display: String,
    idVal: String,
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
    selected: {
      type: [String, Number],
      default: 0,
    },
  },
  methods: {
    onClose() {
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
.sl-QFVuO {
  .sl-area {
    height: 30px;
    outline: none;
    border: 1px solid #d4d4d4;
    background: transparent;
    border-radius: 5px;
    max-width: 130px; // an test
    &:active {
      border-style: solid;
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
.fs-10 {
  font-size: 10px;
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
