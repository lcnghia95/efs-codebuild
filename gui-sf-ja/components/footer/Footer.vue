<template>
  <div class="footer2 pt-30 pb-50">
    <div class="text-center w-1000">
      <ul class="mb-20 p-0 help">
        <li>
          <label class="mb-30 text-center">
            {{ $t('1') }}
          </label>
          <p class="text-center first-help">
            <a :href="$t('faqUrl')">{{ $t('94') }}</a><br />
            <a :href="$t('payMethodUrl')">{{ $t('95') }}</a><br />
            <a :href="`https://fx-on.com/inquiry/knowledge/?keyword=${$t('106')}`" v-if="!supportLocale">{{ $t('96') }}</a>
          </p>
        </li>
        <li>
          <label class="mb-30 text-center">
            {{ $t('3') }}
          </label>
          <p class="text-center">
            <a :href="$t('aboutUrl')">{{ $t('97') }}</a><br />
            <a :href="$t('termUrl')">{{ $t('98') }}</a><br />
            <a href="http://fx-on.com/corp/media/" v-if="!supportLocale">{{ $t('99') }}</a>
          </p>
        </li>
        <li>
          <p class="mb-50 text-center"></p>
          <p class="text-center">
            <a :href="$t('lawUrl')">{{ $t('100') }}</a><br />
            <a href="https://corp.gogojungle.co.jp/recruit_details/" v-if="!supportLocale">{{ $t('101') }}</a>
          </p>
        </li>
      </ul>
    </div>
    <p class="footer-info">
      {{ $t('6') }}
    </p>
    <div class="flex footer-info">
      <span class="mt-20" v-html="$t('104')"></span>
      <div class="sns-part flex layout-col-mid">
        <a target="_blank" title="Twitter" href="https://twitter.com/GogoJungle_fxon"><Twitter /></a>
        <a target="_blank" title="Facebook" href="https://www.facebook.com/investon"><FacebookSquare /></a>
        <a target="_blank" title="Line" id="line-icon" href="https://lin.ee/3ZhkodU34"><LineIcon /></a>
      </div>
    </div>
    <div class="mb-20 footer-info">
      <a href="http://www.fsa.go.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img01.jpg'" :alt="$t('107')" />
      </a>
      <a href="http://www.jiaa.or.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img02.jpg'" :alt="$t('108')" />
      </a>
      <a href="https://www.finmac.or.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img03.jpg'" :alt="$t('109')" />
      </a>
      <a href="http://www.fsa.go.jp/sesc/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img04.jpg'" :alt="$t('110')" />
      </a>
    </div>
    <p class="text-center fs-12">
      {{ $t('102', {year: (new Date).getFullYear()}) }}
    </p>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/footer.json'
import Lzimg from '@@/../components/Lzimg.vue'
import Twitter from '@@/../components/icons/Twitter.vue'
import FacebookSquare from '@@/../components/icons/FacebookSquare.vue'
import LineIcon from '@@/../components/icons/Line.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Lzimg,
    FacebookSquare,
    Twitter,
    LineIcon
  },
  computed: {
    supportLocale() {
      return this.langSupported().includes(this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss" scoped>
$surface-main-width: 1000px;
.footer2 {
  color: white;
  background: #000031;
  min-width: $surface-main-width;
  .help {
    list-style: none;
    display: inline-flex;
    width: 100%;
    li {
      flex: 1 0 auto;
      .first-help {
        border-right: 1px solid;
      }
    }
  }
  .footer-info {
    max-width: 1000px;
    margin: 0 auto 25px;
    justify-content: space-between;
    span {
      display: block;
    }
  }
  a {
    color: white;
    &:hover {
      text-decoration: none;
      color: #0f3e9e;
    }
  }
}
.sns-part {
  a {
    margin-right: 20px;
    .icon-cls {
      border-radius: 50%;
    }
    &:hover {
      color: unset;
    }
  }
}
#line-icon {
  .icon-cls /deep/ {
    width: 40px;
    height: 40px;
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.icon-cls /deep/ {
  width: 30px;
  height: 30px;
  cursor: pointer;
  svg {
    width: 32px;
    height: 32px;
  }
}
</style>
