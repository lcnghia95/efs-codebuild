<template>
  <div class="exp-container flex layout-col">
    <div class="txt-content w-full flex space-between" >
      <img v-if="this.img" class="left-img" >
      <div class="exp-txt m-5" ref="content" v-wrap-lines="isExpanded ? -1 : this.minLines">{{ this.text }}</div>
    </div>
    <button v-if="showExpButton" class="expend-btn flex mid center" @click="onClickExpand">
      {{ isExpanded ? $t(2) : $t(1) }}
    </button>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/navi-expand-text.json'
// import ImgWrapper from '@@/../components/ImgWrapper.vue'

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
      default: 6,
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isExpanded: false,
      showExpButton: false,
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
  font-size: 3.5vw;
}

/* .left-img {
  width: 25vw;
  height: 25vw;
  margin: 0vw 3vw;
} */
.exp-txt {
  line-height: 4.5vw;
}
.expend-btn {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  height: 10vw;
  outline: none;
}
</style>

<docs>
```vue
<template>
  <div class="w-full">
    <ExpandText :text="this.dataAuthor.userIntroduction" :minLines="4"/>
  </div>
</template>
<script>
import ExpandText from '@/components/finance/ExpandableText.vue'

export default {
  components: {
    ExpandText,
  },
  async asyncData({ app, params, redirect }) {
    let data = await app.GoGoHTTP.get(
      `/api/surface/navi/writerlist/${params.id}`
    )
    return {
      dataAuthor: data.writer,
    }
  },
}
</script>
```
</docs>
