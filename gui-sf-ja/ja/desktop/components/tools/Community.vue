<template>
  <div>
    <div v-if="!loading">
      <div class="flex space-between">
        <a data-toggle="collapse" v-if="!isTsukuruProduct(this.$route.params.id)" href="#post-comment" class="no-underlying flex mid" @click="onShowComment">
          <button class="btn-review text-center" :class="{'show-comment': isShowComment}">
            <b class="fs-18">{{ $t('1') }}</b>
          </button>
        </a>
        <a v-else class="no-underlying flex mid" href="https://fx-on.com/inquiry/tsukuru/">
          <button class="btn-review text-center" :class="{'show-comment': 0}">
            <b class="fs-18">{{ $t('1') }}</b>
          </button>
        </a>
        <div class="flex">
          <input type="text" class="input-search pl-20 pr-20" :placeholder="$t('2')" v-model="searchText" />
          <button class="btn-search" @click="onSearch">{{ $t('3') }}</button>
        </div>
      </div>
      <div id="post-comment" class="panel-collapse collapse co-commu">
        <div class="mt-30 mb-30 fs-18">{{ $t('6') }}</div>
        <div class="mb-5" v-html="$t('7')"></div>
        <textarea class="text-area w-full resize-vertical p-20" v-model="commentText" :placeholder="$t('8')"></textarea>
        <div v-if="noContent"><b class="co-red">{{ $t('13') }}</b></div>
        <div class="mt-25 flex mid space-between">
          <b>{{ $t('9') }}</b>
          <ImportFile ref="importFile1" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged1" :index-number="1" />
          <ImportFile ref="importFile2" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged2" :index-number="2" :is-disable="!formData1" />
          <ImportFile ref="importFile3" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged3" :index-number="3" :is-disable="!formData2" />
        </div>
        <div class="mt-20 fs-12 co-commu">{{ $t('10') }}</div>
        <div class="text-center mt-30 mb-20">
          <button class="btn-review" @click="onClickPostComment" :disabled="processing">
            <b class="fs-18">{{ $t('11') }}</b>
          </button>
          <div class="showreview modal fade" role="dialog" v-if="$store.state.user.id">
            <div class="modal-dialog flex layout-col">
              <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
              <div class="review-content">
                <UserMessage :buyer="communities.buyer" :message="reviewMsg" />
                <div class="btn-wrapp flex mid center pt-25 pb-25">
                  <button class="btn-review btn-cancel text-center" data-dismiss="modal">
                    <b class="fs-18">{{ $t('12') }}</b>
                  </button>
                  <button class="btn-review text-center ml-20" @click="onPostComment" :disabled="processing">
                    <div class="flex mid center">
                      <b class="fs-18">{{ $t('1') }}</b>
                      <Loading v-if="processing" class="ml-10 sm" style="width: 20px; height: 20px;" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex space-between mt-50">
        <div class="comment-info">
          <span><b>{{ showTotal }}</b></span>
          <span v-if="reviewData.data.length"><b>{{ showRange }}</b></span>
        </div>
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                scroll-offset-el="#content-tab-id"
                theme-class="theme2"
                @pagingclick="onPagingClick"
        />
      </div>
      <SingleCommunity v-for="commu in reviewData.data" @posted="onPosted" :buyer="communities.buyer" :content="commu" @delete-topic="onDeleteTopic" @delete-reply="onDeleteReply" :key="'commu-'+commu.id" class="mt-25 mb-50" />
      <div class="mt-20 flex space-between" v-if="reviewData.data.length">
        <div class="comment-info">
          <span><b>{{ showTotal }}</b></span>
          <span v-if="reviewData.data.length"><b>{{ showRange }}</b></span>
        </div>
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                scroll-offset-el="#content-tab-id"
                theme-class="theme2"
                @pagingclick="onPagingClick"
        />
      </div>
    </div>
    <div class="flex center" v-else>
      <Loading class="ml-10" style="width: 50px; height: 50px;" />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-community.json'
