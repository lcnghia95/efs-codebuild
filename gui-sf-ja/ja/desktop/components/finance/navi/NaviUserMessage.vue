<template>
  <div class="mb-20 comment">
    <div class="flex p-20">
      <a class="cursor-pointer" :href="'/users/' + message.userId">
        <Lzimg :data-src="'/img/users/' + message.userId + '/tiny'" alt="" class="shadow" />
      </a>
      <div class="ml-20 w-full">
        <div class="flex space-between mid fs-12">
          <a class="cursor-pointer mr-10" :href="'/users/' + message.userId">{{ message.userName }}</a>
          <div class="flex mid">
            <span class="date-time">{{ formatTime(message.publishedDate, 6) }}</span>
            <a class="ml-10 cursor-pointer" v-if="!theirMsg" @click="onDeleteTopic(message.id)">x</a>
          </div>
        </div>
        <div class="flex p-10" v-if="message.isUploadedImages || message.fxonImgUrl">
          <img v-for="(number,index) in (message.fxonImgUrl || message.isUploadedImages)" :src="buildSrc(number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" >
        </div>
        <div class="w-full pre-line mt-10 text-left" v-html="message.content"/>
      </div>
    </div>
    <div class="panel-group mb-0" v-if="!disableReply">
      <div :id="'replies-detail' + message.id" class="panel-collapse collapse fs-13">
        <div class="panel-body">
          <div v-for="item in message.replies" class="flex contend-end mb-20 message fs-12 row-reverse" :key="item.id">
            <a :href="'/users/'+ item.userId" class="ml-20">
              <img :src="'/img/users/' + item.userId" class="shadow" width="60" height="60" alt="">
            </a>
            <div class="mb-0 content-wrapper border-all border-radius-5 grow0 p-10">
              <div class="flex space-between">
                <span>{{ item.userName }}</span>
                <div class="flex mid">
                  <span class="date-cls fs-12">{{ formatTime(item.publishedDate, 6) }}</span>
                  <a class="ml-10 cursor-pointer" v-if="item.userId === userId" @click="innerDeleteReply(item.id)">x</a>
                </div>
              </div>
              <div class="mt-10 pre-line text-left" v-html="item.content"/>
            </div>
          </div>
          <div class="flex space-between fs-12">
            <textarea class="w-full resize-vertical" rows="1" :placeholder="$t('2')" v-model="replyContent" />
            <button class="btn-reply ml-20" @click="onPostReply">{{ $t('3') }}</button>
          </div>
        </div>
      </div>
      <div class="pl-10 pr-10 pt-5 pb-5">
        <h4 class="panel-title">
          <a data-toggle="collapse" :href="'#replies-detail' + message.id" class="no-underlying fs-12 flex mid" @click="onClickExpand">
            <b>{{ $t('1').replace('%s', (message.replies || []).length) }} </b>&nbsp;
            <AngleDoubleDown v-if="!onExpand" class="expand-icon"/>
            <AngleDoubleUp v-if="onExpand" class="expand-icon"/>
          </a>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-community.json'
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import AngleDoubleUp from '@@/../components/icons/AngleDoubleUp.vue'
import { gotoLogin } from '@/utils/client/common'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  components: {
    AngleDoubleDown,
    AngleDoubleUp,
    Lzimg,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    productId: [Number, String],
    message: {
      type: Object,
      default: () => {
        return {}
      },
    },
    disableReply: Boolean,
    onDeleteTopic: Function,
    onDeleteReply: {
      type: Function,
    },
  },
  data() {
    return {
      onExpand: false,
      replyContent: null,
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
    buildSrc(number) {
      if (typeof number == 'string') {
        return number
      }
      if (this.message.id) {
        return '/img/communities/' + this.message.id + '/' + number
      }
      return number
    },
    onClickExpand() {
      this.onExpand = !this.onExpand
    },
    innerDeleteReply(id) {
      this.message.replies = this.message.replies.filter(item => {
        return item.id !== id
      })
      this.onDeleteReply(id)
    },
    onPostReply() {
      if (!this.replyContent) {
        return
      }
      if (!this.$store.state.user.id) {
        gotoLogin()
        return
      }
      this.processing = true
      this.GoGoHTTP.post('/api/v3/surface/communities', {
        productId: this.productId,
        content: this.replyContent,
        isTopic: 0,
        topicId: this.message.id,
      })
        .then(data => {
          if (data.id) {
            if (!this.message.replies) {
              this.$set(this.message, 'replies', [])
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
            })
            this.replyContent = '' // reset reply content
            this.$emit('posted')
          }
        })
        .finally(() => {
          this.processing = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.comment {
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  img {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
  }
  a {
    color: #666;
  }
  .list-icon {
    color: #ccc;
    .icon {
      margin-right: 5px;
      width: 18px;
      height: 18px;
    }
  }
  .date-time {
    color: #b2b2b2;
  }
  .pre-line {
    white-space: pre-line;
    font-size: 12px;
    color: #2d2d2d;
    letter-spacing: 1px;
  }
  .panel-group {
    background: #f7f5f2;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 10px;
    textarea {
      height: 30px;
      padding: 5px;
      &::placeholder {
        font-size: 12px;
        color: #b2b2b2;
      }
    }
    .btn-reply {
      border: none;
      background: #b0b0b0;
      height: 30px;
      width: 120px;
      border-radius: 5px;
      color: white;
    }
    .expand-icon {
      width: 16px;
      height: 16px;
    }
    .content-wrapper {
      background: white;
    }
  }
}
</style>
