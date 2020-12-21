<template>
  <div class="w-1000 p-10">
    <div v-html="data.Content" class="pre-wrap mt-20"/>
    <div class="mt-30 mb-30 flex mid content-end">
      <twitter-button class="mr-10" />
      <facebook-button class="mr-10" />
    </div>
    <div class="showconfirm modal fade" role="dialog" v-if="!$store.state.user.isBuyuser">
      <div class="modal-dialog flex layout-col">
        <div class="confirm-content">
          <div class="p-25 text-center"><b v-html="$t('1')"/></div>
          <div class="btn-wrapp flex mid center pt-15 pb-15">
            <button class="button-comment btn-cancel text-center" data-dismiss="modal">
              <b class="fs-18">{{ $t('2') }}</b>
            </button>
            <a :href="`/login?is_buyuser=1&u=${this.$route.path}`">
              <button class="button-comment text-center ml-20">
                <div class="flex mid center">
                  <b class="fs-18">{{ $t('3') }}</b>
                </div>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TwitterButton from '@@/../components/social/TwitterButton.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    TwitterButton,
    FacebookButton,
  },
  mounted() {
    $('.top-header').css('display', 'none')
    if (!this.$store.state.user.id) {
      let loginUrl = `/login?is_buyuser=1&u=${this.$route.path}`
      if ($('#open_account_btn').length) {
        $('#open_account_btn').attr('href', loginUrl)
        $('#open_account_btn').removeAttr('target')
      }
      if ($('#open_account_btn2').length) {
        $('#open_account_btn2').attr('href', loginUrl)
        $('#open_account_btn2').removeAttr('target')
      }
      if ($('#open_account_btn3').length) {
        $('#open_account_btn3').attr('href', loginUrl)
        $('#open_account_btn3').removeAttr('target')
      }
      if ($('.open_account_btn_link').length) {
        $('.open_account_btn_link').attr('href', loginUrl)
        $('.open_account_btn_link').removeAttr('target')
      }
    } else if (this.data.isBuyuser !== 1) {
      if ($('#open_account_btn').length) {
        $('#open_account_btn').removeAttr('href')
        $('#open_account_btn').click(function() {
          $('.showconfirm').modal({
            backdrop: 'static',
            keyboard: false,
          })
        })
      }
      if ($('#open_account_btn2').length) {
        $('#open_account_btn2').removeAttr('href')
        $('#open_account_btn2').click(function() {
          $('.showconfirm').modal({
            backdrop: 'static',
            keyboard: false,
          })
        })
      }
      if ($('#open_account_btn3').length) {
        $('#open_account_btn3').removeAttr('href')
        $('#open_account_btn3').click(function() {
          $('.showconfirm').modal({
            backdrop: 'static',
            keyboard: false,
          })
        })
      }
    }
  },
}
</script>
<style type="text/css">
/* stylelint-disable */
header {
  display: none;
}
.footer,
.bread-crumb {
  display: none !important;
}
</style>
<style lang="scss" scoped>
/* stylelint-enable */
.pre-wrap {
  white-space: pre-line;
  word-break: break-all;
}
.share-button /deep/ .share-btn {
  background-color: #9c3;
  border-radius: 3px;
  padding-left: 6px;
  padding-right: 6px;
}
/deep/ .icon-cls {
  margin-right: 5px;
  height: auto;
}
.share-button /deep/ .icon-mail {
  width: 16px;
  margin-top: 2px;
}
.share-button /deep/ .icon-share {
  width: 10px;
}
/deep/ .saxobank_circle {
  height: 290px !important;
}
/deep/ .oab_pink {
  border: 3px solid #f91165;
  background: linear-gradient(#f400dd, #6c00fc);
  color: #fff !important;
  &:hover {
    color: #f91165 !important;
    background-color: #fff !important;
  }
}
/deep/ .open_account_btn:hover {
  background: #fff;
  text-decoration: none;
}
.button-comment {
  border: none;
  background: #b0b0b0;
  height: 30px;
  width: 180px;
  border-radius: 5px;
  color: white;
  &:hover {
    opacity: 0.6;
  }
}
.showconfirm .modal-dialog {
  width: 550px;
  line-height: 2;
  margin: 0 auto;
  position: absolute;
  top: 45% !important;
  left: 0;
  right: 0;
  transform: translate(0, -50%) !important;
  .confirm-content {
    background: #fff;
    border-radius: 8px;
    .btn-wrapp {
      border-top: 1px solid #aab2bd;
      background: #e6e9ed;
      border-radius: 0 0 8px 8px;
      .btn-cancel {
        background: #707070;
      }
    }
  }
}
button {
  outline: none;
}
</style>
