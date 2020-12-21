<template>
  <div>
    <a class="btn-social btn-twitter w-full flex mid" href="https://twitter.com/GogoJungle_fxon" target="_blank">
      <twitter class="center i-twitter ml-40" />
      <p class="fs-15">
        GogoJungle<span class="fs-16">{{ this.$t('1') }}</span>
      </p>
    </a>
    <a class="btn-social btn-fb w-full flex mid mt-10" href="https://www.facebook.com/investon" target="_blank">
      <facebook class="center i-fb" />
      <p class="fs-15">
        GogoJungle<span class="fs-14">{{ this.$t('2') }}</span>
      </p>
    </a>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-social-links.json'
import Twitter from '@@/../components/icons/Twitter.vue'
import Facebook from '@@/../components/icons/Facebook.vue'
/**
 * The social network links.
 */
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Twitter,
    Facebook,
  },
}
</script>

<style lang="scss" scoped>
.fs-14 {
  font-size: 14px;
}
.fs-15 {
  font-size: 15px;
}
.fs-16 {
  font-size: 16px;
}
/deep/ .icon-cls {
  height: auto;
}
.i-twitter {
  width: 32px;
  display: flex;
}
.i-fb {
  width: 16px;
  display: flex;
  margin-left: 48px;
  margin-right: 8px;
}
.btn-twitter {
  background: #21a5e1;
}
.btn-fb {
  background: #3c5a99;
}
.btn-social {
  color: #fff;
  text-decoration: none;
  height: 55px;
  font-weight: bold;
  &:hover {
    opacity: 0.8;
  }
  /deep/ p {
    margin: auto;
    margin-left: 8px;
  }
}
</style>
