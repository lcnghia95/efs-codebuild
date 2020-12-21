<template>
  <div class="p-10" :id="'commu-' + message.id">
    <div class="message border-radius-5 flex" :class="{ 'row-reverse': !theirMsg }">
      <a :href="'/users/'+ message.userId" :class="{'mr-20': theirMsg, 'ml-20': !theirMsg}">
        <img :src="'/img/users/' + message.userId" class="shadow" width="60" height="60" alt="">
      </a>
      <div class="mb-0 content-wrapper border-all border-radius-5 grow0"
           :class="{ 'their-message': !theirMsg, 'my-message': theirMsg }">
        <div class="flex mid space-between p-10">
          <div class="flex mid">
            <span>{{ message.userName }}</span>
            <div v-if="message.buyer === 1 || parseInt(buyer) === 1" class="buyer-content text-center mt-20">{{ $t('1') }}</div>
            <div @click="onAction(1)" class="flex mid ml-10" v-if="message.id">
              <ThumbsUp class="like cursor-pointer" :class="{ 'active': actionType === 1 }"/>({{ this.message.like || 0 }})
            </div>
            <div @click="onAction(2)" class="flex mid ml-5" v-if="message.id">
              <ThumbsDown class="ml-15 mt-5 dislike cursor-pointer" :class="{ 'active': actionType === 2 }"/>({{ this.message.dislike || 0 }})
            </div>
          </div>
          <div class="flex mid">
            <span class="date-cls fs-12">{{ formatTime(message.publishedDate, 6) }}</span>
            <a class="ml-10 cursor-pointer" v-if="!theirMsg && message.id" @click="onDeleteTopic(message.id)">x</a>
          </div>
        </div>
        <div :class="{preview: isPreview}">
          <div class="flex p-10" v-if="message.isUploadedImages || this.message.fxonImgUrl">
            <img v-for="(number,index) in (this.message.fxonImgUrl || message.isUploadedImages)" :src="buildSrc(number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" >
          </div>
          <div class="mt-20 pre-line p-10 text-left" v-html="message.content"/>
        </div>
        <div class="panel-group mb-0" v-if="!disableReply">
          <div :id="'replies-detail' + message.id" class="panel-collapse collapse fs-13">
            <div class="panel-body">
              <div v-for="item in message.replies" class="flex contend-end mb-20 message fs-12 row-reverse" :key="item.id" :id="'commu-' + item.id">
                <a :href="'/users/'+ item.userId" class="ml-20">
                  <img :src="'/img/users/' + item.userId" class="shadow" width="60" height="60" alt="">
                </a>
                <div class="mb-0 content-wrapper border-all border-radius-5 grow0 p-10 their-message">
                  <div class="flex space-between">
                    <span>{{ item.userName }}</span>
                    <div class="flex mid">
                      <span class="date-cls fs-12">{{ formatTime(item.publishedDate, 6) }}</span>
                      <a class="ml-10 cursor-pointer" v-if="item.userId === userId" @click="onClickDel(item.id)">x</a>
                    </div>
                  </div>
                  <div class="flex p-10" v-if="item.isUploadedImages || item.fxonImgUrl">
                    <img v-for="(number,index) in (item.fxonImgUrl || item.isUploadedImages)" :src="buildSrcItem(item.id, number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" >
                  </div>
                  <div class="mt-10 pre-line text-left" v-html="item.content"/>
                </div>
              </div>
              <ImportFile ref="importFile1" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged1" :index-number="1" :maxsize="1" />
              <ImportFile ref="importFile2" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged2" :index-number="2" :is-disable="!formData1" :maxsize="1" />
              <ImportFile ref="importFile3" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged3" :index-number="3" :is-disable="!formData2" :maxsize="1" />
              <div class="flex space-between mb-10 fs-12 mt-20" v-if="userId">
                <textarea
                  name="replyContent"
                  v-validate="{ rules: { required: true } }"
                  class="w-full resize-vertical"
                  rows="4"
                  v-model="replyContent"
                  :placeholder="$t('2')"
                  maxlength="2000"
                />
                <div class="ml-20 reply-user">
                  <img :src="'/img/users/' + userId" class="shadow" width="60" height="60" alt="" >
                  <button class="btn-comment w-full fs-12 mt-15" @click="onPostReply" :disabled="processing">
                    <div class="flex mid center">
                      <Loading v-if="processing" class="ml-10 sm" style="width: 20px; height: 20px;margin: 0;"/>
                      <b class="fs-18" v-else>{{ $t('3') }}</b>
                    </div>
                  </button>
                </div>
              </div>
              <div v-if="errors.first('replyContent')" style="color: red;">{{ $t('replyError') }}</div>
            </div>
          </div>
          <div class="pl-20 pr-20 pt-10 pb-10">
            <h4 class="panel-title">
              <a data-toggle="collapse" :href="'#replies-detail' + message.id" class="no-underlying fs-12 flex mid" @click="onClickExpand" :id="'click-area-' + message.id">
                <b>{{ (message.replies || []).length || '0' }}{{ $t('6') }}</b>&nbsp;
                <AngleDoubleDown v-if="!onExpand" class="expand-icon"/>
                <AngleDoubleUp v-if="onExpand" class="expand-icon"/>
              </a>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <GogoModal :show="isShowModal" :cancel-text="$t('8')" @close="onClose" @ok="innerDeleteReply" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{$t('7')}}
      </div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/systemtrade-usermessage.json'
