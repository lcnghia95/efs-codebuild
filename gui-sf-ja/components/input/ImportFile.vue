<template>
  <div class="draggable-area flex mid p-10" @dragover.prevent @drop.prevent="fileDropped" :class="{'row-reverse space-around': isRowReserver}">
    <label class="btn btn-default upload-area flex mid">
      <FileUpload class="icon-file"/>
      {{ $t('2', {num: indexNumber}) }}
      <input ref="file" type="file" class="upload h-full w-full" :accept="accept" @change="fileChanged" :disabled="isDisable">
    </label>
    <a download class="co-21 ml-5" v-if="downloadUrl" :href="downloadUrl" :title="imgName">{{ imgName }}</a>
    <b v-else class="co-21 img-name" :title="imgName">&nbsp;&nbsp;{{ imgName || $t('1') }}</b>
    <div class="dragging w-full h-full" v-show="isShow"/>
  </div>
</template>
<script>
import {
  createFormDataRequest,
  checkExtension,
  checkImgSize,
  checkImgWH,
} from '@/utils/client/common'
import FileUpload from '@@/../components/icons/FileUpload.vue'
import i18n from '@@/lang/components-desktop/input-importfile.json'

const obj = {
  name: 'ImportFile',
  components: { FileUpload },
  i18n: {
    messages: i18n,
  },
  props: {
    downloadUrl: String,
    filename: String,
    accept: String,
    autoupload: Boolean,
    uploadurl: String,
    maxsize: {
      type: Number,
      default: 10, // 10 MB
    },
    indexNumber: [String, Number],
    isDisable: {
      type: Boolean,
      default: false,
    },
    isRowReserver: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    $(this.$el).on({
      dragenter: this.handleDragEnter,
      dragleave: this.handleDragLeave,
    })
  },
  activated() {
    $(this.$el).on({
      dragenter: this.handleDragEnter,
      dragleave: this.handleDragLeave,
    })
  },
  destroyed() {
    let body = $(this.$el)
    body.off('dragenter', this.handleDragEnter)
    body.off('dragleave', this.handleDragLeave)
  },
  deactivated() {
    let body = $(this.$el)
    // incase component uses keep-alive
    body.off('dragenter', this.handleDragEnter)
    body.off('dragleave', this.handleDragLeave)
  },
  data() {
    return {
      imgName: this.filename || '',
      dragging: 0,
      isShow: false,
      isProcessing: false,
    }
  },
  watch: {
    filename(val) {
      this.imgName = val
    },
  },
  methods: {
    fileDropped(evt) {
      this.dragging = 0
      this.isShow = false
      this.fileChanged(evt.dataTransfer.files)
    },
    handleUploadImg(files) {
      // upload file to server
      let me = this
      me.isProcessing = true
      Promise.all([createFormDataRequest(files, this.uploadurl)])
        .then(data => {
          me.imgName = files[0].name
          me.$emit('input', [files, data])
          me.isProcessing = false
        })
        .catch(() => {
          me.isProcessing = false
        })
    },
    fileChanged(files) {
      files instanceof Event && (files = files.target.files)

      if (files.length) {
        // validate before moving further
        let me = this,
          fr = new FileReader()
        fr.onload = () => {
          // validate before move further
          // file extension must belong to accept property
          // and must smaller maxsize property
          if (
            me.checkExtension(files[0], me.accept.split(/,\s*/)) &&
            me.checkImgSize(files[0], me.maxsize)
          ) {
            if (me.autoupload) {
              me.handleUploadImg(files)
            } else {
              me.imgName = files[0].name
              me.$emit('input', files)
            }
          }
        }
        fr.readAsDataURL(files[0])
      }
    },
    handleDragEnter(evt) {
      evt.preventDefault()
      this.dragging++
      this.isShow = true
    },
    handleDragLeave(evt) {
      evt.preventDefault()
      this.dragging--
      !this.dragging && (this.isShow = false)
    },
    deleteImage(newName = '') {
      this.imgName = newName
      this.$refs.file.value = ''
    },
  },
}

Object.assign(obj.methods, {
  checkExtension,
  checkImgSize,
  checkImgWH,
})

export default obj
</script>
<style lang="scss" scoped>
.upload-area {
  position: relative;
  border-radius: 0;
  border: 1px solid #707070;
  color: #707070;
  height: 30px;
  .upload {
    position: absolute;
    left: -99999px;
    filter: alpha(opacity=0);
  }
}
.draggable-area {
  height: 40px;
  position: relative;
}
.dragging {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(153, 153, 153, 0.8);
}
.icon-file {
  width: 14px;
  height: 14px;
}
.img-name {
  font-size: 10px;
}
.row-reverse {
  flex-direction: row-reverse;
}
</style>
