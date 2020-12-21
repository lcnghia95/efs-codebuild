<template>
  <div class="infobar-t w-full mb-20">
    <div class="main--ib-t w-1000 flex mid">
      <a :href="'/finance/salons'" class="link--p flex mid pr-20">
        <GraduationCap class="mr-10"/>
        <span>{{ $t('1') }}</span>
      </a>
    </div>
  </div>
</template>
<script>
import GraduationCap from '@@/../components/icons/GraduationCap.vue'
import i18n from '@@/lang/components-desktop/magazine-info-topbar.json'
/**
 * The Information Bar Top 02.
 */
export default {
  components: {
    GraduationCap,
  },
  i18n: {
    messages: i18n,
  },
}
</script>
<style lang="scss" scoped>
/deep/ .icon-cls {
  width: 30px;
  height: 30px;
}
.infobar-t {
  background: #000034;
}
.main--ib-t {
  height: 40px;
  font-size: 14px;
  a {
    color: #fff;
  }
  .link--p {
    border-right: 1px dotted #4b4c71;
  }
}
</style>
