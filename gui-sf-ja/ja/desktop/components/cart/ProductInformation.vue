<template>
  <section>
    <Items class="mb-20">
      <div class="heading pl-20 pos-rel">{{ $t('13') }}</div>
    </Items>
    <div v-if="isCampaign" class="mt-30 mb-35" style="color: red; font-weight: bold; font-size: 15px;">
      {{ $t('campaign' + isCampaign) }}
    </div>
    <SalonsItems class="mb-20" />
  </section>
</template>

<script>
import Items from '@/components/cart/product-information/Items.vue'
import SalonsItems from '@/components/cart/product-information/SalonsItems.vue'
import i18n from '@@/lang/components-desktop/cart.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Items,
    SalonsItems,
  },
  computed: {
    isCampaign() {
      return this.$store.getters['cart01/isCampaign']
    },
  },
}
</script>

<style lang="scss" scoped>
.heading {
  font-size: 18px;
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    position: absolute;
    top: 7px;
    left: 0;
    border-radius: 50%;
    background: #ddd;
  }
}
.prod-doc {
  width: 600px;
  min-height: 50px;
  border: 1px solid #ddd;
  font-size: 12px;
  border-radius: 5px;
  padding: 10px 30px 30px 30px;
  .ta {
    overflow-y: scroll;
    resize: none;
  }
  .btn-agree {
    width: 350px;
    height: 50px;
    margin: 40px auto 10px auto;
    background: #ddd;
    color: #666;
    /deep/ {
      .c-label {
        padding-left: 10px;
        margin-bottom: 0;
      }
      .checkmark {
        top: 2px;
        height: 10px;
        width: 10px;
        border: 1px solid #666;
        background: transparent;
        &::after {
          top: 1px;
          left: 1px;
        }
      }
    }
  }
}
.prod-info {
  width: 600px;
  min-height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  .terms-condition-all {
    width: 350px;
    height: 50px;
    margin: 40px auto 10px auto;
    background: #ddd;
    color: #666;
    /deep/ {
      .c-label {
        padding-left: 10px;
        margin-bottom: 0;
      }
      .checkmark {
        top: 2px;
        height: 10px;
        width: 10px;
        border: 1px solid #666;
        background: transparent;
        &::after {
          top: 1px;
          left: 1px;
        }
      }
    }
  }
}
.item {
  width: 539px;
  height: 100px;
  border-bottom: 1px solid #ddd;
  .lbl {
    background: green;
    color: #fff;
    width: auto;
    padding: 0 5px;
    height: 15px;
    border-radius: 3px;
    font-size: 9px;
  }
  .col {
    margin-top: 25px;
    width: 50%;
    .amount {
      margin-left: 32px;
      opacity: 0.7;
    }
    .seller {
      font-size: 10px;
      margin-top: 8px;
      opacity: 0.7;
    }
    .terms-condition {
      margin-top: 10px;
      a {
        color: blue;
        opacity: 0.8;
      }
      /deep/ {
        .c-label {
          padding-left: 18px;
        }
        .checkmark {
          top: 2px;
          height: 12px;
          width: 12px;
          border: 1px solid #666;
          &::after {
            top: 2px;
            left: 2px;
          }
        }
      }
    }
  }
}
</style>
