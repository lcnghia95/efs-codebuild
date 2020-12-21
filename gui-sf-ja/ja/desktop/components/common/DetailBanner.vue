<template>
  <a :href="banner[9].landingPageUrl" v-if="banner[9]" class="banner-detail w-full"
     :class="{'special-case': !banner[3]}" >
    <img :src="banner[9].bannerUrl">
  </a>
</template>
<script>
export default {
  data() {
    return {
      banner: this.$store.getters['getBanners'],
    }
  },
}
</script>
<style lang="scss" scoped>
.special-case {
  display: block;
}
</style>
