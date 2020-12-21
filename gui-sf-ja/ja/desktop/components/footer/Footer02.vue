<template>
  <div class="footer2 pt-30 pb-50 pl-5 pr-5">
    <div class="text-center w-1000">
      <div class="mb-20 p-0 help flex space-between reponsive-lg">
        <div class="help-item">
          <label class="mb-30 text-center">
            {{ $t('1') }}
          </label>
          <p class="text-center first-help">
            <a href="https://fx-on.com/inquiry/knowledge/">{{ $t('94') }}</a><br />
            <a href="https://fx-on.com/inquiry/knowledge/?keyword=支払">{{ $t('95') }}</a><br />
            <a href="https://fx-on.com/inquiry/knowledge/?keyword=返金">{{ $t('96') }}</a>
          </p>
        </div>
        <div class="help-item">
          <label class="mb-30 text-center">
            {{ $t('3') }}
          </label>
          <p class="text-center">
            <a href="https://corp.gogojungle.co.jp/">{{ $t('97') }}</a><br />
            <a href="/terms/service">{{ $t('98') }}</a><br />
            <a href="http://fx-on.com/corp/media/">{{ $t('99') }}</a>
          </p>
        </div>
        <div class="help-item">
          <p class="mb-50 text-center"></p>
          <p class="text-center">
            <a href="http://fx-on.com/corp/law/">{{ $t('100') }}</a><br />
            <a href="https://corp.gogojungle.co.jp/recruit_details/">{{ $t('101') }}</a>
          </p>
        </div>
      </div>
      <div class="mb-20 p-0 help flex space-between reponsive-sm">
        <div class="flex help-item layout-col space-between">
          <label class="mb-15 text-center">
            {{ $t('1') }}
          </label>
          <p class="text-center">
            <a href="https://fx-on.com/inquiry/knowledge/">{{ $t('94') }}</a><br />
            <a href="https://fx-on.com/inquiry/knowledge/?keyword=支払">{{ $t('95') }}</a><br />
            <a href="https://fx-on.com/inquiry/knowledge/?keyword=返金">{{ $t('96') }}</a>
          </p>
        </div>
        <div class="flex help-item layout-col space-between">
          <label class="mb-15 text-center">
            {{ $t('3') }}
          </label>
          <p class="text-center">
            <a href="https://corp.gogojungle.co.jp/">{{ $t('97') }}</a><br />
            <a href="/terms/service">{{ $t('98') }}</a><br />
            <a href="http://fx-on.com/corp/media/">{{ $t('99') }}</a>
          </p>
        </div>
        <div class="flex help-item layout-col space-between">
          <label class="mb-15 text-center">
            {{ $t('44') }}
          </label>
          <p class="text-center">
            <a href="http://fx-on.com/corp/law/">{{ $t('100') }}</a><br />
            <a href="https://corp.gogojungle.co.jp/recruit_details/">{{ $t('101') }}</a>
          </p>
        </div>
      </div>
    </div>
    <p class="footer-info">
      {{ $t('6') }}
      <span class="mt-20" v-html="$t('104')"></span>
    </p>
    <div class="mb-20 footer-info">
      <a href="http://www.fsa.go.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img01.jpg'" alt="金融庁" />
      </a>
      <a href="http://www.jiaa.or.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img02.jpg'" alt="日本投資顧問業協会" />
      </a>
      <a href="https://www.finmac.or.jp/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img03.jpg'" alt="証券・金融商品あっせん相談センター" />
      </a>
      <a href="http://www.fsa.go.jp/sesc/" class="ml-10 mr-10" target="_blank">
        <Lzimg :data-src="'/img/assets/pc/common/footer/img04.jpg'" alt="証券取引等監視委員会" />
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

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Lzimg,
  },
}
</script>

<style lang="scss" scoped>
$surface-main-width: 1000px;
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: 999px) {
  .footer2 {
    min-width: 0 !important;
  }
}
@media only screen and (max-width: $max-width) {
  .reponsive-lg {
    display: none !important;
  }
  .reponsive-sm {
    display: inline-flex !important;
  }
  .help-item {
    border-right: 1px solid #575757;
  }
  .help-item:last-child {
    border-right: none;
  }
}
@media only screen and (min-width: $min-width) {
  .reponsive-lg {
    display: inline-flex !important;
  }
  .reponsive-sm {
    display: none !important;
  }
}
.footer2 {
  color: white;
  background: #000031;
  min-width: $surface-main-width;
  .help {
    list-style: none;
    display: inline-flex;
    width: 100%;
    .help-item {
      flex: 0 0 33.333%;
      .first-help {
        border-right: 1px solid;
      }
    }
    &.reponsive-sm {
      display: none;
    }
  }
  .footer-info {
    max-width: 1000px;
    margin: 0 auto 25px;
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
</style>
