<template>
  <div class="search-X9ikc flex space-between">
    <input
      type="text"
      ref="innerSearch"
      maxlength="50"
      class="search-input w-full pl-10"
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
$border: 3px;
.search-X9ikc {
  border: 1px solid #d4d4d4;
  width: 240px;
  height: 35px;
  border-radius: $border;
  .search-button {
    border-top-right-radius: $border;
    border-bottom-right-radius: $border;
    flex: 0 0 40px;
    height: 100%;
    outline: none;
    border: none;
    background: white;
    .glyphicon-search {
      color: #ccc;
    }
    &:hover {
      background: #eee;
      .glyphicon-search {
        color: #7d7d7d;
      }
    }
  }
  .search-input {
    border-radius: $border;
    border: none;
    &::placeholder {
      color: #ccc;
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
