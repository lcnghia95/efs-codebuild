<template>
  <div class="navi-header" :class="{detail: !isListPage, 'list-page': isListPage}">
    <div class="navi-logo">
      <a href="/finance/navi" style="text-decoration: none">
        <SeriesLogo />
        <span class="name">投資ナビ+</span>
      </a>
    </div>
    <div class="navi-menu flex space-between">
      <div class="flex mid">
        <Tab class="flex grow1" />
        <div class="user-and-search">
          <div class="author" :class="{ 'active-author' : isAuthor}">
            <SeriesAuthor :fill="isAuthor ? '#2a2a2a' : '#c9c9c9'" @click="submit" />
            <a :href="`/finance/navi/authors/`" class="author-name" v-wrap-lines="1">{{ $t('28') }}</a>
          </div>
          <button class="btn-search" @click="submit">
            <SeriesSearch class="ml-10" />
          </button>
          <div class="header-search-block">
            <input type="text" maxlength="80" class="header-search-input" :placeholder="$t('29')" v-model="searchQuery" @keyup="submitByEnter" />
          </div>
        </div>
        <div class="dropdown sub-menu mr-15">
          <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ...
          </button>
          <ul class="dropdown-menu" aria-labelledby="dLabel">
            <li class="inline-flex mid">
              <SeriesAuthor :fill="isAuthor ? '#2a2a2a' : '#c9c9c9'" />
              <a :href="`/finance/navi/authors/`" class="author-name" v-wrap-lines="1">{{ $t('28') }}</a>
            </li>
            <li class="inline-flex mid">
              <SeriesSearch @click="submit" />
              <div class="header-search-block">
                <input type="text" maxlength="80" class="header-search-input w-full" :placeholder="$t('29')" v-model="searchQuery" @keyup="submitByEnter" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <InfoBar class="navi-header-info-bar" />
    </div>
  </div>
</template>
<script>
import ArticleMixin from "@@/../common/containers/navi/article/mixins"
import Tab from '@@/../common/components/navi/tab'
import InfoBar from '@@/../common/components/navi/info-bar'
import SeriesAuthor from '@@/../components/icons/SeriesAuthor.vue'
import SeriesLogo from '@@/../components/icons/SeriesLogo.vue'
import SeriesSearch from '@@/../components/icons/SeriesSearch.vue'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'

export default {
  name: "navi-menu",
  components: { Tab, InfoBar, SeriesAuthor, SeriesLogo, SeriesSearch },
  i18n: {
    messages: i18n,
  },
  mixins: [ArticleMixin],
  props: ['isListPage'],
  data() {
    let searchQuery = this.$nuxt._route.query
    let path = this.$nuxt._route.path || ''
    let params = this.$nuxt._route.params || {}

    return {
      searchQuery: searchQuery.q && !searchQuery.isindex ? searchQuery.q :  params.wt || '',
      isAuthor: path.includes('authors'),
      isSeries: path.includes('series')
    }
  },
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
  },
  methods: {
    submitByEnter(e) {
      if (e.keyCode == 13) {
        this.submit()
      }
    },
    submit() {
      let q = encodeURIComponent(this.searchQuery)
      if (!this.searchQuery) {
        return
      }
      let type = this.isSeries ? 'series' : 'articles'
      location.href = `/finance/navi/${type}/searchresult/p/1/ipc/0/pt/3/w/${q}`
    },
  }
}
</script>
<style scoped lang="scss">
$color-c9: #c9c9c9;
.navi {
  &-logo {
    padding: 10px 40px 10px 50px;
    display: flex;
    align-items: center;
    .name {
      margin-left: 10px;
      font-size: 23px;
      color: #2d2d2d;
      font-weight: bold;
    }
  }
  &-menu {
    color: $color-c9;
    padding: 0 40px 0 30px;
  }
}

.navi-header {
  background: #ffffff;
  position: relative;
  z-index: 1;
  &:after {
    content: '';
    width: 100%;
    border-bottom: solid 2px #efefef;
    position: absolute;
    left: 0;
    z-index: -1;
  }
  &.detail {
    @media only screen and (max-width: 768px),
    only screen
    and (max-width : 896px)
    and (max-height : 414px) {
      display: none;
    }
  }
  &.list-page {
    @media screen and (max-width: 896px){
      .navi-header-info-bar {
        display: none;
      }
      .navi-logo {
        justify-content: center;
      }
      .navi-menu {
        padding: 0;
        > div {
          justify-content: space-between;
          width: 100%;
        }
        .user-and-search {
          margin-left: 0;
        }
      }
    }
    @media screen and (max-width: 768px){
      .navi-header-info-bar {
        display: flex;
        justify-content: flex-end !important;
      }
    }
    @media screen and (max-width: 718px){
      .navi-header-info-bar {
        display: none;
      }
    }
  }
}

.list-page {
  .navi-menu .fi-tab {
    @media all and (max-width: 320px) {
      padding: 5px 10px;
    }
  }
}

.user-and-search {
  font-size: 15px;
  display: flex;
  align-items: center;
  margin-left: 44px;
  a {
    color: $color-c9;
    &:hover {
      color: #2d2d2d;
      text-decoration: none;
    }
  }
  .author {
    display: flex;
  }
  .author-name {
    width: 48px;
  }
  @media all and (max-width: 480px){
    display: none;
  }
}

.dropdown.sub-menu {
  display: none;
  @media all and (max-width: 480px){
    display: block;
  }
  ul {
    left: -206px;
    top: 116%;
    width: 240px;
    min-width: 0;
    li {
      height: 40px;
      padding-left: 10px;
    }
  }
  button {
    outline: none;
    border: none;
    background: transparent;
    color: $color-c9;
    font-size: 20px;
  }
}

.icon-cls {
  display: inline-block;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
}

i.icon-cls {
  color: $color-c9;
  width: 20px;
  height: 20px;
}

i.icon-cls-logo {
  display: inline-block;
  color: $color-c9;
  width: 31px;
}

.header-search-block {
  input {
    border: none;
    color: #2a2a2a;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: $color-c9;
      opacity: 1; /* Firefox */
    }
    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: $color-c9;
    }
    &::-ms-input-placeholder { /* Microsoft Edge */
      color: $color-c9;
    }
  }
}

.active-author {
  position: relative;
  a {
    color: #2a2a2a;
    text-decoration: none;
  }
}
.active-author::before {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  margin: 0 auto;
  background: #2a2a2a;
}

@media only screen and (max-width: 1024px) {
  .user-and-search {
    margin-left: 30px;
  }
}

@media only screen and (max-width: 768px) {
  .header-search-input {
    max-width: 100px;
  }
}

button.btn-search {
  border: none;
  background: white;
  outline: none;
}
</style>
