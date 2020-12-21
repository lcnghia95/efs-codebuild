<template>
  <section class="w-1000 flex space-between">
    <div class="left-content">
      <div class="flex mid mb-20">
        <span class="icon-other flex mid center mr-5" :style="langSupported.includes($i18n.locale) ? 'font-size: 13px; width: 38px; height: 38px;' : ''">
          <b>{{ $t('1') }}</b>
        </span>
        <span class="title">
          <b>
            {{ curType ? $t('2' + curType) : $t('2') }}
          </b>
        </span>
      </div>
      <div class="flex flex-wrap">
        <ProductVertical05 v-for="product in dataShow.data" :key="'new-product-' + product.id" :product="product" class="bg-prd-new mr-10 mb-10" />
      </div>
      <div class="text-center mb-40">
        <paging :cur-page="dataShow.currentPage"
                :total="dataShow.lastPage"
                :from="dataShow.pagingFrom"
                :to="dataShow.pagingTo"
                :has-scroll="true"
                :is-add-url-param="true"
                :origin-url="originUrl"
                theme-class="theme4"
                @pagingclick="onGetDataPage"
        />
      </div>
    </div>
    <div class="right-content p-15">
      <div class="fs-13 co-white affiliatecompany">{{ $t('4') }}</div>
      <div class="img-wrap">
        <a :href="fxonUrl('/campaign/?p=3')" class="mt-10" target="_bank">
          <img :src="'/img/assets/pc/companies/sub_campaign_300x600.png'" alt="" />
        </a>
      </div>
      <div class="mt-25 fs-13 co-white affiliatecompany mb-10">{{ $t('3') }}</div>
      <div class="tieup" v-html="tieup"></div>
      <div class="mt-25 fs-13 co-white affiliatecompany mb-10">{{ $t('5') }}</div>
      <div class="adv-mt4">
        <a href="https://fx-on.com/news/detail/?c=1&id=395" target="_bank">
          <img src="https://fx-on.com/include/img/common/sub/banner/r_banner_onamae.png" alt="" />
        </a>
      </div>
    </div>
  </section>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-newproduct.json'
import ProductVertical05 from '@/components/product/ProductVertical05.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { calPaging } from '@/utils/client/common'
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    curType: String,
    originUrl: String,
    curPage: [String, Number],
    tieup: {
      type: String,
      default: '',
    },
  },
  components: {
    ProductVertical05,
    Paging,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      dataShow: {},
    }
  },
  created() {
    this.dataShow = calPaging(this.data, this.curPage, 40)
  },
  mounted() {
    $('.img1').css('width', '270px')
  },
  methods: {
    onGetDataPage(_page) {
      this.dataShow = calPaging(this.data, _page, 40)
    },
  },
}
</script>
<style lang="scss" scoped>
.left-content {
  width: 670px;
  .icon-other {
    width: 30px;
    height: 30px;
    background: #7d7d7d;
    border-radius: 50%;
    color: white;
    font-size: 16px;
  }
  .title {
    color: #7d7d7d;
    font-size: 20px;
  }
  .bg-prd-new:nth-child(4n) {
    margin-right: 0;
  }
  .btc-icon {
    color: #7d7d7d;
  }
}
.right-content {
  width: 300px;
  height: 100%;
  background: #ebeaeb;
  border-radius: 5px;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  /deep/ .gogo-link {
    width: 100%;
    img:hover {
      opacity: 0.85;
    }
  }
  .affiliatecompany {
    height: 30px;
    background-color: #515151;
    line-height: 28px;
    padding-left: 10px;
    font-weight: bold;
    width: 270px;
    border-top: 3px solid #9c3;
    border-radius: 3px 3px 0 0;
  }
  .co-white {
    color: white;
  }
  .img-wrap {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .adv-mt4 {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
.tieup {
  overflow: hidden;
}
</style>
