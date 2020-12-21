<template>
  <div class="flex p-20">
    <div>
      <a :href="'/users/'+ message.userId">
        <img :src="'/img/users/' + message.userId" class="shadow img-user" width="80" height="80" alt="" />
      </a>
      <div v-if="message.buyer === 1 || parseInt(buyer) === 1" class="buyer-content text-center mt-20"><b>{{ $t('1') }}</b></div>
    </div>
    <div class="w-full ml-30 message-wrapp">
      <div class="flex space-between">
        <a class="user-name" :href="'/users/'+ message.userId">
          {{ message.userName }}
        </a>
        <span v-if="message.userId == userId && message.id" @click="onDelete" class="glyphicon glyphicon-remove cursor-pointer" aria-hidden="true"></span>
      </div>
      <div class="mb-0 border-radius-5 grow0 mt-10">
        <div class="flex" v-if="message.isUploadedImages || this.message.fxonImgUrl">
          <img v-for="(number,index) in (this.message.fxonImgUrl || message.isUploadedImages)" :src="buildSrc(number)" alt="" :key="message.id ? 'message-image-' + message.id + '-' + number : 'message-image'+index" class="img-content mr-10 shadow" />
        </div>
        <div class="pre-line" v-html="message.content"></div>
      </div>
      <div class="flex date-cls mt-15 mb-10">
        <ClockO class="clock-icon" />
        <span class="fs-12 ml-5">{{ formatTime(message.publishedDate, 6) }}</span>
      </div>
      <div class="flex mid" v-if="message.isTopic">
        <div @click="onAction(1)" class="flex mid">
          <ThumbsUp class="like cursor-pointer" :class="{ 'active': actionType === 1 }" />{{ this.message.like || 0 }}
        </div>
        <div @click="onAction(2)" class="flex mid">
          <ThumbsDown class="ml-15 mt-5 dislike cursor-pointer" :class="{ 'active': actionType === 2 }" />{{ this.message.dislike || 0 }}
        </div>
      </div>
    </div>
    <GogoModal :show="isShowModal" :cancel-text="'キャンセル'" :ok-text="'Ok'" @ok="onCallDelete" @update:show="val => isShowModal = val" :width="500" :height="200">
      <div slot="title">
        {{ $t('2') }}
      </div>
      <div slot="modal-body" class="msg-box flex center mid">
        {{ $t('3') }}
      </div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-usermessage.json'
import ClockO from '@@/../components/icons/ClockO.vue'
import ThumbsUp from '@@/../components/icons/ThumbsUp.vue'
import ThumbsDown from '@@/../components/icons/ThumbsDown.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
export default {
  components: {
    ClockO,
    ThumbsUp,
    ThumbsDown,
    GogoModal,
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
    type: {
      type: Number,
      default: 0,
    },
    buyer: [Number, String],
  },
  data() {
    return {
      isShowModal: false,
      actionType: this.message.likeType || null,
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
    isBuyuser() {
      return this.$store.state.user.isBuyuser
    },
  },
  methods: {
    onCallDelete() {
      this.GoGoHTTP.delete(
        `/api/v3/surface/communities/${this.message.id}`
      ).then(() => {
        if (this.type) {
          this.$emit('delete-reply', this.message.id)
        } else {
          this.$emit('delete-topic', this.message.id)
        }
      })
    },
    onDelete() {
      this.isShowModal = true
    },
    onAction(type) {
      // check pre-condition here
      if (!this.actionType) {
        this.GoGoHTTP.put(
          `/api/v3/surface/communities/${this.message.id}/action`,
          {
            type,
          }
        ).then(() => {
          // Increment like/dislike base on new action type
          if (type === 1) {
            this.message.like = (this.message.like || 0) + 1
          } else {
            this.message.dislike = (this.message.dislike || 0) + 1
          }

          // Update current action type
          this.actionType = type
        })
      }
    },
    buildSrc(number) {
      if (typeof number == 'string') {
        // in case url from fx-on, will return raw url
        return number
      }
      if (this.message.id) {
        return '/img/communities/' + this.message.id + '/' + number
      }
      return number
    },
  },
}
</script>
<style lang="scss" scoped>
.date-cls {
  color: #929292;
}
.border-radius-5 {
  border-radius: 5px;
}
.pre-line {
  white-space: pre-line;
  font-size: 16px;
  color: #929292;
  line-height: 1.8;
  letter-spacing: 1px;
}
.clock-icon {
  width: 16px;
  height: 16px;
}
.buyer-content {
  height: 30px;
  line-height: 33px;
  font-size: 18px;
  color: white;
  background: #f6bb42;
  border-radius: 18px;
}
.img-content {
  width: 30%;
  height: 30%;
}
.img-user {
  border-radius: 50%;
}
.user-name {
  color: #2251d1;
  font-size: 22px;
  text-decoration: underline;
  &:hover {
    color: #123aa9;
  }
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
.msg-box {
  height: calc(100% - 105px);
}
</style>

<docs>
  ```vue
  <template>
    <user-message :message="message"/>
  </template>
  <script>
  export default {
    data() {
      return {
        message: {
          "id": 62443,
          "content": "abc",
          "publishedDate": 1533608042,
          "userId": 140003,
          "userName": "テストマン",
          "isTopic": true
        }
      }
    },
  }
  </script>
  ```
</docs>
