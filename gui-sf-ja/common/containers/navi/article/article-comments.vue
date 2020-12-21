<template>
  <div class="article-comments flex layout-col">
    <span class="comment-summary pl-5 mt-25">
      {{ t(12) }} {{ totalThreads ? `(${totalThreads})` : '' }}
    </span>
    <!--  Threads List  -->
    <div
      class="pl-5 pr-5 inline-flex mt-20"
      v-for="thread in threads"
      :key="thread.id"
    >
      <img class="avatar" :src="`/img/users/${thread.userId}`" alt="" />
      <div class="flex layout-col ml-10" style="flex: 1">
        <div class="flex space-between">
          <a
            class="user-name"
            :href="`//users/${thread.userId}`"
            v-wrap-lines="1"
          >
            {{ thread.userName }}
          </a>
          <div class="inline-flex mid">
            <div class="date flex mid">
              {{ formatTime(thread.publishedDate, 6) }}
            </div>
            <div
              class="delete-icon ml-5"
              v-if="$store.state.user.id == thread.userId"
              @click="deleteThread(thread)"
            >
              &times;
            </div>
          </div>
        </div>
        <p class="comment" v-html="urlify(thread.content)"></p>
        <div
          class="reply"
          aria-expanded="false"
          :aria-controls="`thread-${thread.id}`"
          @click="handleCollapseThreads(thread.id)"
        >
          {{ thread.replies && thread.replies.length ? thread.replies.length : '' }}{{ t(25) }}&nbsp;
          <AngleDoubleDown
            v-if="!arrowManager[`thread-${thread.id}`]"
            style="width: 14px"
          />
          <AngleDoubleUp v-else style="width: 14px" />
        </div>
        <div class="collapse" :id="`thread-${thread.id}`">
          <div class="flex layout-col thread-reply-bg">
            <div
              class="reply-message inline-flex p-10"
              v-for="reply in thread.replies || []"
              :key="reply.id"
            >
              <img class="avatar" :src="`/img/users/${reply.userId}`" alt="" />
              <div class="flex layout-col ml-10" style="flex: 1">
                <div class="flex space-between">
                  <a
                    class="user-name"
                    :href="`/users/${reply.userId}`"
                    v-wrap-lines="1"
                  >
                    {{ reply.userName }}
                  </a>
                  <div class="inline-flex mid">
                    <div class="date flex mid">
                      {{ formatTime(reply.publishedDate, 6) }}
                    </div>
                    <div
                      class="delete-icon ml-5"
                      v-if="$store.state.user.id == thread.userId"
                      @click="deleteReplyThread(thread, reply)"
                    >
                      &times;
                    </div>
                  </div>
                </div>
                <p class="comment" v-html="urlify(reply.content)"></p>
              </div>
            </div>
            <div
              v-if="thread.replies && thread.replies.length && $store.state.user.id"
              style="border-top: 1px solid #d8d8d8; height: 1px"
              class="ml-10 mr-10 mt-5 mb-5"
            ></div>
            <!-- input comment in thread -->
            <div
              class="comment-input flex layout-col p-10"
              v-if="$store.state.user.id"
            >
              <div class="inline-flex">
                <img
                  class="avatar"
                  :src="`/img/users/${$store.state.user.id}`"
                  alt=""
                />
                <textarea
                  :name="`thread-${thread.id}`"
                  class="chat-input ml-10"
                  rows="3"
                  maxlength="255"
                  style="resize: vertical"
                ></textarea>
              </div>
              <button class="add-comment mt-5" @click="createReply(thread)">
                {{ t(24) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  New threads  -->
    <div
      class="new-thread comment-input flex layout-col p-10 mt-20"
      v-if="$store.state.user.id"
    >
      <div class="inline-flex">
        <img
          class="avatar"
          :src="`/img/users/${$store.state.user.id}`"
          alt=""
        />
        <textarea
          ref="newThreadInput"
          class="chat-input ml-10"
          rows="3"
          maxlength="255"
          style="resize: vertical"
        ></textarea>
      </div>
      <button
        class="add-comment mt-5 inline-flex"
        @click="createThread"
        :disabled="isCreatingThread"
      >
        <span v-if="!isCreatingThread">{{ t(24) }}</span><Loading v-if="isCreatingThread" class="ml-10" />
      </button>
    </div>
    <div
      v-else
      class="flex center mid mt-20 pb-20 pt-20 lock-comment-container"
    >
      <a class="flex mid center" :href="`/login?u=${$route.fullPath}`">
        {{ t(13) }}
      </a>
    </div>
    <GogoModal
      :show="showModalConfirmDeleteMessage"
      @update:show="val => (showModalConfirmDeleteMessage = val)"
      :width="300"
      :height="120"
      small
    >
      <div slot="modal-header"></div>
      <div
        slot="modal-body"
        class="p-20 flex layout-col body-confirm-delete-modal"
      >
        <div v-html="t(14)"></div>
        <div class="inline-flex center-content actions mt-20">
          <button @click="handleDeleteMessage">{{ t(16) }}</button>
          <button @click="showModalConfirmDeleteMessage = false" class="ml-10">
            {{ t(15) }}
          </button>
        </div>
      </div>
      <div slot="modal-footer" class="flex center"></div>
    </GogoModal>
  </div>
</template>
<script>
import { urlify, t } from "@@/../common/assets/js/helper"
import AngleDoubleDown from "@@/../components/icons/AngleDoubleDown"
import AngleDoubleUp from "@@/../components/icons/AngleDoubleUp"
import Loading from "@@/../components/icons/Loading.vue"
import GogoModal from "@@/../components/modals/GogoModal.vue"

export default {
  name: "ArticleComments",
  components: { AngleDoubleUp, AngleDoubleDown, Loading, GogoModal },
  data: () => ({
    threads: [],
    totalThreads: 0,
    totalComments: 0,
    arrowManager: {},
    isCreatingThread: false,
    showModalConfirmDeleteMessage: false,
    isDeleteReply: false,
    replyMessageWillBeRemoved: null,
    threadWillBeRemoved: null,
    threadHasRemovedReply: null
  }),
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    }
  },
  mounted() {
    this.GoGoHTTP.get(
      `/api/v3/surface/communities?productId=${this.article.productId ||
        this.article.seriesProductId}`
    ).then(response => {
      this.threads = this.sortArray(response.comments) || []
      this.threads.forEach(thr => (thr.replies = this.sortArray(thr.replies)))
      this.totalComments = response.total
      this.totalThreads = response.topic
    })
  },
  methods: {
    t,
    urlify,
    handleCollapseThreads(threadId) {
      const elementId = `thread-${threadId}`
      if (this.arrowManager[elementId] === undefined)
        this.arrowManager[elementId] = 0

      if (this.arrowManager[elementId]) $(`#${elementId}`).collapse("hide")
      else $(`#${elementId}`).collapse("show")

      this.arrowManager = {
        ...this.arrowManager,
        [elementId]: 1 - this.arrowManager[elementId]
      }
    },
    async createThread() {
      if (!this.$refs.newThreadInput.value.trim()) return
      this.isCreatingThread = true
      const newCreatedThread = await this.GoGoHTTP.post(
        "/api/v3/surface/communities",
        {
          productId: this.article.productId || this.article.seriesProductId,
          isTopic: 1,
          content: this.$refs.newThreadInput.value.trim()
        }
      )

      this.totalThreads++
      this.threads.push({
        content: this.$refs.newThreadInput.value,
        id: newCreatedThread.id,
        publishedDate: new Date().getTime() / 1000,
        userId: this.$store.state.user.id,
        userName: this.$store.state.user.name,
        replies: []
      })
      this.$refs.newThreadInput.value = ""
      this.isCreatingThread = false
    },
    async createReply(thread) {
      const content = document.querySelector(
        `textarea[name=thread-${thread.id}]`
      )
      if (!content || !content.value.trim()) return

      const newReply = await this.GoGoHTTP.post("/api/v3/surface/communities", {
        productId: this.article.productId || this.article.seriesProductId,
        content: content.value.trim(),
        isTopic: 0,
        topicId: thread.id
      })
      this.threads.forEach(thr => {
        if (thr.id === thread.id) {
          thr.replies.push({
            content: content.value.trim(),
            id: newReply.id,
            publishedDate: moment()
              .utc()
              .unix(),
            topicId: thread.id,
            userId: this.$store.state.user.id,
            userName: this.$store.state.user.name
          })
        }
      })
      content.value = ""
    },
    sortArray(array = []) {
      if (!array.length) return array
      return array.sort((a, b) => a.publishedDate - b.publishedDate)
    },
    deleteReplyThread(thread, reply) {
      this.showModalConfirmDeleteMessage = true
      this.isDeleteReply = true
      this.replyMessageWillBeRemoved = reply
      this.threadHasRemovedReply = thread
    },
    async deleteThread(thread) {
      this.showModalConfirmDeleteMessage = true
      this.threadWillBeRemoved = thread
    },
    async handleDeleteMessage() {
      const removedId = this.isDeleteReply
        ? this.replyMessageWillBeRemoved.id
        : this.threadWillBeRemoved.id
      await this.GoGoHTTP.delete(`/api/v3/surface/communities/${removedId}`)
      this.showModalConfirmDeleteMessage = false
      if (this.isDeleteReply) {
        this.isDeleteReply = false
        this.threadHasRemovedReply.replies = this.threadHasRemovedReply.replies.filter(
          reply => reply.id !== removedId
        )
        this.threads.forEach(thr => {
          if (thr.id === this.threadHasRemovedReply.id) {
            thr.replies = thr.replies.filter(
              rp => rp.id !== this.replyMessageWillBeRemoved.id
            )
          }
        })
        return
      }
      this.threads = this.threads.filter(
        thr => thr.id !== this.threadWillBeRemoved.id
      )
    }
  }
}
</script>

