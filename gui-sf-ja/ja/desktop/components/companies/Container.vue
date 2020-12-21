<template>
  <div class="companies-wrapp">
    <div class="company-img">
      <img :src="'/img/assets/pc/companies/main_banner.jpg'" alt="" />
    </div>
    <div
      class="flex space-between company-container w-1000"
    >
      <div class="grow12 h-full">
        <div class="title-company">
          • {{ $t('1') }}
        </div>
        <div class="flex ml-30 mr-30 pt-20">
          <a
            class="company-type cursor-pointer mr-20"
            v-for="(item, i) in compare"
            :href="'/companies/' + item.url"
            :class="{
              'btn-active': selected === item.url || selectedTab === item.url,
            }"
            :key="i"
          >
            <div
              class="fs-13 center flex h-50 mid text-center company-title"
              v-html="item.title"
            ></div>
            <div class="h-20 icon-down text-center">&#9660;</div>
          </a>
        </div>
        <div class="ml-30 mr-30">
          <slot></slot>
        </div>
      </div>
      <div class="ml-20 right-content">
        <div class="h-30 mt-15 fs-13 affiliatecompany">
          {{ $t('2') }}
        </div>
        <div class="img-wrap">
          <a :href="fxonUrl('/campaign/?p=3')" class="mt-5" target="_bank">
            <img
              :src="'/img/assets/pc/companies/sub_campaign_300x600.png'"
              alt=""
            />
          </a>
        </div>
        <div class="h-30 mt-25 fs-13 affiliatecompany mb-5">
          {{ $t('3') }}
        </div>
        <div class="tieup" v-html="tieup"></div>
        <div class="h-30 mt-25 fs-13 affiliatecompany m-b-5">
          {{ $t('8') }}
        </div>
        <div class="adv-mt4">
          <a href="https://fx-on.com/news/detail/?c=1&id=395" target="_bank">
            <img
              src="https://fx-on.com/include/img/common/sub/banner/r_banner_onamae.png"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/companies.json'
export default {
  props: {
    tieup: Array,
  },
  // async asyncData({ app }) {
  //   let { content } = await app.GoGoHTTP.get('/api/v3/surface/campaigns')
  //   return {
  //     tieup: content,
  //   }
  // },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      compare: [
        {
          title: this.$t('5'),
          url: 'present',
        },
        {
          title: this.$t('6'),
          url: 'fx',
        },
        {
          title: this.$t('7'),
          url: 'stocks',
        },
        {
          title: this.$t('4'),
          url: 'bitcoin',
        },
      ],
      selectedTab: this.$route.path.split('/')[2],
      mapTitle: {},
      selected: this.$route.path.replace(/\/companies\/?/, ''),
    }
  },
}
</script>
<style lang="scss" scoped>
.companies-wrapp {
  background: #f3f0ee;
  .company-img {
    position: relative;
    height: 380px;
    img {
      width: 100%;
      max-width: 1400px;
      height: 380px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .company-container {
    z-index: 1;
    margin-top: -100px;
    padding-bottom: 80px;
    position: relative;
    > div {
      background-color: rgba(255, 255, 255, 0.9);
      &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        width: 685px;
      }
    }
    .company-title {
      line-height: 16px;
      text-shadow: 0 1px 1px #c5e170;
    }
    .right-content {
      width: 300px;
      padding: 0 15px 20px 15px;
      .affiliatecompany {
        background-color: rgb(81, 81, 81);
        line-height: 28px;
        padding-left: 10px;
        font-weight: bold;
        width: 270px;
        border-top: 3px solid #9c3;
        border-radius: 3px 3px 0 0;
        color: white;
      }
      .tieup {
        /deep/ * {
          max-width: 100% !important;
          img {
            height: auto;
          }
        }
      }
    }
  }
  .title-company {
    line-height: 50px;
    padding-left: 29px;
    background-color: rgba(2, 89, 46, 0.9);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: 22px;
    color: white;
  }
  .company-type {
    border-radius: 5px;
    width: 140px;
    height: 70px;
    border: 1px solid rgb(124, 157, 68);
    display: inline-block;
    background-color: rgb(143, 195, 31);
    color: rgb(84, 116, 21);
    line-height: 16pt;
    font-weight: bold;
    position: relative;
    text-decoration: none;
    &:last-child {
      margin-right: 0;
    }
    .icon-down {
      color: white;
      font-size: 10px;
      line-height: 22px;
      background-color: #02592e;
      width: 140px;
      position: absolute;
      left: -1px;
      bottom: -1px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  .btn-active {
    border: 1px solid rgb(124, 157, 68);
    color: #fff100 !important;
    background: rgb(143, 195, 31);
    .company-title {
      text-shadow: none;
    }
    .icon-down {
      color: #fff100;
    }
  }
  .img-wrap {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .cash-back {
    .cash-back-detail {
      display: block;
      background: #f0f0f0;
      border-left: 20px solid #ffe200;
      text-decoration: none;
      margin-bottom: 1px;
      padding-bottom: 4px;
      position: relative;
      &::after {
        content: '\f005';
        font-family: FontAwesome, sans-serif;
        font-size: 11px;
        color: white;
        text-shadow: 1px 1px 0 #dec619;
        position: absolute;
        top: calc((100% - 14px) / 2);
        left: -15px;
      }
      h5 {
        color: #ff6500;
        margin: 0;
        padding-bottom: 3px;
        border-bottom: 1px dotted #c7c7c7;
      }
      p {
        color: #2d2d2d;
        margin: 5px 0 0;
      }
      &:nth-child(even) {
        background: #f8f8f8;
        border-left: 20px solid #ffd200;
      }
      &:hover {
        h5 {
          text-decoration: underline;
        }
      }
    }
  }
  .adv-campaign {
    a {
      display: block;
      img {
        border: 1px solid #e2e3e5;
        margin: 5px auto;
      }
      p {
        color: red;
        font-weight: bold;
      }
      &:hover p {
        text-decoration: underline;
      }
    }
  }
  .adv-popular {
    a {
      display: block;
      position: relative;
      border-bottom: 1px solid #ebebeb;
      text-decoration: none;
      img.rank-number {
        position: absolute;
        top: 5px;
        left: 5px;
      }
      p {
        color: #333;
        margin-bottom: 0;
      }
      &:hover {
        background: #eee;
        p {
          color: #6831f6;
        }
      }
    }
  }
  .adv-mt4 {
    a {
      display: block;
      width: 270px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .m-l-6 {
    margin-left: 6px;
  }
  .w-270 {
    width: 270px;
  }
  .w-64 {
    width: 64px;
  }
  .p-t-5 {
    padding-top: 5px;
  }
  .p-tb-9 {
    padding-top: 9px;
    padding-bottom: 9px;
  }
  .m-t-25 {
    margin-top: 25px;
  }
  .m-t-1 {
    margin-top: 1px;
  }
  .h-20 {
    height: 20px;
  }
  .h-30 {
    height: 30px;
  }
  .h-50 {
    height: 50px;
  }
}
</style>
