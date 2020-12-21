<template>
  <nuxt-child />
</template>

<script>
export default {
  layout: 'cart',
  async asyncData({ redirect, req }) {
    if (req.headers['new-cart-enable'] != 'true') {
      return redirect(302, `${process.env.FXON_URL}/asp/cart/`)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  /deep/ .reponsive-img-payment {
    height: 22px;
    max-width: calc(100% - 22px);
  }
  /deep/ .summary .a-row:nth-child(3) {
    border: none !important;
  }
  /deep/ .confirm-footer {
    display: none;
  }
  /deep/ .dropdown-menu {
    max-height: 100px !important;
  }
  /deep/ .modal-dialog {
    margin: 5px auto !important;
    top: 0 !important;
    height: 90vh !important;
    max-width: calc(100vw - 15px);
    display: flex;
    align-items: center;
    .modal-title {
      margin-left: 0 !important;
    }
    .modal-content {
      max-height: 85vh;
      width: 100% !important;
      overflow: auto;
      height: auto !important;
    }
    .modal-body {
      max-height: calc(85vh - 155px);
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .modal-header {
      padding: 10px;
      .modal-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>