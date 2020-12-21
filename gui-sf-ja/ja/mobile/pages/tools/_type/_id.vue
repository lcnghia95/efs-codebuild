<template>
  <section class="pb-50">
    <div class="stt-9 pt-15 pb-15 mt-30" v-if="cartInfo.status == 9 || data.statusType == 9" v-html="$t('29')"></div>
    <div class="input-form flex mid mb-20 mt-20" @keyup.enter="searchClick">
      <Search @click.native="searchClick" />
      <input class="no-border" ref="input" type="text" v-model="textSearch" @focus="handleFocus(true)" @blur="handleFocus(false)" :placeholder="$t('27')" />
    </div>
    <div v-if="selectedCategories.length" class="flex pb-5 pl-10 pr-10">
      <b class="title-selected text-right">{{ $t('2') }}</b>
      <div class="flex flex-wrap">
        <a v-for="(item, i) in selectedCategories" :key="'cate-' + i" class="ml-20 cursor-pointer"
           @click="onGoToSearch(2, item)"
        >
          <b>{{ $t('categories.' + item) }}</b>
        </a>
      </div>
    </div>
    <div v-if="selectedKeywords.length" class="flex pb-25 pl-10 pr-10">
      <b class="title-selected text-right">{{ $t('1') }}</b>
      <div class="flex flex-wrap">
        <a v-for="(item, i) in selectedKeywords" :key="'key-' + i" class="ml-20 cursor-pointer"
           @click="onGoToSearch(1, item)"
        >
          <b>{{ $t('keywords.' + item) }}</b>
        </a>
      </div>
    </div>
    <div class="border-bottom-tools" v-if="selectedCategories.length || selectedKeywords.length"></div>
    <div class="title p-10 mt-10" style="overflow-wrap: break-word;">{{ data.name }}</div>
    <div class="border-top-tools text-center p-10" :class="{'border-bottom-tools': !data.set}" v-if="checkShowPass">
      <h4 class="title-showpass mt-30 mb-30 co-grey">{{ $t('3') }}</h4>
      <p class="txt-showpass mb-30 co-grey">{{ $t('4') }}</p>
      <div class="flex center">
        <input class="input-field p-20" v-model="password" :placeholder="$t('6')" type="password" />
      </div>
      <div class="flex center mt-20">
        <button class="btn-lock flex mid center btn grey" @click="getProductPassword" :class="{'disabled': loading}">
          <LockOpen class="mr-5" />
          <span>{{ $t('5') }}</span>
        </button>
      </div>
      <div class="co-red flex center mt-20" v-show="productStatus == 0">
        <b>{{ $t('7') }}</b>
      </div>
    </div>
    <template v-else>
      <div class="flex p-10 mt-10">
        <div class="product-img mr-15">
          <Lzimg :data-src="'/img/products/' + data.id" :alt="`${data.name} ${$t('28')}`" />
        </div>
        <div class="flex layout-col">
          <b class="co-tools mb-10" v-html="data.description"></b>
          <template v-if="cartInfo.discountStart && cartInfo.discountEnd">
            <b class="co-grey">{{ $t('8') }}:</b>
            <p class="co-red mt-5">
              <b>{{ formatTime(cartInfo.discountStart, 0) }} ~ <br /> {{ formatTime(cartInfo.discountEnd, 0) }}</b>
            </p>
          </template>
          <p v-if="cartInfo.reservedStart">
            <b class="co-grey">{{ $t('9') }}: </b>
            <span class="co-red mt-5">
              <b>{{ formatTime(cartInfo.reservedStart, 0) }}</b>
            </span>
          </p>
          <p v-if="cartInfo.reservedEnd">
            <b class="co-grey">{{ $t('10') }}: </b>
            <span class="co-red mt-5">
              <b>{{ formatTime(cartInfo.reservedEnd, 0) }}</b>
            </span>
          </p>
        </div>
      </div>
      <div class="flex mid mt-10 mb-10">
        <div class="mt-5 mb-5 title-selected pr-10 text-right">{{ $t('11') }}</div>:
        <div class="flex flex-wrap ml-15">
          <template v-if="productCategories.length">
            <span class="mt-5 mb-5 mr-10" v-for="(item,idx) in productCategories" :key="'prd-cate-' + idx" v-if="$t('categories.' + item) != 'categories.' + item">
              <a class="cursor-pointer co-tools" @click="onGoToSearch(2, item)"><b>{{ $t('categories.' + item) }}</b></a>
            </span>
          </template>
          <template v-else>
            -
          </template>
        </div>
      </div>
      <div class="flex mid mb-10">
        <div class="mb-5 title-selected pr-10 text-right">{{ $t('12') }}</div>:
        <a class="mt-5 mb-5 ml-15 co-tools" :href="'/users/' + (data.user || {}).id">
          <b>{{ (data.user || {}).name || $t('4') }}</b>
        </a>
      </div>
      <div class="flex mb-10">
        <div class="mb-5 title-selected pr-10 text-right">{{ $t('13') }}</div>:
        <div class="flex flex-wrap ml-15">
          <template v-if="productKeywords.length">
            <span class="mr-10" v-for="(item,idx) in productKeywords" :key="'prd-cate-' + idx" v-if="$t('keywords.' + item) != 'keywords.' + item">
              <a class="cursor-pointer co-tools" @click="onGoToSearch(1, item)"><b>{{ $t('keywords.' + item) }}</b></a>
            </span>
          </template>
          <template v-else>
            -
          </template>
        </div>
      </div>
      <div class="flex mb-10" v-if="data.typeId == 13">
        <div class="title-selected pr-10 text-right">{{ $t('34') }}</div>:
        <div class="ml-15">{{ $t('33') }}</div>
      </div>
      <LazyComp01 min-height="150px" class="border-top-tools pl-15 pr-15 pt-5">
        <div class="flex pt-10 pb-10 border-dash-bot">
          <div class="title-selected pr-10 text-right">
            {{ $t('9') }}
          </div>:
          <span class="ml-10">
            {{ cartInfo.start ? formatTime(cartInfo.start, 7) : '-' }}
          </span>
        </div>
        <div class="flex pt-10 pb-10 border-dash-bot">
          <div class="title-selected pr-10 text-right">
            {{ $t('16') }}
          </div>:
          <span class="ml-10">
            {{ cartInfo.updated ? formatTime(cartInfo.updated, 7) : '-' }}
          </span>
        </div>
        <div class="flex pt-10 pb-10 border-dash-bot">
          <div class="title-selected pr-10 text-right">
            {{ $t('15') }}
          </div>:
          <span class="ml-10">
            <rate class="rating" :alway-show="true" :stars="(data.review || {}).stars" :target="data.id" :number="(data.review || {}).count" />
          </span>
        </div>
        <div class="flex pt-10 pb-10">
          <div class="title-selected pr-10 text-right">
            {{ $t('18') }}
          </div>:
          <span class="ml-10">
            <SaleCount :sale-count="cartInfo.count" />
          </span>
        </div>
        <div v-if="cartInfo.brokers">
          <div class="cart-info-tag ml-100 mr-5">
            <a :href="fxonUrl()+'/company/detail/?i='+item"
               v-for="item in cartInfo.brokers"
               v-if="Object.keys(allowedBrokers).includes(item.toString())"
               class="fs-12 h-20 block ml-5 mr-5 border-radius-10 pl-10 pr-10"
               :key="'broker-' + item"
            >
              {{ allowedBrokers[item.toString()] }}
            </a>
          </div>
        </div>
      </LazyComp01>
      <LazyComp01 min-height="30px">
        <SocialGroup />
      </LazyComp01>
      <LazyComp01 :timeout="8e3" min-height="400px">
        <Payment03 class="mb-30 mt-20" :get-product-password="getProductPassword" />
      </LazyComp01>
      <LazyComp01 :timeout="9e3" class="flex tools-tab-wrapp mt-20" min-height="40px">
        <div class="tab flex mid center text-center cursor-pointer"
             :class="{'tab-active': 1 == selectedTab}"
             @click="onSelectTab(1)"
        >
          <Tags class="icon-content-tab" />
          <span>{{ $t('19') }}</span>
        </div>
        <div class="tab flex mid center text-center cursor-pointer"
             :class="{'tab-active': 2 == selectedTab}"
             @click="onSelectTab(2)"
        >
          <CommentSolid class="icon-content-tab" />
          <span>{{ $t('20') }}</span>
        </div>
        <div class="tab flex mid center text-center cursor-pointer"
             :class="{'tab-active': 3 == selectedTab}"
             @click="onSelectTab(3)"
        >
          <InfoCircle class="icon-content-tab" />
          <span>{{ titleTab3 ? $t('30') : $t('21') }}</span>
        </div>
      </LazyComp01>
      <LazyComp01 :timeout="1e4" min-height="50px" v-if="selectedTab == 1">
        <div class="outline p-20 outline-IbBKtrbLMt" v-html="outline"></div>
      </LazyComp01>
      <div class="detail-tab-des" v-if="selectedTab == 2">
        <Community :get-data="getCommunityData" :id="data.id" :commu-total="commuTotal" />
      </div>
      <div v-if="selectedTab == 3" class="p-10" style="overflow: auto;">
        <UserInfo :user="data.user" v-if="!titleTab3" />
        <div class="mt-10" v-else v-html="titleTab3"></div>
      </div>
      <LazyComp01 min-height="30px">
        <SocialGroup />
      </LazyComp01>
      <LazyComp01 :timeout="11e3" min-height="300px" v-if="cartInfo.status != 9">
        <Payment03 class="mb-30 mt-20" :get-product-password="getProductPassword" />
      </LazyComp01>
      <div class="list-product">
        <div v-if="(subProducts.productsOfUser || []).length">
          <div class="mt-20 title p-10">
            <b>{{ $t('22', {name: data.user.name}) }}</b>
          </div>
          <ListProduct :products="subProducts.productsOfUser" />
        </div>
        <div v-if="relatedArticles.length" class="mt-20 title p-10">
          <b>{{ $t('32') }}</b>
        </div>
        <NaviRankHorizontal01 class="al-item" v-for="item in relatedArticles" :key="'articles-list' + item.id" :item="item" :follow-fn="onNaviFollowItem" :fav-fn="onNaviFavoriteItem" />
        <div class="title p-10" id="related">
          <b>{{ $t('23') }}</b>
        </div>
        <ListProduct :products="subProducts.related" />
        <div class="mt-20 title p-10" id="popularCount">
          <b>{{ $t('24') }}</b>
        </div>
        <ListProduct :products="subProducts.popularCount" :enable-rank="true" />
        <div class="mt-20 title p-10" id="campaign">
          <b>{{ $t('25') }}</b>
        </div>
        <ListProduct :products="subProducts.campaign" />
        <div class="mt-20 title p-10" id="popularPrice">
          <b>{{ $t('26') }}</b>
        </div>
        <ListProduct :products="subProducts.popularPrice" :enable-rank="true" />
      </div>
    </template>
  </section>
