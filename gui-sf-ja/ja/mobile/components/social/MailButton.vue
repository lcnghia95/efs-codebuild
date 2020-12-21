<template>
  <div class="h-20">
    <a :href="'mailto:?subject=[' + (title || '') + ']&body=www.gogojungle.co.jp' + (url || '')" class="cursor-pointer no-underlying">
      <div class="share-btn flex mid border-radius-5 fs-12">
        <Email class="mr-10 icon-mail" />{{ $t('mailbutton.1') }}
      </div>
    </a>
  </div>
</template>

<script>
import Email from '@@/../components/icons/Email.vue'
export default {
  components: {
    Email,
  },
  props: {
    url: String,
    title: String,
  },
  i18n: {
    messages: {
      ja: {
        mailbutton: {
          1: '友達に教える',
        },
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.share-btn {
  background-color: #7b8e9f;
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
