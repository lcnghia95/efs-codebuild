<template>
  <div class="login-wrapper w-1000">
    <div>
      <div class="main-login mb-150 mt-150">
        <h3 class="header title-border-bottom">
          {{ $t('20') }}
        </h3>
        <div>
          <gogo-link class="w-200 pl-10 text-left w-full mt-20 btn-login" :target="'/mypage'" replace>
            {{ $t('21') }}
          </gogo-link>
          <a class="w-200 pl-10 text-left w-full mt-20 btn-login" href="/">
            {{ $t('22') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/register.json'
import GogoLink from '@@/../components/link/GogoLink.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    GogoLink,
  },
  async asyncData({ redirect, req }) {
    let referer = req.headers.referer || ''
    if (!referer.includes('/register')) {
      return redirect('/')
    }
    return {}
  },
}
</script>

<style lang="scss" scoped>
$color53: #666;
$color43: #d9d9d9;
$color6: #aeaead;
$color1: #d9d9d9;
$color64: #f5f5f5;
$color6: #aeaead;
.login-wrapper {
  margin: 50px auto 150px;
  .header {
    color: $color53;
    border-color: $color43;
  }
  .btn-login {
    display: block;
    background: $color6;
    border-radius: 0 !important;
    height: 40px;
    line-height: 40px;
    &:active,
    &:focus,
    &:hover,
    &:visited {
      color: white;
      outline: none;
      text-decoration: none;
    }
  }
  .main-login {
    padding: 40px 80px;
    width: 1000px;
    background: $color64;
  }
}
.title-border-bottom {
  line-height: 30px;
  border-bottom: solid 1px $color1;
  font-weight: bold;
}
.w-200 {
  width: 200px;
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