</template>

<script>
import title from '@@/../common/pages'
import titleI18n from '@@/lang/common/title.json'
import i18n from '@@/lang/mobile/tools-id.json'
import LockOpen from '@@/../components/icons/LockOpen.vue'
import SaleCount from '@/components/tools/SaleCount.vue'
import Payment03 from '@/components/payment/Payment03.vue'
import Tags from '@@/../components/icons/Tags.vue'
import CommentSolid from '@@/../components/icons/CommentSolid.vue'
import InfoCircle from '@@/../components/icons/InfoCircle.vue'
import Rate from '@@/../components/product/Rate.vue'
import Community from '@/components/tools/ToolsCommunity.vue'
import UserInfo from '@/components/tools/UserInfo.vue'
import ListProduct from '@/components/tools/ListProduct.vue'
import Search from '@@/../components/icons/Search.vue'
import { editCss, filterInt, setCookie } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import NaviRankHorizontal01 from '@/components/product/navi/NaviRankHorizontal01.vue'
import { getExternalRedirectLink, isMultiplePrice } from '@@/../common/js/product/externalProduct'
import {trackingToolsDetailView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'
import SocialGroup from '@@/../components/systemtrade/SocialGroup.vue'

import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'

const obj = Object.assign(
  {
    validate({ params }) {
      return (
        !isNaN(filterInt(params.id)) &&
        ['ebooks', 'indicators', 'rooms'].includes(params.type)
      )
    },
    components: {
      SocialGroup,
      Lzimg,
      LazyComp01,
      LockOpen,
      SaleCount,
      Payment03,
      Tags,
      CommentSolid,
      InfoCircle,
      Rate,
      Community,
      UserInfo,
      ListProduct,
      Search,
      NaviRankHorizontal01
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        id: null,
        data: {},
        commuTotal: 0,
        subProducts: [],
        isFavorite: false,
        loading: false,
        password: null,
        allowedBrokers: [],
        selectedTab: 1,
        communities: null,
        textSearch: null,
        relatedArticles: [],
      }
    },
    computed: {
      cartInfo() {
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
      productCategories() {
        return this.processArray('categories')
      },
      productKeywords() {
        return this.processArray('keywords')
      },
    },
    mounted() {
      this.onGetBrokers()
      if (!this.checkShowPass) {
        this.getExtendData()
        trackingToolsDetailView(this.data)
      }
      if (this.$route.query.cmt) {
        this.onSelectTab(2)
        this.$nextTick(() => {
          if ($('.tools-tab-wrapp').length) {
            $('html, body').animate(
              {
                scrollTop: $('.tools-tab-wrapp').offset().top - 20,
              },
              'slow'
            )
          }
        })
      }
    },
    async asyncData({ app, params, error, req, store }) {
      let locale = app.i18n.locale,
        title = titleI18n[locale].title,
        titlePrefix = i18n[locale].titlePrefix,
        [toolData, externalUrl, isRangePrice] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/tools/${params.id}?type=${params.type}`),
          getExternalRedirectLink(app, params.id),
          isMultiplePrice(app, params.id),
        ]),
        titleChunk,
        currentUrl
      store.commit('cart/setInfo', {
        // OAM-27672
        info: Object.assign({},
          { externalUrl, isRangePrice },
          toolData.cartInfo),
        productStatus: toolData.status,
        isPassword: toolData.isPassword,
      })
      if (!toolData || !Object.keys(toolData).length) {
        return error({ statusCode: 404 })
      }
      let data = toolData,
        outline = toolData.outline || ''
      if (process.browser) {
        currentUrl = window.location.href
      } else {
        currentUrl = process.env.GOGO_URL + req.originalUrl
      }
      titleChunk = titlePrefix ? `${data.name} - ${titlePrefix}` : data.name
      if (outline.includes('<style')) {
        outline = editCss(outline, '.outline-IbBKtrbLMt')
      }
      const { 
        cartInfo: { name, price, status } = {},
        review: { count, stars } = {},
        isPassword,
      } = data
      return {
        id: params.id,
        data: data,
        titleTab3: (data.user || {}).transaction || null,
        titleChunk,
        outline: outline || '',
        keywordsChunk: data.name,
        meta: [
          {
            name: 'og:site_name',
            content: 'GogoJungle',
            hid: 'og:site_name',
          },
          {
            name: 'og:type',
            content: 'website',
            hid: 'og:type',
          },
          {
            name: 'og:title',
            content: `${titleChunk} - ${title}`,
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: data.description || data.name,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:url',
          },
          {
            name: 'og:image',
            content: process.env.GOGO_URL + '/img/products/' + params.id,
            hid: 'og:image',
          },
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/${params.type}/${
              params.id
            }`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: name,
          id: params.id,
          description: data.description || data.name,
          url: `${process.env.GOGO_URL}/tools/${params.type}/${params.id}`,
          image_link: `${process.env.GOGO_URL}/img/products/${params.id}`,
          product_type: 6,
          status: isPassword ? 3 : status,
          price,
          count,
          rate: stars,
        }),
      }
    },
    methods: {
      onNaviFollowItem,
      onNaviFavoriteItem,
      onGetDataRelatedArticles() {
        this.GoGoHTTP.get(`/api/v3/surface/tools/${this.id}/related/articles`)
          .then(data => {
            this.relatedArticles = data || []
          })
      },
      getExtendData() {
        this.GoGoHTTP.get(
          `/api/v3/surface/tools/${this.$route.params.id}/related?userId=${
            this.data.user.id
          }&type=${this.cartInfo.type}`
        )
          .then(data => {
            this.subProducts = data
          })
          .catch(() => {
            this.subProducts = []
          })
        this.GoGoHTTP.get(
          `/api/v3/surface/products/communities/${this.$route.params.id}/count`
        )
          .then(data => {
            this.commuTotal = data
          })
          .catch(() => {
            this.commuTotal = 0
          })
        this.onGetDataRelatedArticles()
      },
      onGetBrokers() {
        this.GoGoHTTP.get(`/api/v3/brokers/domestic`).then(data => {
          this.allowedBrokers = data || []
        })
      },
      onUpdateTotal(number) {
        this.commuTotal = number
      },
      onDeleteReply() {
        this.commuTotal--
      },
      onPosted() {
        this.commuTotal++
      },
      getProductPassword(password) {
        return this.GoGoHTTP.post(
          '/api/v3/surface/tools/' + this.$route.params.id,
          {
            pagePassword: typeof password == 'string' ? password : this.password,
            type: this.$route.params.type,
          }
        )
          .then(data => {
            if (!data || !Object.keys(data).length) {
              this.$router.push('/tools')
              return
            }
            if (this.data.isPassword === 2) {
              this.$store.commit('cart/productStatus', data.status)
            }
            if (this.data.isPassword === 1 && data.status == 0) {
              this.$store.commit('cart/productStatus', 0)
            }
            if (this.data.isPassword === 1 && data.status == 1) {
              this.$set(this, 'data', data)
              this.$store.commit('cart/setCart', data.cartInfo)
              this.$store.commit('cart/productStatus', 1)
              this.$set(this, 'commuTotal', data.commuTotal || 0)
              this.getExtendData()
              trackingToolsDetailView(this.data)
              let outline = data.outline || '',
                locale = this.$i18n.locale,
                suffixDes = titleI18n[locale].suffixDes,
                title = titleI18n[locale].title,
                description = titleI18n[locale].description,
                currentUrl = window.location.href,
                descriptionChunk,
                titleChunk,
                keywordsChunk
              descriptionChunk = `${data.name} ${suffixDes}`
              titleChunk =
                this.$t('titlePrefix') !== 'titlePrefix'
                  ? `${data.name}- ${this.$t('titlePrefix')}`
                  : data.name
              if (outline.includes('<style')) {
                outline = editCss(outline, '.outline-IbBKtrbLMt')
              }
              this.$set(this, 'id', this.$route.params.id)
              this.$set(this, 'titleChunk', titleChunk)
              this.$set(this, 'outline', outline || '')
              this.$set(this, 'descriptionChunk', descriptionChunk)
              this.$set(this, 'keywordsChunk', keywordsChunk)
              this.$set(this, 'meta', [
                {
                  name: 'og:site_name',
                  content: 'GogoJungle',
                  hid: 'og:site_name',
                },
                {
                  name: 'og:type',
                  content: 'website',
                  hid: 'og:type',
                },
                {
                  name: 'og:title',
                  content: `${titleChunk} - ${title}`,
                },
                {
                  name: 'og:description',
                  content: `『${descriptionChunk}』 ${description}`,
                  hid: 'og:description',
                },
                {
                  name: 'og:url',
                  content: currentUrl,
                  hid: 'og:site_name',
                },
                {
                  name: 'og:image',
                  content:
                    process.env.GOGO_URL +
                    '/img/products/' +
                    this.$route.params.id,
                  hid: 'og:image',
                },
              ])
              this.$set(this, 'linkMeta', [
                {
                  rel: 'canonical',
                  href: `https://www.gogojungle.co.jp/tools/${this.$route.type}/${
                    this.$route.id
                  }`,
                },
              ])
            }
          })
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
      processArray(type) {
        if (!this.data || !this.data[type] || !this.data[type].length) {
          return []
        }
        return this.data[type].split(',')
      },
      onSelectTab(_tab) {
        this.selectedTab = _tab
      },
      getCommunityData(cb, needRefresh = false) {
        if (!this.communities || needRefresh) {
          this.GoGoHTTP.get(
            `/api/v3/surface/communities?productId=${this.$route.params.id}`
          )
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
      descriptionTemplate() {
        return this.data.description || this.data.name
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.stt-9 {
  background: #7d7d7d;
  font-size: 16px;
  text-align: center;
  color: white;
}
.input-form {
  padding: 0 5%;
  i {
    color: #a1a1a1;
  }
  &::before {
    width: 90%;
  }
}
.border-bottom-tools {
  border-bottom: 2px solid #f60;
}
.border-top-tools {
  border-top: 2px solid #f60;
}
.title {
  color: #434a54;
  font-size: 18px;
  font-weight: bold;
  background: #f3f0ef;
}
.co-tools {
  font-size: 14px;
  color: #3379b8;
  line-height: 20px;
}
.title-showpass {
  font-size: 28px;
}
.txt-showpass {
  font-size: 18px;
}
.btn-lock {
  width: 68vw;
  height: 60px;
  border-radius: 8px;
  &:hover {
    opacity: 0.9;
  }
  span {
    font-size: 18px;
  }
}
.btn {
  color: white;
  width: 68vw;
}
.input-field {
  height: 60px;
  width: 68vw;
  font-size: 21px;
  border: 1px solid #d9d9d9;
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
.co-red {
  color: red;
}
.product-img {
  flex: 0 0 25vw;
  width: 25vw;
  height: 25vw;
  background: #f5f7fa;
  overflow: hidden;
  img {
    max-width: 25vw;
    max-height: 25vw;
  }
}
.title-selected {
  flex: 0 0 25vw;
  a {
    font-size: 14px;
    color: #337ab7;
    text-decoration: underline;
  }
}
.border-dash-bot {
  border-bottom: dashed 1px #d9d9d9;
}
.rating {
  /deep/ .gg-rating {
    font-size: 16px;
    align-items: center;
  }
}
.tools-tab-wrapp {
  height: 40px;
  .tab {
    font-size: 12px;
    color: #666;
    flex: 1;
    border: 1px solid #e0dedc;
    line-height: 14px;
    border-right: 0;
    padding: 0 3px;
  }
  .tab-active {
    background: #9c3;
    color: white;
    border: 1px solid #9c3;
  }
  .icon-content-tab {
    width: 6vw;
    height: 6vw;
  }
}
.outline {
  white-space: pre-line;
  word-break: break-all;
  overflow: hidden;
  /deep/ > * {
    overflow-x: auto;
  }
  /deep/ * {
    max-width: 100% !important;
    img {
      height: auto;
      &.ext-content {
        height: 0 !important;
      }
    }
  }
}
.list-product {
  b {
    font-size: 18px;
  }
}
/deep/ .group-1 {
  .sale-remain {
    border-bottom: none !important;
  }
  .sale-count {
    display: none;
  }
  .ex-count {
    display: none;
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
