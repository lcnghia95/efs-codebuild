<template>
  <div role="dialog" class="modal fade">
    <div class="modal-dialog" :class="{'modal-lg':large, 'modal-sm':small}" role="document"
         :style="{width: optionalWidth}">
      <div class="modal-content" :style="{height: optionalHeight}">
        <slot name="modal-header">
          <div class="modal-header">
            <button type="button" class="close" @click="close(true)"><span>&times;</span></button>
            <h4 class="modal-title">
              <slot name="title">{{ title }}</slot>
            </h4>
          </div>
        </slot>
        <slot name="modal-body">
          <div class="modal-body"/>
        </slot>
        <slot name="modal-footer">
          <div class="modal-footer border-none">
            <button v-if="okText" type="button" class="btn btn-primary" :class="okBtnCls" @click="okClick">{{ $t(okText) }}</button>
            <button v-if="cancelText" type="button" class="btn btn-default" @click="close(false)">{{ $t(cancelText) }}</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components/gogo-modal.json'
function getScrollBarWidth() {
  if (
    document.documentElement.scrollHeight <=
    document.documentElement.clientHeight
  ) {
    return 0
  }
  let inner, outer, w1, w2
  inner = document.createElement('p')
  outer = document.createElement('div')
  inner.style.width = '100%'
  inner.style.height = '200px'

  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  w1 = inner.offsetWidth
  w2 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  w1 === w2 && (w2 = outer.clientWidth)

  document.body.removeChild(outer)

  return w1 - w2
}

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    okText: {
      type: String,
      default: '1',
    },
    cancelText: {
      type: String,
      default: '2',
    },
    title: {
      type: String,
      default: '',
    },
    show: {
      required: true,
      type: Boolean,
    },
    width: {
      default: null,
    },
    height: {
      default: null,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    ignoreCloseAct: Boolean,
    ignoreCloseOk: Boolean,
    okBtnCls: {
      default: null,
    },
  },
  computed: {
    optionalWidth() {
      if (this.width === null) {
        return null
      } else if (Number.isInteger(this.width)) {
        return this.width + 'px'
      }
      return this.width
    },
    optionalHeight() {
      if (!this.height) {
        return '90%'
      } else if (Number.isInteger(this.height)) {
        return this.height + 'px'
      }
      return this.height
    },
  },
  watch: {
    show(val) {
      const el = this.$el
      const body = document.body
      const scrollBarWidth = getScrollBarWidth()

      if (val) {
        $(el)
          .find('.modal-content')
          .focus()
        el.style.display = 'block'
        setTimeout(() => $(el).addClass('in'), 0)
        $(body).addClass('modal-open')
        $(el).css('overflow', 'hidden')
        if (scrollBarWidth !== 0) {
          body.style.paddingRight = scrollBarWidth + 'px'
        }
      } else {
        body.style.paddingRight = null
        let elWrap = $(el)
        $(body).removeClass('modal-open')
        elWrap.removeClass('in').on('transitionend', () => {
          elWrap.off('click transitionend')
          el.style.display = 'none'
        })
        this.$emit('update:show', false)
      }
    },
  },
  methods: {
    close(isClose) {
      this.$emit('close', isClose)
      if (this.ignoreCloseAct && !isClose) {
        return
      }
      this.$emit('update:show', false)
    },
    okClick() {
      this.$emit('ok')
      if (this.ignoreCloseOk) {
        return
      }
      this.$emit('update:show', false)
    },
  },
}
</script>
<style lang="scss" scoped>
.modal {
  transition: all 0.3s ease;
}
.modal.in {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal.zoom .modal-dialog {
  transform: scale(0.1);
  top: 300px;
  opacity: 0;
  transition: all 0.3s;
}
.modal.zoom.in .modal-dialog {
  transform: scale(1) translate3d(0, -300px, 0);
  opacity: 1;
}
.modal-dialog {
  height: 90vh;
  margin: 30px auto;
  overflow: hidden;
  @media only screen and (max-width: 768px),
  only screen
  and (max-width : 896px) 
  and (max-height : 414px) {
    width: auto !important;
  }
}
.modal-header {
  height: 50px;
  background: #f0f0f0;
  border-radius: 5px 5px 0 0;
  .modal-title {
    font-size: 20px;
  }
}
.modal-body {
  height: calc(80vh - 100px);
  overflow-y: auto;
  margin: 10px 0;
}
.modal-footer {
  height: 55px;
  padding: 10px;
  text-align: center;
  background: #f0f0f0;
  border-radius: 0 0 5px 5px;
  button {
    padding: 4px 25px;
    outline: none;
  }
}
.close {
  opacity: 0.3;
  outline: none;
}
</style>
