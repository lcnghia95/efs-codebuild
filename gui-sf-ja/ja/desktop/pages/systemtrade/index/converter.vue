<template>
  <div class="w-1000 converter">
    <div class="main-title mt-20">
      <b>{{ $t('2') }}</b>
    </div>
    <div class="main-img">
      <img src="/img/assets/pc/systemtrade/converter.png" width="100%" height="222px" alt="converter main pic" />
    </div>
    <div class="convert-area flex space-between mt-20">
      <div class="w50p">
        <div><b>{{ $t('3') }}</b></div>
        <textarea v-model="sampleMql4" rows="25" class="w-full" wrap="off"></textarea>
        <div class="text-center mt-10">
          <button class="button-convert" @click="onConvert">{{ $t('5') }}</button>
        </div>
      </div>
      <div class="w50p">
        <div><b>{{ $t('4') }}</b></div>
        <textarea v-model="mql5Converted" rows="25" class="w-full" wrap="off"></textarea>
        <div class="flex mid center space-around mt-10">
          <button class="button-convert" :disabled="!mql5Converted" @click="onDownloadMql5" :class="{'btn-dis': !mql5Converted}">{{ $t('6') }}</button>
          <button class="button-convert" :disabled="!mql5Converted" @click="onDownloadZip" :class="{'btn-dis': !mql5Converted}">{{ $t('7') }}</button>
        </div>
      </div>
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="400" :height="200" :cancel-text="$t('10')" :ok-text="$t('9')" @ok="onGoToLogin">
      <div slot="title" class="modal-title pl-10">
        {{ $t('1') }}
      </div>
      <div slot="modal-body">
        <div class="p-20" style="height: 95px;">{{ $t('8') }}</div>
      </div>
    </GogoModal>
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/systemtrade-converter.json'
import sampleMql4 from '@@/../common/commondata/mqlDefault.js'
import { getCookie, setCookie, gotoLogin } from '@/utils/client/common'
import GogoModal from '@@/../components/modals/GogoModal.vue'
const obj = Object.assign(
  {
    components: {
      GogoModal
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        sampleMql4,
        mql5Converted: '',
        isShowModal: false,
      }
    },
    computed: {
      userId() {
        return parseInt(this.$store.state.user.id)
      },
    },
    methods: {
      descriptionTemplate() {
        return this.$t('11')
      },
      onGoToLogin() {
        gotoLogin(`u=${location.pathname}`)
      },
      onConvert() {
        if (!this.userId) {
          const ggjCV = getCookie('ggjCV', document.cookie)
          if (!ggjCV) {
            const period = 30 * 24 * 60
            setCookie('ggjCV', 1, period)
          } else {
            this.isShowModal = true
            return
          }
        }
        let fData = new FormData()
        fData.append('mql4', this.sampleMql4)
        fData.append('profram_type', 0)
        this.GoGoHTTP.post(
          `/converter`,
          fData,
        ).then(data => {
          this.mql5Converted = data.mql5
        })
      },
      onDownloadMql5() {
        if (!this.mql5Converted) {
          return
        }
        const downloadFileName = 'converter.mq5'
        let blob = new Blob([this.mql5Converted], { 'type': 'application/x-msdownload' })

        let link = document.createElement('a')
        link.setAttribute('download', downloadFileName)
        link.href = URL.createObjectURL(blob)

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveOrOpenBlob(blob, downloadFileName)
        } else {
            var evt = document.createEvent( 'MouseEvents' )
            evt.initEvent( 'click', false, true )
            link.dispatchEvent( evt )
        }
      },
      onDownloadZip() {
        let ziplink = document.createElement('a')
        ziplink.href = 'https://fx-on.com/up/MQL5Converter.zip'

        let zipevt = document.createEvent( 'MouseEvents' )
        zipevt.initEvent( 'click', false, true )
        ziplink.dispatchEvent( zipevt )
      }
    }
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.converter {
  .main-title {
    font-size: 20px;
  }
  .convert-area {
    .w50p {
      width: 48%;
    }
    textarea {
      resize: vertical;
    }
    .button-convert {
      display: block;
      width: 200px;
      height: 60px;
      margin: 0 auto 50px;
      border: 1px solid #47a1de;
      background-color: #47a1de;
      color: #fff;
      font-size: 24px;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }
    .btn-dis {
      cursor: not-allowed;
      background: #7c7c7c;
    }
  }
}
</style>