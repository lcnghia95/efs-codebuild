<template>
  <div class="p-15" style="background: #f3f0ef;">
    <div class="flex layout-col" style="flex-direction: column-reverse;">
      <CrowdMessage 
        v-for="(message, index) in messagesShow"
        class="mb-25"
        :key="index"
        :msg="{...message, crowdId}"
      />
    </div>
    <div class="comment-box">        
      <textarea :placeholder="$t(6)" v-model="comment" :disabled="isPostingComment" maxlength="2000"></textarea>
      <label for="secrectCheckbox" class="mt-5 pos-rel">
        <input 
          id="secrectCheckbox"
          name="secrectCheckbox"
          type="checkbox" 
          class="bid-checkbox"
          v-model="isPrivate"
        />
        <span class="fake-cb"></span>
        {{ $t(7) }}
      </label>
      <div style="color: red;" class="mb-10" v-html="$t(8)"></div>
      <div class="submid-btn" @click="onPostComment">
        <template v-if="!isPostingComment">{{ $t(9) }}</template>
        <Loading style="height: 40px;" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowd-msg.json'
import CrowdMessage from '@/components/crowdsourcing/detail/CrowdMessage.vue'
import Loading from '@@/../components/icons/Loading.vue'

export default {
  components: {
    CrowdMessage,
    Loading,
  },
  props: {
    messagesInit: {
      type: Object,
      default() { return {}}
    }
  },
  data() {
    return {
      crowdId: this.$route.params.id,
      messages: this.messagesInit,
      messagesShow: [],
      comment: '',
      isPostingComment: false,
      isPrivate: false,
    }
  },
  i18n: {
    messages: i18n,
  },
  mounted() {
    this.$nuxt.$on('onConfirmChange', this.onConfirmChange)
    this.$nuxt.$on('refresh', this.getData)
    this.calcMessagesShow()
  },
  methods: {
    calcMessagesShow() {
      let { messages } = this
      this.messagesShow = Object.values(messages || {})
                                .sort((date1, date2) => date1.publishedDate <= date2.publishedDate ? 1 : -1)
    },
    getData() {
      return this.GoGoHTTP.get('/api/v3/surface/crowdsourcing/comments', { params: { cId: this.crowdId } }).then(messages => {
        this.messages = messages
        this.calcMessagesShow()
        this.isPostingComment = false
      })
    },
    onPostComment() {
      if(!this.comment || this.isPostingComment) {
        return
      }
      this.isPostingComment = true
      this.GoGoHTTP.post('/api/v3/surface/crowdsourcing/comments?isGetId=1', {
        crowdsourcingId: this.crowdId,
        comment: { content: this.comment },
        isPrivate: this.isPrivate ? this.isPrivate : undefined,
      }).then(()=>{
        this.comment = ''
        this.isPrivate = false
        this.getData()
      })
    },
    async onConfirmChange(msgChange) {
      this.$nuxt.$emit('isLoading', { value: true, id: msgChange.id})
      await this.GoGoHTTP.put( '/api/v3/surface/crowdsourcing/comments/' + msgChange.id, msgChange )
      await this.getData()
      this.$nuxt.$emit('isLoading', { value: false, id: msgChange.id})
    },
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  margin: 0 -15px -15px -15px;
  padding: 0 10px 10px 10px;
  background: #f3f0ef;
  textarea {
    width: 100%;
    margin-top: 5px;
    resize: none;
    height: 90px;
    border: 1px solid #e6e4e2;
    padding: 10px;
    &::placeholder {
      color: #b2b2b2;
    }
  }
  label {
    font-weight: normal;
  }
  input {
    opacity: 0;
    &:checked ~ .fake-cb::after {
      opacity: 1;
    }
  }
  .fake-cb {
    position: absolute;
    top: calc(50% - 7px);
    left: 0;
    height: 12px;
    width: 12px;
    background-color: #f3f0ef;
    box-shadow: 0 0 0 1px #959595;
    &::after {
      content: "";
      position: absolute;
      opacity: 0;
      left: 7px;
      top: -7px;
      width: 6px;
      height: 17px;
      border: solid #a6a5a5;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
      transition: opacity 0.3s ease;
    }
  }
  .submid-btn {
    width: 200px;
    height: 40px;
    background: #9c3;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin: 15px auto;
    /deep/ .loader::before {
      width: 20px;
      height: 20px;
      position: absolute;
      left: calc(50% - 10px);
      top: calc(50% - 10px);
    }
  }
}
</style>