<template>
  <div class="panel panel-default payment-5ATzP">
    <div class="panel-heading text-center">
      {{ $t('12') }}
    </div>
    <div class="panel-body flex layout-col mid text-center pb-40">
      <h4>{{ $t('2') }}</h4>
      <!-- serialPrice -->
      <div class="info-1lDFf" v-if="serialPrice">
        <div class="info-box p-5 mb-10">
          {{ $t('14') }}：{{ formatNumber(serialPrice) }}<span v-if="serialPrice !== '-'">円</span>
        </div>
        <button class="btn orange border-radius-5 w-full">
          <div class="flex mid center">
            <Cart />
            <span class="ver-mid">{{ $t('3') }}</span>
          </div>
        </button>
      </div>

      <!-- article price -->
      <div class="info-1lDFf mt-20" v-if="price">
        <div class="info-box p-5 mb-10">
          {{ $t('16') }}：{{ formatNumber(price) }}円
        </div>
        <button class="btn orange border-radius-5 w-full">
          <div class="flex mid center">
            <Cart />
            <span class="ver-mid">{{ $t('2') }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-payment.json'
import Cart from '@@/../components/icons/Cart.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Cart
  },
  props: {
    price: {
      type: Number,
      default() {
        return 15000
      }
    },
    serialPrice: {
      type: [Number, String],
      default() {
        return 15000
      }
    },
  }
}
</script>


<style lang="scss" scoped>
.payment-5ATzP {
  color: #5b5b5b;
  border-radius: 0;
  .panel-heading {
    background: white;
    border-bottom-style: dashed;
    border-bottom-color: #c6c6c6;
  }
}
.lock-password {
  border-radius: 10px;
  .password-title {
    display: inline-block;
    font-size: 26px;
    border-bottom: 1px solid #d9d9d9;
  }
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    width: 310px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    width: 310px;
    background: #00a0e9;
    height: 50px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.btn {
  padding: 5px 25px;
  font-size: 16.5px;
  text-decoration: none;
  color: #fff;
  position: relative;
  display: inline-block;
  outline: none;
}
.btn:active {
  transform: translate(0, 5px);
  -webkit-transform: translate(0, 5px);
  box-shadow: 0 1px 0 0;
}
.orange {
  background-color: #ff8500;
  box-shadow: 0 5px 0 0 #b84d03;
}
.orange:hover {
  outline: none;
  background-color: #ff9929;
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-cls {
  width: 30px;
  height: 34px;
}
.lh-16 {
  line-height: 16px;
}
.ver-mid {
  vertical-align: middle;
}
.info-1lDFf {
  width: 340px;
}
.info-box {
  color: white;
  border-radius: 4px;
  background: #5b5b5b;
}
</style>