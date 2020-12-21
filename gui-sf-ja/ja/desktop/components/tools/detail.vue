<template>
  <div class="mt-30">
    <div v-if="selectedCategories.length" class="flex pb-5 pl-10 pr-10">
      <b class="title-selected text-right">{{ $t('11') }}</b>
      <div class="flex flex-wrap">
        <a v-for="(item, i) in selectedCategories" :key="'cate-' + i" class="ml-20 cursor-pointer"
           @click="onGoToSearch(2, item)"
        >
          <b>{{ $t('categories.' + item) }}</b>
        </a>
      </div>
    </div>
    <div v-if="selectedKeywords.length" class="flex pb-25 pl-10 pr-10">
      <b class="title-selected text-right">{{ $t('10') }}</b>
      <div class="flex flex-wrap">
        <a v-for="(item, i) in selectedKeywords" :key="'key-' + i" class="ml-20 cursor-pointer"
           @click="onGoToSearch(1, item)"
        >
          <b>{{ $t('keywords.' + item) }}</b>
        </a>
      </div>
    </div>
    <div class="border-bottom-tools" v-if="selectedCategories.length || selectedKeywords.length"></div>
    <div class="img-stt9 flex mid center" v-if="info.status == 9">
      <svg class="svg-line">
        <line x1="0" y1="0" x2="100%" y2="100%" />
      </svg>
      <div class="text-in">{{ $t('30') }}</div>
    </div>
    <div class="title mt-20 mb-30" style="overflow-wrap: break-word;">{{ data.name }}</div>
    <div class="border-top-tools text-center" :class="{'border-bottom-tools': !data.set}" v-if="checkShowPass">
      <div class="img-stt9 flex mid center mt-30" v-if="data.statusType == 9">
        <svg class="svg-line">
          <line x1="0" y1="0" x2="100%" y2="100%" />
        </svg>
        <div class="text-in">{{ $t('30') }}</div>
      </div>
      <h4 class="title-showpass mt-50 mb-50 co-grey">{{ $t('16') }}</h4>
      <p class="txt-showpass mb-50 co-grey">{{ $t('17') }}</p>
      <div class="flex mid center mb-50">
        <input class="input-field pl-25 pr-25" v-model="password" :placeholder="$t('19')" type="password" />
        <button class="btn-lock flex mid center btn grey" @click="getProductData" :class="{'disabled': loading}">
          <LockOpen class="mr-5" />
          <span>{{ $t('18') }}</span>
        </button>
      </div>
      <div class="text-center co-red mt-10 mb-20" v-show="productStatus == 0"><b>{{ $t('23') }}</b></div>
    </div>
    <div v-else class="flex space-between pb-20" :class="{'border-bottom-tools': !data.set && info.status != 9}">
      <div class="w-685">
        <DetailBanner />
        <DetailHeader :product="data" :on-go-to-search="onGoToSearch" />
      </div>
      <div class="w-300 mt-5">
        <Payment01v1 :get-product-password="getProductData" />
      </div>
    </div>
    <LazyComp01 v-if="video.length!==0" min-height="250px" class="mt-30">
      <h2 class="title-right flex mid pl-10 m-0">
        <b class="video-title">この商品の紹介動画</b>
      </h2>
      <div class="flex mt-10">
        <iframe v-for="(item,index) in video" class="mr-10 ml-20 h-200" :src="youtubeParser(item.url)" frameborder="0" allowfullscreen :key="index"></iframe>
      </div>
    </LazyComp01>
    <div v-if="(data.set || []).length && info.status != 9" class="pt-10 pb-10 border-top-sets border-bottom-tools">
      <div>
        <b class="co-tools">{{ $t('25') }}</b>
      </div>
      <div class="flex flex-wrap mb-50">
        <ProductVertical02 v-for="(product,idx) in data.set"
                           :key="'user-product-' + idx"
                           :product="product"
                           class="product"
        />
      </div>
    </div>
    <template v-if="(realtradeWidgets || []).length">
      <div class="flex realtrade-widgets">
        <div class="flex mt-10 layout-col rt-item" v-for="(item,index) in realtradeWidgets" :key="'realtradeWidgets-' + index">
          <div class="account-info flex mb-10">
            <div class="flex ml-10 space-between layout-col w-full">
              <div class="inline-flex account-type-container">
                <div class="account-type" :style="{backgroundColor: `#${item.color}`}">
                  {{ $t('35') }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <iframe scrolling="no" :src="item.widgetUrl" frameborder="0" width="300" height="390" class="gg-hide"></iframe>
          </div>
        </div>
      </div>
    </template>
    <template v-if="hasData">
      <div class="mt-20 content-detail flex mid space-between" id="content-tab-id">
        <a class="content-tab flex mid center no-underlying cursor-pointer"
           :class="{'content-tab-active-1 box-shadow': selectedContentTab == 1}"
           @click="onSelectContentTab(1)"
        >
          <Tags class="icon-content-tab" />
          <span class="ml-5"> {{ $t('12') }} </span>
        </a>
        <a class="content-tab flex mid center no-underlying cursor-pointer"
           :class="{'content-tab-active-2 box-shadow': selectedContentTab == 2}"
           @click="onSelectContentTab(2)"
        >
          <CommentSolid class="icon-content-tab" />
          <span class="ml-5">{{ $t('13') }} &nbsp; ({{ communityTotal || 0 }})</span>
        </a>
        <a class="content-tab flex mid center no-underlying cursor-pointer"
           :class="{'content-tab-active-3 box-shadow': selectedContentTab == 3}"
           @click="onSelectContentTab(3)"
        >
          <InfoCircle class="icon-content-tab" />
          <span class="ml-5">{{ titleTab3 ? $t('24') : $t('14') }}</span>
        </a>
      </div>
      <LazyComp01 class="mt-25 pb-20" min-height="230px" :class="{'border-bottom': info.status != 9}" v-if="selectedContentTab == 1">
        <div class="outline mt-30 pl-20 pr-20 outline-IbBKtrbLMt" v-html="outline"></div>
      </LazyComp01>
      <div v-if="selectedContentTab == 2" class="mt-30">
        <Community @posted="onPosted" @update-total="onUpdateTotal" @delete-reply="onDeleteReply" :get-data="getCommunityData" :id="data.id" />
      </div>
      <div v-if="selectedContentTab == 3">
        <UserInfo :user="data.user" class="mt-50" v-if="!titleTab3" />
        <div class="mt-30 pl-20 pr-20" v-else v-html="titleTab3"></div>
      </div>
      
      <LazyComp01 :timeout="10e3" class="flex mid center mt-50" min-height="20px">
        <SocialGroup />
      </LazyComp01>
      <LazyComp01 :timeout="11e3" min-height="50px">
        <div class="mt-50 content-detail flex mid space-between">
          <a class="content-tab flex mid center no-underlying cursor-pointer"
             :class="{'content-tab-active-1 box-shadow': selectedContentTab == 1}"
             @click="onSelectContentTab(1)"
          >
            <Tags class="icon-content-tab" />
            <span class="ml-5"> {{ $t('12') }} </span>
          </a>
          <a class="content-tab flex mid center no-underlying cursor-pointer"
             :class="{'content-tab-active-2 box-shadow': selectedContentTab == 2}"
             @click="onSelectContentTab(2)"
          >
            <CommentSolid class="icon-content-tab" />
            <span class="ml-5">{{ $t('13') }} &nbsp; ({{ communityTotal || 0 }})</span>
          </a>
          <a class="content-tab flex mid center no-underlying cursor-pointer"
             :class="{'content-tab-active-3 box-shadow': selectedContentTab == 3}"
             @click="onSelectContentTab(3)"
          >
            <InfoCircle class="icon-content-tab" />
            <span class="ml-5">{{ titleTab3 ? $t('24') : $t('14') }}</span>
          </a>
        </div>
      </LazyComp01>
      <div class="flex center cart-area" v-if="info.status != 9">
        <CartButton01v1 class="mb-10 bottom-cart-btn"
                        :cart-status="info.status"
                        :get-product-password="getProductPassword"
                        :p-id="info.id"
        />
      </div>
      <div v-if="(subProducts.productsOfUser || []).length">
        <div class="mt-30 product-title-border pt-5">
          <b class="co-tools">{{ $t('22', { name: data.user.name }) }}</b>
        </div>
        <RelatedProducts :products="subProducts.productsOfUser" />
      </div>
      <div class="mt-50 product-title-border pt-5" id="related">
        <b class="co-tools">{{ $t('4') }}</b>
      </div>
      <RelatedProducts :products="subProducts.related" />
      <template v-if="alsoBoughtProducts.length > 0">
        <div class="mt-50 product-title-border pt-5" id="alsoBoughtProducts">
          <b class="co-tools">{{ $t('31') }}</b>
        </div>
        <AlsoBoughtProducts :products="alsoBoughtProducts" :enable-rank="false" />
      </template>
      <div class="mt-50 product-title-border pt-5" id="popularCount">
        <b class="co-tools">{{ $t('26') }}</b>
      </div>
      <RelatedProducts :products="subProducts.popularCount" :enable-rank="true" />
      <div class="mt-50 product-title-border pt-5" id="campaign">
        <b class="co-tools">{{ $t('27') }}</b>
      </div>
      <RelatedProducts :products="subProducts.campaign" />
      <div class="mt-50 product-title-border pt-5" id="popularPrice">
        <b class="co-tools">{{ $t('28') }}</b>
      </div>
      <RelatedProducts :products="subProducts.popularPrice" :enable-rank="true" />
      <div v-if="relatedArticles.length" class="mt-50 product-title-border pt-5" id="relatedArticle">
        <b class="co-tools">{{ $t('3') }}</b>
      </div>
      <ArticleList class="navi-wrapp mt-25 ml-25" :list="relatedArticles">
        <template slot-scope="prop">
          <navi-horizontal04 :item="prop.item"
                             :follow-fn="prop.item.onNaviFollow"
                             :favorite-fn="prop.item.onNaviFavorite"
          />
        </template>
      </ArticleList>
      <div class="tool-detail-menu w-full">
        <div class="w-1000 flex mid h-full">
          <a @click="scrollTop" class="detail-menu no-underlying flex mid">
            {{ $t('9') }}
          </a>
          <a @click="onSelectContentTab(1)" class="detail-menu no-underlying flex mid">
            {{ $t('32') }}
          </a>
          <a @click="onSelectContentTab(2)" class="detail-menu no-underlying flex mid">
            {{ $t('33') }}
          </a>
          <a :href="'/review/detail/' + id" class="detail-menu no-underlying flex mid" v-if="reviews && reviews.length > 0">
            {{ $t('1') }}
          </a>
          <a @click="goToRelated" class="detail-menu no-underlying flex mid">
            {{ $t('4') }}
          </a>
          <a v-if="relatedArticles.length > 0" @click="goToRelatedArticle" class="detail-menu no-underlying flex mid">
            {{ $t('34') }}
          </a>
        </div>
      </div>
    </template>
    <LazyComp01 :timeout="11e3" min-height="360px" v-if="!this.$store.state.user.id">
      <guide class="mt-50" />
    </LazyComp01>
    <div class="flex center btn-top" v-if="!checkShowPass">
      <button class="flex mid center bottom-btn p-5" @click="scrollTop">
        <div class="up-circle mr-10">
          <AngleUp />
        </div>
        {{ $t('20') }}
      </button>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-detail.json'
import DetailHeader from '@/components/product/DetailHeader.vue'
import Payment01v1 from '@/components/payment-v1/type01/Payment01v1.vue'
import ProductVertical02 from '@/components/product/ProductVertical02.vue'
import Tags from '@@/../components/icons/Tags.vue'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import LockOpen from '@@/../components/icons/LockOpen.vue'
import CommentSolid from '@@/../components/icons/CommentSolid.vue'
import InfoCircle from '@@/../components/icons/InfoCircle.vue'
import Community from './Community.vue'
import CartButton01v1 from '@/components/payment-v1/type01/CartButton01v1.vue'
import Guide from './Guide.vue'
import UserInfo from './UserInfo.vue'
import RelatedProducts from './RelatedProducts.vue'
import DetailBanner from '@/components/common/DetailBanner.vue'
import { setCookie,youtubeParser } from '@/utils/client/common'
import { setStoreData } from '@@/../common/js/finance/utils'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import NaviHorizontal04 from '@/components/product/navi/NaviHorizontal04.vue'
import ArticleList from '@/components/product/navi/ArticleList.vue'
import AlsoBoughtProducts from '@/components/product/AlsoBoughtProducts.vue'
import {trackingToolsDetailView} from '@@/../common/js/ga/ecom-enhance'
import SocialGroup from '@@/../components/systemtrade/SocialGroup.vue'

export default {
  components: {
    SocialGroup,
    DetailHeader,
    Payment01v1,
    ProductVertical02,
    Tags,
    CommentSolid,
    InfoCircle,
    Community,
    CartButton01v1,
    Guide,
    UserInfo,
    RelatedProducts,
    AngleUp,
    LockOpen,
    DetailBanner,
    LazyComp01,
    NaviHorizontal04,
    ArticleList,
    AlsoBoughtProducts
  },
  props: {
    getProductPassword: {
      type: Function,
    },
    id: [Number, String],
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    outline: {
      type: String,
      default() {
        return ''
      },
    },
    realtradeWidgets: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    hasData() {
      return !!(this.data || {}).id
    },
    checkShowPass() {
      return (
        this.isPassword === 1 &&
        (!this.productStatus ||
          this.productStatus === -1 ||
          this.productStatus === 9)
      )
    },
    selectedCategories: {
      get() {
        return this.$store.getters['tools/getToolsCategories']
      },
      set(val) {
        this.$store.commit('tools/setToolsCategories', val)
      },
    },
    selectedKeywords: {
      get() {
        return this.$store.getters['tools/getToolsKeywords']
      },
      set(val) {
        this.$store.commit('tools/setToolsKeywords', val)
      },
    },
  },
  data() {
    return {
      password: null,
      menu2Pos: null,
      selectedContentTab: 1,
      loading: false,
      titleTab3: (this.data.user || {}).transaction,
      communities: null,
      communityTotal: 0,
      video:[],
      subProducts: [],
      relatedArticles: [],
      alsoBoughtProducts: [],
      reviews: []
    }
  },
  i18n: {
    messages: i18n,
  },
  mounted() {
    if (!this.checkShowPass) {
      this.getRelatedData()
      trackingToolsDetailView(this.data)
    }
    this.getRelatedArticles()
    this.getDataVideo()
    this.getProductReview()
    if (this.$route.query.cmt) {
      this.onSelectContentTab(2)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    youtubeParser,
    setStoreData,
    getDataVideo() {
      this.GoGoHTTP.get(`/api/v3/surface/tools/${this.id}/video`).then(
        data => {
          this.video = data || []
        }
      )
    },
    onUpdateTotal(number) {
      this.$emit('update-total', number)
    },
    onDeleteReply() {
      this.$emit('delete-reply')
    },
    onPosted() {
      this.$emit('posted')
    },
    getCommunityData(cb) {
      if (!this.communities) {
        this.GoGoHTTP.get(`/api/v3/surface/communities?productId=${this.id}`)
          .then(data => {
            if (data instanceof Array) {
              // data is empty
              data = { comments: [], topic: 0 }
            }
            this.communities = data
            cb(data)
          })
          .catch(() => {
            cb({ comments: [] })
          })
      } else {
        cb(this.communities)
      }
    },
    getProductData(password) {
      let pass = this.password || password
      if (!pass || typeof pass !== 'string') {
        return
      }
      this.loading = true
      return this.getProductPassword(pass).finally(() => {
        this.loading = false
        this.getRelatedData()
        trackingToolsDetailView(this.data)
      })
    },
    onScroll() {
      if (window.scrollY > this.menu2Pos) {
        $('.tool-detail-menu').slideDown(300)
      } else {
        $('.tool-detail-menu').slideUp(300)
      }
    },
    scrollTop() {
      $('html, body').animate({ scrollTop: 0 }, 'slow')
    },
    goToRelated() {
      $('html, body').animate(
        { scrollTop: $('#related').offset().top - 60 },
        'slow'
      )
    },
    goToRelatedArticle() {
      $('html, body').animate(
              { scrollTop: $('#relatedArticle').offset().top - 60 },
              'slow'
      )
    },
    onGoToSearch(type, idx) {
      if (type === 1) {
        this.$store.commit('tools/setToolsKeywords', [idx])
        this.$store.commit('tools/setToolsCategories', [])
        setCookie('toolsKeywords', [idx], 5, '/tools')
        setCookie('toolsCategories', [], 5, '/tools')
        window.location = `/tools/search/?key=${idx}&p=1`
      } else {
        this.$store.commit('tools/setToolsCategories', [idx])
        this.$store.commit('tools/setToolsKeywords', [])
        setCookie('toolsKeywords', [], 5, '/tools')
        setCookie('toolsCategories', [idx], 5, '/tools')
        window.location = `/tools/search/?cat=${idx}&p=1`
      }
    },
    onSelectContentTab(_tab) {
      this.selectedContentTab = _tab
      $('html, body').animate(
        { scrollTop: $('#content-tab-id').offset().top - 100 },
        'slow'
      )
    },
    isTsukuruProduct(productId) {
      return [5735, 7560, 5939, 5941, 7561].includes(productId)
    },
    getRelatedData() {
      this.GoGoHTTP.get(
        `/api/v3/surface/tools/${this.id}/related?userId=${
          this.data.user.id
        }&type=${this.info.type}`
      )
        .then(data => {
          this.subProducts = data
        })
        .catch(() => {
          this.subProducts = []
        })
      this.GoGoHTTP.get(`/api/v3/surface/products/communities/${this.id}/count`)
        .then(data => {
          this.communityTotal = data
        })
        .catch(() => {
          this.communityTotal = 0
        })
      this.GoGoHTTP.get(`/api/v3/surface/tools/${this.id}/also/buy`)
        .then(data => {
          this.alsoBoughtProducts = data
        })
      if (process.browser) {
        this.menu2Pos = $('.menu2').position().top + $('.menu2').height()
        window.addEventListener('scroll', this.onScroll)
        setCookie('toolsKeywords', '', 5, '/tools')
        setCookie('toolsCategories', '', 5, '/tools')
      }
    },
    getRelatedArticles() {
      this.GoGoHTTP.get(
        `/api/v3/surface/tools/${this.id}/related/articles`
      )
        .then(data => {
          this.relatedArticles = data
          this.setStoreData(data)
        })
        .catch(() => {
          this.subProducts = []
        })
    },
    getProductReview() {
      this.GoGoHTTP.get(
        `/api/v3/surface/review/product/${this.id}?limit=1`,
      ).then(data => {
        this.reviews = data.data || []
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.video-title {
  font-size: 21px;
}
.h-200 {
  height: 200px;
}
.border-bottom-tools {
  border-bottom: 2px solid #f60;
}
.border-top-tools {
  border-top: 2px solid #f60;
}
.border-top-sets {
  border-top: 1px solid #707070;
}
.w-685 {
  width: 685px;
}
.w-300 {
  width: 300px;
}
.title-selected {
  flex: 0 0 170px;
  font-size: 16px;
  color: #666;
  ~ div {
    a {
      font-size: 16px;
      color: #337ab7;
    }
  }
}
.img-stt9 {
  position: relative;
  border: 1px solid #d9d9d9;
  height: 250px;
  background: #eee;
  .text-in {
    border: 1px solid #d9d9d9;
    padding: 10px 20px;
    font-size: 16px;
    background: white;
    z-index: 2;
  }
  .svg-line {
    width: 100%;
    height: 100%;
    position: absolute;
    line {
      stroke: #d9d9d9;
      stroke-width: 1;
    }
  }
}
.title {
  color: #434a54;
  font-size: 28px;
  font-weight: bold;
}
.co-tools {
  font-size: 18px;
  color: #666;
  line-height: 2;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.outline {
  white-space: pre-line;
  /deep/ * {
    max-width: 100% !important;
    img {
      height: auto;
    }
  }
}
.tool-detail-menu {
  display: none;
  position: fixed;
  height: 60px;
  top: 0;
  left: 0;
  background: white;
  box-shadow: 0 3px 4px #ededed;
  z-index: 9;
}
.detail-menu {
  cursor: pointer;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  &:hover {
    color: #f60;
    border-bottom: 2px solid #f60;
  }
}
.tab {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border: #d9d9d9 1px solid;
  border-bottom: none;
  background: white;
}
.tab-active {
  color: #2d2d2d;
  margin-bottom: -1px;
}
.fs-20 {
  font-size: 20px;
}
.co-66 {
  color: #9c3;
}
.icon-title {
  width: 30px;
  height: 30px;
}
.content-detail {
  height: 50px;
  background: #d1d1d1;
  color: #666;
  border-radius: 25px;
  overflow: hidden;
}
.content-tab {
  width: 33%;
  font-size: 20px;
  border-radius: 25px;
  font-weight: bold;
  height: 100%;
}
.content-tab-active-1 {
  color: white;
  background: #3679b6;
}
.content-tab-active-2 {
  color: white;
  background: #f6ba44;
}
.content-tab-active-3 {
  color: white;
  background: #3abb9a;
}
.icon-content-tab {
  width: 30px;
  height: 32px;
}
.btn {
  color: white;
  width: 200px;
}
.input-field {
  height: 60px;
  width: 380px;
  margin-right: 70px;
  font-size: 21px;
  &::placeholder {
    color: #9f9f9f;
  }
}
.co-grey {
  color: #656565;
}
.grey {
  background-color: #656565;
}
.orange {
  background-color: #ff8500;
}
.cart-area {
  margin: 100px 0;
  /deep/ .orange {
    width: 400px;
    height: 90px;
    font-size: 32px;
    > span {
      margin-top: 5px;
    }
  }
  /deep/ .shoping-cart {
    width: 45px;
    height: 45px;
  }
  /deep/ div.heart {
    width: 60px;
    height: 60px;
    margin-left: 20px;
    .heart-icon {
      width: 35px;
      height: 35px;
    }
  }
  /deep/ .heart-wrapp {
    flex-direction: inherit;
    .heart-number {
      font-size: 32px;
      margin-left: 10px;
    }
  }
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.product-title-border {
  border-top: 1px solid #707070;
}
.border-icon {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: #3679b6;
  color: white;
  font-size: 12px;
}
.up-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: white;
  i {
    color: #434a54;
    width: 20px;
    height: 18px;
  }
}
.box-shadow {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.6);
}
.co-red {
  color: red;
}
.btn-top {
  margin-top: 60px;
  .bottom-btn {
    border: none;
    border-radius: 5px;
    background: #434a54;
    color: white;
    width: 400px;
    height: 70px;
    font-size: 19px;
    &:hover {
      opacity: 0.9;
    }
  }
}
.title-showpass {
  font-size: 36px;
}
.txt-showpass {
  font-size: 18px;
}
.btn-lock {
  width: 320px;
  height: 60px;
  border-radius: 8px;
  &:hover {
    opacity: 0.9;
  }
  span {
    font-size: 18px;
  }
}
.cart-btn /deep/ .lh-15 {
  line-height: 20px;
}
.bottom-cart-btn /deep/ {
  button {
    width: 400px;
    height: 90px;
    font-size: 32px;
    div {
      line-height: 25px;
    }
  }
}
.navi-wrapp /deep/ {
  .article-XMkTj {
    margin-right: 26px;
    &:last-child {
      margin-right: 0;
    }
    .navi-h04 {
      width: 210px;
    }
  }
}
.account-type {
  color: white;
  background-color: orange;
  height: 32px;
  border-radius: 5px;
  padding: 8px;
  margin-right: 10px;
}
.realtrade-widgets {
  .rt-item {
    margin-right: 48px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