import ClockO from '@@/../components/icons/ClockO.vue'
import ThumbsUp from '@@/../components/icons/ThumbsUp.vue'
import ThumbsDown from '@@/../components/icons/ThumbsDown.vue'
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import AngleDoubleUp from '@@/../components/icons/AngleDoubleUp.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ImportFile from '@@/../components/input/ImportFile.vue'
import Loading from '@@/../components/icons/Loading.vue'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default {
  components: {
    ClockO,
    ThumbsUp,
    ThumbsDown,
    AngleDoubleDown,
    AngleDoubleUp,
    GogoModal,
    ImportFile,
    Loading,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    message: {
      type: Object,
      default() {
        return {}
      },
    },
    buyer: [Number, String],
    disableReply: {
      type: Boolean,
      default: false,
    },
    onDeleteTopic: {
      type: Function,
    },
    onDeleteReply: {
      type: Function,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actionType: this.message.likeType || null,
      onExpand: false,
      replyContent: null,
      isShowModal: false,
      keepId: null,
      processing: false,
      formData1: null,
      formData2: null,
      formData3: null,
      imgSource: [],
    }
  },
  computed: {
    userId() {
      return parseInt(this.$store.state.user.id)
    },
    theirMsg() {
      return (
        parseInt(this.$store.state.user.id) !== parseInt(this.message.userId)
      )
    },
  },
  methods: {
    onClickExpand() {
      this.onExpand = !this.onExpand
    },
    async onPostReply() {
      const rs = await this.$validator.validateAll()
      if(!rs) {
        return
      }
      this.processing = true
      this.GoGoHTTP.post('/api/v3/surface/communities', {
        productId: this.$route.params.id,
        content: this.replyContent,
        isTopic: 0,
        topicId: this.message.id,
      })
        .then(async data => {
          if (data.id) {
            if (!this.message.replies) {
              this.$set(this.message, 'replies', [])
            }
            let isUploadedImages = 0
            if (this.formData1) {
              let fileUploadUrl = '/upload/img/communities/' + data.id
              await this.GoGoHTTP.post(fileUploadUrl, this.formData1)
              isUploadedImages++
              if (this.formData2) {
                await this.GoGoHTTP.post(fileUploadUrl, this.formData2)
                isUploadedImages++
              }
              if (this.formData3) {
                await this.GoGoHTTP.post(fileUploadUrl, this.formData3)
                isUploadedImages++
              }
              this.formData1 = null
              this.formData2 = null
              this.formData3 = null
              this.$refs.importFile1.deleteImage()
              this.$refs.importFile2.deleteImage()
              this.$refs.importFile3.deleteImage()
              this.imgSource = []
            }
            this.message.replies.push({
              content: this.replyContent,
              id: data.id,
              publishedDate: moment()
                .utc()
                .unix(),
              topicId: this.message.id,
              userId: parseInt(this.$store.state.user.id),
              userName: this.$store.state.user.name,
              isUploadedImages,
            })
            this.replyContent = '' // reset reply content
            this.$emit('posted')
          }
        })
        .finally(() => {
          this.processing = false
        })
    },
    onAction(type) {
      if (!this.actionType) {
        this.GoGoHTTP.put(
          `/api/v3/surface/communities/${this.message.id}/action`,
          {
            type,
          }
        ).then(() => {
          if (type === 1) {
            this.message.like = (this.message.like || 0) + 1
          } else {
            this.message.dislike = (this.message.dislike || 0) + 1
          }
          this.actionType = type
        })
      }
    },
    getBase64(file, cb) {
      let reader = new FileReader()
      reader.onloadend = () => {
        cb(reader.result)
      }
      reader.readAsDataURL(file)
    },
    fileChanged1(_file) {
      this.formData1 = new FormData()
      this.formData1.append('file', _file[0])
      this.commentFileName1 = _file[0].name
      this.getBase64(_file[0], data => {
        this.$set(this.imgSource, '0', data)
      })
    },
    fileChanged2(_file) {
      this.formData2 = new FormData()
      this.formData2.append('file', _file[0])
      this.commentFileName2 = _file[0].name
      this.getBase64(_file[0], data => {
        this.$set(this.imgSource, '1', data)
      })
    },
    fileChanged3(_file) {
      this.formData3 = new FormData()
      this.formData3.append('file', _file[0])
      this.commentFileName3 = _file[0].name
      this.getBase64(_file[0], data => {
        this.$set(this.imgSource, '2', data)
      })
    },
    buildSrc(number) {
      if (typeof number == 'string') {
        return number
      }
      if (this.message.id) {
        return '/img/communities/' + this.message.id + '/' + number
      }
      return number
    },
    buildSrcItem(id, number) {
      if (typeof number == 'string') {
        return number
      }
      if (id) {
        return '/img/communities/' + id + '/' + number
      }
      return number
    },
    onClickDel(id) {
      this.isShowModal = true
      this.keepId = id
    },
    innerDeleteReply() {
      if (!this.keepId) {
        return
      }
      this.message.replies = this.message.replies.filter(item => {
        return item.id !== this.keepId
      })
      this.onDeleteReply(this.keepId).finally(() => {
        this.isShowModal = false
        this.keepId = null
      })
    },
    onClose() {
      this.isShowModal = false
      this.keepId = null
    }
  },
}
</script>
<style lang="scss" scoped>
.message {
  &.row-reverse {
    flex-direction: row-reverse;
  }
  .border-all {
    border: 1px solid #d9d9d9;
  }
  .grow0 {
    flex: 1 0 0%;
  }
  .content-wrapper {
    position: relative;
    background: white;
    &::before {
      content: '';
      position: absolute;
      display: block;
      border-top: 13px solid transparent;
      border-bottom: 13px solid transparent;
      top: 12px;
    }
    &::after {
      content: '';
      position: absolute;
      display: block;
      border-top: 12px solid transparent;
      border-bottom: 12px solid transparent;
      top: 13px;
    }
    &.my-message {
      &::before {
        border-right: 20px solid #d9d9d9;
        left: 0;
        margin-left: -20px;
      }
      &::after {
        border-right: 18px solid white;
        left: 0;
        margin-left: -18px;
      }
    }
    &.their-message {
      &::before {
        border-left: 20px solid #d9d9d9;
        right: 0;
        margin-right: -20px;
      }
      &::after {
        border-left: 18px solid white;
        right: 0;
        margin-right: -18px;
      }
    }
  }
  .panel-group {
    background: #ededed;
    border-top: 1px solid #d9d9d9;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    .panel-collapse {
      border-bottom: 1px solid #d9d9d9;
    }
    .reply-user {
      width: 70px;
    }
    .btn-comment {
      background: #9c3;
      color: white;
      border-radius: 5px;
      align-self: center;
      border: none;
      height: 30px;
      padding: 0;
    }
  }
}
.img-content {
  width: 30%;
  height: 30%;
}
.date-cls {
  color: #929292;
}
.border-radius-5 {
  border-radius: 5px;
}
.pre-line {
  white-space: pre-line;
  font-size: 16px;
  color: #929292;
  line-height: 1.8;
  letter-spacing: 1px;
}
.preview {
  overflow-y: auto;
  height: calc(100% - 38px);
}
.expand-icon {
  width: 16px;
  height: 16px;
}
.buyer-content {
  height: 30px;
  line-height: 33px;
  font-size: 18px;
  color: white;
  background: #4caf93;
}
.like,
.dislike {
  width: 20px;
  height: 20px;
  color: #abc2ea;
}
.active {
  color: #596aa1 !important;
}
.resize-vertical {
  resize: vertical;
}
</style>
<style>
.collapse {
  display: none;
}
.collapse.in {
  display: block;
}
.collapsing {
  position: relative;
  height: 0;
  overflow: hidden;
  transition-timing-function: ease;
  transition-duration: 0.35s;
  transition-property: height, visibility;
}
</style>