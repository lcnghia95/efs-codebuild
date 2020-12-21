<template>
  <div class="p-10 bg-white ctn">
    <div 
      class="msg-header-02"
      @click="onConfirmChange"
      :class="{private: msg.secretUser}"
      v-if="userId === (msg.user || {}).id"
    >
      <Loading style="height: 40px;" v-if="isLoading" />
      <template v-else>{{ $t(msg.secretUser ? 1 : 5) }}</template>
    </div>
    <div class="msg" :class="{seft: userId === (msg.user || {}).id}">
      {{ msg.content }}
    </div>
    <div class="msg-info flex space-between">
      <div class="wrap-text" style="max-width: 50%; white-space: nowrap;">{{ (msg.user || {}).name }}</div>
      <div class="wrap-text" style="max-width: 50%; white-space: nowrap;">{{ formatTime(msg.publishedDate, 6) }}</div>
    </div>
    <div class="reply-num" @click="onClickExpand">
      <span class="bg-white pr-10 pl-10" style="color: #0066c0;">
        <span>{{ $t(4, {n: (msg.replies || {}).length || 0}) }}</span>
        <AngleDown v-if="!onExpand || !(msg.replies || {}).length" /><AngleUp v-else />
      </span>
    </div>
    <div class="panel-collapse collapse" ref="collapse">
      <template v-for="(reply, key) in msg.replies">
        <div 
          class="msg" 
          :class="{seft: userId === (reply.user || {}).id}"
          :key="key"
        >
          {{ reply.content }}
        </div>
        <div class="msg-info flex space-between" :key="key+'rp'">
          <div class="wrap-text">{{ (reply.user || {}).name }}</div>
          <div class="wrap-text">{{ formatTime(msg.publishedDate, 6) }}</div>
        </div>
      </template>
    </div>
    <textarea 
      :placeholder="$t(3)"
      class="msg-input"
      v-model="content"
      maxlength="2000"
      :disabled="isPostingReply"
    ></textarea>
    <div class="submit-btn mt-10" @click="handleSubmit">
      <template v-if="!isPostingReply">{{ $t(2) }}</template>
      <Loading style="height: 40px;" v-else />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowd-msg.json'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import Loading from '@@/../components/icons/Loading.vue'

export default {
  components: { Loading, AngleUp, AngleDown },
  i18n: {
    messages: i18n,
  },
  props: {
    msg: {
      type: Object,
      default: ()=>({})
    },
    onReply: {
      type: Function,
      default: ()=>{},
    }
  },
  data() {
    return {
      userId: parseInt(this.$store.state.user.id),
      content: '',
      isPostingReply: false,
      onExpand: false,
      isLoading: false,
    }
  },
  mounted() {
    this.$nuxt.$on('isLoading', (obj)=> {
      if(obj.id == this.msg.id) {
        this.isLoading = obj.value
      }
    })
  },
  methods: {
    handleSubmit() {
      if(this.isPostingReply) {
        return
      }
      let content = this.content,
        id = this.msg.id,
        crowdId = this.msg.crowdId
      if(!content) {
        return
      }
      this.isPostingReply = true
      this.GoGoHTTP.post('/api/v3/surface/crowdsourcing/comments?isGetId=1', {
        crowdsourcingId: crowdId,
        replyId: id,
        comment: {content},
      }).then(() => {
        this.isPostingReply = false
        this.content = ''
        this.$nuxt.$emit('refresh')
      })
    },
    onConfirmChange() {
      if(this.isLoading) {
        return
      }
      let msgChange = {
        id: this.msg.id,
        secretUser: !this.msg.secretUser,
      }
      this.$nuxt.$emit('onConfirmChange', msgChange)
    },
    onClickExpand() {
      this.onExpand = !this.onExpand
      if(this.onExpand) {
        $(this.$refs.collapse).delay(5000).collapse('show')
      } else {
        $(this.$refs.collapse).delay(5000).collapse('hide')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 320px) {
  .msg-info {
    font-size: 9px;
  }
}
.ctn {
  border-radius: 5px;
}
.msg {
  width: 90%;
  min-height: 60px;
  background: #e8e5e3;
  padding: 15px;
  border-radius: 15px;
  position: relative;
  word-break: break-all;
  margin-top: 15px;
  &:nth-child(1) {
    margin-top: 0;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5px;
    width: 0;
    height: 0;
    border: 30px solid transparent;
    border-top-color: #e8e5e3;
    border-bottom: 0;
    border-left: 0;
    margin-bottom: -23px;
    transform: rotate(25deg);
  }
  &.seft {
    margin-left: auto;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 15px;
      left: unset;
      width: 0;
      height: 0;
      border: 35px solid transparent;
      border-top-color: #e8e5e3;
      border-bottom: 0;
      border-right: 0;
      margin-bottom: -23px;
      transform: rotate(-25deg);
    }
    + .msg-info {
      text-align: right;
      margin-top: 5px;
      margin-left: auto;
      padding: 0 40px 0 0;
      margin-right: 0;
    }
  }
}
.msg-info {
  width: 88%;
  margin-right: auto;
  padding: 0 0 0 40px;
  color: #b2b2b2;
}
.msg-input {
  width: 100%;
  margin-top: 20px;
  border: 1px solid #e0dedc;
  color: #2d2d2d;
  border-radius: 5px;
  height: 110px;
  resize: none;
  padding: 10px;
}
.submit-btn {
  background: #9c3;
  height: 40px;
  width: 110px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
  margin-left: auto;
  &:active {
    transform: translateY(5px);
  }
  /deep/ .loader::before {
    width: 20px;
    height: 20px;
    position: absolute;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
  }
}
.reply-num {
  text-align: center;
  border-bottom: 1px solid;
  line-height: 0;
  margin: 20px 0;
  height: 6px;
  .icon-cls {
    height: 11px;
    width: 13px;
  }
}
.msg-header-02 {
  height: 40px;
  background: #9c3;
  color: #fff;
  line-height: 40px;
  padding: 0 10px;
  text-align: right;
  margin: -10px -10px 20px -10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-decoration: underline;
  /deep/ .loader::before {
    width: 20px;
    height: 20px;
    position: absolute;
    left: calc(100% - 20px);
    top: calc(50% - 10px);
  }
  &.private {
    background: #bfbfbf;
  }
}
</style>