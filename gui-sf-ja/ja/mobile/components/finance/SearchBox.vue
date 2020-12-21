<template>
  <div class="search-finance flex space-between w-full">
    <input
      type="text"
      ref="innerSearch"
      maxlength="50"
      class="search-input p-10"
      :placeholder="placeholder"
      :value="value"
      @change="onChange"
      @keypress.enter="onEnter">
    <button class="search-button flex mid center" @click="onSearch">
      <span class="glyphicon glyphicon-search"/>
    </button>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'search',
    event: 'input',
  },
  props: {
    search: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      value: this.search,
    }
  },
  watch: {
    search(val) {
      this.value = val
    },
  },
  methods: {
    onChange(e) {
      this.value = e.target.value
      this.$emit('input', this.value)
    },
    onEnter() {
      $(this.$refs.innerSearch).trigger('blur')
      this.$emit('enter', this.value)
    },
    onSearch() {
      this.$emit('search', this.value)
    },
  },
}
</script>


<style lang="scss" scoped>
.search-finance {
  background: #dfdedc;
  padding: 3vw;
  .search-input {
    flex: 1 0 auto;
    height: 10vw;
    border: 2px solid #b2b2b2;
    border-radius: 4px 0 0 4px;
    -webkit-appearance: none;
    &::placeholder {
      color: #ccc;
    }
  }
  .search-button {
    width: 10vw;
    height: 10vw;
    flex: 0 0 10vw;
    background: #b2b2b2;
    border-radius: 0 4px 4px 0;
    outline: none;
    border: none;
    .glyphicon-search {
      font-size: 4.5vw;
      color: white;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <SearchBox v-model="search" @enter="onEnter" @search="onSearch" :placeholder="'placeholder'"/>
  </template>
  <script>
  export default {
    data() {
      return {
        search: null
      }
    },
    methods: {
      onEnter(search) {
        console.log(search)
      },
      onSearch(search) {
        console.log(search)
      }
    }
  }
  </script>
  ```
</docs>
