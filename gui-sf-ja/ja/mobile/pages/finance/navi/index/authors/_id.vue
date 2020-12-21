<template>
  <div class="author-detail mt-10 mb-25">
    <div class="author-title flex space-between">
      <div class="flex">
        <img class="author-img" :src="getNaviImg(this.dataAuthor, '/img/users/')" />
        <div class="author-names">
          <div>
            <b>{{ dataAuthor.name }}{{ $t('1') }}</b>
          </div>
          <div class="small-name mt-5 flex mid">
            <edit class="edit-icn" /><span class="fs-12">{{ dataAuthor.name }}</span>
          </div>
        </div>
      </div>
      <a class="author-notes flex mid space-between" href="https://fx-on.com/lecture/duty.php?c=1&i=12711">
        <div class="an-text" v-wrap-lines="2" v-html="$t('2')"></div>
        <span class="an-icon">〉</span>
      </a>
    </div>
    <hr class="ad-hr" />
    <ExpandText class="author-intro" :text="this.dataAuthor.userIntroduction" />
    <SeriesItem v-for="item in this.dataSeries" :key="'srs_' + item.sId" :item="item" :fav-fn="onNaviFavoriteItem" />
  </div>
</template>

<script>
import NaviTabMenu from '@/components/finance/navi/NaviTabMenu.vue'
import SearchBox from '@/components/finance/SearchBox.vue'
import ExpandText from '@/components/finance/ExpandableText.vue'
import SeriesItem from '@/components/product/navi/AuthorsSeriesItem.vue'
import Edit from '@@/../components/icons/Edit.vue'
import { onNaviFavoriteItem, getNaviImg } from '@@/../common/js/finance/utils'
import i18n from '@@/lang/mobile/navi-authors-detail.json'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      NaviTabMenu,
      SearchBox,
      ExpandText,
      SeriesItem,
      Edit,
    },
    i18n: { messages: i18n },
    data() {
      return {
        keyword: null,
      }
    },
    async asyncData({ app, params, error }) {
      let data = await app.GoGoHTTP.get(
          `/api/v3/surface/navi/authors/${params.id}`
        ),
        locale = app.i18n.locale,
        suffix = i18n[locale]['1'],
        titleChunk
      if (!data.writer) {
        return error({ statusCode: 404 })
      }

      titleChunk = `${(data.writer || { name: '' }).name}${suffix}`

      return {
        dataAuthor: data.writer,
        dataSeries: data.series || [],
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/authors/${
              params.id
            }`,
          },
        ],
      }
    },
    methods: {
      onNaviFavoriteItem,
      getNaviImg,
      gotoSearch() {
        let query = this.keyword ? `w/${encodeURIComponent(this.keyword)}` : ''

        location.href = `/finance/navi/articles/searchresult/${query}`
      },
      descriptionTemplate() {
        return this.dataAuthor.userIntroduction || ''
      },
    },
  },
  title
)

export default obj
</script>
<style lang="scss" scoped>
.ad-hr {
  margin-top: 10px;
  margin-bottom: 0;
}
.author-intro {
  box-shadow: 0 2px 8px #ddd;
  padding: 3vw;
  /deep/ .expend-btn {
    margin-top: 5px;
  }
}
.author-title {
  margin: 3vw;
  min-height: 10vw;
}
.author-img {
  width: 60px;
  object-fit: cover;
  flex: 0 0 60px;
  height: 60px;
}
.author-names {
  margin-left: 3vw;
  text-align: left;
}
.small-name {
  color: #707070;
}
i.icon-cls {
  width: 4vw;
}
.author-notes {
  width: 19vw;
  background-color: white;
  border: 1px solid #dfdedc;
  color: #333;
  border-radius: 4px;
  padding: 5px;
  &:visited,
  &:hover,
  &:active {
    text-decoration: none;
  }
  .an-text {
    line-height: 18px;
    font-size: 15px;
    width: 50px;
    max-height: 42px;
  }
  .an-icon {
    margin-left: 5px;
  }
}
.edit-icn.icon-cls {
  width: 20px;
  height: 23px;
}
</style>

<style lang="scss">
/* stylelint-disable */
.menu-cls,
.search-box,
.nav-wrapper--fi {
  display: none;
}
/* stylelint-enable */
</style>
