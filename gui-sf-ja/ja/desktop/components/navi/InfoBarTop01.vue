<template>
  <div class="main--ib-t flex mid w-full">
    <div class="link--i pos-rel mr-25" id="info_follow"> <!-- The id use for jquery to get el in other component -->
      <a class="flex mid cursor-pointer" @click="cleanFavData">
        <Check class="mr-5"/>
        <span class="link-tit">{{ $t('1') }}</span>
        <div class="text-center">({{ (data.follow || []).length - unFollow }})</div>
      </a>
      <div class="nav-sub pos-abs pt-20 pb-20 pl-15 pr-15">
        <template v-if="(data.follow || []).length==0">
          <div v-if="userId" class="txt-note text-center pt-10 pb-10">
            {{ $t('4') }}「<Check/>」{{ $t('5') }}<br>
            {{ $t('6') }}
          </div>
          <div v-else class="txt-note text-center">
            {{ $t('7') }}<br>
            <a href="/login" class="txt-blue">{{ $t('8') }}</a>{{ $t('9') }}
          </div>
        </template>
        <template v-else>
          <ul class="sub-list p-0 m-0">
            <li class="flex mid" v-for="(follow,index) in (data.follow || [])" :key="'PMgVk'+index">
              <div @click="onFollow(follow)">
                <check class="li-disabled" v-if="follow.isUnFollow"/>
                <check v-else/>
              </div>
              <a :href="follow.detailUrl || '/finance/navi/'+follow.id" :title="follow.title" class="fs-13 pl-5 wrap-text">{{ follow.title }}</a>
            </li>
          </ul>
        </template>
        <a class="btn-close text-center cursor-pointer pos-abs">×</a>
      </div>
    </div>
    <div class="link--i pos-rel mr-25" id="info_fav"> <!-- The id use for jquery to get el in other component -->
      <a class="flex mid cursor-pointer" @click="cleanFavData">
        <star class="mr-5"/>
        <span class="link-tit">{{ $t('2') }}</span>
        <div class="text-center">({{ (data.favorite || []).length - unFavorite }})</div>
      </a>
      <div class="nav-sub pos-abs pt-20 pb-20 pl-15 pr-15">
        <template v-if="(data.favorite || []).length==0">
          <div v-if="userId" class="txt-note text-center pt-10 pb-10">
            {{ $t('4') }}「<star/>」{{ $t('5') }}<br>
            {{ $t('6') }}
          </div>
          <div v-else class="txt-note text-center">
            {{ $t('7') }}<br>
            <a href="/login" class="txt-blue">{{ $t('8') }}</a>{{ $t('9') }}
          </div>
        </template>
        <template v-else>
          <ul class="sub-list p-0 m-0">
            <li class="flex" v-for="(favorite,index) in (data.favorite || [])" :key="'TZofh'+index">
              <div @click="onFavorite(favorite, index)">
                <star class="li-disabled" v-if="favorite.isUnFav"/>
                <star v-else/>
              </div>
              <a :href="favorite.detailUrl || '/finance/navi/'+favorite.id" :title="favorite.title" class="fs-13 pl-5 wrap-text">{{ favorite.title || false }}</a>
            </li>
          </ul>
        </template>
        <a class="btn-close text-center cursor-pointer pos-abs">×</a>
      </div>
    </div>
    <div class="link--i pos-rel">
      <a class="flex mid cursor-pointer">
        <book class="mr-5"/>
        <span class="link-tit mr-5">{{ $t('3') }}</span>
        <div class="text-center">({{ (data.purchased || []).length }})</div>
      </a>
      <div class="nav-sub pos-abs pt-20 pb-20 pl-15 pr-15">
        <template v-if="(data.purchased || []).length==0">
          <div v-if="userId" class="txt-note text-center pt-10 pb-10">
            {{ $t('10') }}
          </div>
          <div v-else class="txt-note text-center">
            {{ $t('11') }}<br>
            <a href="/login" class="txt-blue">{{ $t('12') }}</a>{{ $t('13') }}
          </div>
        </template>
        <template v-else>
          <ul class="sub-list p-0 m-0">
            <li class="flex" v-for="(purchased,index) in (data.purchased || [])" :key="'GrvUS'+index">
              <book class="mr-10"/>
              <a :href="purchased.detailUrl" :title="purchased.title" class="fs-13 pl-5 wrap-text">{{ purchased.title }}</a>
            </li>
          </ul>
        </template>
        <a class="btn-close text-center cursor-pointer pos-abs">×</a>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import Book from '@@/../components/icons/Book.vue'
import Star from '@@/../components/icons/Star.vue'
import PaperClip from '@@/../components/icons/PaperClip.vue'
import Check from '@@/../components/icons/Check.vue'
import i18n from '@@/lang/components-desktop/info-bar-top01.json'
/**
 * The Information Bar Top 01.
 */
