<template>
  <div>
    <template v-if="isAdvising && !buyLater">
      <div class="flex flex-wrap" :class="{'layout-col': langSupported().includes($i18n.locale)}">
        <Checkbox class="contract-ck" v-model="agree" :label="$t('9')" :attrs="{value: 1}" /> <span @click="onShowContract" class="contract cursor-pointer">【{{ $t('10') }}】</span>
      </div>
    </template>
    <GogoModal class="term-modal" :show="isShowModal" @update:show="val => isShowModal = val" :width="1000" :height="700" :cancel-text="$t('12')" :ok-text="''" :title="$t('10')">
      <div slot="modal-body" class="modal-body" style="min-height: 40vh; margin: 0;">
        <div class="p-10" v-html="term"></div>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import i18n from '@@/lang/components-desktop/cart-product-list.json'
export default {
  components: {
    Checkbox,
    GogoModal,
  },
  props: {
    isAdvising: {
      type: Number,
      default: 0,
    },
    buyLater: {
      type: Boolean,
      default: false,
    },
    productId: [String, Number],
    userId: [String, Number],
  },
  i18n: { messages: i18n },
  watch: {
    agree(val) {
      this.$store.commit('cart01/onAgreeContract', {
        id: this.productId,
        contract: val,
        vm: this,
      })
    },
  },
  data() {
    return {
      isShowModal: false,
      agree: false,
      term: this.$store.getters['cart01/getContractBefore'][this.userId],
    }
  },
  methods: {
    acceptContract() {
      this.agree = true
    },
    onShowContract() {
      this.isShowModal = true
    },
  },
}
</script>

<style lang="scss" scoped>
.contract-ck {
  flex: 1 0 auto;
  /deep/ {
    .checkmark {
      margin-top: 1px;
      height: 12px !important;
      width: 12px !important;
      &::after {
        left: 2px !important;
        top: 2px !important;
        width: 4px !important;
        height: 4px !important;
      }
    }
  }
}
.contract-ck.c-label {
  padding-left: 15px;
  font-size: 11px;
  white-space: nowrap;
  margin-bottom: 0;
  flex: 1 0 auto;
}
/deep/ .modal-dialog {
  top: 5%;
  button {
    outline: none;
    &:active,
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
}
.term-modal /deep/ {
  .modal-header {
    .modal-title {
      border-left: 2px solid #2d2d2d;
      padding-left: 5px;
      margin-left: 20px;
    }
  }
  .advising-body {
    color: #2d2d2d;
    padding: 20px 30px;
    height: 510px;
    overflow-y: auto;
  }
}
</style>
