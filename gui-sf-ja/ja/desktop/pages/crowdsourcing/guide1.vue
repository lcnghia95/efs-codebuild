<template>
  <div class="crowd-investment m-t-30">
    <div class="crowd-investment-head">
      <h3 class="text-center">
        {{ $t('1') }}
        <span class="fs-20">{{ $t('2') }}</span>
      </h3>
    </div>
    <div class="crowd-investment-body">
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">1.</span>
          <b>{{ $t('3') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('4')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching1.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">2.</span>
          <b>{{ $t('5') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('6')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching2.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">3.</span>
          <b>{{ $t('7') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('8')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching3.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">4.</span>
          <b>{{ $t('9') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('10')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching4.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">5.</span>
          <b>{{ $t('11') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('12')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching5.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">6.</span>
          <b>{{ $t('13') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('14')"></p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching6.png" alt="" />
        </figure>
      </div>
      <div class="investment-matching">
        <h4>
          <span class="text-center mr-5">7.</span>
          <b>{{ $t('15') }}</b>
        </h4>
        <p class="fs-20 ml-10 mt-5" v-html="$t('16')"></p>
        <p class="fs-16 text-note">{{ $t('17') }}</p>
        <figure class="text-center mt-20">
          <img src="/img/assets/pc/crowdsourcing/matching7.png" alt="" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-guide1.json'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: `${this.$t('1')} - ${this.$t('18')}`,
        keywordsChunk: this.$t('1'),
        descriptionChunk: this.$t('1'),
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/guide1`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.crowd-investment {
  background: white;
  .crowd-investment-head {
    border-top: 5px solid #84c320;
    height: 220px;
    background: url('/img/assets/pc/crowdsourcing/bg-head.jpg') repeat;
    position: relative;
    &::before {
      content: '';
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    }
    h3 {
      font-size: 40px;
      color: #84c320;
      margin-top: 60px;
      text-shadow: 5px 0 0 #fff, -5px 0 0 #fff, 0 5px 0 #fff, 0 -5px 0 #fff;
      span {
        margin-top: 20px;
        display: block;
      }
    }
  }
  .crowd-investment-body {
    background: #fff;
    font-family: '游明朝体', 'Yu Mincho', YuMincho, 'ヒラギノ明朝 Pro',
      'Hiragino Mincho Pro', 'MS P明朝', 'MS PMincho', serif;
    .investment-matching {
      width: 800px;
      margin: 0 auto 100px;
      h4 {
        margin: 0;
        font-size: 25px;
        b {
          border-bottom: 2px solid black;
          padding-bottom: 3px;
        }
        span {
          display: inline-block;
          width: 45px;
          height: 45px;
          line-height: 45px;
          color: #fff;
          background: #84c320;
          padding-left: 10px;
        }
      }
      p {
        line-height: 35px;
        &.text-note {
          line-height: 25px;
        }
      }
    }
  }
  .fs-20 {
    font-size: 20px;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
