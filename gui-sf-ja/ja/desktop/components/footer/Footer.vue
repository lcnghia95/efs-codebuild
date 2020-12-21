<template>
  <div>
    <div class="footer1">
      <p class="fs-15">
        <b><span class="glyphicon glyphicon-user" aria-hidden="true"></span> {{ $t('7') }}</b>
      </p>
      <hr class="footer1-hr" />
      <div class="flex space-between m-lr-5 fs-13 mb-20">
        <div class="flex space-between" style="width: 48%;">
          <div class="lh-20" style="width: 49%;">
            <b class="fs-14 lh-25">{{ $t('111') }}</b><br />
            <a href="/post/1/278"> {{ $t('112') }}</a><br />
            <a href="/terms/service">{{ $t('10') }}</a><br />
            <a href="/terms/privacy">{{ $t('11') }}</a><br />
            <a href="/post/1/15809">{{ $t('113') }}</a>
          </div>
          <div class="lh-20" style="width: 48%;">
            <b class="fs-14 lh-25">{{ $t('103') }}</b><br />
            <a href="/post/1/15830">{{ $t('114') }} </a><br />
            <a href="/post/1/3138">{{ $t('115') }} </a><br />
            <a href="/post/1/15841"><span v-html="$t('116')"></span></a><br />
            <a href="/post/1/528">{{ $t('117') }}</a><br />
            <a href="/post/1/531">{{ $t('118') }}</a><br />
            <a href="/post/1/8212">{{ $t('119') }}</a><br />
            <a href="/post/1/581">{{ $t('120') }}</a><br />
            <a href="/post/1/287">{{ $t('121') }}</a><br />
            <a href="/post/1/495">{{ $t('122') }}</a><br />
            <!-- <a href="/post/1/495">{{ $t('123') }}</a> -->
          </div>
        </div>
        <div class="lh-20" style="width: 23%;">
          <p class="mb-20">
            <b class="fs-14 lh-25">{{ $t('124') }}</b><br />
            <a href="/post/1/15817">{{ $t('125') }}</a><br />
            <a href="/post/1/15818"><span v-html="$t('126')"></span></a><br />
          </p>
          <b class="fs-14 lh-25">{{ $t('127') }}</b><br />
          <a href="/post/46/15647">{{ $t('128') }}</a><br />
          <a href="/post/46/15407">{{ $t('129') }}</a>
        </div>
        <div class="lh-20" style="width: 21%;">
          <p class="mb-20">
            <b class="fs-14 lh-25">{{ $t('130') }}</b><br />
            <a href="/post/1/15823">{{ $t('131') }}</a><br />
            <a href="/post/1/15823#id2">{{ $t('132') }}</a><br />
            <a href="/post/1/15823#id3">{{ $t('133') }}</a><br />
            <a href="/post/1/15823#id4"><span v-html="$t('134')"></span></a><br />
            <a href="/post/1/15823#id5">{{ $t('135') }}</a><br />
            <a href="/post/1/15823#id6">{{ $t('136') }}</a>
          </p>
        </div>
      </div>
      <div class="flex mid space-between">
        <div style="width: 48%;">
          <b class="flex mid fs-15">
            <Cube />{{ $t('41') }}
          </b>
          <hr class="footer1-hr" />
        </div>
        <div style="width: 23%;">
          <b class="flex mid fs-15">
            <HandShake :fill-co="'#707070'" />{{ $t('42') }}
          </b>
          <hr class="footer1-hr" />
        </div>
        <div style="width: 21%;">
          <b class="flex mid fs-15" style="height: 32px;">
            <Folder class="folder-icon" />&nbsp;{{ $t('44') }}
          </b>
          <hr class="footer1-hr" />
        </div>
      </div>
      <div class="flex space-between">
        <div class="flex space-between" style="width: 48%;">
          <div class="lh-20" style="width: 49%;">
            <b class="lh-25 fs-13">{{ $t('137') }}</b><br />
            <a href="/post/1/15363">{{ $t('138') }}</a><br />
            <a href="/post/1/16067">{{ $t('139') }}</a><br />
            <a href="/post/1/16067#02">{{ $t('140') }}</a><br />
            <a href="/post/1/16067#03">{{ $t('141') }}</a><br />
            <a href="/post/1/16068">{{ $t('142') }}</a><br />
            <a href="/terms/display">{{ $t('143') }}</a><br />
            <div class="lh-20 mt-20">
              <b class="lh-25 fs-13">{{ $t('144') }}</b> <br />
              <a href="/post/1/16083">{{ $t('145') }}</a><br />
              <a href="/post/1/16084">{{ $t('146') }}</a><br />
              <a href="https://labo.gogojungle.co.jp/articles/102">{{ $t('147') }}</a><br />
              <a href="https://labo.gogojungle.co.jp/articles/105">{{ $t('148') }}</a>
              <a href="/post/1/16091">{{ $t('172') }}</a><br />
              <a href="/post/1/16119">{{ $t('173') }}</a>
            </div>
          </div>
          <div class="lh-20" style="width: 48%;">
            <b class="lh-25 fs-13">{{ $t('160') }}</b><br />
            <a href="/post/1/12328">{{ $t('161') }}</a><br />
            <a href="/post/1/6955">{{ $t('162') }}</a><br />
            <div class="mt-15">
              <b class="lh-25 fs-13">{{ $t('163') }}</b><br />
              <a href="/post/1/16096">{{ $t('164') }}</a><br />
              <a href="/post/1/1587">{{ $t('165') }}</a><br />
            </div>
            <div class="mt-15">
              <b class="lh-25 fs-13">{{ $t('166') }}</b><br />
              <a href="/post/1/16105#id01">{{ $t('167') }}</a><br />
              <a href="/post/1/16105#id02">{{ $t('168') }}</a><br />
              <a href="/post/1/302#id01">{{ $t('169') }}</a><br />
              <a href="/post/1/302#id02">{{ $t('170') }}</a><br />
              <a href="/post/1/1602">{{ $t('171') }}</a><br />
            </div>
          </div>
        </div>
        <div class="lh-20" style="width: 23%;">
          <b class="lh-25 fs-13">{{ $t('149') }}</b> <br />
          <a href="/post/1/391">{{ $t('150') }}</a><br />
          <a href="/post/1/391#id2">{{ $t('151') }}</a><br />
          <a href="/post/1/391#id3">{{ $t('152') }}</a><br />
          <a href="/post/1/391#id4">{{ $t('153') }}</a><br />
          <a href="/terms/affiliate">{{ $t('154') }}</a><br />
          <a href="/post/1/15356">{{ $t('155') }}</a>
        </div>
        <div class="lh-20" style="width: 21%;">
          <div>
            <b class="lh-25 fs-13">{{ $t('174') }}</b> <br />
            <a href="/post/1/15208">{{ $t('175') }}</a><br />
          </div>
          <div class="mt-15">
            <b class="lh-25 fs-13">{{ $t('176') }}</b> <br />
            <a href="/terms/crowdsourcing">{{ $t('177') }}</a>
          </div>
          <div class="mt-15">
            <b class="lh-25 fs-13">{{ $t('178') }}</b> <br />
            <a href="https://fx-on.com/inquiry/knowledge.php">{{ $t('179') }}</a><br />
          </div>
        </div>
      </div>
    </div>
    <Footer02 />
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/footer.json'
import HandShake from '@@/../components/icons/HandShake.vue'
import Cube from '@@/../components/icons/Cube.vue'
import Folder from '@@/../components/icons/Folder.vue'
import Footer02 from '@@/../components/footer/Footer.vue'
export default {
  components: {
    HandShake,
    Cube,
    Folder,
    Footer02,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
$surface-main-width: 1000px;
.fs-15 {
  font-size: 15px;
}
.footer1 {
  color: #707070;
  width: $surface-main-width;
  margin: 70px auto 70px;
  .footer1-hr {
    border-color: #000;
    margin-top: 5px;
  }
  .footer-title {
    b {
      flex-grow: 0.8;
      &:first-child {
        flex-grow: 3;
      }
    }
  }
  a {
    color: #707070;
    font-size: 12px;
    &:hover {
      text-decoration: none;
      color: #0f3e9e;
    }
  }
}
.fs-14 {
  font-size: 14px;
}
.lh-20 {
  line-height: 20px;
}
.lh-25 {
  line-height: 25px;
}
i.icon-cls {
  width: 32px;
  height: 32px;
  color: #707070;
  &.folder-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
