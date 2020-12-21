<template>
  <div class="flex flex-wrap list-VHwiM">
    <div v-for="(item, i) in iList" :key="'hi9p5' + i" class="article-XMkTj mb-25">
      <slot :item="item" :follow-fn="item.onNaviFollow" :favorite-fn="item.onNaviFavorite"></slot>
    </div>
  </div>
</template>

<script>
import { gotoLogin } from '@/utils/client/common'
export default {
  props: {
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
    }
  },
  methods: {
    processData(list) {
      return list.map(item => {
        item.onNaviFollow = this.onNaviFollow
        item.onNaviFavorite = this.onNaviFavorite
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
  },
}
</script>
