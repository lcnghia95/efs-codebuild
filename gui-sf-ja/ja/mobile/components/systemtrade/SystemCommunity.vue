<template>
  <div id="community-area">
    <div class="community-post">
      <b>{{ $t('1') }}</b><span>{{ totalShow }}</span>
      <textarea class="text-area w-full resize-vertical mt-5" v-model="commentText" :placeholder="$t('2')"></textarea>
      <div class="text-txt mt-10 mb-15">{{ $t('12') }}</div>
      <ImportFile ref="importFile1" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged1" :index-number="1" />
      <ImportFile ref="importFile2" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged2" :index-number="2" :is-disable="!formData1" />
      <ImportFile ref="importFile3" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged3" :index-number="3" :is-disable="!formData2" />
      <div class="recommend mt-10">{{ $t('3') }}</div>
      <div class="text-center mt-20 mb-10">
        <button class="btn-review flex mid center" @click="onClickPostComment" :disabled="processing">
          {{ $t('4') }}
        </button>
        <div class="co-red mt-5 text-txt" v-if="noContent"><b>{{ $t('13') }}</b></div>
      </div>
    </div>
    <div v-if="!loading" class="communities mt-20 p-10" id="comment-info">
      <div class="text-center mt-20">
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                theme-class="theme1"
                scroll-offset-el="#community-area"
                @pagingclick="onPagingClick"
        />
      </div>
      <UserMessage v-for="commu in reviewData.data" :message="commu" :key="'commu-'+commu.id" :id="'commu-'+commu.id" class="mt-20 mb-40" :on-delete-topic="onDeleteTopic" :on-delete-reply="onDeleteReply" @posted="onPosted" :on-show-modal="onShowModal" />
      <div class="text-center mt-20">
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                scroll-offset-el="#community-area"
                @pagingclick="onPagingClick"
        />
      </div>
    </div>
    <div class="flex center mt-30" v-else>
      <Loading class="ml-10" style="width: 50px; height: 50px;" />
    </div>
    <div class="show-modal modal fade" role="dialog" v-if="$store.state.user.id" id="show-review">
      <div class="modal-dialog flex layout-col">
        <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
        <div class="review-content p-10">
          <div class="text-left mb-10"><b>{{ $t('11') }}</b></div>
          <UserMessage :buyer="communities.buyer" :message="reviewMsg" :disable-reply="true" />
          <div class="flex mid content-end bot-area pt-10 mt-10">
            <div data-dismiss="modal">{{ $t('8') }}</div>
            <button class="btn-review ml-10 flex mid center" @click="onPostComment" :disable="processing">
              {{ $t('4') }}
              <Loading class="ml-5 sm" style="width: 20px; height: 20px;" v-if="processing" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="show-modal modal fade" role="dialog" :id="'show-modal'">
      <div class="modal-dialog flex layout-col">
        <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
        <div class="action-content">
          <div class="p-10" @click="onShowReply" v-if="!parentId">{{ $t('5') }}</div>
          <div class="p-10" @click="onAction(1)">{{ $t('6') }}</div>
          <div class="p-10" @click="onAction(2)">{{ $t('7') }}</div>
          <div class="p-10 bot-area" data-dismiss="modal">{{ $t('8') }}</div>
        </div>
      </div>
    </div>
    <div class="show-modal modal fade" role="dialog" :id="'show-reply'">
      <div class="modal-dialog flex layout-col">
        <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
        <div class="reply-content p-10">
          <textarea
            name="replyContent"
            class="w-full un-resize text-area p-5"
            rows="6"
            v-model="replyContent"
            :placeholder="$t('9')"
            v-validate="{ rules: { required: true } }"
          ></textarea>
          <div v-if="errors.first('replyContent')" style="color: red;">{{ $t('replyError') }}</div>
          <ImportFile ref="importFile1" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged1" :index-number="1" :maxsize="1" />
          <ImportFile ref="importFile2" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged2" :index-number="2" :is-disable="!formData1" :maxsize="1" />
          <ImportFile ref="importFile3" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged3" :index-number="3" :is-disable="!formData2" :maxsize="1" />
          <div class="flex mid content-end bot-area pt-10">
            <div data-dismiss="modal">{{ $t('8') }}</div>
            <button class="btn-reply ml-10 flex mid center" @click="onPostReply" :disable="replying">
              {{ $t('10') }}
              <Loading class="ml-5 sm" style="width: 20px; height: 20px;" v-if="replying" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/systemtrade-community.json'
