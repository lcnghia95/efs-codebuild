<template>
  <div class="crowdsourcing-detail pt-30 pb-40">
    <div class="w-1000 flex space-between">
      <div class="p-40 detail-left">
        <div class="title-detail w-full flex mid pt-20 pb-20">
          <PaperPlane />
          <span class="ml-10 wrap-text" :title="crowdsourcing.title">{{ crowdsourcing.title }}</span>
        </div>
        <div class="mt-20 mb-40 min-h-150 crowd-content" v-html="crowdsourcing.content"></div>
        <div class="title-detail w-full flex mid fs-25 pt-20 pb-20">
          <Comments />
          <span class="ml-10">{{ $t('2') }}</span>
        </div>
        <div>
          <message :key="i" v-for="(item, i) in comments" :img-url="crowdsourcing.user.id !== item.user.id ? '/crowdsourcing/developers/'+item.user.id : null" :content="item" :their-msg="item.user.id !== userId"
                   class="message" :download-link="downloadLink(item)" :content-type="'crowdsourcing'" :is-processing="replyLoading"
                   :reply-enable="item.isTopic && userId && !crowdsourcing.matched" :user-id="userId" :status-enable="item.user.id === userId" :ref="'msg'+item.id"
                   @input="replyFileChanged" @reply="onPostReply" @changestatus="onChangeStatus(item.id)"
          />
        </div>
        <div class="mt-40" v-if="userId && crowdsourcing.id && !crowdsourcing.matched">
          <textarea class="w-full resize-vertical" rows="5" v-model="comment2.content" :placeholder="$t('5')"></textarea>
          <import-file ref="importFile1" accept=".zip, .mq4, .ex4, .pdf, .jpeg, .jpg, .png, .gif" class="w-full fs-10" @input="fileChanged2" />
          <div class="mt-10 co-red" v-html="$t('6')"></div>
          <label class="mt-10 flex mid private-cmt">
            <Checkbox v-model="isPrivateComment" />
            <span>{{ $t('7') }}</span>
          </label>
          <div class="co-red" v-html="$t('8')"></div>
        </div>
        <div class="mt-40 co-red text-center"
             v-if="userId && crowdsourcing.matched && userId != crowdsourcing.devId && userId != (crowdsourcing.user || {}).id"
        >
          {{ $t('36') }}
        </div>
        <div class="w-full flex center mt-40" v-if="crowdsourcing.id">
          <button class="btn-comment w-200 fs-18 flex mid center" v-if="userId && !crowdsourcing.matched" @click="onPostComment">
            <span>{{ $t('9') }}</span>
            <Loading v-if="cmtLoading" class="ml-10 sm" style="width: 20px; height: 20px;" />
          </button>
          <a :href="'/login?u=' + $route.fullPath" v-if="!userId">
            <button class="btn-orange">
              {{ $t('29') }}
            </button>
          </a>
        </div>
        <div v-if="!userId" class="text-center remind-login mt-10">
          {{ $t('23') }}
        </div>
        <div class="w-full text-center mt-10" v-if="userId && crowdsourcing.matched">
          <button class="btn-comment w-200 fs-18" v-if="userId && crowdsourcing.matched && userId != crowdsourcing.devId && userId != crowdsourcing.user.id" @click="onGoBack">
            {{ $t('37') }}
          </button>
          <button class="btn-comment w-300 fs-18" v-if="userId && crowdsourcing.matched && (userId == crowdsourcing.devId || userId == (crowdsourcing.user || {}).id)" @click="onGoMypage">
            {{ $t('38') }}
          </button>
        </div>
      </div>
      <div class="detail-right">
        <div class="right-title">
          {{ crowdsourcing.matched ? $t('28') : $t('1') }}
        </div>
        <div class="ml-20 mr-20 pt-30">
          {{ $t('10') }}
        </div>
        <div class="price ml-20 mr-20 border-bottom-3">
          ￥{{ formatNumber(crowdsourcing.reward, 0) }}
        </div>
        <div class="ml-20 mr-20 pt-30">
          {{ $t('11') }}
        </div>
        <div class="date-show pb-5 ml-20 mr-20 border-bottom">
          {{ crowdsourcing.createdAt ? formatTime(crowdsourcing.createdAt, 7) : '-' }}
        </div>
        <div class="ml-20 mr-20 pt-10">
          {{ $t('12') }}
        </div>
        <div class="date-show pb-5 ml-20 mr-20 border-bottom">
          {{ crowdsourcing.bidEndAt ? formatTime(crowdsourcing.bidEndAt, 7) : '-' }}
        </div>
        <div class="ml-20 mr-20 pt-10">
          {{ $t('13') }}
        </div>
        <div class="date-show pb-5 ml-20 mr-20 border-bottom">
          {{ crowdsourcing.deadlineAt ? formatTime(crowdsourcing.deadlineAt, 7) : '-' }}
        </div>
        <div class="ml-20 mr-20 pt-30">
          {{ $t('14') }}
        </div>
        <div class="price pb-10 ml-20 mr-20 border-bottom-3">
          {{ (bidders.data || []).length }}人
        </div>
        <div class="pt-20 pb-20 ml-20 mr-20 pt-30 border-bottom"
             v-for="(item,index) in bidders.data"
             :key="'MHcKA'+index"
        >
          <a :href="'/crowdsourcing/developers/' + item.user.id">
            {{ item.user.name || $t('18') }}
          </a>
          <div v-if="item.price">
            {{ $t('15') }}
            <span class="fs-25 cancel-price" v-if="item.status > 1">{{ formatNumber(item.price, 0) }}</span>
            <span class="fs-25" v-else>{{ formatNumber(item.price, 0) }}</span>
            円
          </div>
        </div>
        <div v-if="!userId || !bidders.bidable" class="pt-10 pb-10 ml-20 mr-20">
          {{ $t('16') }}
        </div>
        <a href="/mypage/crowdsourcing" class="w-full to-register" v-if="userId && !isCrowdsourcing">
          <button class="btn-comment center fs-18 w-full">{{ $t('41') }}</button>
        </a>
        <div v-if="userId && !crowdsourcing.matched && userId != (crowdsourcing.user || {}).id && bidders.bidable" class="ml-20 mr-20 border-radius-10 bid-content mt-20">
          <div class="bid-title pt-10 pb-10">{{ $t('19') }}</div>
          <div class="p-10 border-bottom-dashed co-red fs-12" v-html="$t('20')"></div>
          <div class="p-10">
            <input type="number" pattern="[0-9]*" name="bidNumber" :placeholder="$t('21')" class="input-bid"
                   v-model.number="bidNumber"
            />
            <span><b class="fs-16">円</b></span>
            <div v-if="bidNumberWrong" class="co-red fs-12">{{ $t('35') }}</div>
          </div>
          <div class="pl-10 pr-10 pb-10">
            <button class="btn-comment w-full h-40" :class="{ 'disabled': loading }" @click="onBid" :disabled="!userId">{{ $t('22') }}</button>
          </div>
        </div>
        <div v-if="waiting" class="ml-20 mr-20 border-radius-10 bid-content mt-20">
          <div class="bid-title pt-10 pb-10">{{ $t('24') }}</div>
          <div class="p-10 fs-12">
            {{ $t('25') }}
            <a :href="'/mypage/crowdsourcing/receive/' + id">{{ $t('26') }}</a>
            {{ $t('27') }}
          </div>
        </div>
        <div class="flex bg-white p-20 mt-20">
          <a :href="'/users/' + (crowdsourcing.user || {}).id" v-if="crowdsourcing.user">
            <img :src="'/img/users/' + (crowdsourcing.user || {}).id" class="shadow" width="60" height="60" alt="" />
          </a>
          <img :src="'/img/users/' + ((crowdsourcing.user || {}).id || 0)" class="shadow" width="60" height="60" alt="" v-else />
          <div class="ml-10">
            <span>{{ $t('17') }}</span>
            <br />
            <a :href="'/users/' + ((crowdsourcing.user || {}).id || 0)" v-if="crowdsourcing.user">
              <div class="order-name" v-wrap-lines="2">{{ (crowdsourcing.user || {}).name || $t('18') }}</div>
            </a>
            <div class="order-name" v-wrap-lines="2" v-else>{{ $t('18') }}</div>
          </div>
        </div>
      </div>
    </div>
    <gogo-modal :show="showNoContent" @update:show="val => showNoContent = val" :ok-text="''"
                width="440px" height="170px" :cancel-text="'OK'"
    >
      <div class="modal-body flex" slot="modal-body">
        <p class="pl-10"> {{ $t('30') }} </p>
      </div>
    </gogo-modal>
    <gogo-modal :show="showConfirmChange" @ok="onConfirmChange" @update:show="val => showConfirmChange = val" width="440px" height="170px" :ok-text="$t('33')" :cancel-text="$t('34')">
      <div class="modal-body flex" slot="modal-body">
        <p class="p-l-10">{{ msgChange.secretUser ? $t('31') : $t('32') }} </p>
      </div>
    </gogo-modal>
  </div>
