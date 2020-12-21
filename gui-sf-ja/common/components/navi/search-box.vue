<template>
  <div class="header-search-block flex space-between">
    <input type="text" maxlength="80" class="header-search-input" 
           :value="value"
           @keyup="submitByEnter"
           @change="onChange"
           @keypress.enter="onEnter"
    />
    <button class="header-search-button" @click="submit">
      <search-icon />
    </button>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-tab.json'
import SearchIcon from "@@/../common/components/search-icon"

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    SearchIcon
  },
  mounted() {},
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
    let searchQuery = this.$nuxt._route.query
    return {
      value: this.search,
      searchQuery: searchQuery.q && !searchQuery.isindex ? searchQuery.q : ''
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
    submitByEnter(e) {
      if (e.keyCode == 13) {
        this.submit()
      }
    },
    submit() {
      this.$emit('search', this.value)
    },
  },
}
</script>


<style lang="scss" scoped>
.header-search-block {
  border-radius: 23px;
  overflow: hidden;
  display: flex;
  height: 36px;
  width: 200px;
  border: 1px solid #bcb5b9;
  margin: 30px 0px 10px 0px;
  // margin: 30px 30px 30px 50px;
  input {
    font-size: 14px;
    padding-left: 30px;
    &.header-search-input {
      // height: 42px;
      // line-height: 47px;
      border: 0;
      outline: none;
      overflow: hidden;
      &::placeholder {
        color: #aeaead;
      }
    }
  }
  .header-search-button {
    background-color: white;
    width: 70px;
    height: 38px;
    padding: 0;
    border: 0;
    color: #777;
    font-size: 15px;
    outline: none;
  }
}
@media only screen and (max-width: 768px),
only screen
and (max-width : 896px)
and (max-height : 414px) {
  .header-search-block {
    // border: 2px solid #858686;
    margin: 0px;
    width: auto;
  }
  .header-search-button {
    background-color: #95bbbb;
  }
  input {
    &.header-search-input {
      width: 100%;
    }
  }
}
</style>
