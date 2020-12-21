<template>
  <div id="community-area">
    <LazyComp01 min-height="200px">
      <div class="flex layout-col pl-30 pr-30 pb-30 pt-5" v-if="!loading">
        <NaviUserMessage v-for="item in reviewData.data" :key="'navi-user-msg-' + item.id" :message="item" :on-delete-topic="onDeleteTopic" :on-delete-reply="onDeleteReply" :product-id="productId" />
      </div>
      <div v-else class="flex center pt-30 pb-30">
        <Loading style="width: 50px; height: 50px" />
      </div>
      <div class="text-center mb-30" v-if="reviewData.lastPage > 1">
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                theme-class="theme4"
                @pagingclick="onPagingClick"/>
      </div>
    </LazyComp01>
    <div class="comment-area pb-30">
      <textarea id="dnd-XKWMl" class="text-area fs-12 w-full resize-vertical p-10 mt-5" v-model="commentText" :placeholder="$t('4')"/>
      <LazyComp01 min-height="80px">
        <ImportMultiFile ref="importFile" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged" :default-txt="$t('5')" :btn-txt="$t('11')" :is-row-reserver="true" :multiple="3" :maxsize="1" />
      </LazyComp01>
    </div>
    <LazyComp01 class="text-center pb-30" min-height="80px">
      <button class="button-comment" @click="onClickPostComment">{{ $t('6') }}</button>
      <div class="co-red mt-5" v-if="noContent"><b>{{ $t('9') }}</b></div>
      <div class="co-red mt-5" v-if="checkErr"><b>{{ $t(checkErr) }}</b></div>
      <div class="showreview modal fade" role="dialog" v-if="$store.state.user.id">
        <div class="modal-dialog flex layout-col">
          <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
          <div class="review-content">
            <div class="pl-15 pt-10 text-left"><b>{{ $t('7') }}</b></div>
            <div class="pl-15 pr-15 pt-10">
              <NaviUserMessage :buyer="communities.buyer" :message="reviewMsg" :disable-reply="true"/>
            </div>
            <div class="btn-wrapp flex mid center pt-25 pb-25">
              <button class="button-comment btn-cancel text-center" data-dismiss="modal">
                <b class="fs-18">{{ $t('8') }}</b>
              </button>
              <button class="button-comment text-center ml-20" @click="onPostComment" :disabled="processing">
                <div class="flex mid center">
                  <b class="fs-18">{{ $t('10') }}</b>
                  <Loading v-if="processing" class="ml-10"/>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </LazyComp01>
  </div>
