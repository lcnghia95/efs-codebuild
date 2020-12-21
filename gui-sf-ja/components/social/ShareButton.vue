<template>
  <div class="h-20">
    <a class="cursor-pointer no-underlying" @click="onShareClick">
      <div class="share-btn border-radius-5 fs-12 flex mid" :title="$t('2')">
        <share class="mr-10 icon-share"/> {{ $t('1') }}
      </div>
    </a>
  </div>
</template>

<script>
import Share from '@@/../components/icons/Share.vue'
import i18n from '@@/lang/components/share-button.json'
export default {
  components: {
    Share,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onShareClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.share-btn {
  background-color: #395ca9;
  height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 20px;
  color: white;
}
.h-20 {
  height: 20px;
}
.icon-share {
  width: 12px;
  height: auto;
}
</style>
