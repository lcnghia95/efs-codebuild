<template>
  <div class="flex layout-col wrapper space-between" :class="{'mobile-ver': isMobile}">
    <div v-if="isMobile" class="back-mobile flex mid center" @click="switchToMobile()">
      モバイル用<span>GogoJungleに戻る</span>
    </div>
    <div>
      <div class="flex w-full user-header">
        <div class="w-1000">
          <a :href="logoHref" class="pt-5 pb-5">
            <i :is="LogoComp" class="logo-cls" title />
          </a>
        </div>
      </div>
      <div ref="topImgShow" class="header-img" :class="{'top-img': profile.hasBanner}">
        <div :style="{
          background: `url(${topImgUrl}) top center / contain no-repeat`,
          height: 0}" v-if="profile.hasBanner"
        ></div>
      </div>
      <div class="top-menu flex w-full">
        <div class="flex w-1000">
          <div class="left flex-wrap flex">
            <div class="avatar" :style="{backgroundImage: `url(/img/users/${this.$route.params.id}/large?defaultImg=1)`}"></div>
            <b class="wrap-text ml-20">{{ profile.nickName || $t('31') }}</b>
          </div>
          <div class="right flex mid space-between">
            <div class="flex menu">
              <a :href="item.url" class="pl-15 pr-15 flex"
                 :class="{ disabled: !item.hasData, active: item.active }"
                 v-for="(item, i) in menu" :key="i"
              >
                {{ $t(item.title) }}
              </a>
              <a :href="`/users/${$route.params.id}/follows`" class="flex layout-col mid center sub-menu ml-40"
                 :class="{ disabled: !profile.follows }"
              >
                <span>{{ $t(1) }}</span>
                <span>{{ profile.follows || 0 }}</span>
              </a>
              <div class="splitter ml-10 mr-10"></div>
              <a :href="`/users/${$route.params.id}/followers`" class="flex layout-col mid center sub-menu"
                 :class="{ disabled: !profile.followers }"
              >
                <span>{{ $t(2) }}</span>
                <span>{{ profile.followers || 0 }}</span>
              </a>
            </div>
            <button @click="onSendMsg" :class="{ disabled: !isProfileValid || $store.state.user.id == $route.params.id }" class="add-msg fs-12">
              {{ $t(3) }}
            </button>
          </div>
        </div>
      </div>
      <div class="main flex center" :class="{'w-1000': isMobile}">
        <!-- banner left -->
        <a v-if="banners[1] && !isMobile" class="block mr-20 mb-20" :href="banners[1].landingPageUrl" target="_blank">
          <img :src="banners[1].bannerUrl" alt="banners-1" />
        </a>
        <div class="flex">
          <div class="profile-left mt-50 pr-20">
            <template v-if="isProfileValid">
              <div class="profile-info mb-10">
                {{ $t(6) }}：{{ bt }} │
                {{ $t(7) }}：{{ jt }} │
                {{ $t(8) }}：{{ sa }} │
                {{ $t(9) }}：{{ ae }} │
                {{ $t(10) }}：{{ ama }}
              </div>
              <div class="text-center mb-10">
                <button :class="{ disabled: !isProfileValid }" class="follow-btn" @click="handleFollow">
                  <UserTimes v-if="profile.isFollow" />
                  <UserPlus v-else />
                  {{ $t(profile.isFollow ? 11 : 12) }}
                </button>
              </div>
              <p class="intro" v-html="profile.introduction"></p>
              <p v-if="Object.keys(blog || []).length" class="recent-article pb-10 mt-30">
                {{ $t(13) }}
              </p>
              <a
                v-for="(item, i) in blog"
                :key="'sfuwU'+i"
                :href="item.detailUrl"
                :rel="item.isExternal ? 'nofollow' : ''"
                class="no-underlying blog mb-10"
                target="_blank"
              >
                {{ item.title }}({{ formatTime(item.publishedDate, 1) }})
              </a>
              <div v-if="Object.keys(blog || []).length" class="text-right">
                <a :href="`/users/${$route.params.id}/blog`"
                   class="no-underlying show-more mb-10" target="_blank"
                >
                  {{ $t(14) }}
                  <ArrowCircleRight />
                </a>
              </div>
            </template>
          </div>
          <nuxt-child class="profile-right" />
        </div>
        <!-- banner right -->
        <a v-if="banners[2] && !isMobile" class="block ml-20 mb-20" :href="banners[2].landingPageUrl" target="_blank">
          <img :src="banners[2].bannerUrl" alt="" />
        </a>
      </div>
      <Footer02 />
    </div>
    <GogoModal :show="showGuide" :title="$t(15)" @update:show="val => showGuide = val" width="600px" height="340px"
               class="c-modal"
    >
      <div class="modal-body flex layout-col mid" slot="modal-body">
        <span class="text-center mt-20" v-html="msg"></span>
        <a class="flex mid center no-underlying" href="/register">{{ $t(16) }}</a>
      </div>
      <div slot="modal-footer" class="modal-footer flex mid center text-center">
        {{ $t(17) }}<a :href="`/login?u=${returnUrl || $route.fullPath}`">{{ $t(18) }}&#x3e;&#x3e;</a>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-id.json'