import Paging from '@@/../components/paging/Paging.vue'
import SingleCommunity from './SingleCommunity.vue'
import UserMessage from './UserMessage.vue'
import ImportFile from '@@/../components/input/ImportFile.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { calPaging, gotoLogin } from '@/utils/client/common'
export default {
  props: {
    id: [Number, String],
    getData: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    Paging,
    SingleCommunity,
    UserMessage,
    ImportFile,
    Loading,
  },
  i18n: {
    messages: i18n,
  },
  mounted() {
    this.sendPageView()
  },
  data() {
    return {
      noContent: null,
      loading: true,
      communities: [],
      imgSource: [],
      reviewData: {
        lastPage: 1,
        from: 1,
        to: 1,
        pagingFrom: 1,
        pagingTo: 1,
        data: [],
      },
      searchText: null,
      isShowComment: false,
      commentText: null,
      formData1: null,
      formData2: null,
      formData3: null,
      commentFileName1: null,
      commentFileName2: null,
      commentFileName3: null,
      processing: false,
      reviewMsg: {
        userId: this.$store.state.user.id,
      },
    }
  },
  computed: {
    showTotal() {
      return this.$t('4').replace('%s', this.communities.topic || 0)
    },
    showRange() {
      return this.$t('5').replace(
        '%s',
        this.reviewData.data.length > 1
          ? this.reviewData.from.toString() +
            '～' +
            this.reviewData.to.toString()
          : this.reviewData.from.toString()
      )
    },
  },
  created() {
    this.initFirstData()
  },
  methods: {
    onPosted() {
      this.$emit('posted')
    },
    onDeleteReply() {
      this.$emit('delete-reply')
    },
    onDeleteTopic(id) {
      let currPage = this.reviewData.currentPage
      this.communities.comments = this.communities.comments.filter(item => {
        return item.id !== id
      })
      this.communities.topic -= 1
      this.data = this.communities.comments
      this.reviewData = calPaging(this.data, currPage, 10, 4)
      this.$emit(
        'update-total',
        this.communities.comments.reduce((result, item) => {
          result++
          result += (item.replies || []).length
          return result
        }, 0)
      )
    },
    initFirstData() {
      this.getData(data => {
        this.loading = false
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
                  scrollTop: $('#commu-' + gotoId[0]).offset().top - 60,
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
                    scrollTop: $('#commu-' + gotoId[0]).offset().top - 60,
                  },
                  'slow'
                )
              })
            }
          }
        } else {
          this.reviewData = calPaging(this.data, 1, 10, 4)
        }
      })
    },
    onPagingClick(page) {
      this.reviewData = calPaging(this.data, page, 10, 4)
    },
    onSearch() {
      if (!this.searchText) {
        this.initFirstData()
        return
      }
      this.data = this.communities.comments
      this.data = this.data.filter(item => {
        return (
          (item.content || '').includes(this.searchText) ||
          (item.userName || '').includes(this.searchText) ||
          (item.replies || []).filter(e => {
            return (
              (e.content || '').includes(this.searchText) ||
              (e.userName || '').includes(this.searchText)
            )
          }).length
        )
      })
      this.reviewData = calPaging(this.data, 1, 10, 4)
    },
    onShowComment() {
      if (!this.$store.state.user.id) {
        gotoLogin()
        return
      }
      this.isShowComment = !this.isShowComment
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
      $('.showreview').modal({
        backdrop: 'static',
        keyboard: false,
      })
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
            this.communities.topic += 1
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
            this.$emit('posted')
            this.initFirstData()
            this.commentText = null
            this.$nextTick(() => {
              $('html, body').animate(
                {
                  scrollTop: $('.comment-info').offset().top - 100,
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
    isTsukuruProduct(productId) {
      return [5735, 7560, 5939, 5941, 7561].includes(parseInt(productId))
    },
  },
}
</script>

<style lang="scss" scoped>
.co-red {
  color: red;
}
.btn-review {
  width: 300px;
  height: 40px;
  line-height: 41px;
  background: #f6bb42;
  color: white;
  border-radius: 4px;
  border: none;
  outline: none;
  &:hover {
    opacity: 0.9;
  }
}
.h-40 {
  height: 40px;
}
.btn-icon {
  width: 20px;
  height: 20px;
}
.input-search {
  width: 400px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #707070;
}
.btn-search {
  background: #707070;
  width: 100px;
  height: 40px;
  line-height: 41px;
  font-size: 18px;
  border: none;
  outline: none;
  color: white;
  &:hover {
    opacity: 0.9;
  }
}
.comment-info {
  color: #707070;
  span {
    display: block;
  }
}
.paging-wrap /deep/ {
  li:last-child {
    margin-right: 0;
  }
}
.show-comment {
  background: white;
  text-align: left;
  color: #f6bb44;
  padding-left: 0;
  b {
    font-size: 24px;
  }
}
.fs-18 {
  font-size: 18px;
}
.resize-vertical {
  resize: vertical;
}
.text-area {
  border: 1px solid #707070;
  height: 300px;
  outline: none;
  resize: none;
  &::placeholder {
    color: #aab2bd;
  }
}
.co-commu {
  color: #707070;
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
      overflow-y: auto;
      margin-bottom: 20px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <Community :getData="getCommunityData" :id="id"/>
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
