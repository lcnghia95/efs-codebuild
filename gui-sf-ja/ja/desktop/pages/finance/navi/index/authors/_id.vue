<template>
  <div class="w-full writer-list">
    <div class="flex space-between">
      <div class="flex">
        <ImgWrapper :src="'/img/users/' + data.writer.id" alt="" class="user-img" />
        <div class="ml-20">
          <div class="user-name">
            {{ $t('1', {name: data.writer.name}) }}
          </div>
          <a class="mt-5 fs-12 user-url" :href="'/users/' + data.writer.id">
            {{ data.writer.name }}
          </a>
        </div>
      </div>
      <div class="flex layout-col ext-link">
        <a href="https://fx-on.com/lecture/duty.php?c=1&i=12711" class="flex guide">
          <File /><span class="fs-12">{{ $t('2') }}</span>
        </a>
        <button class="btn btn-default blog-part mt-20" @click="onClickShare"><span>{{ $t('5') }}</span></button>
      </div>
    </div>
    <div v-html="data.writer.userIntroduction" class="mt-5 mb-30 fs-12"></div>
    <SerieHorizontal v-for="item in dataShow.data" :key="'series-' + item.sId" :item="item" @favorite="onFavorite" />
    <div class="flex center">
      <paging :cur-page="dataShow.currentPage"
              :total="dataShow.lastPage"
              :from="dataShow.pagingFrom"
              :to="dataShow.pagingTo"
              :is-add-url-param="true"
              :origin-url="originUrl"
              :has-scroll="true"
              theme-class="theme1"
              @pagingclick="onPagingClick" class="mt-15"
      />
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="w + 100" :height="h + 400">
      <div slot="title" class="flex center">
        {{ $t('6') }}
      </div>
      <div slot="modal-body" class="share-body">
        <div class="a-row flex mid">
          <div class="title">{{ $t('7') }}</div>
          <div class="content">
            <SelectBox :width="'100px'" :data-source="layoutList" :display="'text'" :id-val="'id'" v-model="layoutType" />
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('8') }}</div>
          <div class="content">
            <input type="number" v-model="w" max="999" />px&nbsp;
            <span>{{ $t('12') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('9') }}</div>
          <div class="content">
            <input type="number" v-model="h" max="999" />px&nbsp;
            <span>{{ $t('12') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('10') }}</div>
          <div class="content">
            <input type="color" v-model="frCo" />&nbsp;
            <span>{{ $t('13') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('11') }}</div>
          <div class="content">
            <input type="color" v-model="foCo" />&nbsp;
            <span>{{ $t('13') }}</span>
          </div>
        </div>
        <div class="flex center mt-20">
          <iframe :src="`${FXON_BLOG_URL}/parts/navi_serial_parts.php?w=${w-4}&h=${h-4}&gid=0&did=${data.writer.id}&s=${layoutType}&fr=${frCo.substr(1, 7)}&fo=${foCo.substr(1, 7)}`" style="border: none; overflow: hidden;" :width="w + 'px'" :height="h + 'px'"></iframe>
        </div>
        <div class="share-footer p-20">
          <textarea class="w-full resize-vertical" ref="shareUrl" rows="3" readonly="true" v-model="buildTxt"></textarea>
        </div>
        <div class="flex center pb-20">
          <button class="btn-copy" @click="onCallCopy">{{ $t('16') }}</button>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import Paging from '@@/../components/paging/Paging.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-writer-list.json'