import jobType from '@@/lang/common/job-type.json'
import bloodType from '@@/lang/common/blood-type.json'
import styleAdvise from '@@/lang/common/style-advise﻿.json'
import adviseExperience from '@@/lang/common/advise-experience.json'
import adviseMoneyAmount from '@@/lang/common/advise-money-amount.json'
import UserPlus from '@@/../components/icons/UserPlus.vue'
import UserTimes from '@@/../components/icons/UserTimes.vue'
import ArrowCircleRight from '@@/../components/icons/ArrowCircleRight.vue'
import Footer02 from '@@/../components/footer/Footer.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Logoja from '@@/../components/icons/Logoja.vue'
import Logoen from '@@/../components/icons/Logoen.vue'
import Logoth from '@@/../components/icons/Logoth.vue'
import Logovi from '@@/../components/icons/Logovi.vue'
import { filterInt } from '@/utils/client/common'
import title from '@@/../common/pages'
import { setCookie, isAgentMobile } from '@/utils/client/common'

const SUBTITLE = {
  '': 36,
  products: 20,
  blog: 21,
  review: 22,
  follows: 1,
  followers: 2,
  realtrade: 39
}

export default Object.assign(
  {
    layout: 'empty',
    i18n: {
      messages: i18n,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      UserPlus,
      UserTimes,
      ArrowCircleRight,
      Footer02,
      GogoModal,
      Logoja,
      Logoen,
      Logoth,
      Logovi,
    },
    data() {
      let topImgUrl = `/img/users/${
        this.$route.params.id
      }/banners?ingoreOnErr=1`
      return {
        topImgUrl,
        showGuide: false,
        msg: '',
        returnUrl: '',
      }
    },
    mounted() {
      window.onscroll = this.handleWindowScroll
    },
    async asyncData({ app, params, req, error }) {
      let { id } = params,
        [profile, blog, banners] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/profile/${id}`),
          app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/blog`),
          app.GoGoHTTP.get('/api/v3/surface/banner'),
        ]),
        isProfileValid = Object.keys(profile).length,
        locale = app.i18n.locale,
        cI18n = i18n[locale],
        bt = bloodType[locale][profile.bloodType] || '-',
        jt = jobType[locale][profile.occupation] || '-',
        sa = styleAdvise[locale][profile.investmentType] || '-',
        ae = adviseExperience[locale][profile.investmentCareer] || '-',
        ama = adviseMoneyAmount[locale][profile.investmentAmount] || '-',
        type = req._parsedOriginalUrl.pathname.split('/')[3] || '',
        menu = [
          {
            title: 19,
            url: `/users/${id}`,
            hasData: true,
            active: type == '',
          },
          {
            title: 20,
            url: `/users/${id}/products`,
            hasData: profile.hasProduct,
            active: type == 'products',
          },
          {
            title: 21,
            url: `/users/${id}/blog`,
            hasData: profile.hasBlog,
            active: type == 'blog',
          },
          {
            title: 22,
            url: `/users/${id}/review`,
            hasData: profile.hasReview,
            active: type == 'review',
          },
          {
            title: 39,
            url: `/users/${id}/realtrade`,
            hasData: profile.realtrade,
            active: type == 'realtrade',
          },
        ],
        isMobile = isAgentMobile(req.headers['user-agent'])

      if (!isProfileValid) {
        return error({ statusCode: 404 })
      }
      return {
        profile,
        blog,
        isProfileValid,
        bt,
        jt,
        sa,
        ae,
        ama,
        menu,
        banners,
        isMobile,
        titleChunk: `${profile.nickName || cI18n[35]}${cI18n[37]}${
          cI18n[SUBTITLE[type]]
        } - ID : ${id}`,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/users/${id}${
              type ? `/${type}` : ''
            }`,
          },
        ],
      }
    },
    methods: {
      switchToMobile() {
        setCookie('forceRenderDesktop', '', 0)
        // TODO: Hieu Nguyen - Correct finance navi structure
        if (this.$route.path.includes('/t/')) {
          location.href = this.$route.path.replace(
           '/articles/searchresult/',
           '/searchresult/'
        )
       } else {
         location.reload()
        }
      },
      descriptionTemplate() {
        return (this.profile.introduction || '').replace(/<(.|\n)*?>/g, '')
      },
      handleWindowScroll() {
        if (window.pageYOffset < 40) {
          this.$refs.topImgShow.classList.remove('scroll-lvl1')
          this.$refs.topImgShow.classList.remove('scroll-lvl2')
        } else if (window.pageYOffset > 40 && window.pageYOffset < 300) {
          this.$refs.topImgShow.classList.add('scroll-lvl1')
          this.$refs.topImgShow.classList.remove('scroll-lvl2')
        } else {
          this.$refs.topImgShow.classList.remove('scroll-lvl1')
          this.$refs.topImgShow.classList.add('scroll-lvl2')
        }
      },
      onSendMsg() {
        if (!this.isProfileValid) {
          return
        }
        let url = `/mypage/message?toUserId=${
          this.$route.params.id
        }&toUserName=${this.profile.nickName || ''}`
        if (!this.$store.state.user.id) {
          this.msg = this.$t(23)
          this.returnUrl = encodeURIComponent(url)
          this.showGuide = true
          return
        }
        location.href = url
      },
      async handleFollow() {
        if (!this.isProfileValid) {
          return
        }
        this.returnUrl = ''
        if (!this.$store.state.user.id) {
          this.msg = this.$t(24)
          this.showGuide = true
          return
        }
        let res = await this.GoGoHTTP.post(
          `/api/v3/surface/profile/${this.$route.params.id}/${
            this.profile.isFollow ? 'unfollow' : 'follow'
          }`
        )
        if (!res) {
          this.msg = this.$t(24)
          this.showGuide = true
          return
        }
        this.$set(this.profile, 'isFollow', this.profile.isFollow ? 0 : 1)
        this.$set(
          this.profile,
          'followers',
          (this.profile.followers || 0) + (this.profile.isFollow ? 1 : -1)
        )
      },
    },
    computed: {
      LogoComp() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          return `Logo${this.$i18n.locale}`
        }
        return 'Logoja'
      },
      logoHref() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          return `/${this.$i18n.locale}`
        }
        return '/'
      }
    }
  },
  title
)
</script>

<style lang="scss" scoped>
$minWidth: 1020px;
$s: 230px;
@media only screen and (max-width: 1400px) {
  .main > a {
    display: none;
  }
}
.back-mobile {
  display: none;
  width: 100%;
  height: 150px;
  background: #0343ce;
  font-size: 55px;
  color: white;
  span {
    text-decoration: underline;
  }
}
.wrapper {
  background: #f5f8fa;
  min-width: $minWidth;
}
.user-header {
  position: fixed;
  background: white;
  z-index: 2;
  a {
    display: inline-block;
  }
  .logo-cls {
    width: 180px;
    height: 40px;
  }
}
.header-img {
  background: white;
}
.top-menu {
  z-index: 2;
  height: 60px;
  box-shadow: 0 4px 2px -2px rgba(207, 203, 207, 1);
  align-items: center;
  position: fixed;
  top: 50px;
  background: white;
  min-width: $minWidth;
  > div:first-child {
    height: 60px;
  }
  .left {
    width: $s;
    height: $s;
    flex: 0 0 $s;
    align-items: center;
    transition: all 0.3s ease;
    font-size: 16px;
    b {
      max-width: calc(#{$s} - 60px);
    }
  }
  .right {
    width: 770px;
    height: 60px;
    > div:first-child {
      height: 60px;
    }
    a {
      color: black;
      text-decoration: none;
    }
  }
  & + .main {
    .profile-left {
      margin-top: 290px;
    }
    .profile-right {
      margin-top: 140px;
      margin-bottom: 100px;
    }
    > a {
      margin-top: 140px;
    }
  }
  .avatar {
    width: 203px;
    height: 203px;
    border: 5px solid white;
    background-repeat: no-repeat;
    background-size: cover;
    transition: all 0.5s ease;
    border-radius: 5px;
  }
}
.top-img {
  height: 320px;
  min-height: 320px;
  margin-top: 50px;
  width: 100%;
  > div {
    height: 320px !important;
    transform: translate3d(0, 0, 0);
  }
  + .top-menu {
    position: absolute;
    top: 370px;
    .left {
      margin-top: -150px;
    }
    & + .main {
      margin-top: 60px;
      .profile-left {
        margin-top: 50px;
      }
      .profile-right {
        margin-top: 30px;
      }
      > a {
        margin-top: 30px;
      }
    }
  }
}
.scroll-lvl1:not(.top-img) + .top-menu,
.scroll-lvl2 + .top-menu {
  .left {
    height: 60px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border: none;
  }
}
.scroll-lvl2 + .top-menu {
  .left {
    margin-top: 0;
  }
  position: fixed;
  top: 50px;
}
.follow-btn {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  outline: none;
  height: 40px;
  width: 200px;
  font-weight: bold;
  .icon-cls {
    color: #f60;
    width: 16px;
    height: 12px;
  }
}
.menu a:not(.sub-menu) {
  font-size: 14px;
  align-items: center;
  &.active,
  &:hover {
    color: #ff7d00;
    border-bottom: 3px #ff7d00 solid;
  }
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.splitter {
  border-left: 1px dotted gray;
  height: 20px;
  margin-top: 25px;
}
.sub-menu > span:first-child {
  font-size: 11px;
}
.add-msg {
  background: #ff7d00;
  height: 30px;
  width: 140px;
  color: white;
  border: none;
  outline: none;
  border-radius: 5px;
}
.profile-left {
  width: 230px;
  flex: 0 0 230px;
  font-size: 14px;
  line-height: 20px;
}
.intro {
  word-wrap: break-word;
}
.main {
  height: auto;
  background: #f5f8fa;
  > div {
    width: 1000px;
    flex: 0 0 1000px;
  }
}
.profile-right {
  width: 770px;
  flex: 0 0 770px;
}
.recent-article {
  border-bottom: 1px dotted #b4b5b6;
}
.blog {
  display: block;
}
.show-more .icon-cls {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.c-modal /deep/ {
  .modal-dialog {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 340px;
    font-size: 14px;
  }
  .modal-header {
    text-align: center;
  }
  .modal-body {
    height: 227px;
    span {
      font-size: 20px;
    }
    a {
      outline: none;
      background: #ff7d00;
      color: white;
      border-radius: 5px;
      border: none;
      height: 45px;
      width: 260px;
      margin-top: 25px;
    }
  }
  .modal-footer {
    height: 40px;
  }
}
/deep/ .panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.mobile-ver {
  .back-mobile {
    display: flex !important;
  }
  div:nth-child(2) {
    transform: translateX(0);
  }
  .scroll-lvl2 + .top-menu {
    top: unset;
  }
}
</style>