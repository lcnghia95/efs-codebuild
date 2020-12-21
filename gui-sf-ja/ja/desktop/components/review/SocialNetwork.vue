<template>
  <div class="mt-40 pl-40 pr-40 pt-10 pb-5 official-social border-radius-4">
    <b class="fs-16 mt-40">GogoJungle公式ソーシャル</b>
    <div class="flex">
      <div class="flex social-button mt-5 mb-15">
        <TwitterSquare class="twitter-color pr-10"/>
        <div class="text-left ml-5 pt-5">
          <div class="text-left fs-12">
            GogoJungle <b class="pl-5 twitter-color">twitter</b>
          </div>
          <iframe
            :src="'https://platform.twitter.com/widgets/tweet_button.html?size=m&url=https://twitter.com/invest_on_com&lang=ja&'"
            scrolling="no"
            width="90"
            height="20"
            title="@invest_on_com"
            class="tweet-btn"/>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="flex social-button mt-5 mb-5">
        <FacebookSquare class="facebook-color pr-10"/>
        <div class="ml-5 pt-5">
          <div class="text-left fs-12">
            GogoJungle <b class="pl-5 facebook-color">facebook</b>
          </div>
          <iframe :src="'https://www.facebook.com/plugins/like.php?href=https://www.facebook.com/investon/' + $route.fullPath + '&width=100px&locale=ja_JP&layout=button_count&action=like&size=small&show_faces=true&height=46&appId'"
                  width="140px" height="20" class="tweet-btn" scrolling="no" frameborder="0"
                  allowTransparency="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TwitterSquare from '@@/../components/icons/TwitterSquare.vue'
import FacebookSquare from '@@/../components/icons/FacebookSquare.vue'
export default {
  components: {
    TwitterSquare,
    FacebookSquare,
  },
}
</script>


<style lang="scss" scoped>
$color53: #666;
.text-left {
  text-align: left;
}
.fs-16 {
  font-size: 16px;
}
.border-radius-4 {
  border-radius: 4px;
}
.official-social {
  text-align: center;
  border: solid 3px #e3e3e3;
  > b {
    color: $color53;
  }
}
.tweet-btn {
  border: 0;
  overflow: hidden;
}
.social-button {
  padding-left: 10px;
  align-items: flex-end;
  justify-content: flex-start;
  i {
    width: 50px;
    height: auto;
    padding-bottom: 2px;
  }
  .twitter-color {
    color: #1b95e0;
  }
  .facebook-color {
    color: #234896;
  }
}
</style>
