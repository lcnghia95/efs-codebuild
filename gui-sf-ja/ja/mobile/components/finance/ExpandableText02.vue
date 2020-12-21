<template>
  <div>
    <div class="flex mb-10" id="ctn">
      <slot></slot>
      <div class="init-content" ref="content" v-wrap-lines="6" v-if="!isExpanded">
        {{ getTextHtml(text) }}
      </div>
    </div>
    <transition name="html-content">
      <div class="html-content mb-10" v-if="isExpanded" v-html="text"></div>
    </transition>
    <button class="btn-exp" v-if="showExpButton" @click="onClickExpand">
      {{ isExpanded ? $t(2) : $t(1) }}
    </button>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/navi-expand-text.json'
import { tagRemoved } from '@/utils/client/common'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isExpanded: false,
      showExpButton: true,
    }
  },
  methods: {
    onClickExpand() {
      this.isExpanded = !this.isExpanded
      $(this.$refs.content).removeClass('init-content')
      if(!this.isExpanded) {
        $('html, body').animate(
          { scrollTop: $('#ctn').offset().top - 100 },
          200
        )
      }
    },
    getTextHtml(content) {
      return tagRemoved(content.replace(/<style.*<\/style>/g, ''))
    },
  },
  mounted() {
    this.showExpButton = $(this.$refs.content).hasClass('ddd-truncated')
  },
}
</script>
<style lang="scss" scoped>
.btn-exp {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  height: 40px;
  width: 100%;
  left: 0;
  outline: none;
}
.init-content {
  max-height: 100px;
  overflow: hidden;
}
.html-content {
  transition: height 0.8s ease;
  /deep/ > * {
    overflow-x: auto;
  }
  /deep/ * {
    max-width: 100% !important;
    img {
      height: auto;
      &.ext-content {
        height: 0 !important;
      }
    }
  }
}

/* animation */
.html-content-enter-active, .html-content-leave-active {
  transition: opacity 0.5s ease;
  transition: max-height 0.5s ease 0.5;
}
.html-content-enter-to {
  opacity: 1;
  max-height: 500000px;
}
.html-content-enter {
  opacity: 0;
  max-height: 0;
}
.html-content-leave-to {
  opacity: 0;
  max-height: 500000px;
}
.html-content-leave {
  opacity: 1;
  max-height: 0;
}
</style>
