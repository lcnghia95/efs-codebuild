<template>
  <div class="payment-yZtzqpG">
    <div class="main-info p-15">
      <div>
        <template v-if="payments.card === 1">
          <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt />
          <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt />
        </template>
        <img
          class="mr-5"
          v-if="payments.bank === 1"
          :src="'/img/assets/pc/common/payment_ico_bank.png'"
          alt
        />
        <template v-if="payments.store === 1">
          <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_D2.png'" alt />
          <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_D1.png'" alt />
          <img class="mr-5 mb-5" height="35" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt />
          <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_familymart_new.png'" alt />
        </template>
        <img v-if="payments.tran === 1" :src="'/img/assets/pc/common/payment_ico_transfer.png'" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    payments() {
      return this.$store.getters["cart/payments"]
    },
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    getProductPassword: {
      type: Function
    },
  },
}
</script>


<style lang="scss" scoped>
.payment-yZtzqpG {
  background: white;
  color: #666;
}
</style>

