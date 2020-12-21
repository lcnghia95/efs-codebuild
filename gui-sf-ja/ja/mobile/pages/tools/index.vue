<template>
  <div class="tools-index mt-20">
    <div class="input-form flex mid mb-20" @keyup.enter="searchClick">
      <Search @click.native="searchClick" />
      <input class="no-border" ref="input" type="text" v-model="textSearch" @focus="handleFocus(true)" @blur="handleFocus(false)" :placeholder="$t('31')" />
    </div>
    <div class="flex mid space-between p-10 title">
      <a class="fs-20" href="/tools">{{ $t('1') }}</a>
      <div class="filter-tools flex mid center" @click="showFilter">
        {{ $t('4') }}
        <span class="arrow-down"></span>
      </div>
    </div>
    <nuxt-child />
    <GogoModal :show="showModal" :cancel-text="''" :ok-text="''" @update:show="val => showModal = val" class="c-modal" :width="'90vw'" :height="'80vh'">
      <div slot="title" class="modal-title pl-10">
        {{ $t('5') }}
      </div>
      <div slot="modal-body" class="modal-body p-10">
        <div class="type-title">{{ $t('6') }}</div>
        <div class="flex flex-wrap space-between mt-10">
          <checkbox v-model="selectedCategories" :attrs="{ id: 'categories'+key, value: key }" :label="label" v-for="(label, key) in $t('categories')" :key="'categories-' + key" class="ml-10" />
        </div>
        <div class="type-title mt-20">{{ $t('7') }}</div>
        <div class="flex flex-wrap space-between mt-10">
          <checkbox v-model="selectedKeywords" :attrs="{ id: 'keywords'+key, value: key }" :label="label" v-for="(label, key) in $t('keywords')" :key="'keywords-' + key" class="ml-10" />
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button @click="onlickOk" v-if="$route.path != '/tools'">OK</button>
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/tools-index.json'
import title from '@@/../common/pages'
import { setCookie } from '@/utils/client/common'
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import TextField from '@/components/form/TextField.vue'
import Search from '@@/../components/icons/Search.vue'

function buildTitle(val) {
  let totalLength = val.categories.length + val.keywords.length
  if (!totalLength) {
    return ''
  } else {
    let arr = [...val.categories, ...val.keywords],
      str = '',
      i,
      l
    for (i = 1, l = arr.length - 1; i < l; i++) {
      str += `- ${arr[i]} `
    }
    str = arr[0] + str
    if (arr.length > 1) {
      str += '- ' + arr[arr.length - 1]
    }
    return str
  }
}

const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      Checkbox,
      GogoModal,
      TextField,
      Search,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        descriptionChunk: null,
        keywordsChunk: null,
        showModal: false,
        textSearch: this.$route.query.t ? this.$route.query.t : null,
        attr: {
          placeholder: this.$t('31'),
          name: 't',
          model: this.text,
        },
      }
    },
    computed: {
      selectedCategories: {
        get() {
          return this.$store.getters['tools/getToolsCategories']
        },
        set(val) {
          if (!this.isSearch) {
            location.href = `/tools/search/?cat=${val[0]}`
          }
          let cat = val.map(e => this.$t('categories')[e]),
            key = this.selectedKeywords.map(e => this.$t('keywords')[e]),
            str = buildTitle.call(this, { categories: cat, keywords: key })
          this.titleChunk = str || this.$t('1')
          this.descriptionChunk = str
          this.keywordsChunk = [...cat, ...key].join()
          this.$store.commit('tools/setToolsCategories', val)

          setCookie('toolsCategories', val, 5, '/tools')
        },
      },
      selectedKeywords: {
        get() {
          return this.$store.getters['tools/getToolsKeywords']
        },
        set(val) {
          if (!this.isSearch) {
            location.href = `/tools/search/?key=${val[0]}`
          }
          let cat = this.selectedCategories.map(e => this.$t('categories')[e]),
            key = val.map(e => this.$t('keywords')[e]),
            str = buildTitle.call(this, { keywords: key, categories: cat })
          this.titleChunk = str || this.$t('1')
          this.descriptionChunk = str
          this.keywordsChunk = [...cat, ...key].join()
          this.$store.commit('tools/setToolsKeywords', val)

          setCookie('toolsKeywords', val, 5, '/tools')
        },
      },
      isSearch() {
        return this.$route.fullPath.indexOf('/tools/search') > -1 ? true : false
      },
    },
    methods: {
      onGoToSearch(type, index) {
        if (this.$route.fullPath.indexOf('/tools/search') > -1) {
          return
        }
        if (type === 1) {
          location.href = `/tools/search/?cat=${index}&p=1`
          setCookie('toolsCategories', [index], 5, '/tools')
        } else {
          location.href = `/tools/search/?key=${index}&p=1`
          setCookie('toolsKeywords', [index], 5, '/tools')
        }
      },
      titleTemplate(localeDoc) {
        if (!this.selectedCategories.length && !this.selectedKeywords.length) {
          // in case there is no selected category and keyword
          // it will return the default title
          return `${this.$t('1')} - ${localeDoc.title}`
        } else {
          return `${this.titleChunk}- ${this.$t('25')}`
        }
      },
      descriptionTemplate() {
        if (this.selectedCategories.length || this.selectedKeywords.length) {
          return `${this.descriptionChunk}- ${this.$t('26')}`
        }
      },
      keywordsTemplate() {
        if (this.selectedCategories.length || this.selectedKeywords.length) {
          return `${this.keywordsChunk},${this.$t('27')}`
        }
      },
      showFilter() {
        this.showModal = true
      },
      searchClick() {
        // $(this.$refs.searchForm).submit()
        if (this.textSearch) {
          location.href = `/tools/search/?t=${this.textSearch}`
        }
      },
      handleFocus(isAddFocus) {
        if (isAddFocus) {
          this.$el.classList.add('input-form--focus')
        } else {
          this.$el.classList.remove('input-form--focus')
        }
      },
      onlickOk() {
        this.showModal = false
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.tools-index {
  .input-form {
    padding: 0 5%;
    i {
      color: #a1a1a1;
    }
    &::before {
      width: 90%;
    }
  }
  .title {
    background: #f3f0ef;
    .fs-20 {
      font-size: 17px;
      font-weight: bold;
      color: #393939;
    }
    .filter-tools {
      font-size: 15px;
      padding: 4px 10px 3px;
      border-radius: 3px;
      border: 2px solid #e0dedc;
      background: white;
      span.arrow-down {
        margin-left: 2px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px 4px 0 4px;
        border-color: #7d7d7d transparent transparent transparent;
      }
    }
  }
  .modal-title {
    font-size: 16px;
    border-left: 2px solid #9c3;
  }
  .modal-body {
    height: calc(80vh - 120px);
    .type-title {
      font-weight: bold;
      color: #9c3;
      border-bottom: 2px solid #d9d9d9;
    }
    /deep/ .c-label {
      width: 40vw;
      font-weight: normal;
      margin-left: 0;
      margin-bottom: 5px;
    }
  }
  .modal-footer {
    height: 50px;
    button {
      width: 40%;
      max-width: 120px;
      color: white;
      background: #9c3;
      border: 0;
    }
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.search-box {
  display: none;
}
/* stylelint-enable */
</style>