import { calPaging, filterInt } from '@/utils/client/common'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import FollowBtn from '@/components/finance/payment/FollowBtn02.vue'
import MiniCart from '@/components/finance/payment/MiniCart.vue'
import File from '@@/../components/icons/File.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import SerieHorizontal from '@/components/product/navi/SerieHorizontal.vue'
import ArticleList from '@/components/product/navi/ArticleList.vue'
import { gotoLogin } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      Paging,
      FavoriteBtn,
      FollowBtn,
      MiniCart,
      File,
      ImgWrapper,
      GogoModal,
      SelectBox,
      SerieHorizontal,
      ArticleList,
    },
    i18n: {
      messages: i18n,
    },
    props: {
      forceSub: Object,
    },
    data() {
      return {
        dataShow: {
          data: [],
        },
        isShowModal: false,
        frCo: '#52b800',
        foCo: '#e4e4e4',
        w: 400,
        h: 180,
        layoutList: [
          {
            id: 0,
            text: this.$t('14'),
          },
          {
            id: 1,
            text: this.$t('15'),
          },
        ],
        layoutType: 0,
        FXON_BLOG_URL: process.env.FXON_BLOG_URL,
      }
    },
    computed: {
      buildTxt() {
        return `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_serial_parts.php?w=${this
          .w - 4}&h=${this.h - 4}&gid=0&did=${this.data.writer.id}&s=${
          this.layoutType
        }&fr=${this.frCo.substr(1, 7)}&fo=${this.foCo.substr(
          1,
          7
        )}" style="border: none; overflow: hidden" width="400px" height="180px"></iframe>`
      },
    },
    async asyncData({ app, params, store, error }) {
      let locale = app.i18n.locale,
        suffix = i18n[locale]['1'],
        data = await app.GoGoHTTP.get(
          `/api/v3/surface/navi/authors/${params.id}`
        ),
        series,
        dataShow,
        originUrl,
        titleChunk
      if (!data.writer) {
        return error({ statusCode: 404 })
      }
      series = (data.series || []).map(item => {
        item.id = item.sId
        item.title = item.name
        return item
      })
      dataShow = calPaging(series || [], params.p || 1, 10)
      originUrl = `/finance/navi/authors/${params.id}`
      titleChunk = suffix.replace('{name}', data.writer.name || '')
      store.commit('pushBC', {
        name: titleChunk,
        path: originUrl,
      })
      return {
        data,
        dataShow,
        originUrl,
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
      changeFollow(list, id, status) {
        let s = list.find(el => {
          return el.id == id
        })
        if (s) {
          s.isFollow = status
        }
      },
      changeFavorite(list, id, status) {
        let s = list.find(el => {
          return el.id == id
        })
        if (s) {
          s.isFavorite = status
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
      onFavorite(item) {
        if (!this.$store.state.user.id) {
          gotoLogin(`u=${location.pathname}`)
          return
        }
        this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/series`, {
          seriesId: item.id,
        }).then(res => {
          if (res.status) {
            this.addFavorite(item)
          } else {
            this.removeFavorite(item)
          }
          this.$nuxt.$emit('upDateData')
        })
      },
      onPagingClick(page) {
        this.dataShow = calPaging(this.data.series || [], page, 10)
      },
      onClickShare() {
        this.isShowModal = true
      },
      onCallCopy() {
        this.$refs.shareUrl.select()
        document.execCommand('copy')
      },
      descriptionTemplate() {
        return this.data.writer.userIntroduction || ''
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.writer-list {
  color: #2d2d2d;
  .user-img {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
  }
  .user-name {
    font-size: 24px;
    line-height: 30px;
  }
  .user-url {
    color: #2d2d2d;
    display: inline-block;
  }
  .ext-link {
    align-items: flex-end;
  }
  .blog-part {
    background: #fdfdfd;
    padding: 0 5px;
    width: 135px;
    span {
      font-size: 11px;
    }
    &:hover,
    &:active,
    &:focus {
      outline: none;
      background: #fdfdfd;
    }
  }
  .guide {
    .icon-cls {
      color: #2d2d2d;
      flex: 0 0 17px;
      width: 17px;
      height: 17px;
    }
    span {
      margin-top: 1px;
      color: #2d2d2d;
    }
  }
}
/deep/ .modal-dialog {
  top: 15%;
  margin: 10% auto;
}
.share-body {
  border-top: 1px dotted #d9d9d9;
  background: white;
  .a-row {
    border-bottom: 1px dotted #d9d9d9;
    padding: 5px 10px;
    .title {
      text-align: right;
      flex: 0 0 40%;
      width: 40%;
      padding-right: 10px;
    }
    .content {
      padding-left: 10px;
      input {
        width: 60px;
        height: 25px;
      }
    }
  }
  .share-footer {
    textarea {
      resize: vertical;
    }
  }
  .btn-copy {
    height: 25px;
    width: 150px;
    border-radius: 5px;
    border: 1px solid #d1d1d1;
    outline: none;
    background: white;
  }
}
.serie-list /deep/ {
  .article-XMkTj {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
