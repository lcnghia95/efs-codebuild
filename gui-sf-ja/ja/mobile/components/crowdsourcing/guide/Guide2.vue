<template>
  <div class="ctn">
    <div class="crowd-head" v-html="$t(1)"></div>
    <div class="crowd-head-2nd text-center mt-5" v-html="$t(2)"></div>
    <!-- step 1 -->
    <div class="step-header flex mt-50">
      <div class="num">1</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(3) }}</div>
        <div class="text-2">
          <div class="flex">
            <div class="img-ctn">
              <Lzimg data-src="/img/assets/pc/crowdsourcing/guide_0.gif" alt="" width="80" height="80" />
            </div>
            <div v-html="$t(4)"></div>
          </div>
          <div class="grey-box" v-html="$t(5)"></div>
          <div class="grey-box" v-html="$t(6)"></div>
        </div>
      </div>
    </div>
    <!-- step 2 -->
    <div class="step-header flex mt-50">
      <div class="num">2</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(7) }}</div>
        <div class="text-2">
          <div class="flex">
            <div class="img-ctn">
              <Lzimg data-src="/img/assets/pc/crowdsourcing/guide_2.gif" alt="" width="80" height="80" />
            </div>
            <div v-html="$t(8)"></div>
          </div>
          <div class="grey-box" v-html="$t(9)"></div>
        </div>
      </div>
    </div>
    <!-- step 3 -->
    <div class="step-header flex mt-50">
      <div class="num">3</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(10) }}</div>
        <div class="text-2">
          <div class="flex">
            <div class="img-ctn">
              <Lzimg data-src="/img/assets/pc/crowdsourcing/guide_3.gif" alt="" width="80" height="80" />
            </div>
            <div v-html="$t(11)"></div>
          </div>
          <div class="grey-box" v-html="$t(12)"></div>
        </div>
      </div>
    </div>
    <!-- step 4 -->
    <div class="step-header flex mt-50">
      <div class="num">4</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(13) }}</div>
        <div class="text-2">
          <div class="flex">
            <div class="img-ctn">
              <Lzimg data-src="/img/assets/pc/crowdsourcing/guide_4.gif" alt="" width="80" height="80" />
            </div>
            <div v-html="$t(14)"></div>
          </div>
          <div class="grey-box" v-html="$t(15)"></div>
        </div>
      </div>
    </div>
    <!--  -->
    <a class="green-btn" :href="$store.state.user.id ? '/mypage/crowdsourcing' : '/login?u=/mypage/crowdsourcing'">{{ $t(16) }}</a>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowdsourcing-guide2.json'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  components: {
    Lzimg,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.ctn {
  padding: 20px 10px;
  .crowd-head {
    font-size: 27px;
    font-weight: bold;
    text-align: center;
    color: #00b7ee;
  }
  .crowd-head-2nd {
    color: #00b7ee;
  }
  .step-header {
    .num {
      flex: 0 0 50px;
      background: #00b7ee;
      height: 50px;
      font-size: 20px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      font-weight: bold;
    }
    .content {
      .text-1 {
        border-bottom: 1px solid #b2b2b2;
        border-top: 1px solid #b2b2b2;
        border-right: 1px solid #b2b2b2;
        padding: 5px 5px 5px 10px;
        height: 50px;
      }
      .text-2 {
        padding-top: 20px;
        font-size: 14px;
        color: #707070;
        .grey-box {
          background-color: #eaeaea;
          padding: 10px;
          margin-top: 10px;
          border-radius: 5px;
        }
      }
      .img-ctn {
        flex: 0 0 80px;
        height: 80px;
      }
    }
  }
  img {
    max-width: 100%;
  }
}
.green-btn {
  display: block;
  margin: 35px auto 0 auto;
  width: 80%;
  text-align: center;
  background: #00a300;
  color: #fff;
  height: 45px;
  line-height: 45px;
  border-radius: 5px;
  text-decoration: none;
  position: relative;
  &:active {
    opacity: 0.8;
  }
  &::after {
    content: '>';
    position: absolute;
    right: 12px;
  }
}
</style>