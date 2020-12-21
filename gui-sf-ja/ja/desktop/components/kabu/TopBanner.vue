<template>
  <div class="kabu-heading">
    <div class="kabu-wrap">
      <p class="kabu-title m-0">{{ $t('1') }}</p>
      <p class="title-sub" v-html="$t('2')">
      </p>
      <p class="title-sub2">  
        {{ $t('3') }}
      </p>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/kabu-topbanner.json'
export default {
  i18n: {
    messages: i18n
  }
}
</script>
<style lang="scss" scoped>
.kabu-wrap {
  width: 940px;
  margin: 0 auto;
  padding-top: 40px;
}
.kabu-heading {
  background-image: url(/img/assets/pc/kabu/heading.jpg);
  text-shadow: 2px 2px 1px #000;
  color: #ebfffe;
  font-size: 16px;
  font-weight: 700;
  background-color: #0034a840; //---> delete
  height: 250px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.kabu-title {
  color: #ebfffe;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 2px 2px 1px #000;
  padding-left: 10px;
  padding-bottom: 20px;
}
.title-sub {
  color: #ebfffe;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 2px 2px 1px #000;
  letter-spacing: 0.2em;
}
.title-sub2 {
  color: #ebfffe;
  font-size: 12px;
  font-weight: 700;
  text-shadow: 2px 2px 1px #000;
  letter-spacing: 1.5px;
}
</style>