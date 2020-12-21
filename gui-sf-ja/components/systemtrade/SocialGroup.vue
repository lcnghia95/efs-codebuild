<template>
  <div class="flex flex-wrap mt-20 mb-20 ">
    <div class="social-item line flex mid center" @click="onShareLine">
      <LineSocial/>
      <span>{{ $t(2) }}</span>
    </div>
    <FacebookButton
      :url="$route.fullPath"
      class="social-item"
      style="height: 20px; padding: 0; border: none;"
      size="small"
      height="20"
    />
    <div class="social-item twitter flex mid center" @click="onShareTwitter">
      <Twitter/>
      <span>{{ $t(1) }}</span>
    </div>
    <a class="social-item hatena flex mid center" :href="`http://b.hatena.ne.jp/entry/s/www.gogojungle.co.jp${$route.fullPath}`">
      <strong class="mr-5">B!</strong>{{ $store.getters['systemtrade/hatenaCount'] || 0 }}
    </a>
    <a class="social-item mail flex mid center" :href="`mailto:?subject=[${(title || '')}]&body=http://b.hatena.ne.jp/entry/s/www.gogojungle.co.jp${$route.fullPath}`">
      <Email/>
      <span>{{ $t(3) }}</span>
    </a>
  </div>
</template>

<script>
import Twitter from '@@/../components/icons/Twitter.vue'
import LineSocial from '@@/../components/icons/LineSocial.vue'
import Email from '@@/../components/icons/Email.vue'
import FacebookButton from '@@/../components/social/FacebookButton.vue'
import i18n from '@@/lang/components-desktop/social-group.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Twitter,
    FacebookButton,
    LineSocial,
    Email,
  },
  props: {
    title: {
      title: String,
      default: ''
    },
  },
  methods: {
    onShareTwitter() {
      let height = 600,
        width = 600,
        top = 100,
        left = 100,
        inputParams = {
          original_referer: this.$route.fullPath,
          ref_src: 'twsrc%5Etfw',
          text: this.title,
          url: this.$route.fullPath,
          via: 'www.gogojungle.co.jp',
        },
        twitterUrl = 'https://twitter.com/intent/tweet'
      window.open(
        this.createUrlWithQuery(twitterUrl, inputParams),
        'Sharing to twitter',
        `width=${width},height=${height},top=${top},left=${left}`
      )
    },
    createUrlWithQuery(url, params) {
      let rs = url + '?'
      Object.keys(params).forEach(s2 => {
        rs = rs + s2 + '=' + params[s2] + '&'
      })
      return rs
    },
    onShareLine() {
      window.open(
        `http://line.naver.jp/R/msg/text/?https://www.gogojungle.co.jp/finance/mailmagazine/${this.$route.fullPath}`,
        'Sharing to twitter',
        `width=600,height=600,top=100,left=100`
      )
    },
  }
}
</script>

<style lang="scss" scoped>
.social-item {
  min-width: 50px;
  height: 20px;
  margin: 5px;
  border-radius: 5px;
  text-align: center;
  padding: 0 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-color: none;
  cursor: pointer;
  user-select: none;
  font-size: 11px;
  &:active {
    transform: translateY(2px);
  }
  &.twitter {
    border: 1px solid;
    border-color: #1b96e0;
    color: #1b96e0;
    /deep/ .icon-cls {
      width: 15px;
      height: 100%;
      margin-right: 2px;
      /deep/ svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  &.hatena {
    border: 1px solid;
    border-color: #1b96e0;
    color: #1b96e0;
  }
  &.line {
    border: 1px solid;
    border-color: #00b833;
    color: #00b833;
    /deep/ .icon-cls {
      width: 19px;
      height: 100%;
      /deep/ svg {
        width: 100%;
        height: 100%;
        fill: #00b833;
      }
    }
  }
  &.mail {
    border: 1px solid;
    border-color: #89ba27;
    color: #89ba27;
    /deep/ .icon-cls {
      width: 18px;
      height: auto;
      /deep/ svg {
        width: 100%;
        height: 100%;
        fill: #00b833;
      }
    }
  }
}
</style>