</template>
<script>
import NaviUserMessage from './NaviUserMessage.vue'
import i18n from '@@/lang/components-desktop/navi-community.json'
import ImportMultiFile from '@@/../components/input/ImportMultiFile.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { calPaging, gotoLogin } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  props: {
    getData: {
      type: Function,
      default: () => {},
    },
    productId: [Number, String],
  },
  components: {
    NaviUserMessage,
    ImportMultiFile,
    Paging,
    Loading,
    LazyComp01,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      commentText: null,
      formData: [],
      imgSource: [],
      reviewData: {},
      data: [],
      processing: false,
      checkErr: null,
      noContent: false,
      reviewMsg: {
        userId: this.$store.state.user.id,
      },
      communities: {},
      loading: false,
    }
  },
  mounted() {
    this.initFirstData()
    let dnd = document.getElementById('dnd-XKWMl'),
      vm = this
    dnd.ondrop = function(e) {
      e.preventDefault()
      let files = e.dataTransfer.files,
        name = [],
        imgFiles = []
      for (const key in files) {
        if (files.hasOwnProperty(key) && files[key].type.includes('image/')) {
          name.push(files[key].name)
          imgFiles.push(files[key])
        }
      }
      vm.fileChanged(imgFiles)
      vm.$refs.importFile.setFileName(name.join(','))
    }
  },
  methods: {
    initFirstData() {
      this.loading = true
      this.GoGoHTTP.get(
        `/api/v3/surface/communities?productId=${this.productId}`
      )
        .then(data => {
          if (!data.comments) {
            data.comments = []
          }
          this.communities = data
          this.data = this.communities.comments
          this.reviewData = calPaging(this.data, 1, 5, 4)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fileChanged(_file) {
      this.imgSource = []
      this.formData = []
      if (!_file) {
        return
      }
      if (_file.err) {
        this.checkErr = _file.err
        return
      }
      this.checkErr = null
      for (let i = 0; i < _file.length; i++) {
        let fData = new FormData()
        fData.append('file', _file[i])
        this.getBase64(_file[i], data => {
          this.$set(this.imgSource, i, data)
        })
        this.formData.push(fData)
      }
    },
    getBase64(file, cb) {
      let reader = new FileReader()
      reader.onloadend = () => {
        cb(reader.result)
      }
      reader.readAsDataURL(file)
    },
    onPagingClick(page) {
      this.reviewData = calPaging(this.data, page, 5, 4)
    },
    onClickPostComment() {
      if (!this.$store.state.user.id) {
        gotoLogin()
        return
      }
      if (!this.commentText) {
        this.noContent = true
        return
      }
      this.noContent = false
      this.checkErr = null
      this.reviewMsg = {
        userId: this.$store.state.user.id,
        userName: this.$store.state.user.name,
        content: this.commentText,
        publishedDate: moment()
          .utc()
          .unix(),
        isUploadedImages: this.imgSource.length ? this.imgSource : null,
      }
      $('.showreview').modal({
        backdrop: 'static',
        keyboard: false,
      })
    },
    onPostComment() {
      this.processing = true
      this.GoGoHTTP.post('/api/v3/surface/communities', {
        productId: this.productId,
        isTopic: 1,
        content: this.commentText,
      })
        .then(async data => {
          if (data.id) {
            let isUploadedImages = 0
            if (this.formData.length) {
              for (let i = 0; i < this.formData.length; i++) {
                let fileUploadUrl = '/upload/img/communities/' + data.id
                await this.GoGoHTTP.post(fileUploadUrl, this.formData[i])
                isUploadedImages++
              }
              this.formData = []
              this.$refs.importFile.deleteImage()
              this.imgSource = []
            }
            this.communities.comments.unshift({
              content: this.commentText,
              id: data.id,
              publishedDate: new Date().getTime() / 1000,
              topicId: this.communities.topicId,
              userId: this.$store.state.user.id,
              userName: this.$store.state.user.name,
              isUploadedImages: isUploadedImages,
              replies: [],
            })
            this.data = this.communities.comments
            this.reviewData = calPaging(
              this.data,
              this.reviewData.currentPage,
              5,
              4
            )
            this.topicNum = this.data.length || 0
            this.commentText = null
            this.$emit('posted')
            this.$nextTick(() => {
              $('html, body').animate(
                {
                  scrollTop: $('#community-area').offset().top - 100,
                },
                800
              )
            })
          }
        })
        .finally(() => {
          $('.showreview').modal('hide')
          this.processing = false
        })
    },
    onDeleteTopic(id) {
      if (!id) {
        return
      }
      this.GoGoHTTP.delete('/api/v3/surface/communities/' + id).then(() => {
        let currPage = this.reviewData.currentPage
        this.communities.comments = this.communities.comments.filter(item => {
          return item.id !== id
        })
        this.data = this.communities.comments
        this.reviewData = calPaging(this.data, currPage, 5, 4)
      })
    },
    onDeleteReply(id) {
      this.GoGoHTTP.delete(`/api/v3/surface/communities/${id}`).then(() => {
        this.$emit('delete-reply')
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.comment-area {
  border-top: 1px solid #d9d9d9;
  padding: 20px 30px;
  .text-area {
    border-top: 1px solid #bfbfbf;
    border-left: 1px solid #bfbfbf;
    border-right: 1px solid #bfbfbf;
    border-bottom: 1px dotted #bfbfbf;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    height: 100px;
    outline: none;
    resize: none;
    &::placeholder {
      color: #aab2bd;
    }
  }
  .draggable-area /deep/ {
    background: #f7f6f3;
    margin-top: -6px;
    border: 1px solid #bfbfbf;
    border-top: 1px dotted #aaa;
    height: auto;
    padding: 5px 40px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    .upload-area {
      font-size: 12px;
      height: 28px;
      border: 1px solid #d9d9d9;
      padding: 5px 10px;
      &:hover {
        background: #b0afb0;
        border: 1px solid #b0afb0;
        color: white;
        .icon-cls {
          color: white;
        }
      }
    }
  }
  /deep/ .img-name {
    font-size: 13px;
    font-weight: normal;
    color: #2d2d2d;
  }
  /deep/ .icon-file {
    display: none;
  }
  .recommend {
    font-size: 10px;
    color: #2d2d2d;
  }
}
.co-red {
  color: red;
}
.button-comment {
  border: none;
  background: #b0b0b0;
  height: 30px;
  width: 180px;
  border-radius: 5px;
  color: white;
  &:hover {
    opacity: 0.9;
  }
}
.showreview .modal-dialog {
  width: 1000px;
  margin: 0 auto;
  position: absolute;
  top: 45% !important;
  left: 0;
  right: 0;
  transform: translate(0, -50%) !important;
  button.close {
    color: white;
    text-shadow: none;
    font-size: 25px;
    opacity: 1;
    outline: none;
    &:hover {
      opacity: 0.9;
    }
  }
  .review-content {
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
    /deep/ .message-wrapp {
      text-align: left;
    }
    /deep/ .grow0 {
      max-height: 400px;
      margin-bottom: 20px;
    }
  }
}
button {
  outline: none;
}
</style>
