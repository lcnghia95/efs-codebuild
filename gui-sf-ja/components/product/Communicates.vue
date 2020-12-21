<template>
  <div>
    <div class="communicates flex pt-10 pb-10 space-between cursor-pointer"
       v-for="(item, i) in communicates"
       :class="{'border-bottom-none': i == communicates.length - 1}"
       :key="'commu-' + i"
       @click="handleClick(item)">
      <div class="system-ava">
        <img :src="'/img/users/' + item.userId + '/small'" alt="" >
      </div>
      <div class="p-10 fs-12 talkbubble">
        <div class="flex space-between">
          <b class="user-name wrap-text" :title="item.userName || $t('1')">{{ item.userName || $t('1') }}</b>
          <b>{{ formatTime(item.publishedDate, 1) }}</b>
        </div>
        <div class="mt-10"><p v-wrap-lines="4">{{ item.content }}</p></div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/user-info.json'
export default {
  props: {
    communicates: {
      type: Array,
      default: () => {
        return []
      },
    },
    goCommunity: {
      type: Function,
      default() {},
    },
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    handleClick(item) {
      this.goCommunity(`${item.id},${item.isTopic},${item.topicId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.communicates {
  text-decoration: none;
  &:hover .user-name {
    text-decoration: underline;
  }
}
.user-name {
  width: 55%;
}
.system-ava {
  width: 48px;
  height: 48px;
  img {
    width: 100%;
    height: 100%;
    border: 1px solid #d2d2d2;
  }
}
.talkbubble {
  position: relative;
  width: 235px;
  height: 110px;
  padding: 10px;
  border-radius: 5px;
  border: solid #d2d2d2 1px;
  color: #666;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: -15px;
    top: 16px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-right: 14px solid #d2d2d2;
    border-bottom: 8px solid transparent;
  }
  &::after {
    left: -13px;
    border-right: 14px solid #fff;
  }
}
.talkbubble p {
  margin: 0;
}
.border-bottom-none {
  border-bottom: none;
}
</style>
