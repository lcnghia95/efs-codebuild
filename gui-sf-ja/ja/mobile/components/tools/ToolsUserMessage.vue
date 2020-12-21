<template>
  <div>
    <div class="message p-10">
      <div class="flex mid space-between mb-10">
        <div class="flex mid top-message">
          <div class="mr-10">{{ $t('3') }}</div>
          <div class="flex mid">
            <ThumbsUp class="like cursor-pointer" :class="{ 'active': message.likeType === 1 }" />
            ({{ message.like || 0 }})
          </div>
          <div class="flex mid ml-5">
            <ThumbsDown class="ml-10 mt-5 dislike cursor-pointer" :class="{ 'active': message.likeType === 2 }" />
            ({{ message.dislike || 0 }})
          </div>
          <div v-if="message.buyer === 1 || parseInt(buyer) === 1" class="buyer-content text-center">{{ $t('1') }}</div>
        </div>
        <a class="ml-10 cursor-pointer" v-if="!theirMsg" @click="onDeleteTopic(message.id)">x</a>
      </div>
      <div class="flex" v-if="message.isUploadedImages || message.fxonImgUrl">
        <img v-for="(number,index) in (this.message.fxonImgUrl || message.isUploadedImages)" :src="buildSrc(number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" />
      </div>
      <div class="mt-10 pre-line text-left" v-html="message.content" @click="onShowModal(message.id)"></div>
    </div>
    <div class="flex mid date-cls">
      <span>{{ message.userName }}</span>
      <span class="fs-12 ml-10">{{ formatTime(message.publishedDate, 6) }}</span>
    </div>
    <div class="panel-group mb-0" v-if="!disableReply">
      <div :id="'replies-detail' + message.id" class="panel-collapse collapse mt-10">
        <div class="panel-body">
          <div v-for="item in message.replies" class="mb-20 reply" :key="'commu-'+item.id" :id="'commu-'+item.id">
            <div class="message">
              <div class="flex mid content-end pr-10">
                <a class="ml-10 cursor-pointer" v-if="item.userId === userId" @click="onDeleteReply(item.id)">x</a>
              </div>
              <!-- <div class="flex mid top-message" @click="onShowModal(item.id, message.id)">
                <div class="flex mid">
                  <ThumbsUp class="like cursor-pointer" :class="{ 'active': item.likeType === 1 }"/>
                  ({{ item.like || 0 }})
                </div>
                <div class="flex mid ml-5">
                  <ThumbsDown class="ml-15 mt-5 dislike cursor-pointer" :class="{ 'active': item.likeType === 2 }"/>
                  ({{ item.dislike || 0 }})
                </div>
                <div v-if="item.buyer === 1 || parseInt(buyer) === 1" class="buyer-content text-center mr-10">{{ $t('1') }}</div>
              </div> -->
              <div class="flex p-10" v-if="item.isUploadedImages || item.fxonImgUrl">
                <img v-for="(number,index) in (item.fxonImgUrl || item.isUploadedImages)" :src="buildSrcItem(item.id, number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" />
              </div>
              <div class="pre-line text-left p-10" v-html="item.content"></div>
            </div>
            <div class="flex mid date-cls">
              <span>{{ item.userName }}</span>
              <span class="fs-12 ml-10">{{ formatTime(item.publishedDate, 6) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="(message.replies || []).length">
        <h4 class="panel-title flex mid content-end">
          <a data-toggle="collapse" :href="'#replies-detail' + message.id" class="no-underlying fs-12 flex mid" @click="onClickExpand">
            <span>{{ $t('2') }}&nbsp;({{ (message.replies || []).length }})</span>
            <AngleDoubleDown v-if="!onExpand" class="expand-icon" />
            <AngleDoubleUp v-if="onExpand" class="expand-icon" />
          </a>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/systemtrade-usermessage.json'
// import ClockO from '@@/../components/icons/ClockO.vue'
// import GogoLink from '@@/../components/link/GogoLink.vue'
import ThumbsUp from '@@/../components/icons/ThumbsUp.vue'
import ThumbsDown from '@@/../components/icons/ThumbsDown.vue'
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import AngleDoubleUp from '@@/../components/icons/AngleDoubleUp.vue'
export default {
  components: {
    // ClockO,
    // GogoLink,
    ThumbsUp,
    ThumbsDown,
    AngleDoubleDown,
    AngleDoubleUp,
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
      default: () => {},
    },
    onDeleteReply: {
      type: Function,
      default: () => {},
    },
    onShowModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      onExpand: false,
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
    buildSrcItem(id, number) {
      if (typeof number == 'string') {
        return number
      }
      if (id) {
        return '/img/communities/' + id + '/' + number
      }
      return number
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
    innerDeleteReply(id) {
      this.message.replies = this.message.replies.filter(item => {
        return item.id !== id
      })
      this.onDeleteReply(id)
    },
  },
}
</script>
<style lang="scss" scoped>
.message {
  background: #e8e5e3;
  border-radius: 10px;
  color: #434343;
}
.reply {
  width: 85%;
  float: right;
}
.date-cls {
  color: #929292;
}
.border-radius-5 {
  border-radius: 5px;
}
.pre-line {
  white-space: pre-line;
  font-size: 12px;
  line-height: 1.5;
  max-width: 100%;
  overflow-wrap: break-word;
}
.expand-icon {
  width: 16px;
  height: 16px;
}
.buyer-content {
  height: 20px;
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
.panel-body {
  padding: 0;
}
.img-content {
  width: 30%;
  height: 30%;
}
</style>
