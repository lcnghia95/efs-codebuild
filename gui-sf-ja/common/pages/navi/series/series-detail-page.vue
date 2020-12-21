<template>
  <div class="series-detail-page-container">      
    <div v-if="checkShowPass" class="series-detail-page lock-product text-center pt-40">
      <div class="password-title"><b>{{ $t('14') }}</b></div>
      <p class="mt-40 fs-12 hint">{{ $t('15') }}</p>
      <input class="input-field pl-20 pr-20" :class="(isError) ? 'is-error' : ''" v-model="password" :placeholder="(isError) ? $t('16') : $t('17')" type="password" />
      <div class="flex mid center mb-50">
        <button class="btn-lock flex mid center btn mt-10" @click="getSeries" :class="{'disabled': loading}">
          <span>{{ $t('16') }}</span>
        </button>
      </div>
    </div>
    <div class="w-full article-detail" v-else>
      <div>
        <a class="series-image" :href="'/finance/navi/authors/' + data.series.userId">
          <ImgWrapper :src="'/img/products/' + data.series.pId" :alt="`${data.series.title} ${$t('18')}`" class="product-img" />
        </a>
        <div class="w-full">
          <div class="series-title">
            <b>{{ data.series.title }}</b>
          </div>
          <div class="series-username">
            <SeriesUser class="icon-other no-circle mr-5" />
            <a class="fs-12 user-name" :href="'/finance/navi/authors/' + data.series.userId">
              {{ data.series.userName }}
            </a>
          </div>
          <div class="flex mid mb-30">
            <LikeCount 
              width="30"
              height="30"
              :liked="likeStatus.isLiked"
              :count="likeStatus.totalLike"
              @onLike="onLike"
              class="mr-20"
            />
            <navi-favourite-button class="ml-20" :height="'30px'" @favourite="onFavoriteSeries" :marked="!isUnFav?Boolean(1):Boolean(0)" />
          </div>
          <div v-html="data.series.content || ''" class="series-content"></div>
          <h5 v-if="data.series.content" class="display-mobile text-grey">{{ $t('24') }}</h5>
          <div v-if="data.series.content" class="display-mobile series-content-mobile">
            <ExpandText class="author-intro" :text="data.series.content" />
          </div>
          <div class="series-cart">
            <div class="social-part">
              <a class="blog-part" @click="onClickShare"><span>{{ $t('3') }}</span></a>
              <div class="inline-flex ml-30" style="justify-content: center">
                <navi-line-button class="mr-20" :svg-fill="'#757575'" />
                <navi-twitter-button class="mr-20" :svg-fill="'#757575'" />
                <navi-facebook-btn :svg-fill="'#757575'" />
              </div>
            </div>
            <MiniCart
              :price="data.series.price"
              :product-id="data.series.pId"
              :discount-price="data.series.discountPrice"
              :get-cart-password="getPasswordSeries"
              v-if="checkShowPayment"
            />
          </div>
        </div>
      </div>
      <div class="line-date pos-rel">{{ $t('25') }}</div>
      <article-list class="article-list" @onFilterTab="onFilterTab" @selectSort="selectSort" 
                    :sort-type="sortType" :data-source="sortArticle" :change-favorite="changeFavorite" 
                    :change-follow="changeFollow" :force-sub="forceSub" :list="dataShow.data" 
                    :add-to-favorite="$parent.addToFavorite" 
                    :add-to-follow="$parent.addToFollow" :total="totalArticle"
                    :page="(dataShow.currentPage - 1) || 0"
      >
        <template slot-scope="prop">
          <navi-horizontal07 :item="prop.item" :follow-fn="prop.item.onNaviFollow" :favorite-fn="prop.item.onNaviFavorite" :series-price="data.series.price" />
        </template>
      </article-list>
      <div class="flex center">
        <paging :cur-page="dataShow.currentPage"
                :total="dataShow.lastPage"
                :from="dataShow.pagingFrom"
                :to="dataShow.pagingTo"
                :has-scroll="false"
                theme-class="theme5"
                class="article-list"
                @pagingclick="onPagingClick"
        />
      </div>
      <div class="article-list display-mobile">
        <LoadMore v-if="(data.articles.length > 10) && (data.articles.length > dataShow.data.length)" class="ld-box flex center" @click.native="onLoadMore()" />
        <div class="bottom-space" v-else></div>
      </div>
      <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="500" :height="350">
        <div slot="title" class="flex center">
          {{ $t('9') }}
        </div>
        <div slot="modal-body" class="share-body">
          <div class="a-row flex mid">
            <div class="title">{{ $t('10') }}</div>
            <div class="content">
              <input type="color" v-model="frCo" />&nbsp;
              <span>{{ $t('11') }}</span>
            </div>
          </div>
          <div class="a-row flex mid">
            <div class="title">{{ $t('12') }}</div>
            <div class="content">
              <input type="color" v-model="foCo" />&nbsp;
              <span>{{ $t('11') }}</span>
            </div>
          </div>
          <div class="flex center mt-20">
            <iframe :src="`${FXON_BLOG_URL}/parts/navi_article_parts.php?sid=${$route.params.id}&aid=0&fr=${frCo.substr(1, 7)}&fo=${foCo.substr(1, 7)}`" style="border: none; overflow: hidden;" width="300px" height="251px"></iframe>
          </div>
          <div class="share-footer p-20">
            <textarea class="w-full resize-vertical" ref="shareUrl" rows="3" readonly="true" v-model="buildTxt"></textarea>
          </div>
          <div class="flex center pb-20">
            <button class="btn-copy" @click="onCallCopy">{{ $t('13') }}</button>
          </div>
        </div>
        <div slot="modal-footer"></div>
      </GogoModal>
    </div>
  </div>
