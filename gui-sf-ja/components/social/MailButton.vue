<template>
  <div class="h-20">
    <a :href="'mailto:?subject=[' + title + ']&body=www.gogojungle.co.jp' + shareUrl" class="cursor-pointer no-underlying">
      <div class="share-btn flex mid border-radius-5 fs-12">
        <Email class="mr-10 icon-mail"/>{{ $t('1') }}
      </div>
    </a>
  </div>
</template>

<script>
import Email from '@@/../components/icons/Email.vue'
import i18n from '@@/lang/components/mail-button.json'
export default {
  components: {
    Email,
  },
  props: {
    url: String,
    title: String,
  },
  computed: {
    shareUrl() {
      return this.url || this.$route.fullPath || ''
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.share-btn {
  background-color: #9c3;
  height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 20px;
  color: white;
}
.h-20 {
  height: 20px;
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-mail {
  width: 18px;
  height: 18px;
}
</style>
