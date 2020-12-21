<template>
  <div class="flex space-between app-header" :class="{'app-header-series' : hideBackBtn || false}">
    <div v-if="!hideBackBtn" class="back-actions inline-flex mid">
      <navi-back-btn :link="backLink" :label="backLabel" />
    </div>
    <div v-else class="header-series inline-flex mid">
      {{ backLabel }}
    </div>
    <div class="user-info inline-flex">
      <template v-if="account && account.id">
        <div class="user-name dropdown mr-20">
          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            {{account.name}}
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a href="/mypage" class="inline-flex">
              <User />&nbsp;マイページ
            </a></li>
            <li><a href="/info" class="inline-flex">
              <CommentDots />&nbsp;お知らせ
            </a></li>
            <li><a href="/post/1/15363" style="color: #5844ac">出品する</a></li>
            <li><a href="/post/1/15356" style="color: #ff1493">アフィリエイトする</a></li>
            <li><a href="/post/1/15376"><BookOpen />&nbsp;ご利用ガイド</a></li>
          </ul>
        </div>
        <a class="cart-info-container" href="/cart">
          <cart-icon class="mr-20 header-item"/>
          <span class="number-item-in-cart" v-if="cartNumberItem">{{ cartNumberItem }}</span>
        </a>
      </template>
      <a v-else :href="`/login?u=${$route.fullPath}`" class="mr-15" style="color: #666666">ログイン</a>
      <home-icon class="header-item home" width="24px" />
      <a class="btn-navi ml-20 flex mid center" v-if="rightLabel" :href="naviButtonUrl">
        {{ rightLabel }}
      </a>
    </div>
  </div>
</template>
<script>
import NaviBackBtn from "@@/../common/components/back-button";
import CartIcon from "@@/../common/components/cart-icon";
import HomeIcon from "@@/../common/components/home-icon";
import User from '@@/../components/icons/User.vue'
import CommentDots from '@@/../components/icons/CommentDots.vue'
import BookOpen from '@@/../components/icons/BookOpen.vue'
export default {
  name: "app-header",
  components: {
    HomeIcon,
    CartIcon,
    NaviBackBtn,
    User,
    CommentDots,
    BookOpen
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    backLabel: {
      type: String,
      default: ''
    },
    backLink: {
      type: String,
      default: ''
    },
    rightLabel: {
      type: String,
      default: ''
    },
    hideBackBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * @returns {{id: number, name: string, isBuyuser: boolean}}
     */
    account() {
      return this.$store.state.user
    },
    cartNumberItem() {
      return this.$store.state.cartCnt
    },
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
    naviButtonUrl() {
      if (!this.account) return '/login'
      return this.account.isBuyuser ? '/mypage/display' : '/mypage/display/navi/list'
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
  }
}
</script>
<style scoped lang="scss">
.app-header {
  height: 46px;
  border-bottom: 1px solid #efefef;
  padding: 0 40px;
  &.app-header-series {
    background: #ffffff;
    border-bottom: none;
    .header-series {
      font-size: 10px;
      color: #a2a2a2;
      @media only screen and (max-width: 768px) {
        visibility: hidden;
        max-width: 50px;
      }
      @media only screen and (max-width: 320px) {
        display: none;
      }
    }
  }
  @media only screen and (max-width: 768px) {
    padding: 0 20px;
  }
  @media only screen and (max-width: 425px) {
    padding: 0 10px;
  }
  .title {
    font-size: 1rem;
    color: #666666 !important;
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
  .user-name {
    font-size: 16px;
    color: #666666 !important;
    button {
      border: none;
      @media only screen and (max-width: 768px) {
        font-size: 16px;
      }
      &:hover {
        border: none;
        background: transparent;
      }
    }
    /deep/ ul li a {
      display: inline-flex !important;
      width: 100%;
      align-items: center;
      height: 36px;
      padding: 10px 15px !important;
      i {margin-top: 4px;}
      svg {
        width: 30px !important;
        height: 30px !important;
        path {
          fill: #888 !important;
        }
      }
    }
  }
  .cart-info-container {
    position: relative;
    color: #5d5e5e;
    .number-item-in-cart {
      position: absolute;
      top: -2px;
      right: 6px;
      background-color: #FF8500;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      color: white;text-align: center;
      vertical-align: center;
      font-size: 11px;
    }
  }
}
.user-info {
  align-items: center;
}
.header-item:first-child {
  height: 27px;
  cursor: pointer;
  &:hover {
    stroke: darken(#5d5e5e, 15%) !important;
  }
}
.btn-navi {
  width: 80px;
  height: 28px;
  background: #73CDD6;
  border-radius: 4px;
  color: white;
  text-decoration: none;
}
// iphone x
@media only screen 
  and (max-width : 896px) 
  and (max-height : 414px) {
    .app-header {
      &.app-header-series {
        .header-series {
          visibility: hidden;
        }
      }
      padding: 0 20px;
      .title {
        display: none;
      }
      .user-name {
        button {
          font-size: 16px;
        }
      }
    }
}

</style>
