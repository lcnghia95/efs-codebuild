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
          <div v-html="$t(4)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching1.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 2 -->
    <div class="step-header flex mt-15">
      <div class="num">2</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(5) }}</div>
        <div class="text-2">
          <div v-html="$t(6)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching2.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 3 -->
    <div class="step-header flex mt-15">
      <div class="num">3</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(7) }}</div>
        <div class="text-2">
          <div v-html="$t(8)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching3.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 4 -->
    <div class="step-header flex mt-15">
      <div class="num">4</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(9) }}</div>
        <div class="text-2">
          <div v-html="$t(10)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching4.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 5 -->
    <div class="step-header flex mt-15">
      <div class="num">5</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(11) }}</div>
        <div class="text-2">
          <div v-html="$t(12)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching5.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 6 -->
    <div class="step-header flex mt-15">
      <div class="num">6</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(13) }}</div>
        <div class="text-2">
          <div v-html="$t(14)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching6.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
    <!-- step 7 -->
    <div class="step-header flex mt-15">
      <div class="num">7</div>
      <div class="w-full content">
        <div class="text-1 flex mid" v-wrap-lines="2">{{ $t(15) }}</div>
        <div class="text-2">
          <div v-html="$t(16)"></div>
          <figure class="text-center mt-20">
            <Lzimg style="min-height: 97px;" data-src="/img/assets/pc/crowdsourcing/matching7.png" alt="" />
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/crowdsourcing-guide1.json'
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
    color: #83c225;
  }
  .crowd-head-2nd {
    color: #83c225;
  }
  .step-header {
    .num {
      flex: 0 0 50px;
      background: #83c225;
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
        word-break: break-word !important;
      }
      .text-2 {
        padding-top: 20px;
        font-size: 14px;
        color: #707070;
      }
    }
  }
  img {
    max-width: 100%;
  }
}
</style>