<template>
  <div class="prod-info flex center layout-col fs-12 pt-20 pb-40 pl-30 pr-30" v-if="products.length">
    <div class="prod-doc flex center layout-col mb-10" v-for="prd in products" :key="'advising-item-' + prd.product.id">
      <div class="flex item w-full pos-rel space-between pt-10 pb-20">
        <div class="lbl flex center mid pos-abs" :style="{'background-color': colors[prd.product.isAdvising]}">{{ (prd.product || {}).isAdvising ? $t('37') : $t('38') }}</div>
        <div class="col wrapp-info">
          <div class="title">{{ (prd.product || {}).name }}</div>
          <div class="seller">{{ $t('8') }}: {{ prd.user.nickName }}</div>
        </div>
        <div class="col flex layout-col flex-start">
          <div class="flex space-between">
            <div class="amount">{{ $t('9') }} {{ prd.count }}</div>
            <div class="total"><strong>({{ $t('39') }})<span v-if="(prd.product || {}).isFreeFirstMonth" class="ml-5">{{ $t('42') }}</span>&nbsp;{{ formatNumber(campaignPrice(prd.prices[0])) }}{{ currency }}</strong></div>
          </div>
        </div>
      </div>
      <div class="ta w-full p-10" v-html="getTerm(prd.user, prd.prices[0].price) || ''" v-if="(prd.product || {}).isAdvising"></div>
    </div>
    <div class="mt-30 flex center" v-if="hasAdvising">
      <div class="agree-all flex mid center">
        <Checkbox :label="$t('36')" v-model.number="checkAll" />
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox'
import i18n from '@@/lang/components-desktop/cart.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Checkbox,
  },
  computed: {
    products() {
      return this.$store.getters['cart01/buyNow'].filter(
        item => item.product.isAdvising || item.product.typeId === 4
      )
    },
    buyer() {
      return this.$store.getters['cart01/buyer']
    },
    hasAdvising() {
      return this.$store.getters['cart01/hasAdvising']
    },
    currency() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return 'JPY'
      }
      return '円'
    }
  },
  data() {
    return {
      checkAll: 0,
      colors: {
        1: '#4da6e0',
        0: '#ff7d00',
      },
    }
  },
  watch: {
    checkAll(val) {
      this.$store.commit('cart01/onConfirmSalonsBefore', val)
    },
  },
  methods: {
    getTerm(user, price) {
      let text = this.$store.getters['cart01/getConclusion'][user.id],
        curDate = new Date().getTime()
      if (text) {
        text = text.replace('#PostalCode#', this.buyer.zip)
        text = text.replace('#postal_code#', this.buyer.zip)
        text = text.replace(
          '#Region1#',
          `${this.buyer.prefectureId} ${this.buyer.address1}`
        )
        text = text.replace('#Region2#', this.buyer.address2)
        text = text.replace('#Region3#', this.buyer.address3)
        text = text.replace('#buy_last_name#', this.buyer.lastName)
        text = text.replace('#buyename#', this.buyer.lastName)
        text = text.replace('#buyfname#', this.buyer.firstName)
        text = text.replace('#buy_first_name#', this.buyer.firstName)
        text = text.replace('#dev_last_name#', user.lastName)
        text = text.replace('#dev_first_name#', user.firstName)
        text = text.replace('#devename#', user.lastName)
        text = text.replace('#devfname#', user.firstName)
        text = text.replace('#term#', 1)
        text = text.replace('#dday#', this.formatTime(curDate, 8))
        text = text.replace('#dday2#', this.formatTime(curDate, 8))
        text = text.replace(
          '#dday3#',
          this.formatTime(curDate + 30 * 24 * 60 * 60, 8)
        )
        text = text.replace('#Region4#', '')
        text = text.replace('#price#', this.formatNumber(price))
      }
      return text
    },
    campaignPrice(price) {
      return price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price)
    }
  },
}
</script>


<style lang="scss" scoped>
.item {
  .lbl {
    background: #4da6e0;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9px;
  }
  .col {
    margin-top: 25px;
    .amount {
      opacity: 0.7;
    }
    &.wrapp-info {
      width: 40%;
    }
    .title,
    .seller {
      word-break: break-all;
    }
    .seller {
      font-size: 10px;
      margin-top: 8px;
      opacity: 0.7;
    }
  }
}
.ta {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
}
.agree-all {
  width: 350px;
  height: 50px;
  background: #f0f0f0;
  /deep/ .c-label {
    font-weight: normal;
    margin-bottom: 0;
  }
}
</style>
