<template>
  <div class="p-20">
    <div class="mt-20 mb-20 message border-radius-5 flex" :class="{ 'row-reverse': !theirMsg }">
      <a :to="imgUrl || '/users/'+ (content.user || {}).id" :class="{'mr-20': theirMsg, 'ml-20': !theirMsg}">
        <img :src="'/img/users/' + (content.user || {}).id" class="shadow" width="60" height="60" alt="" />
      </a>
      <div class="mb-0 content-wrapper border-all border-radius-5 grow0 p-10"
           :class="{ 'their-message': !theirMsg, 'my-message': theirMsg }"
      >
        <div class="flex space-between">
          <div class="flex mid">
            <span>{{ (content.user || {}).name }}</span>
            <div class="flex ml-5 fs-12" v-if="statusEnable">
              <span v-if="content.secretUser" class="pl-5 pr-5 un-public flex mid">{{ $t('5') }}</span>
              <span v-else class="pl-5 pr-5 border-all flex mid">{{ $t('4') }}</span>
              <button class="ml-5 fs-11" @click="changeStatus">
                {{ content.secretUser ? $t('7') : $t('6') }}
              </button>
            </div>
          </div>
          <span class="date-cls fs-12">{{ formatTime(content.publishedDate, 6) }}</span>
        </div>
        <div class="mt-20 pre-line" v-html="content.content"></div>
        <div class="mt-20" v-if="downloadLink">
          <a :href="downloadLink" class="cursor-pointer no-underlying co-61 flex mid">
            <Download />&nbsp;<span>{{ content.fileName }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="panel-group ml-45" v-if="content.replies">
      <div class="bg-co-59 pl-20 pr-20 pt-10 pb-10">
        <h4 class="panel-title">
          <a data-toggle="collapse" :href="'#replies-detail' + content.id" class="no-underlying fs-12 flex mid" @click="onClickExpand">
            <b>{{ content.replies.length }}{{ $t('8') }}</b>&nbsp;
            <AngleDoubleUp v-if="onExpand" class="co-31" />
            <AngleDoubleDown v-else class="co-31" />
          </a>
        </h4>
      </div>
      <div :id="'replies-detail' + content.id" class="panel-collapse collapse fs-13">
        <div class="panel-body message">
          <div v-for="item in content.replies" class="flex contend-end mb-20 message fs-12 row-reverse" :key="item.id">
            <a :to="'/users/'+ (item.user || {}).id" class="ml-20">
              <img :src="'/img/users/' + (item.user || {}).id" class="shadow" width="50" height="50" alt="" />
            </a>
            <div class="mb-0 content-wrapper border-all border-radius-5 grow0 p-10 their-message">
              <div class="flex space-between">
                <span>{{ (item.user || {}).name }}</span>
                <span class="date-cls fs-12">{{ formatTime(item.publishedDate, 6) }}</span>
              </div>
              <div class="mt-10 pre-line" v-html="item.content"></div>
              <div class="mt-10" v-if="item.fileName">
                <a :href="replyDownloadLink(item)" class="cursor-pointer no-underlying co-61 flex mid">
                  <Download />&nbsp;<span>{{ item.fileName }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ml-40" v-if="replyEnable">
      <a data-toggle="collapse" :href="'#replies-area' + content.id" class="flex mid content-end no-underlying fs-12 reply-button">
        <Reply /><span class="ml-5">{{ $t('3') }}</span>
      </a>
      <div :id="'replies-area' + content.id" class="panel-collapse collapse fs-13">
        <div class="message">
          <div class="mt-20 flex space-between" v-if="userId">
            <textarea class="w-full resize-vertical" rows="3" :id="'reply-box' + content.id" :placeholder="$t('1')"></textarea>
            <img :src="'/img/users/' + userId" class="shadow ml-10" width="50" height="50" alt="" />
          </div>
          <div class="flex space-between mb-20 mt-5" v-if="userId">
            <import-file name="replyFile" v-model="replyFile" :accept="'.zip, .mq4, .ex4, .pdf, .jpeg, .jpg, .png, .gif'" class="w-full fs-10" @input="fileChanged" />
            <button class="btn-comment ml-20 fs-12 flex mid center" @click="onPostReply">
              <span>{{ $t('2') }}</span>
              <Loading v-if="isProcessing" class="ml-10 sm" style="width: 20px; height: 20px;" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/crowdsourcing-message.json'
import ImportFile from '@@/../components/input/ImportFile.vue'
import Download from '@@/../components/icons/Download.vue'
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import AngleDoubleUp from '@@/../components/icons/AngleDoubleUp.vue'
import Reply from '@@/../components/icons/Reply.vue'
import Loading from '@@/../components/icons/Loading.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ImportFile,
    Download,
    AngleDoubleDown,
    AngleDoubleUp,
    Reply,
    Loading,
  },
  props: {
    content: {
      type: Object,
      default() {
        return {}
      },
    },
    contentType: {
      type: String,
      default: '',
    },
    theirMsg: {
      type: Boolean,
      default: null,
    },
    downloadLink: {
      type: String,
      default: null,
    },
    replyEnable: {
      type: [Number, Boolean],
      default: null,
    },
    statusEnable: {
      type: Boolean,
      default: null,
    },
    userId: {
      type: Number,
      default: 0,
    },
    isProcessing: {
      type: Boolean,
      default: null,
    },
    imgUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      onReplyShow: false,
      replyFile: null,
      onExpand: false,
    }
  },
  methods: {
    onClickReply() {
      this.onReplyShow = !this.onReplyShow
    },
    fileChanged(_file) {
      this.$emit('input', _file)
    },
    onPostReply() {
      let content = $('#reply-box' + this.content.id).val()
      this.$emit('reply', this.content.id, content)
    },
    changeStatus() {
      this.$emit('changestatus')
    },
    onClickExpand() {
      this.onExpand = !this.onExpand
    },
    replyDownloadLink(item) {
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
        return `${process.env.GOGO_URL}/file/crowdsourcing/comments/${item.id}`
      }
    },
    fileAccept() {
      if (this.contentType === 'crowdsourcing') {
        return '.zip, .mq4, .ex4, .pdf, .jpeg, .jpg, .png, .gif'
      } else {
        return '.zip, .rar, .lzh'
      }
    },
    clearContent() {
      $('#reply-box' + this.content.id).val('')
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  background: #f3f3f3;
  &.row-reverse {
    flex-direction: row-reverse;
  }
  .border-radius-5 {
    border-radius: 5px;
  }
  .border-all {
    border: 1px solid #b4b5b6;
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
        border-right: 20px solid #b4b5b6;
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
        border-left: 20px solid #b4b5b6;
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
}
.date-cls {
  color: #a1a1a1;
}
.pre-line {
  white-space: pre-line;
  word-break: break-all;
}
.btn-comment {
  background: #9c3;
  color: white;
  border-radius: 5px;
  align-self: center;
  border: none;
  width: 120px;
  height: 35px;
}
.fs-10 {
  font-size: 11px;
  height: 35px !important;
  /deep/ .upload-area {
    font-size: 11px;
  }
}
.reply-button {
  color: #9c3;
}
.un-public {
  background-color: #cda6fc;
}
.h-18 {
  height: 18px;
}
.bg-co-59 {
  background: #ededed;
}
.co-31 {
  color: #73cdd6;
}
.co-61 {
  color: #003567;
}
.icon-cls {
  width: 20px;
  height: 20px;
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