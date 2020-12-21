<template>
  <div class="crowd-guide mt-30">
    <div class="crowd-guide-head">
      <h3 class="text-center">
        <span class="fs-22">{{ $t('1') }}</span>
        {{ $t('2') }}
      </h3>
      <p class="sub-text fs-15 text-center p-10">{{ $t('3') }}</p>
      <a class="btn-development fs-13" href="/crowdsourcing/guide3">
        {{ $t('4') }}
      </a>
    </div>
    <div class="crowd-guide-body">
      <div class="guide-content">
        <div class="title">
          <span class="text-center fs-25">1</span>
          <h4 class="fs-20">
            {{ $t('5') }}
          </h4>
        </div>
        <div class="content-wrapp">
          <div class="flex">
            <img src="/img/assets/pc/crowdsourcing/guide_0.gif" alt="" width="150" height="150" />
            <div class="ml-30">
              <p class="pt-30" v-html="$t('6')"></p>
              <p class="border-text" v-html="$t('7')"></p>
            </div>
          </div>
          <p class="fs-13 mb-15">
            {{ $t('8') }}
          </p>
          <p class="text-note fs-12" v-html="$t('9')"></p>
          <div class="arrow-center"></div>
        </div>
      </div>
      <div class="guide-content">
        <div class="title">
          <span class="text-center fs-25">2</span>
          <h4 class="fs-20">
            {{ $t('10') }}
          </h4>
        </div>
        <div class="content-wrapp">
          <div class="flex">
            <img src="/img/assets/pc/crowdsourcing/guide_2.gif" alt="" width="150" height="150" />
            <div class="ml-30">
              <p class="pt-30" v-html="$t('11')"></p>
              <p class="border-text" v-html="$t('12')"></p>
            </div>
          </div>
          <p class="fs-13 mb-15">{{ $t('13') }}</p>
          <div class="arrow-center"></div>
        </div>
      </div>
      <div class="guide-content">
        <div class="title">
          <span class="text-center fs-25">3</span>
          <h4 class="fs-20">{{ $t('14') }}</h4>
        </div>
        <div class="content-wrapp">
          <div class="flex">
            <img src="/img/assets/pc/crowdsourcing/guide_3.gif" alt="" width="150" height="150" />
            <div class="ml-30">
              <p class="pt-10" v-html="$t('15')"></p>
              <p class="border-text" v-html="$t('16')"></p>
            </div>
          </div>
          <div class="arrow-center"></div>
        </div>
      </div>
      <div class="guide-content">
        <div class="title">
          <span class="text-center fs-25">4</span>
          <h4 class="fs-20">{{ $t('17') }}</h4>
        </div>
        <div class="content-wrapp">
          <div class="flex">
            <img src="/img/assets/pc/crowdsourcing/guide_4.gif" alt="" width="150" height="150" />
            <div class="ml-30">
              <p class="pt-10" v-html="$t('18')"></p>
              <p class="border-text" v-html="$t('19')"></p>
            </div>
          </div>
        </div>
      </div>
      <a class="btn-request text-center cursor-pointer" @click="onGoToCreate">{{ $t('20') }}</a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-guide2.json'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: `${this.$t('2')} - ${this.$t('21')}`,
        keywordsChunk: this.$t('2'),
        descriptionChunk: this.$t('2'),
      }
    },
    async asyncData({ app }) {
      let isCrowdsourcing = await app.GoGoHTTP.get(
        '/api/v3/surface/crowdsourcing/user'
      )
      return {
        isCrowdsourcing,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/guide2`,
          },
        ],
      }
    },
    methods: {
      onGoToCreate() {
        if (this.isCrowdsourcing === 1) {
          location.href = '/mypage/crowdsourcing/input'
        } else {
          location.href = '/mypage/crowdsourcing?u=/mypage/crowdsourcing/input'
        }
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.crowd-guide {
  background: white;
  margin-bottom: 100px;
  padding-bottom: 60px;
  .crowd-guide-head {
    border-top: 5px solid #03b9ee;
    height: 280px;
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
      font-size: 50px;
      color: #03b9ee;
      margin-top: 55px;
      text-shadow: 5px 0 0 #fff, -5px 0 0 #fff, 0 5px 0 #fff, 0 -5px 0 #fff;
      span {
        margin-bottom: 15px;
        display: block;
      }
    }
    .sub-text {
      width: 610px;
      background: #f3f0ee;
      margin: 0 auto;
      border-radius: 8px;
      border: 3px solid #fff;
    }
    .btn-development {
      display: block;
      background: #03b9ee;
      position: absolute;
      top: 0;
      right: 0;
      color: white;
      padding: 4px 10px 7px 15px;
      border-radius: 0 0 0 5px;
      cursor: pointer;
      text-decoration: none;
    }
  }
  .crowd-guide-body {
    width: 760px;
    margin: 0 auto;
    background: #fff;
    .content-wrapp {
      width: 650px;
      margin: 0 auto;
    }
    .link-mypage {
      color: #3381ff;
      text-decoration: none;
    }
    .arrow-center {
      width: 0;
      height: 0;
      margin: 50px auto;
      border-left: 45px solid transparent;
      border-right: 45px solid transparent;
      border-top: 30px solid #03b9ee;
    }
    .guide-content {
      .title {
        border: 1px solid black;
        position: relative;
        span {
          display: inline-block;
          width: 45px;
          height: 45px;
          line-height: 45px;
          background: #03b9ee;
          color: white;
          position: absolute;
          top: -1px;
          left: -1px;
        }
        h4 {
          display: inline-block;
          height: 43px;
          line-height: 46px;
          margin: 0;
          padding-left: 60px;
        }
      }
      .flex {
        margin: 30px 0 10px;
        .border-text {
          border: 1px solid #f1f1f1;
          padding: 7px 10px;
        }
        img {
          flex: 0 0 150px;
        }
        p {
          line-height: 24px;
        }
      }
      p.text-note {
        color: #6b6b6b;
      }
    }
  }
  .btn-request {
    display: block;
    margin: 40px auto;
    width: 400px;
    height: 60px;
    line-height: 63px;
    background: #00a300;
    color: white;
    border-radius: 5px;
    border-top: 1px solid #46cc46;
    box-shadow: 0 -1px 0 #009600;
    text-decoration: none;
    position: relative;
    font-size: 18px;
    &::before {
      content: '>';
      position: absolute;
      top: -2px;
      right: 20px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
  .fs-20 {
    font-size: 20px;
  }
  .fs-25 {
    font-size: 25px;
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
