<template>
  <div class="dev">
    <div class="dev-title">
      {{ $t(1) }}
    </div>
    <div class="dev-input">
      <div style="color: red;" class="mb-10">{{ $t(2) }}</div>
      <div class="flex">
        <input
          class="bid-input w-full"
          :placeholder="$t(3)"
          type="text"
          v-model="bidFormated"
          @keyup.enter="onBid"
        />
        <div class="ml-10 unit">{{ $t(4) }}</div>
      </div>
      <div v-if="validateError" style="color: red;">{{ validateError }}</div>
      <div class="submit-btn mt-5" @click="onBid">
        <template v-if="!isBidPosting">{{ !bid ? $t(11) : $t(5) }}</template>
        <Loading style="height: 40px;" v-else />
      </div>
    </div>
    <GogoModal
      class="term-modal"
      :show="isShowModal"
      @ok="acceptBid"
      @update:show="val => isShowModal = val"
      width="80%" height="180px"
    >
      <div slot="modal-header"></div>
      <div slot="modal-body" class="custom-body p-10">
        {{ error || $t(6) }}
      </div>
      <div slot="modal-footer" class="custom-footer flex" @click="isShowModal = false">
        <div class="w-full" @click="isShowModal = false" :style="!error ? 'border-right: 1px solid #d9d9d9;' : null"> {{ !error ? $t(7) : $t(8) }} </div>
        <div class="w-full" @click="acceptBid" v-if="!error">{{ $t(8) }}</div>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowd-bid-box.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'

export default {
  components: {
    GogoModal,
    Loading,
  },
  props: {
    bidNumber: {
      type: [Number, String],
      default() { return -1 }
    }
  },
  i18n: {
    messages: i18n,
  },
  data() {
    let bid = Number.parseFloat(this.bidNumber).toLocaleString('en-GB', { minimumFractionDigits: 0, })
    return {
      bid: this.bidNumber <= 0 ? null : bid,
      error: '',
      validateError: '',
      isShowModal: false,
      isBidPosting: false,
    }
  },
  computed: {
    bidFormated: {
      get: function() {
        return this.bid
      },
      set: function(val) {
        let s = Number.parseFloat(val.replace(/,/g, ''))
        if(s) {
          this.bid = s.toLocaleString('en-GB', { minimumFractionDigits: 0, })
        }
      }
    }
  },
  mounted() {
    this.$nuxt.$on('updateBidPrice', (isBidPosting)=>{
      this.isBidPosting = isBidPosting
    })
  },
  methods: {
    onBid() {
      let bid = parseInt((this.bid || '').replace(/,/g, ''))
      if(bid < 3000 || bid > 5000000) {
        this.validateError = this.$t(10)
        return
      }

      this.isShowModal = true
      if(!bid) {
        this.error = this.$t(9)
        return
      }
      if(bid == this.bidNumber) {
        this.error = this.$t(12)
        return
      }
      this.error = ''
      this.validateError = ''
    },
    acceptBid() {
      this.isShowModal = false
      if(this.error) {
        return
      }
      let bid = parseInt(this.bid.replace(/,/, ''))
      this.$emit('onBid', bid)
    }
  }
}
</script>

<style lang="scss" scoped>

.dev {
  border: 1px solid #000;
  border-radius: 5px;
  .dev-title {
    background: #2d2d2d;
    color: #fff;
    text-align: center;
    padding: 10px 5px;
    font-size: 16px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .dev-content {
    padding: 15px 10px;
  }
  .dev-input {
    padding: 10px 20px;
    border-radius: 5px;
    background: #fff;
    .bid-input {
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      border-radius: 5px;
      border: 1px solid grey;
      font-size: 22px;
      &::placeholder {
        font-size: 15px;
        color: #b2b2b2;
      }
    }
    .unit {
      font-size: 20px;
      padding-top: 20px;
      color: #707070;
      font-weight: 700;
    }
    .submit-btn {
      height: 40px;
      text-align: center;
      background: #8fc31f;
      line-height: 40px;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      /deep/ .loader::before {
        width: 20px;
        height: 20px;
        position: absolute;
        left: calc(50% - 10px);
        top: calc(50% - 10px);
      }
    }
  }
}
.modal {
  background-color: grey !important;
}
/deep/ .modal-dialog {
  top: 5%;
}
.modal-title {
  border-left: 2px solid black;
  font-size: 18px;
}
.term-modal /deep/ {
  .modal-header {
    .modal-title {
      border-left: 2px solid #2d2d2d;
      padding-left: 5px;
      margin-left: 5px;
      font-size: 16px;
    }
  }
  .modal-term {
    height: 60vh;
  }
  .modal-dialog {
    margin: calc(50% - 40px) auto;
  }
  .term-before {
    width: 100%;
    height: 60vh;
    overflow-y: auto;
    padding: 10px 20px;
  }
  .custom-body {
    height: calc(100% - 55px);
    padding: 40px 0;
    text-align: center;
    color: #434343;
  }
  .custom-footer {
    height: 55px;
    text-align: center;
    line-height: 55px;
    border-top: 1px solid #d9d9d9;
    color: #434343;
  }
}
</style>