</template>

<script>
import Message from '@/components/crowdsourcing/CrowdsourcingMessage.vue'
import i18n from '@@/lang/desktop/crowdsourcing-detail.json'
import { filterInt } from '@/utils/client/common'
import PaperPlane from '@@/../components/icons/PaperPlane.vue'
import ImportFile from '@@/../components/input/ImportFile.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'
import Comments from '@@/../components/icons/Comments.vue'
import title from '@@/../common/pages'

const obj = Object.assign(
  {
    components: {
      PaperPlane,
      ImportFile,
      Checkbox,
      GogoModal,
      Loading,
      Message,
      Comments,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    data() {
      return {
        crowdsourcing: {},
        comments: [],
        comment2: {},
        bidders: {},
        isPrivateComment: false,
        waiting: false,
        userId: parseInt(this.$store.state.user.id),
        formData: null,
        formData2: null,
        bidNumber: null,
        GET_DATA_URL: '/api/v3/surface/crowdsourcing/',
        replyFileName: null,
        commentFileName: null,
        showNoContent: false,
        reply: {},
        showConfirmChange: false,
        msgChange: {},
        loading: false,
        cmtLoading: false,
        replyLoading: false,
        bidNumberWrong: false,
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, store, error }) {
      let locale = app.i18n.locale,
        titleSuf = i18n[locale]['39'],
        [crowdsourcing, comments, bidders, isCrowdsourcing] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/${params.id}`),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/comments`, {
            params: {
              cId: params.id,
            },
          }),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/bidders`, {
            params: {
              cId: params.id,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/user')
        ]),
        waiting = bidders.waiting,
        des
      if (!crowdsourcing || !Object.keys(crowdsourcing).length) {
        return error({ statusCode: 404 })
      }
      des = (crowdsourcing.content || '').substr(0, 300)
      store.commit('pushBC', {
        name: crowdsourcing.title,
        target: { name: 'crowdsourcing-id', params: params },
      })
      return {
        id: params.id,
        crowdsourcing,
        comments,
        bidders,
        isCrowdsourcing,
        waiting,
        titleChunk: `${crowdsourcing.title} - ${titleSuf}`,
        descriptionTemplate() {
          return des
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/${params.id}`,
          },
        ],
      }
    },
    methods: {
      downloadLink(item) {
        if (!item.fileName) {
          return ''
        }
        let exts = ['jpeg', 'jpg', 'png', 'gif']
        if (
          exts.includes(
            item.fileName
              .toLowerCase()
              .split('.')
              .pop()
          )
        ) {
          return `${process.env.GOGO_URL}/img/crowdsourcing/${item.id}/1`
        } else {
          return `${process.env.GOGO_URL}/file/crowdsourcing/comments/${
            item.id
          }`
        }
      },
      replyFileChanged(_file) {
        this.formData = new FormData()
        this.formData.append('file', _file[0])
        this.replyFileName = _file[0].name
      },
      fileChanged2(_file) {
        this.formData2 = new FormData()
        this.formData2.append('file', _file[0])
        this.commentFileName = _file[0].name
      },
      onPostReply(_id, content) {
        if (!content) {
          this.showNoContent = true
          return
        }
        if (this.replyLoading) {
          return
        }
        this.replyLoading = true
        this.GoGoHTTP.post(this.GET_DATA_URL + 'comments?isGetId=1', {
          crowdsourcingId: this.id,
          comment: { content: content },
          replyId: _id,
          fileName: this.replyFileName,
        })
          .then(data => {
            if (!this.formData) {
              this.reply = {}
              this.formData = null
              this.$refs['msg' + _id][0].clearContent()
              this.onGetDataComments()
              return
            }
            this.submitUrl = '/upload/crowdsourcing/comments/' + data.id
            this.GoGoHTTP.post(this.submitUrl, this.formData).then(() => {
              this.reply = {}
              this.formData = null
              this.onGetDataComments()
            })
          })
          .finally(() => {
            this.replyLoading = false
          })
      },
      onPostComment() {
        if (!this.comment2.content) {
          this.showNoContent = true
          return
        }
        if (this.cmtLoading) {
          return
        }
        this.cmtLoading = true
        this.GoGoHTTP.post(this.GET_DATA_URL + 'comments?isGetId=1', {
          crowdsourcingId: this.id,
          comment: this.comment2,
          isPrivate: this.isPrivateComment,
          fileName: this.commentFileName,
        })
          .then(async data => {
            if (!this.formData2) {
              this.comment2 = {}
              this.isPrivateComment = false
              this.onGetDataComments()
              return
            }
            this.submitUrl = '/upload/crowdsourcing/comments/' + data.id
            await this.GoGoHTTP.post(this.submitUrl, this.formData2)
            this.comment2 = {}
            this.isPrivateComment = false
            this.formData2 = null
            this.onGetDataComments()
            this.$refs.importFile1.deleteImage()
          })
          .finally(() => {
            this.cmtLoading = false
          })
      },
      onGetDataComments() {
        this.GoGoHTTP.get(this.GET_DATA_URL + 'comments', {
          params: {
            cId: this.id,
          },
        }).then(data => {
          if (data) {
            this.comments = data
          }
        })
      },
      onBid() {
        if (!this.bidNumber) {
          return
        }
        if (this.bidNumber < 3000 || this.bidNumber > 5000000) {
          this.bidNumberWrong = true
          return
        } else {
          this.bidNumberWrong = false
        }
        this.loading = true
        this.GoGoHTTP.post(this.GET_DATA_URL + 'bidders?isGetId=1', {
          cId: this.id,
          price: this.bidNumber,
        })
          .then(() => {
            this.onGetDataBidders()
          })
          .finally(() => {
            this.loading = false
            this.bidNumber = null
          })
      },
      onGetDataBidders() {
        this.GoGoHTTP.get(this.GET_DATA_URL + 'bidders', {
          params: {
            cId: this.id,
          },
        }).then(data => {
          if (data) {
            this.bidders = data
            this.waiting = this.bidders.waiting
          }
        })
      },
      onChangeStatus(_id) {
        this.msgChange = {
          id: _id,
          secretUser: !this.comments[_id].secretUser,
        }
        this.showConfirmChange = true
      },
      onConfirmChange() {
        this.GoGoHTTP.put(
          this.GET_DATA_URL + 'comments/' + this.msgChange.id,
          this.msgChange
        ).then(() => {
          this.onGetDataComments()
        })
      },
      onGoBack() {
        location.href = '/crowdsourcing'
      },
      onGoMypage() {
        if (this.userId === this.crowdsourcing.devId) {
          location.href = `/mypage/crowdsourcing/${
            this.crowdsourcing.isFinish ? 'history/' : ''
          }receive/${this.id}`
        } else if (this.userId === (this.crowdsourcing.user || {}).id) {
          location.href = `/mypage/crowdsourcing/${
            this.crowdsourcing.isFinish ? 'history/' : ''
          }order/${this.id}`
        }
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.crowdsourcing-detail {
  background: #f3f0ee;
  .detail-left {
    width: 760px;
    background: white;
    .message {
      margin-top: 10px !important;
      margin-bottom: 10px !important;
    }
    .crowd-content {
      white-space: pre-line;
    }
    .title-detail {
      border-top: #9c3 1px solid;
      border-bottom: #9c3 1px solid;
      color: #2d2d2d;
      font-size: 25px;
      .icon-cls {
        width: 40px;
        height: 40px;
      }
    }
    .w-200 {
      width: 200px;
    }
    .w-300 {
      width: 300px;
    }
    .fs-18 {
      font-size: 18px;
    }
  }
  .detail-right {
    width: 220px;
    background: white;
    .right-title {
      background-color: #9c3;
      padding: 15px 10px;
      color: white;
      font-size: 17px;
    }
    .border-bottom {
      border-bottom: 1px #b4b5b6 solid;
    }
    .border-bottom-3 {
      border-bottom: #2d2d2d solid 3px;
    }
    .border-radius-10 {
      border-radius: 10px;
    }
    .bid-content {
      border: 1px solid #2d2d2d;
      .input-bid {
        height: 35px;
        border-radius: 5px;
        width: 130px;
        border: 1px solid darkgray;
        &::placeholder {
          font-size: 12px;
        }
      }
    }
    .bid-title {
      background-color: #2d2d2d;
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
      text-align: center;
      color: white;
    }
    .fs-25 {
      font-size: 25px;
    }
  }
  .co-red {
    color: red;
  }
  .btn-comment {
    background: #9c3;
    color: white;
    border-radius: 5px;
    align-self: center;
    border: none;
    height: 40px;
  }
  .price {
    font-size: 30px;
    color: #9c3;
  }
  .date-show {
    font-size: 22px;
    color: #2d2d2d;
  }
  .order-name {
    font-size: 16px;
    color: #2d2d2d;
  }
  .btn-orange {
    width: 200px;
    outline: none;
    background: #ff7d00;
    color: white;
    border-radius: 5px;
    align-self: center;
    border: none;
    font-size: 18px;
    height: 40px;
  }
  .remind-login {
    color: #63656a;
  }
  .w-135 {
    width: 135px;
  }
  .min-h-150 {
    min-height: 150px;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .cancel-price {
    text-decoration: line-through;
  }
  .resize-vertical {
    resize: vertical;
  }
  .draggable-area /deep/ {
    border: 2px dashed #d9d9d9;
    text-align: center;
    justify-content: center;
    .icon-cls {
      width: 20px;
      height: 20px;
    }
  }
  .private-cmt {
    cursor: pointer;
    span {
      font-weight: normal;
    }
  }
  .modal-body {
    height: 95px;
  }
  .to-register {
    display: block;
    padding: 10px 20px;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>

