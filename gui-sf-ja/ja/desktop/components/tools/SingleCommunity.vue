<template>
  <div>
    <UserMessage :buyer="buyer" @delete-topic="onDeleteTopic" :message="content" class="message" :id="'commu-'+content.id" />
    <div class="panel-group reply-content" v-if="this.commentCount || !isTsukuruProduct(this.$route.params.id)">
      <div :id="'replies-detail' + content.id" class="panel-collapse collapse fs-13">
        <div class="panel-body msg-border-bottom pr-30">
          <div v-for="item in content.replies" :key="item.id">
            <UserMessage :buyer="buyer" @delete-reply="onDeleteReply" :type="1" :message="item" :id="'commu-'+item.id" />
          </div>
          <div class="mt-20 flex content-end" v-if="!isTsukuruProduct(this.$route.params.id)">
            <textarea
              name="replyContent"
              v-validate="{ rules: { required: true } }"
              class="text-area p-20"
              v-model="replyContent"
            ></textarea>
          </div>
          <div style="width: calc(100% - 120px); margin-left: auto;" class="mt-10">
            <ImportFile ref="importFile1" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged1" :index-number="1" />
            <ImportFile ref="importFile2" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged2" :index-number="2" :is-disable="!formData1" />
            <ImportFile ref="importFile3" accept=".jpeg, .jpg, .gif, .png, .bmp" @input="fileChanged3" :index-number="3" :is-disable="!formData2" />
          </div>
          <div
            class="mt-10"
            v-if="errors.first('replyContent')"
            style="color: red; width: calc(100% - 130px); margin-left: auto;"
          >
            {{ $t('replyError') }}
          </div>
          <div class="text-center mt-20" v-if="!isTsukuruProduct(this.$route.params.id)">
            <button class="btn-comment" @click="onPostReply" :disabled="processing">
              <div class="flex mid center">
                <b>{{ $t('1') }}</b>
                <Loading v-if="processing" class="ml-10 sm" style="width: 20px; height: 20px;" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div v-if="panelTitle" class="bg-co-59 pl-20 pr-20 pt-15 pb-15">
        <h4 class="panel-title">
          <a data-toggle="collapse" :href="'#replies-detail' + content.id" class="no-underlying fs-12 flex mid">
            <i class="expand-icon mr-10" :is="onExpand ? 'AngleUp' : 'AngleDown'" />
            <b>{{ onExpand ? $t('3') : commentDisplay }}</b>
          </a>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-singlecommunity.json'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import UserMessage from './UserMessage.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { gotoLogin } from '@/utils/client/common'
import ImportFile from '@@/../components/input/ImportFile.vue'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}
export default {
  components: {
    AngleUp,
    AngleDown,
    UserMessage,
    Loading,
    ImportFile,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    commentCount() {
      return (this.content.replies || []).length
    },
    commentDisplay() {
      if (!this.commentCount) {
        return this.$t('2')
      }
      return this.commentCount + this.$t('4')
    },
  },
  props: {
    content: {
      type: Object,
      default() {
        return {}
      },
    },
    theirMsg: {
      type: Boolean,
      default: null,
    },
    panelTitle: {
      type: Boolean,
      default: true,
    },
    buyer: [Number, String],
  },
  data() {
    return {
      onExpand: false,
      replyContent: null,
      processing: false,
      formData1: null,
      formData2: null,
      formData3: null,
      imgSource: [],
    }
  },
  mounted() {
    // handle collapse event
    $('#replies-detail' + this.content.id).on('hide.bs.collapse', () => {
      this.onExpand = false
    })
    $('#replies-detail' + this.content.id).on('show.bs.collapse', () => {
      this.onExpand = true
    })
  },
  methods: {
    getBase64(file, cb) {
      let reader = new FileReader()
      reader.onloadend = () => {
        cb(reader.result)
      }
      reader.readAsDataURL(file)
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
    onDeleteTopic(id) {
      this.$emit('delete-topic', id)
    },
    onDeleteReply(id) {
      this.content.replies = this.content.replies.filter(item => {
        return item.id !== id
      })
      this.$emit('delete-reply')
    },
    fileChanged(_file) {
      this.$emit('input', _file)
    },
    async onPostReply() {
      const rs = await this.$validator.validateAll()
      if(!rs) {
        return
      }
      if (!this.$store.state.user.id) {
        gotoLogin()
      } else {
        this.processing = true
        this.GoGoHTTP.post('/api/v3/surface/communities', {
          productId: this.$route.params.id,
          content: this.replyContent,
          isTopic: 0,
          topicId: this.content.id,
        })
          .then(async data => {
            if (data.id) {
              if (!this.content.replies) {
                this.$set(this.content, 'replies', [])
              }
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
              this.content.replies.push({
                content: this.replyContent,
                id: data.id,
                publishedDate: moment()
                  .utc()
                  .unix(),
                topicId: this.content.id,
                userId: this.$store.state.user.id,
                userName: this.$store.state.user.name,
                isUploadedImages: isUploadedImages,
              })
              this.replyContent = '' // reset reply content
              this.$emit('posted')
            }
          })
          .finally(() => {
            this.processing = false
          })
      }
    },
    isTsukuruProduct(productId) {
      return [5735, 7560, 5939, 5941, 7561].includes(parseInt(productId))
    },
    // onSubmitLike(cId, type) {
    //   this.GoGoHTTP.post('/api/surface/tools/' + cId + '/good', {
    //     type: type,
    //   }).then(data => {
    //     if (data) {
    //       let el,
    //         el2,
    //         oldNum = 0,
    //         oldNum2 = 0
    //       if (type === 1) {
    //         el = $('#like-' + cId)
    //         el2 = $('#dislike-' + cId)
    //       } else {
    //         el = $('#dislike-' + cId)
    //         el2 = $('#like-' + cId)
    //       }
    //       oldNum = parseInt(el.text())
    //       oldNum2 = parseInt(el2.text())
    //       if (!data.type) {
    //         el.text(oldNum - 1)
    //       } else {
    //         el.text(oldNum + 1)
    //         if (data.id) {
    //           el2.text(oldNum2 - 1)
    //         }
    //       }
    //     }
    //   })
    // },
  },
}
</script>

<style lang="scss" scoped>
.message {
  border: 1px solid #aab2bd;
}
.msg-border-bottom {
  border-bottom: 1px solid #aab2bd;
}
.btn-comment {
  width: 300px;
  height: 40px;
  line-height: 41px;
  background: #f6bb42;
  font-size: 18px;
  color: white;
  border-radius: 4px;
  border: none;
  outline: none;
  &:hover {
    opacity: 0.9;
  }
}
.reply-button {
  color: #9c3;
}
.h-18 {
  height: 18px;
}
.bg-co-59 {
  background: #e6e9ed;
}
.expand-icon {
  width: 18px;
  height: 18px;
  background: #707070;
  color: #e6e9ed;
  border-radius: 50%;
  margin-bottom: 1px;
  /deep/ svg {
    width: 80%;
    margin: 1px auto;
  }
  ~ b {
    font-size: 18px;
    color: #707070;
  }
}
.reply-content {
  border-left: 1px solid #aab2bd;
  border-bottom: 1px solid #aab2bd;
  border-right: 1px solid #aab2bd;
  background: #e6e9ed;
}
.text-area {
  width: calc(100% - 130px);
  height: 300px;
  border: 1px solid #707070;
  resize: none;
  outline: none;
}
</style>

<docs>
  ```vue
  <template>
    <SingleCommunity :content="content"/>
  </template>
  <script>
  export default {
    data() {
      return {
        content: {
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
