<template>
  <div>
    <div class="list-header">
      <h5>{{ $t('26') }} {{ total }} {{ $t('27') }}</h5>
      <div class="list-filter">
        <TabFilter class="flex grow1" @onFilterTab="onFilterTab" />
      </div>
    </div>
    <div class="list-content flex space-between" :class="{ 'no-data': iList.length === 0 }">
      <div class="list-options">
        <SelectBox :width="'100px'" :data-source="sortArticle" :display="'text'" :id-val="'id'" @input="selectSort" :selected="sortType" />
      </div>
      <div class="flex flex-wrap list-VHwiM">
        <div v-for="(item, i) in iList" :key="'hi9p5' + i" class="article-XMkTj mb-25">
          <div class="flex">
            <span class="num">{{ item.index }}</span>
            <slot :num="i" :item="item" :follow-fn="item.onNaviFollow" :favorite-fn="item.onNaviFavorite"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gotoLogin } from '@/utils/client/common'
import SelectBox from '@@/../common/components/navi/series/select-box'
import TabFilter from '@@/../common/components/navi/series/tab-filter'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'

export default {
  components: {
    SelectBox,
    TabFilter
  },
  i18n: {
    messages: i18n,
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    sortType: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    addToFavorite: Function,
    addToFollow: Function,
    forceSub: Object,
    followUrl: {
      type: String,
      default: '/api/v3/surface/navi/readlater/article',
    },
    favoriteUrl: {
      type: String,
      default: '/api/v3/surface/navi/favorite/article',
    },
    changeFollow: Function,
    changeFavorite: Function,
  },
  watch: {
    list: {
      handler: function() {
        this.iList = this.processData(this.list)
      },
      deep: true,
    },
  },
  data() {
    return {
      iList: this.processData(this.list),
      sortArticle: [
        {
          id: 0,
          text: this.$t('5'),
        },
        {
          id: 1,
          text: this.$t('22'),
        },
        {
          id: 2,
          text: this.$t('23'),
        },
      ],
    }
  },
  methods: {
    selectSort(sortType) {
      this.$emit('selectSort', sortType)
    },
    processData(list) {
      return list.map((item, index) => {
        item.onNaviFollow = this.onNaviFollow
        item.onNaviFavorite = this.onNaviFavorite
        item.index = this.page * 10 + (index + 1)
        return item
      })
    },
    addFollow(item) {
      let elTopBar = $('#info_follow')
      if (elTopBar.hasClass('active')) {
        item['isUnFollow'] = false
      }
      this.$store.commit('finance/addFollowItem', item)
    },
    removeFollow(item) {
      let elTopBar = $('#info_follow')
      if (elTopBar.hasClass('active')) {
        item['isUnFollow'] = true
        this.$store.commit('finance/addFollowItem', item)
      } else {
        this.$store.commit('finance/removeFollowItem', item)
      }
    },
    addFavorite(item) {
      let elTopBar = $('#info_fav')
      if (elTopBar.hasClass('active')) {
        item['isUnFav'] = false
      }
      this.$store.commit('finance/addFavItem', item)
    },
    removeFavorite(item) {
      let elTopBar = $('#info_fav')
      if (elTopBar.hasClass('active')) {
        item['isUnFav'] = true
        this.$store.commit('finance/addFavItem', item)
      } else {
        this.$store.commit('finance/removeFavItem', item)
      }
    },
    onNaviFollow(item) {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      return this.GoGoHTTP.post(this.followUrl, {
        articleId: item.id,
      })
        .then(res => {
          if (res.status) {
            this.addFollow(item)
          } else {
            this.removeFollow(item)
          }
          this.$nuxt.$emit('upDateData')
          this.$nuxt.$emit('upDateDataItem')
        })
        .catch(err => {
          console.log('Cannot follow this series! ', err)
        })
    },
    onNaviFavorite(item) {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      return this.GoGoHTTP.post(this.favoriteUrl, {
        articleId: item.id,
      })
        .then(res => {
          if (res.status) {
            this.addFavorite(item)
          } else {
            this.removeFavorite(item)
          }
          this.$nuxt.$emit('upDateData')
          this.$nuxt.$emit('upDateDataItem')
        })
        .catch(err => {
          console.log('Cannot favorite this article! ', err)
        })
    },
    onFilterTab(index) {
      this.$emit('onFilterTab', index)
    }
  },
}
</script>
<style lang="scss" scoped>
  .no-data {
    min-height: 500px;
  }
  .num {
    display: flex;
    align-items: center;
    width: 30px;
    color: #cccccc;
  }
  .list-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  .options {
    display: flex;
  }
  .list-content {
    position: relative;
    overflow: hidden;
    .list-options {
      position: absolute;
      top: 10px;
      right: 0;
    }
  }
  .list-VHwiM {
    padding-top: 30px;
  }
  .list-filter {
    display: flex;
    align-items: center;
  }
  @media only screen and (max-width: 768px),
  only screen
  and (max-width: 896px) 
  and (max-height: 414px) {
    .list-content {
      overflow: visible;
    }
    .num {
      display: none;
    }
    .list-header {
      margin-top: 0;
      position: relative;
      padding-top: 15px;
      color: #ffffff;
    }
    .list-filter {
      position: absolute;
      right: 0;
      top: -40px;
    }
    .list-content {
      .list-options {
        top: -30px;
        background: #ffffff;
        border-radius: 5px;
      }
    }
    .article-detail {
      color: #595959;
    }
  }
</style>