<template>
  <div class="social-area p-10">
    <h4 class="text-center"><b>他のサービスIDで登録</b></h4>
    <div class="flex mid space-between">
      <div class="social-block flex mid mr-10">
        <img :src="'/img/assets/pc/common/icon_Yahoo.jpg'" alt="Yahoo" />
        <a id="yahoo" class="w-full text-center fs-11 co-black no-underlying" rel="nofollow"
           @click="snsRegister('yahoojp')"
        >
          {{ 'Yahoo!' }}
        </a>
      </div>
      <div class="social-block flex mid mr-10">
        <img :src="'/img/assets/pc/common/icon_Twitter.jpg'" alt="Twitter" />
        <a id="twitter" class="pl-10 w-full fs-11 co-black no-underlying" rel="nofollow"
           @click="snsRegister('twitter')"
        >
          {{ 'Twitter' }}
        </a>
      </div>
      <div class="social-block flex mid">
        <img :src="'/img/assets/pc/common/icon_Facebook_new.png'" alt="Facebook" />
        <a id="facebook" class="w-full text-center fs-11 co-black no-underlying" rel="nofollow"
           @click="snsRegister('facebook')" 
        >
          {{ 'Facebook' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {trackingUserRegister} from '@@/../common/js/ga/ecom-enhance'
export default {
  methods: {
    buildGetParams() {
      let q = this.$route.query,
        params = Object.keys(q)
          .map(e => `${e}=${q[e]}`)
          .join('&')
      return params
    },
    async snsRegister(provider) {
      if (this.$route.path.includes('register')) {
        await trackingUserRegister(this.$i18n.locale)
      }
      location.href = `/sns/login?provider=${provider}&${this.buildGetParams()}`
    }
  },
}
</script>


<style lang="scss" scoped>
.social-area {
  background: #e9eaec;
  border-radius: 4px;
}
.social-block {
  width: calc(100% / 3);
  background: white;
  img {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
  a {
    border: 1px solid #d9d9d9;
    height: 40px;
    line-height: 40px;
  }
}
.fs-11 {
  font-size: 11px;
}
</style>
