<template>
  <div class="mobile-register-completed">
    <div class="text-center title">
      <h3 class="i-title"><b>{{ $t('20') }}</b></h3>
    </div>
    <Button01 :background="'#a4a4a4'" class="mt-10 mb-10 w-full h-40" :text="$t('21')" @click="gotoPage('/mypage')" />
    <Button01 :background="'#a4a4a4'" class="mt-10 mb-10 w-full h-40" :text="$t('22')" @click="gotoPage('/')" />
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/register.json'
import Button01 from '@/components/common/Button01'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Button01,
  },
  async asyncData({ redirect, req }) {
    let referer = req.headers.referer || ''
    if (!referer.includes('/register')) {
      return redirect('/')
    }
    return {}
  },
  methods: {
    gotoPage(page) {
      location.href = page
    },
  },
}
</script>


<style lang="scss" scoped>
.mobile-register-completed {
  margin: 20px 20px;
  .title {
    .i-title {
      color: #707070;
    }
  }
}
.h-40 {
  height: 40px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.scroll-btn {
  display: none !important;
}
/* stylelint-enable */
</style>