<style scoped lang="scss">
.article-comments {
  img.avatar {
    border-radius: 50%;
    width: 37px;
    height: 37px;
  }
  .comment-summary {
    color: #cccccc;
  }
  .user-name {
    font-size: 16px;
    color: #333333;
  }
  .date {
    color: #afafaf;
    font-size: 12px;
  }
  .comment {
    margin-top: 5px;
    color: #606060;
    line-height: 20px;
  }
  .reply {
    cursor: pointer;
    background-color: #f7f5f2;
    color: #606060;
    padding: 10px;
    height: 36px;
    display: inline-flex;
    &:hover {
      background-color: darken(#f7f5f2, 10%);
      transition: background-color 0.5s;
    }
  }
  .thread-reply-bg {
    background-color: #f7f5f2;
  }
  .comment-input {
    width: 100%;
    textarea {
      width: 100%;
      resize: vertical;
      border-radius: 4px;
      border: 1px solid #d8d8d8;
      outline: none;
      padding: 10px;
    }
    .add-comment {
      border-radius: 4px;
      background-color: darken(#afafaf, 10%);
      outline: none;
      align-self: flex-end;
      margin-top: 5px;
      border: none;
      color: white;
      padding: 5px;
      width: 66px;
      height: 27px;
      justify-content: center;
      &:hover {
        background-color: darken(#afafaf, 20%);
        transition: background-color 0.5s;
      }
    }
  }
}
/deep/.add-comment .loader {
  height: 50px;
  &:before {
    width: 16px !important;
    height: 16px !important;
    border: 2px solid #f3f3f3 !important;
    border-top: 2px solid #555 !important;
    left: calc(50% - 13px);
  }
}
.delete-icon {
  //width: 19px;
  //height: 19px;
  //text-align: center;
  //border: 1px solid #afafaf;
  //border-radius: 50%;
  color: #afafaf;
  cursor: pointer;
  &:hover {
    //border: 1px solid darken(#afafaf, 15%);
    border: none;
    color: darken(#afafaf, 30%);
  }
}
.body-confirm-delete-modal {
  .actions {
    button {
      outline: none;
      width: 76px;
      &:hover {
        transition: background-color 0.5s;
      }
      &:first-child {
        background-color: #a94442;
        border: none;
        color: white;
        &:hover {
          background-color: darken(#a94442, 15%);
        }
      }
      &:last-child {
        color: #606060;
        border: 1px solid #606060;
        background-color: white;
        &:hover {
          background-color: #606060;
          color: white;
        }
      }
    }
  }
}
.lock-comment-container {
  background-color: #efefef;
  border: 1px solid #d8d8d8;
  a {
    width: 241px;
    height: 50px;
    background-color: #ff6600;
    border-radius: 5px;
    color: white;
    text-decoration: none;
    &:hover {
      background-color: darken(#ff6600, 10%);
      transition: background-color .5s;
    }
  }
}
</style>
