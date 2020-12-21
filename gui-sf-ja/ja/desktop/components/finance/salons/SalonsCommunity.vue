<template>
  <div id="community-area">
    <div class="community-post p-20">
      <b class="fs-13">{{ $t('1') }}</b><span class="fs-13">{{ $t('2') }}</span>
      <textarea class="text-area fs-12 w-full resize-vertical p-10 mt-5" v-model="commentText" :placeholder="$t('3')"/>
      <ImportMultiFile ref="importFile" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged" :default-txt="$t('4')" :is-row-reserver="true" :multiple="3" :maxsize="1" />
      <div class="recommend mt-10">{{ $t('5') }}</div>
      <div class="text-center mt-20 mb-10">
        <button class="btn-review" @click="onClickPostComment" :disabled="processing">
          {{ $t('6') }}
        </button>
        <div class="co-red mt-5" v-if="noContent"><b>{{ $t('12') }}</b></div>
        <div class="co-red mt-5" v-if="checkErr"><b>{{ $t(checkErr) }}</b></div>
        <div class="showreview modal fade" role="dialog" v-if="$store.state.user.id">
          <div class="modal-dialog flex layout-col">
            <button type="button" class="close text-right mb-5" data-dismiss="modal">&times;</button>
            <div class="review-content">
              <div class="pl-15 pt-10 text-left"><b>{{ $t('11') }}</b></div>
              <UserMessage :buyer="communities.buyer" :message="reviewMsg" :disable-reply="true"/>
              <div class="btn-wrapp flex mid center pt-25 pb-25">
                <button class="btn-review btn-cancel text-center" data-dismiss="modal">
                  <b class="fs-18">{{ $t('10') }}</b>
                </button>
                <button class="btn-review text-center ml-20" @click="onPostComment" :disabled="processing">
                  <div class="flex mid center">
                    <b class="fs-18">{{ $t('1') }}</b>
                    <Loading v-if="processing" class="ml-10 sm" style="width: 20px; height: 20px;"/>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading" class="communities mt-10 p-20" id="comment-info">
      <div class="text-center">
        <span>{{ showTotal }}</span>&nbsp;&nbsp;&nbsp;
        <span v-if="reviewData.data.length">{{ showRange }}</span>
      </div>
      <div class="search-content flex mid center">
        <input type="text" name="" class="flex mid pl-15 pr-15 w-full" :placeholder="$t('14')" v-model="searchText">
        <button class="flex mid center" type="submit" @click="onSearch">
          <span class="glyphicon glyphicon-search"/>
        </button>
      </div>
      <div class="text-center mt-20">
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                theme-class="theme4"
                scroll-offset-el="#community-area"
                @pagingclick="onPagingClick"/>
      </div>
      <UserMessage v-for="commu in reviewData.data" :message="commu" :key="'commu-'+commu.id" class="mt-20 mb-40" :on-delete-topic="onDeleteTopic" :on-delete-reply ="onDeleteReply" @posted="onPosted"/>
      <div class="text-center mt-20">
        <paging :cur-page="reviewData.currentPage"
                :total="reviewData.lastPage"
                :from="reviewData.pagingFrom"
                :to="reviewData.pagingTo"
                :has-scroll="true"
                :scroll-offset="100"
                theme-class="theme4"
                scroll-offset-el="#community-area"
                @pagingclick="onPagingClick"/>
      </div>
    </div>
    <div class="flex center mt-30" v-else>
      <Loading class="ml-10" style="width: 50px; height: 50px;"/>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/systemtrade-community.json'
import Paging from '@@/../components/paging/Paging.vue'
import UserMessage from './SalonsUserMessage.vue'
import ImportMultiFile from '@@/../components/input/ImportMultiFile.vue'
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
    UserMessage,
    ImportMultiFile,
    Loading,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      loading: true,
      communities: [],
      reviewData: {
        lastPage: 1,
        from: 1,
        to: 1,
        pagingFrom: 1,
        pagingTo: 1,
        data: [],
      },
      searchText: null,
      commentText: null,
      processing: false,
      reviewMsg: {
        userId: this.$store.state.user.id,
      },
      imgSource: [],
      formData: [],
      noContent: false,
      topicNum: 0,
      checkErr: null,
    }
  },
  computed: {
    showTotal() {
      return this.$t('7').replace('%s', this.topicNum)
    },
    showRange() {
      return this.$t('9').replace(
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
    initFirstData() {
      this.getData(data => {
        this.loading = false
        this.communities = data
        this.data = this.communities.comments
        this.reviewData = calPaging(this.data, 1, 10, 4)
        this.topicNum = data.topic || 0
      })
    },
    onPosted() {
      this.$emit('posted')
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
          (item.content || '').indexOf(this.searchText) !== -1 ||
          (item.userName || '').indexOf(this.searchText) !== -1
        )
      })
      this.reviewData = calPaging(this.data, 1, 10, 4)
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
              10,
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
    fileChanged(_file) {
      this.imgSource = []
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
        this.topicNum = this.data.length || 0
        this.reviewData = calPaging(this.data, currPage, 10, 4)
        this.$emit(
          'update-total',
          this.communities.comments.reduce((result, item) => {
            result++
            result += (item.replies || []).length
            return result
          }, 0)
        )
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
.community-post {
  border-radius: 10px;
  background: #f5f5f5;
  .btn-review {
    width: 200px;
    height: 40px;
    line-height: 41px;
    background: #00a0e9;
    color: white;
    border-radius: 4px;
    border: none;
    outline: none;
    &:hover {
      opacity: 0.9;
    }
  }
  .text-area {
    border: 1px solid #d9d9d9;
    border-bottom: 1px dashed #d9d9d9;
    height: 130px;
    outline: none;
    resize: none;
    &::placeholder {
      color: #aab2bd;
    }
  }
  .draggable-area /deep/ {
    margin-top: -6px;
    border-top: none;
    border: 1px solid #d9d9d9;
    height: auto;
    padding: 10px 20px;
    margin-bottom: 5px;
    .upload-area {
      font-size: 12px;
      height: 28px;
      padding: 7px;
    }
  }
  /deep/ .img-name {
    font-size: 13px;
    font-weight: normal;
    color: #2d2d2d;
  }
  /deep/ .icon-file {
    width: 20px;
    height: 20px;
  }
  .recommend {
    font-size: 10px;
    color: #2d2d2d;
  }
  .co-red {
    color: red;
  }
}
.communities {
  border-radius: 10px;
  background: #f5f5f5;
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
        font-size: 15px;
        color: #bfbfbf;
      }
    }
    button {
      background-color: white;
      width: 46px;
      height: 46px;
      color: #777;
      font-size: 15px;
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
.paging-wrap /deep/ {
  li:last-child {
    margin-right: 0;
  }
}
.resize-vertical {
  resize: vertical;
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
/deep/ div.pre-line {
  font-size: 12px;
  line-height: 1.5;
  margin-top: 0;
  padding: 20px;
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