import Paging from '@/components/paging/Paging.vue'
import UserMessage from './SystemUserMessage.vue'
import Loading from '@@/../components/icons/Loading.vue'
import ImportFile from '@@/../components/input/ImportFile.vue'
import { calPaging, gotoLogin } from '@/utils/client/common'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default {
  props: {
    id: [Number, String],
    getData: {
      type: Function,
      default: () => {},
    },
    commuTotal: Number,
  },
  components: {
    Paging,
    UserMessage,
    Loading,
    ImportFile,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      loading: true,
      communities: {
        comments: [],
      },
      reviewData: {
        lastPage: 1,
        from: 1,
        to: 1,
        pagingFrom: 1,
        pagingTo: 1,
        currentPage: 1,
        data: [],
      },
      commentText: null,
      processing: false,
      reviewMsg: {
        userId: this.$store.state.user.id,
      },
      noContent: false,
      totalShow: this.commuTotal,
      keepId: null,
      processAction: false,
      replyContent: null,
      replying: false,
      parentId: null,
      imgSource: [],
      formData1: null,
      formData2: null,
      formData3: null,
      commentFileName1: null,
      commentFileName2: null,
      commentFileName3: null,
    }
  },
  created() {
    this.initFirstData()
  },
  methods: {
    initFirstData(needRefresh = false) {
      this.getData(data => {
        this.loading = false
        this.processAction = false
        this.keepId = null
        this.parentId = null
        this.replyContent = ''
        this.replying = false
        this.communities = data
        this.data = this.communities.comments
        let gotoId = this.$route.query.cmt
        if (gotoId && typeof  gotoId == 'string') {
          gotoId = gotoId.split(',')
          if (parseInt(gotoId[1])) {
            this.reviewData = calPaging(this.data, 1, 10, 4)
            this.$nextTick(() => {
              $('html, body').animate(
                {
                  scrollTop: $('#commu-' + gotoId[0]).offset().top - 40,
                },
                'slow'
              )
            })
          } else {
            let idx = this.data.findIndex(e => e.id === parseInt(gotoId[2])),
              page = 1
            if (idx !== -1) {
              page = parseInt((idx + 10) / 10)
            }
            this.reviewData = calPaging(this.data, page, 10, 4)
            if (idx !== -1) {
              this.$nextTick(() => {
                $('#replies-detail' + gotoId[2]).collapse('show')
                $('html, body').animate(
                  {
                    scrollTop: $('#commu-' + gotoId[0]).offset().top - 40,
                  },
                  'slow'
                )
              })
            }
          }
        } else {
          this.reviewData = calPaging(
            this.data,
            this.reviewData.currentPage,
            10,
            4
          )
        }
        $('#show-reply').modal('hide')
        $('#show-modal').modal('hide')
      }, needRefresh)
    },
    onPosted() {
      this.$emit('posted')
    },
    onPagingClick(page) {
      this.reviewData = calPaging(this.data, page, 10, 4)
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
    getBase64(file, cb) {
      let reader = new FileReader()
      reader.onloadend = () => {
        cb(reader.result)
      }
      reader.readAsDataURL(file)
    },
    onPostComment() {
      this.processing = true
      this.GoGoHTTP.post('/api/v3/surface/communities', {
        productId: this.$route.params.id,
        isTopic: 1,
        content: this.commentText,
      })
        .then(async data => {
          if (data.id) {
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
            this.initFirstData()
            this.commentText = null
            this.totalShow = this.totalShow + 1
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
          $('#show-review').modal('hide')
          this.processing = false
        })
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
      this.reviewMsg = {
        userId: this.$store.state.user.id,
        userName: this.$store.state.user.name,
        content: this.commentText,
        publishedDate: moment()
          .utc()
          .unix(),
        isUploadedImages: this.imgSource.length ? this.imgSource : null,
      }
      $('#show-review').modal({
        backdrop: 'static',
        keyboard: false,
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
        this.reviewData = calPaging(this.data, currPage, 10, 4)
        this.totalShow = this.communities.comments.reduce((result, item) => {
          result++
          result += (item.replies || []).length
          return result
        }, 0)
      })
    },
    onDeleteReply(id) {
      this.GoGoHTTP.delete(`/api/v3/surface/communities/${id}`).then(() => {
        this.initFirstData(true)
      })
    },
    onShowModal(id) {
      if (!id) {
        return
      }
      this.keepId = id
      $('#show-modal').modal({
        backdrop: 'static',
        keyboard: false,
      })
    },
    onShowReply() {
      if (!this.keepId || this.processAction) {
        return
      }
      $('#show-modal').modal('hide')
      this.$nextTick(() => {
        $('#show-reply').modal({
          backdrop: 'static',
          keyboard: false,
        })
      })
    },
    async onPostReply() {
      const rs = await this.$validator.validateAll()
      if(!rs) {
        return
      }
      if (!this.keepId || this.replying) {
        return
      }
      this.replying = true
      this.GoGoHTTP.post('/api/v3/surface/communities', {
        productId: this.$route.params.id,
        content: this.replyContent,
        isTopic: 0,
        topicId: this.keepId,
      }).then(async data => {
        await this.postFormData(data.id)
        this.initFirstData(true)
      })
    },
    async postFormData(commentId) {
      if (this.formData1) {
        let fileUploadUrl = '/upload/img/communities/' + commentId
        let arrayPromise = [this.GoGoHTTP.post(fileUploadUrl, this.formData1)]
        if (this.formData2) {
          arrayPromise.push(this.GoGoHTTP.post(fileUploadUrl, this.formData2))
        }
        if (this.formData3) {
          arrayPromise.push(this.GoGoHTTP.post(fileUploadUrl, this.formData3))
        }
        await Promise.all(arrayPromise)
        this.formData1 = null
        this.formData2 = null
        this.formData3 = null
        this.$refs.importFile1.deleteImage()
        this.$refs.importFile2.deleteImage()
        this.$refs.importFile3.deleteImage()
        this.imgSource = []
        $('#show-reply').modal('hide')
      }
    },
    onAction(type) {
      if (!this.keepId || this.processAction) {
        return
      }
      let tmpCmt
      if (this.parentId) {
        let tmpRpl = this.reviewData.data.filter(e => e.id === this.parentId)[0]
        tmpCmt = tmpRpl.replies.filter(e => e.id === this.keepId)
      } else {
        tmpCmt = this.reviewData.data.filter(e => e.id === this.keepId)[0]
      }
      if (tmpCmt.likeType) {
        $('#show-modal').modal('hide')
        return
      }
      this.processAction = true
      this.GoGoHTTP.put(`/api/v3/surface/communities/${this.keepId}/action`, {
        type,
      }).then(() => {
        this.communities = {
          comments: [],
        }
        this.initFirstData(true)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.community-post {
  border-bottom: 1px #d9d9d9 solid;
  padding: 6vw 4vw;
  font-size: 3.5vw;
  .btn-review {
    width: 50vw;
    height: 10vw;
    max-width: 300px;
    max-height: 60px;
    background: #9c3;
    color: white;
    border-radius: 4px;
    margin: 0 auto;
    border: none;
    outline: none;
  }
  .draggable-area /deep/ {
    border: 1px solid #d9d9d9;
    height: auto;
    margin-bottom: 5px;
    .upload-area {
      font-size: 12px;
      height: 24px;
    }
  }
  /deep/ .img-name {
    font-size: 12px;
    font-weight: normal;
  }
  /deep/ .icon-file {
    width: 20px;
    height: 20px;
  }
  .recommend {
    font-size: 2.5vw;
    line-height: 4vw;
    color: #2d2d2d;
  }
  .co-red {
    color: red;
  }
}
.text-area {
  border: 1px solid #d9d9d9;
  height: 130px;
  padding: 2vw;
  outline: none;
  resize: none;
  -webkit-appearance: none;
  &::placeholder {
    color: #aab2bd;
    font-size: 2.8vw;
  }
}
.communities {
  color: #666;
  .search-content {
    height: 60px;
    padding: 0 7px;
    input {
      border-radius: 4px 0 0 4px;
      border: 1px solid #d9d9d9;
      border-right: 0;
      outline: none;
      overflow: hidden;
      height: 46px;
      &::placeholder {
        color: #bfbfbf;
      }
    }
    button {
      background-color: white;
      width: 46px;
      height: 46px;
      color: #777;
      outline: none;
      border-radius: 0 4px 4px 0;
      border: 1px solid #cecdce;
      border-left: 0;
      &:hover {
        background-color: #eee;
      }
    }
  }
}
.text-txt {
  font-size: 3vw;
}
.show-modal .modal-dialog {
  width: 90%;
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
  .bot-area {
    border-top: 1px solid #e0dedc;
    color: #434343;
  }
  .review-content {
    background: #fff;
    .btn-review {
      border: none;
      border-radius: 5px;
      background: #9c3;
      color: white;
      width: 100px;
      height: 35px;
    }
  }
  .action-content {
    background: #fff;
    color: #434343;
  }
  .reply-content {
    background: #fff;
    color: #434343;
    .un-resize {
      resize: none;
    }
    .btn-reply {
      border: none;
      border-radius: 5px;
      background: #9c3;
      color: white;
      width: 100px;
      height: 35px;
    }
  }
}
/deep/ .buyer-content {
  height: 18px;
  line-height: 20px;
  background: #4caf93;
  font-size: 13px;
  color: white;
  padding: 0 8px;
  border-radius: 10px;
  margin: 0 0 0 10px;
}
</style>
<docs>
  ```vue
  <template>
    <SystemCommunity :getData="getCommunityData" :id="id"/>
  </template>
  <script>
    export default {
      data() {
        return {
          id: 12001,
          '$route': {
            params: {
              id: 12001
            }
          },
          communities: {
            topic: 1,
            total: 2,
            comments: [
            {
              id: 63894,
              content: "1233",
              publishedDate: 1536223317,
              userId: 140003,
              userName: "テストマン",
              isTopic: true,
              replies: [
              {
                id: 63896,
                content: "123",
                publishedDate: 1536223852,
                userId: 140003,
                userName: "テストマン",
                isTopic: false
              }
              ]
            }
            ]
          }
        }
      },
      methods: {
        getCommunityData(cb) {
          cb(this.communities)
        },
      }
    }
  </script>
  ```
</docs>
