<template>
  <section class="w-1000 flex space-between">
    <div class="left-content">
      <div class="flex mid mb-20">
        <span class="icon-other flex mid center mr-5" :style="langSupported().includes($i18n.locale) ? 'font-size: 13px; width: 38px; height: 38px;' : ''">
          <b>{{ $t('1') }}</b>
        </span>
        <span class="title">
          <b>
            {{ curType ? $t('2' + curType) : $t('2') }}
          </b>
        </span>
      </div>
      <div class="flex flex-wrap">
        <ProductVertical05 v-for="product in dataShow.data" :key="'new-product-' + product.id" :product="product" class="bg-prd-new mr-10 mb-10"/>
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
                @pagingclick="onGetDataPage" />
      </div>
    </div>
    <slot class="right-content p-15" name="right-content"/>
  </section>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-newproduct.json'
import ProductVertical05 from '@@/../components/product/ProductVertical05.vue'
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
</style>
