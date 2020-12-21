<template>
  <div>
    <span>{{ title }}: </span>
    <div class="dropdown sl-QFVuO" :style="{ 'width': width || 'auto'}">
      <button :id="uid" type="button" class="sl-area flex space-between mid" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span>{{ displaySelected }}</span>
        <ChevronDown class="caret-icon icon-cls" />
      </button>
      <ul class="dropdown-menu" :aria-labelledby="uid">
        <li class="dd-item cursor-pointer" :class="{'selected': selectedIndex == index}" v-for="(item,index) in dataSource" :key="'35eZr'+index" @click="onSelect(item,index)">
          <span :class="{'hidden-item': selectedIndex !== index}" class="glyphicon glyphicon-ok fs-10 mr-5" aria-hidden="true" v-if="showCheck"></span>{{ displayVal(item) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ChevronDown from '@@/../components/icons/ChevronDown.vue'

export default {
  components: {
    ChevronDown,
  },
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    width: {
      type: String,
    },
    title: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: ''
    },
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
    showCheck: {
      type: [Boolean, Number],
      default: true,
    },
  },
  computed: {
    displaySelected() {
      this.selectedIndex = this.idVal
        ? this.dataSource.findIndex(item => item.id === Number(this.selected))
        : this.selected < this.dataSource.length
          ? this.selected
          : this.dataSource.length - 1
      if (this.display) {
        return this.dataSource[this.selectedIndex][this.display]
      }
      return this.dataSource[this.selectedIndex]
    },
  },
  methods: {
    displayVal(item) {
      if (this.display) {
        return item[this.display]
      }
      return item
    },
    onSelect(item, index) {
      this.selectedIndex = index
      let val
      if (this.idVal) {
        val = item[this.idVal]
      } else {
        val = index
      }
      this.$emit('input', val)
    },
  },
  data() {
    return {
      uid: this._uid + 'nfJBC',
      selectedIndex: this.idVal
        ? this.dataSource.findIndex(item => item.id === this.selected)
        : this.selected < this.dataSource.length
          ? this.selected
          : this.dataSource.length - 1,
    }
  },
}
</script>
<style lang="scss" scoped>
.open {
  .caret-icon {
    transform: rotate(180deg);
  }
}
.caret-icon {
  transition: 0.8s ease;
  margin-left: 10px;
}
i.icon-cls {
  width: 18px !important;
  height: 20px !important;
}
.dropdown-menu {
  transition: 0.8s;
}
.sl-QFVuO {
  .sl-area {
    height: 30px;
    padding: 5px 20px;
    outline: none;
    background: transparent;
    min-width: 100px;
    font-weight: bold;
    border: none;
    span {
      text-align: left;
      min-width: 100px
    }
  }
  .dd-item {
    margin: 10px 5px;
    padding: 2px 2px;
    &:hover {
      background-color: #f0f0f0;
    }
  }
  .sl-area[aria-expanded='true'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .dropdown-menu {
    margin-top: 0;
    min-width: 100%;
    width: auto;
    white-space: nowrap;
    border: none;
    box-shadow: none;
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
</style>
