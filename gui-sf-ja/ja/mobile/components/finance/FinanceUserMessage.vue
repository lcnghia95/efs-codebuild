<template>
  <div>
    <div ref="message" class="message p-10">
      <div class="flex mid space-between mb-10">
        <div class="flex space-between mid top-message">
          <div class="flex">
            <div class="mr-5">{{ $t('3') }}</div>
            <div class="flex mid mr-5">
              <ThumbsUp class="like cursor-pointer" :class="{ 'active': message.likeType === 1 }" />
              ({{ message.like || 0 }})
            </div>
            <div class="flex mid mr-5">
              <ThumbsDown class="dislike cursor-pointer" :class="{ 'active': message.likeType === 2 }" />
              ({{ message.dislike || 0 }})
            </div>
            <div class="flex mid mr-5" v-if="message.buyer === 1 || parseInt(buyer) === 1">
              <div class="buyer-content text-center">{{ $t('1') }}</div>
            </div>
          </div>
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
      <div :id="'replies-detail' + message.id" ref="collapse" class="panel-collapse collapse mt-10">
        <div class="panel-body">
          <div v-for="item in message.replies" class="mb-20 reply" :key="item.id">
            <div class="message">
              <div class="flex mid content-end pr-10">
                <a class="ml-10 cursor-pointer" v-if="item.userId === userId" @click="onDeleteReply(item.id)">x</a>
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
      <div ref="collapse_btn" v-if="(message.replies || []).length">
        <h4 class="panel-title flex mid content-end">
          <div class="no-underlying fs-12 flex mid" @click="onClickExpand">
            <span>{{ $t('2') }}&nbsp;({{ (message.replies || []).length }})</span>
            <AngleDoubleDown v-if="!onExpand" class="expand-icon" />
            <AngleDoubleUp v-if="onExpand" class="expand-icon" />
          </div>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/systemtrade-usermessage.json'
import ThumbsUp from '@@/../components/icons/ThumbsUp.vue'
import ThumbsDown from '@@/../components/icons/ThumbsDown.vue'
import AngleDoubleDown from '@@/../components/icons/AngleDoubleDown.vue'
import AngleDoubleUp from '@@/../components/icons/AngleDoubleUp.vue'
export default {
  components: {
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
  mounted() {
    $(this.$refs.collapse).on('hide.bs.collapse', () => {
      if(!this.$refs.collapse) {
        return
      }
      $([document.documentElement, document.body]).animate({
        scrollTop: $(this.$refs.collapse).offset().top - 150
      }, 1000)
    }).on('shown.bs.collapse', () => {
      if(!this.$refs.collapse) {
        return
      }
      $([document.documentElement, document.body]).animate({
        scrollTop: $(this.$refs.collapse).offset().top - 150
      }, 300)
    })
  },
  methods: {
    onClickExpand() {
      this.onExpand = !this.onExpand
      if(this.onExpand) {
        $(this.$refs.collapse).delay(5000).collapse('show')
      } else {
        $(this.$refs.collapse).delay(5000).collapse('hide')
      }
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
  overflow-wrap: break-word;
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
}
.expand-icon {
  width: 16px;
  height: 16px;
}
.buyer-content {
  height: 20px;
  color: white;
  min-width: 55px;
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
<style>
/* TODO: this is custom fix for collapsing feature, these is some class in boostrap, these css is missing in staging/prodcution env */
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

/* End */
</style>
