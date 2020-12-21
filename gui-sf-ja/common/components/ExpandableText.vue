<template>
  <div class="exp-container flex layout-col">
    <div class="txt-content w-full flex space-between">
      <img v-if="this.img" class="left-img" />
      <div class="exp-txt m-5" ref="content" v-wrap-lines="isExpanded ? -1 : this.minLines">{{ this.text }}</div>
    </div>
    <button v-if="showExpButton" class="expend-btn flex mid center" @click="onClickExpand">
      <span :class="!isExpanded ? arrowDown : arrowUp" aria-hidden="true"></span>
      {{ isExpanded ? '折りたたむ' : '全表示' }}
    </button>
    <!-- <button v-if="showExpButton" class="expend-btn flex mid center" @click="onClickExpand">
      {{ isExpanded ? $t(2) : $t(1) }}
    </button> -->
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/navi-expand-text.json'

export default {
  props: {
    img: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: '',
    },
    minLines: {
      type: Number,
      default: 3,
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isExpanded: false,
      showExpButton: false,
      arrowDown: 'glyphicon glyphicon-menu-down',
      arrowUp: 'glyphicon glyphicon-menu-up'
    }
  },
  methods: {
    onClickExpand() {
      this.isExpanded = !this.isExpanded
    },
  },
  mounted() {
    this.showExpButton = $(this.$refs.content).hasClass('ddd-truncated')
  },
}
</script>
<style>
.exp-container {
  font-size: 16px;
  color: #2d2d2d;
}
.exp-txt {
  line-height: 1.7;
}
.expend-btn {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  height: 37px;
  outline: none;
  border: 0.6762871742248535px solid #2C2C2C;
  border-radius: 20px;
  margin-top: 10px;
  font-size: 14px;
}
</style>