export default {
  data() {
    return {
      unFavorite: 0,
      unFollow: 0,
    }
  },
  i18n: {
    messages: i18n,
  },
  components: {
    CalendarAlt,
    Book,
    Star,
    PaperClip,
    Check,
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
    data: {
      get: function() {
        if (!this.userId) {
          return []
        }
        this.$nuxt.$emit('upDateDataItem')
        return this.$store.getters['finance/getFavData']
      },
      set: function(favData) {
        if (!this.userId) {
          return
        }
        this.$store.commit('finance/setFavData', favData)
      },
      cache: false,
    },
  },
  methods: {
    countUnFav() {
      let rs = 0
      this.$store.state.finance.favData.favorite.forEach(item => {
        if (item.isUnFav) {
          rs++
        }
      })
      this.unFavorite = rs
    },
    countUnFollow() {
      let rs = 0
      this.$store.state.finance.favData.follow.forEach(item => {
        if (item.isUnFollow) {
          rs++
        }
      })
      this.unFollow = rs
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
    onFollow(item) {
      this.GoGoHTTP.post(`/api/v3/surface/navi/readlater/article`, {
        articleId: item.id,
      }).then(res => {
        if (res.status) {
          this.addFollow(item)
        } else {
          this.removeFollow(item)
        }
        this.infoTopBarRerender()
      })
    },
    onFavorite(item) {
      if (item.seriesId) {
        this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/article`, {
          articleId: item.id,
        }).then(res => {
          if (res.status) {
            this.addFavorite(item)
          } else {
            this.removeFavorite(item)
          }
          this.infoTopBarRerender()
          this.$nuxt.$emit('upDateDataItem')
        })
      } else {
        this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/series`, {
          seriesId: item.id,
        }).then(res => {
          if (res.status) {
            this.addFavorite(item)
          } else {
            this.removeFavorite(item)
          }
          this.infoTopBarRerender()
          this.$nuxt.$emit('upDateDataItem')
        })
      }
    },
    cleanFavData() {
      let favorite = this.$store.state.finance.favData.favorite,
        follow = this.$store.state.finance.favData.follow
      favorite.forEach(item => {
        if (item.isUnFav) {
          this.$store.commit('finance/removeFavItem', item)
        }
      })
      follow.forEach(item => {
        if (item.isUnFollow) {
          this.$store.commit('finance/removeFollowItem', item)
        }
      })
      this.unFavorite = 0
      this.unFollow = 0
    },
    infoTopBarRerender() {
      this.countUnFav()
      this.countUnFollow()
    },
  },
  mounted() {
    this.countUnFav()
    this.countUnFollow()
    this.$nuxt.$on('upDateData', this.infoTopBarRerender)
    $('.link--i a').click(function() {
      if (
        $(this)
          .parent()
          .hasClass('active')
      ) {
        $(this)
          .parent()
          .toggleClass('active')
        return
      }
      $('.link--i').removeClass('active')
      $(this)
        .parent()
        .toggleClass('active')
    })
    $('.btn-close').click(function() {
      $('.link--i').removeClass('active')
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('upDateData')
  },
}
</script>
<style lang="scss" scoped>
.main--ib-t {
  height: 40px;
  font-size: 14px;
  justify-content: flex-end;
  border-bottom: 1px solid #d4d4d4;
  .link--i {
    &:last-child .nav-sub {
      left: -295px;
    }
    a {
      color: #2d2d2d;
      .icon-cls {
        width: 18px;
        height: 19px;
      }
    }
  }
  .nav-sub {
    display: none;
    z-index: 999;
    top: 40px;
    left: -152px;
    background: white;
    width: 400px;
    max-height: 300px;
    color: black;
    border: 1px solid #d5d5d5;
    .sub-list {
      width: 350px;
      max-height: 220px;
      list-style: none;
      overflow-y: auto;
      li {
        margin-bottom: 7px;
        i {
          flex: 0 0 18px;
          width: 18px;
          height: 18px;
          color: #ffcc03;
        }
        a {
          cursor: pointer;
          display: block;
          &:hover {
            text-decoration: underline;
          }
        }
        // &:hover {
        //   i {
        //     color: #c7c6c7;
        //   }
        // }
      }
      .li-disabled {
        color: #c7c6c7;
      }
      &::-webkit-scrollbar {
        width: 5px;
        background: #efefef;
      }
      &::-webkit-scrollbar-thumb {
        background: #dadada;
      }
    }
    .btn-close {
      display: block;
      width: 17px;
      height: 17px;
      line-height: 17px;
      font-size: 15px;
      top: -1px;
      right: -1px;
      color: #c3c3c3;
      border: 1px solid #d5d5d5;
      border-radius: 3px;
      &:hover {
        background: #d5d5d5;
        color: white;
        text-decoration: none;
      }
    }
    .txt-note {
      color: #2d2d2d;
      font-size: 14px;
      .txt-blue {
        color: #0344cc;
      }
      .icon-cls {
        width: 15px;
        height: 15px;
      }
    }
  }
}
.link--i {
  > a::before,
  > a::after {
    display: none;
    z-index: 9999;
    content: '';
    width: 0;
    height: 0;
    border-width: 0 12px 12px;
    border-style: solid;
    border-color: #d5d5d5 transparent;
    position: absolute;
    bottom: -21px;
    left: 0;
    right: 0;
    margin-left: -4px;
  }
  > a::after {
    border-color: white transparent;
    bottom: -23px;
  }
  &.active {
    > a::after,
    > a::before {
      display: block;
    }
    .nav-sub {
      display: block;
    }
  }
}
</style>
