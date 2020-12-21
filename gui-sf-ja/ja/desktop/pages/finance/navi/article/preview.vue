<template>
  <section class="detail-bg body">
    <div class="w-1000 bg-white pt-30 pl-40 pr-40 pb-15">
      <div class="flex fs-12">
        <span>{{ formatTime(article.createdAt, 20) }}</span>
        <span>{{ $t('4') }}</span> /
        <span>{{ formatTime(article.createdAt, 20) }}</span>
        <span>{{ $t('5') }}</span>
      </div>
      <div class="navi-title mt-10 mb-50">
        <b>{{ article.title }}</b>
      </div>
      <div class="flex mid space-between">
        <social-buttons02 :twit-tit="article.title" :excludes="{2: true}" />
        <div class="flex btn-wrapp">
          <FollowBtn :text="$t('6')" type="article" />
          <FavoriteBtn :text="$t('7')" class="ml-10" type="article" />
        </div>
      </div>
      <div class="outline-IbBKtrbLMt mt-50 post-rel ql-editor">
        <div v-html="article.content"></div>
        <div class="divider-ctn" v-if="article.priceType">
          <div class="divider">
            <label>{{ $t(31) }}</label>
          </div>
        </div>
        <div v-html="article.paidContent"></div>
      </div>
      <LazyComp01 class="flex center mt-40 mb-40" min-height="200px" v-if="article.price || article.sPrice">
        <PaymentPreviewBox :is-free-article="false" :price="article.price" :serial-price="article.sPrice" />
      </LazyComp01>
      <LazyComp01 class="flex mid space-between" min-height="60px">
        <social-buttons02 />
        <div class="flex btn-wrapp">
          <FollowBtn :text="$t('6')" type="article" />
          <FavoriteBtn :text="$t('7')" class="ml-10" type="article" />
        </div>
      </LazyComp01>
    </div>
  </section>
</template>

<script>
import LazyComp01 from '@@/../components/LazyComp01.vue'
import PaymentPreviewBox from '@/components/finance/payment/PaymentPreviewBox.vue'
import SocialButtons02 from '@/components/navi/SocialButtons02.vue'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import FollowBtn from '@/components/finance/payment/FollowBtn02.vue'
import i18n from '@@/lang/desktop/navi-detail.json'
import '@@/../common/assets/editor.scss'

export default {
  name: 'Preview',
  i18n: {
    messages: i18n,
  },
  components: {
    LazyComp01,
    PaymentPreviewBox,
    SocialButtons02,
    FavoriteBtn,
    FollowBtn,
  },
  data() {
    return {
      article: {},
    }
  },
  mounted() {
    this.$nextTick(() => {
      let article = JSON.parse(localStorage.getItem('article'))

      // https://gogojungle.backlog.jp/view/OAM-46714#comment-90594834
      // option 1: single
      // option 2: serialized
      // option 3: single-serialized
      if (article.title) {
        this.$store.commit('pushBC', {
          name: article.title,
          target: { path: location.pathname },
        })
      }

      // in option 2, priceType 1 (fee), article price 0
      if(article.sellMode === 'serialized') {
        article.priceType = 1
        article.price = 0
      }

      // in option 3, have no serial, show '-'
      if(article.sellMode === 'single-serialized' && !article.seriesId) {
        article.sPrice = '-'
      }

      this.article = {
        createdAt: new Date().valueOf()/1000,
        ...article,
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.detail-bg {
  background: #f2f0ed;
  padding: 40px 0;
}
.navi-title {
  font-size: 30px;
  line-height: 38px;
}
.outline-IbBKtrbLMt * {
  font-size: 16px;
  max-width: 100% !important;
  p {
    line-height: 1.7;
    margin: 0 0 10px;
  }
  /deep/ img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
}
.btn-wrapp /deep/ {
  button {
    width: 100px !important;
  }
  .icon-cls,
  svg {
    width: 18px !important;
    height: 18px !important;
  }
  span {
    font-size: 14px !important;
  }
}
.divider-ctn {
  margin: 0 -32px;
  max-width: 1000px !important;
  width: 980px;
  height: 0;
  -webkit-transition: top 0.3s 0.5s;
  transition: top 0.3s 0.5s;
  position: absolute;
  .divider {
    border-top: 2px dotted #000;
    display: block;
    height: 0;
    label {
      display: block;
      width: 26px;
      background: #000;
      color: #fff;
      padding: 5px 5px;
      text-align: center;
      border-bottom-left-radius: 26px;
      border-bottom-right-radius: 26px;
      font-size: 15px;
      line-height: 16px;
    }
  }
}
</style>