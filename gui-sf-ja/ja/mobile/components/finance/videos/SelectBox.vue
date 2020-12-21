<template>
  <div class="pos-rel sl-QFVuO" :style="{ 'width': width || 'auto'}">
    <button :id="uid" type="button" class="sl-area flex space-between mid w-full" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <div class="w-full" v-html="displaySelected"></div>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" :aria-labelledby="uid">
      <li class="dd-item" 
          :class="{'selected': selectedIndex == index}"
          v-for="(item,index) in dataSource"
          :key="'35eZr'+index"
          @click="onSelect(item,index)"
      >
        <span v-html="item.text"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    width: {
      type: String,
    },
    idSelected: String, // id of item in dataSource
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    displaySelected() {
      let item = this.dataSource.filter(item => item.id == this.idSelected)[0] || {}
      return item.text
    },
  },
  methods: {
    onSelect(item, index) {
      this.selectedIndex = index
      let val = item['id'] || item
      this.$emit('input', val)
    },
  },
  data() {
    return {
      uid: this._uid + 'nfJ09BC',
      selectedIndex: this.idSelected
        ? this.dataSource.findIndex(item => item.id === this.idSelected)
        : 0
    }
  },
}
</script>


<style lang="scss" scoped>
.sl-QFVuO {
  .sl-area {
    height: 30px;
    padding: 5px;
    font-size: 15px;
    outline: none;
    border: 1px solid #d4d4d4;
    background: #fff;
    border-radius: 5px;
    min-width: 100px;
    &:active {
      border-style: solid;
    }
  }
  .dd-item {
    padding: 10px 14px 10px 5px;
    font-size: 12px;
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
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    min-width: 100%;
    padding: 0;
    width: auto;
    white-space: nowrap;
  }
}
.caret {
  margin-left: -4px;
  color: #a1a1a1;
}
.fs-10 {
  font-size: 10px;
}
.hidden-item {
  visibility: hidden;
}
.selected {
  pointer-events: none;
  background: #e0e0e0;
}
</style>

<docs>
  ```vue
  <template>
    <SelectBox :width="'150px'" :data-source="dataSource" idSelected='new' v-model="a"/>
  </template>
  <script>
  export default {
    data() {
      return {
        a: 2,
        dataSource: [
          {
            text: '人気順 <span class="ml-25">（週間）</span>',
            id: 'new'
          },
          {
            text: '人気順 <span class="ml-25">（月間）</span>',
            id: 'premier'
          },
          {
            text: '人気順 <span class="ml-25">（総合）</span>',
            id: 'trend'
          },
        ],
      }
    }
  }
  </script>
  ```
</docs>