</template>

<script>
import Paging from '@@/../components/paging/Paging.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import { checkNested } from "@/utils/client/common"

import ArticleList from '@@/../common/components/navi/series/article-list'
import MiniCart from '@@/../common/components/navi/series/mini-cart'
import NaviHorizontal07 from '@@/../common/components/navi/series/navi-horizontal07'
import LoadMore from '@@/../common/components/navi/load-more'
import ExpandText from '@@/../common/components/ExpandableText'

import SeriesUser from '@@/../components/icons/SeriesUser.vue'
import NaviFavouriteButton from "@@/../common/components/favourite-button"
import NaviFacebookBtn from "@@/../common/components/facebook-button"
import NaviTwitterButton from "@@/../common/components/twitter-button"
import NaviLineButton from "@@/../common/components/line-button"
import LikeCount from '@@/../common/components/like-count'

import AppMixin from "@@/../common/containers/navi/mixin"
import i18n from '@@/lang/desktop/navi-seriesdetail.json'

export default {
  name: "series-detail-page",
  i18n: {
    messages: i18n,
  },
  components: {
    LikeCount,
    NaviLineButton,
    Paging,
    MiniCart,
    ImgWrapper,
    GogoModal,
    NaviHorizontal07,
    ArticleList,
    SeriesUser,
    NaviFavouriteButton,
    NaviFacebookBtn,
    NaviTwitterButton,
    LoadMore,
    ExpandText,
  },
  mixins: [AppMixin],
  props: [
    'checkShowPass',
    'checkShowPayment',
    'dataShow',
    'isError',
    'data',
    'sortType',
    'sortArticle',
    'loading2',
    'isUnFav',
    'forceSub',
    'loading',
    'totalArticle',
    'likeStatus'
  ],
  data() {
    return {
      password: null,
      isShowModal: false,
      FXON_BLOG_URL: process.env.FXON_BLOG_URL,
      frCo: '#52b800',
      foCo: '#e4e4e4',
      isSeries: true
    }
  },
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
    buildTxt() {
      return `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_article_parts.php?sid=${
        this.$route.params.id
      }&aid=0&fr=${this.frCo.substr(1, 7)}&fo=${this.foCo.substr(
        1,
        7
      )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
    },
  },
  methods: {
    checkNested,
    onFilterTab(index) {
      this.$emit('onFilterTab', index)
    },
    selectSort(sortType) {
      this.$emit('selectSort', sortType)
    },
    onFavoriteSeries() {
      this.$emit('onFavoriteSeries')
    },
    onClickShare() {
      this.isShowModal = true
    },
    getPasswordSeries(password) {
      this.$emit('getPasswordSeries', password)
    },
    changeFavorite(data) {
      this.$emit('changeFavorite',data)
    },
    changeFollow(data) {
      this.$emit('changeFollow', data)
    },
    onPagingClick(page) {
      this.$emit('onPagingClick', page)
    },
    onLoadMore() {
      this.$emit('onLoadMore')
    },
    getSeries() {
      this.$emit('getSeries', this.password)
    },
    onCallCopy() {
      this.$refs.shareUrl.select()
      document.execCommand('copy')
    },
    onLike() {
      this.$emit('onLike')
    }
  }
}

</script>

<style lang="scss" scoped>
$color-cc: #cccccc;
$color-2c: #2c2c2c;
$color-2d: #2d2d2d;
$color-7c: #7c7c7c;
$color-75: #757575;
$color-fd: #fdfdfd;
$color-d9: #d9d9d9;
$color-93: #939393;
$color-orange: #ff8500;

.series-detail-page-container {
  width: 1000px; // 620 + 310 + 155
  align-self: center;
  background: #ffffff;
  margin-top: 2px;
  margin: auto;
  .article-detail-header,
  .series-header {
    background: white;
  }
}
.price-actions {
  align-items: center;
  .information {
    border: 1px solid $color-orange;
    color: $color-orange;
    width: 274px;
    height: 51px;
    text-align: center;
    font-size: 16px;
  }
}
.sharing-bottom {
  padding: 10px 0;
  border-bottom: 1px solid #d8d8d8;
}

.article-list /deep/ {
  .article-XMkTj {
    margin-bottom: 0;
    width: 100%;
  }
}
.article-detail {
  color: $color-2d;
  padding: 80px 60px 0px 60px;
  .product-img {
    flex: 0 0 170px;
    width: 350px;
    height: 200px;
    border-radius: 4px;
    overflow: hidden;
  }
  .series-title {
    font-size: 20px;
    color: $color-2c;
  }
  .series-username {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .series-content {
    font-size: 16px;
    line-height: 1.7;
    min-height: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
    color: $color-2d;
  }
  .user-name {
    color: $color-7c;
    font-size: 14px;
    font-weight: bold;
  }
  .blog-part {
    background: $color-fd;
    height: 25px;
    text-decoration: underline;
    color: $color-75;
    span {
      font-size: 14px;
      @media only screen and (max-width: 320px) {
        font-size: 12px;
      }
    }
    &:active,
    &:focus {
      outline: none;
      background: $color-fd;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
.line-date {
  border-bottom: solid 1px #dadada ;
  margin-top: 64px;
  padding-bottom: 10px;
  font-size: 16px;
  color: $color-2c;
}
/deep/ .modal-dialog {
  top: 15%;
  margin: 10% auto;
}
.share-body {
  border-top: 1px dotted $color-d9;
  background: white;
  .a-row {
    border-bottom: 1px dotted $color-d9;
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
.deactive-ux7Q3 {
  opacity: 0.5;
}
.lock-product {
  height: 100vh;
  padding-top: 100px;
  background: #eee;
  padding: 100px 0px 0px 0px;
  .password-title {
    display: inline-block;
    font-size: 26px;
    border-bottom: 1px solid $color-d9;
  }
  .hint {
    color: $color-2d;
  }
  .input-field {
    height: 35px;
    width: 310px;
    border: 1px solid $color-d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    width: 310px;
    background: #00a0e9;
    height: 50px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
i.icon-other {
  width: 23px !important;
  height: 20px !important;
}
.flex-center {
  display: flex;
  align-items: center;
}
.grey-color {
  color: #898989;
  font-weight: bold;
}
.series-image {
  float: left;
  margin-right: 20px;
  margin-bottom: 10px;
}
.fs-16 {
  font-size: 16px;
}
.min-height-50 {
  min-height: 50px;
}
.series-cart {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.social-part {
  display: flex;
  justify-content: center;
  align-items: center;
}
.display-mobile {
  display: none;
}
@media only screen and (max-width: 768px),
  only screen
  and (max-width : 896px) 
  and (max-height : 414px) {
  .display-desktop {
    display: none;
  }
  .series-detail-page-container {
    width: 100%;
    padding: 20px 15px 0px 15px;
    margin-top: 0;
  }
  .article-detail {
    padding: 0;
    .series-title {
      padding-top: 20px;
    }
    .series-username {
      padding-top: 10px;
      padding-bottom: 18px;
    }
    .series-content {
      display: none;
    }
    .product-img {
      width: auto;
    }
  }
  .series-image {
    float: unset;
    margin: 0;
  }
  .series-cart {
    flex-direction: column-reverse;
    height: auto;
  }
  .social-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .line-date {
    background: $color-cc;
    height: 55px;
    display: flex;
    align-items: center;
    font-size: 18px;

    padding-left: 15px;
    margin-left: -15px;
    padding-right: 15px;
    margin-right: -15px;

    margin-top: 0;
    padding-bottom: 0;
    a {
      color: $color-2c;
      background: $color-cc;
    }
  }
  .article-list /deep/ {
    background: #4b4b4b;

    padding-left: 15px;
    margin-left: -15px;
    padding-right: 15px;
    margin-right: -15px;

    .article-XMkTj:last-child {
      .mobile-category:last-child {
        border-bottom: none;
      }
    }
  }
  .display-mobile {
    display: block;
  }
  .series-content-mobile {
    border-top: solid 1px $color-93;
    border-bottom: solid 1px $color-93;
    padding: 20px 0px;
  }
  .text-grey {
    color: $color-93;
  }
}
.img-wrapp /deep/ {
  background-color: #ffffff !important;
  img {
    width: auto !important;
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
